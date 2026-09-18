import type { ConfigResponse, SessionStartResponse, FunnelEvent } from './types';

// Replaced at build time with the literal from .env (see build.js define).
declare const process: { env: { API_BASE_URL?: string } };

const BASE = `${process.env.API_BASE_URL}/api`;

// The loader and widget are separate esbuild bundles, each inlining its own
// copy of this module — so module-level state is NOT shared between them.
// sessionStorage is, though (same page, same origin). The loader bundle's
// fetchApiToken writes the context here; the widget bundle's startSession /
// sendEvent calls read it back via buildUrl.
const CONTEXT_KEY = 'tryon:api-context';

// Per-copy memo: always hit when the same bundle wrote the context (the
// normal flow); sessionStorage covers the cross-bundle case.
const contextMemo: { shop: string; token: string } = { shop: '', token: '' };

function readContext(): { shop: string; token: string } {
  if (contextMemo.token) return contextMemo;
  try {
    const raw = sessionStorage.getItem(CONTEXT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.shop === 'string' && typeof parsed.token === 'string') {
        Object.assign(contextMemo, parsed);
      }
    }
  } catch {
    /* storage disabled or corrupted entry — treated as no context */
  }
  return contextMemo;
}

function writeContext(shop: string, token: string) {
  contextMemo.shop = shop;
  contextMemo.token = token;
  try {
    sessionStorage.setItem(CONTEXT_KEY, JSON.stringify({ shop, token }));
  } catch {
    /* storage full or disabled — memo still serves this bundle's calls */
  }
}

export function buildUrl(path: string, params: Record<string, string> = {}): string {
  const { shop, token } = readContext();
  const query = new URLSearchParams({
    shop,
    'api-token': token,
    ...params,
  });
  return `${BASE}/${shop}${path}?${query}`;
}

export async function fetchApiToken(shop: string): Promise<string> {
  const cached = readContext();
  if (cached.shop === shop && cached.token) return cached.token;

  const res = await fetch(`${BASE}/${shop}/api-token`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`api token fetch failed: ${res.status}`);

  const { data } = await res.json();
  writeContext(shop, data);
  return data;
}

// Stable per-browser id for guests — the per-product try limit keys off this
// when the shopper isn't logged in (customer id wins when present). Survives
// page views and visits; clearing site data resets it, which is acceptable
// for a storefront limit.
export function getAnonymousId(): string {
  const KEY = 'tryon:anon-id';
  const fallback = `anon-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : fallback;
      localStorage.setItem(KEY, id);
      return id;
    }
    return id;
  } catch {
    // Storage blocked — per-visit id; the limit just can't track this browser
    return fallback;
  }
}

// Shopper identity sent with /config and /session for the customer-session
// gates (login requirement + per-product try limit). The anonymous id rides
// along even for logged-in shoppers so a request can never end up with no
// usable identity — the backend prefers the customer id when it's present.
export function getShopperParams(customerId: string): Record<string, string> {
  return customerId
    ? { customer_id: customerId, anonymous_id: getAnonymousId() }
    : { anonymous_id: getAnonymousId() };
}

export async function fetchConfig(
  productId: string,
  variantId: string,
  customerId: string
): Promise<ConfigResponse> {
  // Keyed by variant too: a shopper who switches variants before opening
  // the modal must not be served a config (price/image/token) for the
  // boot-time variant. Customer id is in the key so a logged-in shopper's
  // eligibility never leaks into the guest view (and vice versa).
  const cacheKey = `tryon:config:${productId}:${variantId}:${customerId || 'guest'}`;
  const cached = readCache<ConfigResponse>(cacheKey);
  if (cached) return cached;

  const res = await fetch(
    buildUrl('/config', { product_id: productId, variant_id: variantId, ...getShopperParams(customerId) }),
    {
      headers: { Accept: 'application/json' },
    }
  );
  if (!res.ok) throw new Error(`config fetch failed: ${res.status}`);

  const data: ConfigResponse = await res.json();
  writeCache(cacheKey, data, 60_000); // 60s client-side cache, see session-api notes
  return data;
}

export async function startSession(
  configToken: string, // integrity check tying this call back to /config — see types.ts
  productId: string,
  variantId: string,
  customerId: string,
  existingSessionToken?: string // passed on reconnects so the backend reuses the same session row
): Promise<SessionStartResponse> {
  const res = await fetch(buildUrl('/session'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      config_token: configToken,
      product_id: productId,
      variant_id: variantId,
      device_type: guessDeviceType(),
      ...getShopperParams(customerId),
      ...(existingSessionToken ? { session_token: existingSessionToken } : {}),
    }),
  });
  if (!res.ok) {
    // Surface the backend's error_code (login_required / try_limit_reached)
    // so the modal can show the matching message instead of a generic failure.
    let errorCode: string | undefined;
    try {
      errorCode = (await res.json())?.error_code;
    } catch {
      /* non-JSON body — generic failure */
    }
    const err = new Error(`session start failed: ${res.status}`) as Error & { errorCode?: string };
    err.errorCode = errorCode;
    throw err;
  }
  return res.json();
}

// Uploads the try-on recording (and optional result snapshot) after a
// session ends. Only called when the backend flagged the session as
// recorded — the endpoint re-checks the setting server-side. Multipart
// fetch rather than sendBeacon: recordings are megabytes, beacons aren't.
export function uploadRecording(
  customerId: string,
  sessionToken: string,
  video: Blob | null,
  image: Blob | null
): Promise<void> {
  const form = new FormData();
  form.append('session_token', sessionToken);
  for (const [key, value] of Object.entries(getShopperParams(customerId))) {
    form.append(key, value);
  }
  if (video) form.append('video', video, 'tryon.webm');
  if (image) form.append('image', image, 'snapshot.jpg');

  return fetch(buildUrl('/recording'), { method: 'POST', body: form }).then((res) => {
    if (!res.ok) throw new Error(`recording upload failed: ${res.status}`);
  });
}

// Fire-and-forget funnel events. sendBeacon is preferred because it survives
// the tab closing or navigating away mid-event, which fetch() would not.
export function sendEvent(sessionToken: string, event: FunnelEvent, extra: Record<string, unknown> = {}) {
  const payload = JSON.stringify({ session_token: sessionToken, event, ...extra });

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon(buildUrl('/event'), blob);
  } else {
    // Fallback for browsers without sendBeacon (rare in 2026, but cheap to keep)
    fetch(buildUrl('/event'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {
      /* best-effort; funnel analytics can tolerate the occasional dropped event */
    });
  }
}

export function reportTelemetry(event: string, meta: Record<string, unknown> = {}) {
  const payload = JSON.stringify({ event, ...meta, ts: Date.now() });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(buildUrl('/telemetry'), new Blob([payload], { type: 'application/json' }));
  }
}

function guessDeviceType(): 'mobile' | 'desktop' | 'tablet' | 'unknown' {
  const ua = navigator.userAgent;
  if (/iPad|Tablet/i.test(ua)) return 'tablet';
  if (/Mobi|Android/i.test(ua)) return 'mobile';
  if (/Macintosh|Windows|Linux/i.test(ua)) return 'desktop';
  return 'unknown';
}

// --- tiny sessionStorage cache helpers ---

function readCache<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { value, expiresAt } = JSON.parse(raw);
    if (Date.now() > expiresAt) return null;
    return value;
  } catch {
    return null;
  }
}

function writeCache(key: string, value: unknown, ttlMs: number) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ value, expiresAt: Date.now() + ttlMs }));
  } catch {
    /* storage full or disabled — non-critical, just skip caching */
  }
}
