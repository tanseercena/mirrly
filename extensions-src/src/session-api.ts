import type { ConfigResponse, SessionStartResponse, FunnelEvent } from './types';

const BASE = '/apps/tryon';

export async function fetchConfig(productId: string, variantId: string): Promise<ConfigResponse> {
  const cacheKey = `tryon:config:${productId}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${BASE}/config?product_id=${productId}&variant_id=${variantId}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`config fetch failed: ${res.status}`);

  const data: ConfigResponse = await res.json();
  writeCache(cacheKey, data, 60_000); // 60s client-side cache, see session-api notes
  return data;
}

export async function startSession(
  configToken: string, // integrity check tying this call back to /config — see types.ts
  productId: string,
  variantId: string
): Promise<SessionStartResponse> {
  const res = await fetch(`${BASE}/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      config_token: configToken,
      product_id: productId,
      variant_id: variantId,
      device_type: guessDeviceType(),
    }),
  });
  if (!res.ok) throw new Error(`session start failed: ${res.status}`);
  return res.json();
}

// Fire-and-forget funnel events. sendBeacon is preferred because it survives
// the tab closing or navigating away mid-event, which fetch() would not.
export function sendEvent(sessionToken: string, event: FunnelEvent, extra: Record<string, unknown> = {}) {
  const payload = JSON.stringify({ session_token: sessionToken, event, ...extra });

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon(`${BASE}/event`, blob);
  } else {
    // Fallback for browsers without sendBeacon (rare in 2026, but cheap to keep)
    fetch(`${BASE}/event`, {
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
    navigator.sendBeacon(`${BASE}/telemetry`, new Blob([payload], { type: 'application/json' }));
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

function readCache(key: string): ConfigResponse | null {
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
