import type { ButtonSettings, ConfigResponse, RootDataset } from './types';
import { fetchApiToken, fetchConfig } from './session-api';
import { insertButton } from './insertion';

const RADIUS_MAP: Record<ButtonSettings['border_radius'], string> = {
  pill: '999px',
  rounded: '8px',
  square: '2px',
};

const ICON_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`;

init();

function init() {
  const roots = document.querySelectorAll<HTMLElement>('[id^="tryon-root-"]');
  roots.forEach(setUpRoot);
}

/**
 * Admin-triggered test (Products page drawer opens
 * {storefront}/products/{handle}?o_try=1 in a new tab): auto-launch the
 * try-on instead of waiting for the button click. A FRESH anonymous id is
 * written first so the per-product try limit (keyed on that id) never
 * blocks repeated tests by the same merchant.
 */
function isAutoTry(): boolean {
  try {
    return new URLSearchParams(window.location.search).get('o_try') === '1';
  } catch {
    return false;
  }
}

function primeFreshAnonymousId() {
  const KEY = 'tryon:anon-id';
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `anon-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* storage blocked — the widget falls back to a per-visit id */
  }
}

async function setUpRoot(root: HTMLElement) {
  const data = root.dataset as unknown as RootDataset;
  const { customerId } = data;
  const autoTry = isAutoTry();

  if (autoTry) {
    primeFreshAnonymousId();
  }

  let config;
  try {
    // Token first — cached in sessionStorage after the first call, so later
    // pages/calls reuse it instead of hitting the api-token route again.
    await fetchApiToken(data.shop);
    config = await fetchConfig(data.productId, data.variantId, customerId, adminTestParams());
  } catch (err) {
    // Fail silently on the storefront — a broken config fetch should never
    // surface an error to a shopper who wasn't trying to use the feature.
    console.error('[tryon] config fetch failed', err);
    return;
  }

  if (!config.enabled) return; // nothing rendered, zero layout shift, zero cost

  const button = buildButton(config.button);
  insertButton(button, config.button.position);

  let launching = false; // guards double-mount on rapid double-click
  button.addEventListener('click', () => {
    if (launching) return;
    launching = true;
    void launchWidget(button, root, data, config).finally(() => {
      launching = false;
    });
  });

  if (autoTry) {
    // Drop the admin-test params from the address bar so a manual refresh
    // doesn't auto-open the modal again.
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('o_try');
      url.searchParams.delete('o_exp');
      url.searchParams.delete('o_sig');
      window.history.replaceState(null, '', url.toString());
    } catch {
      /* leave the params — cosmetic only */
    }

    void launchWidget(button, root, data, config, config.admin_test === true);
  }
}

/**
 * The signed admin-test proof (?o_try=1&o_exp=…&o_sig=…), forwarded to
 * /config verbatim. Empty for normal storefront visits — /config then
 * treats it as a regular shopper.
 */
function adminTestParams(): Record<string, string> {
  try {
    const params = new URLSearchParams(window.location.search);
    const sig = params.get('o_sig');
    const exp = params.get('o_exp');
    return sig && exp ? { o_sig: sig, o_exp: exp } : {};
  } catch {
    return {};
  }
}

function buildButton(settings: ButtonSettings): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'tryon-button';
  button.setAttribute('aria-label', settings.text);

  button.style.setProperty('--tryon-bg', settings.background_color);
  button.style.setProperty('--tryon-color', settings.text_color);
  button.style.setProperty('--tryon-radius', RADIUS_MAP[settings.border_radius]);

  button.innerHTML = settings.show_icon
    ? `${ICON_SVG}<span>${escapeHtml(settings.text)}</span>`
    : `<span>${escapeHtml(settings.text)}</span>`;

  return button;
}

async function launchWidget(
  button: HTMLButtonElement,
  root: HTMLElement,
  data: RootDataset,
  bootConfig: ConfigResponse,
  adminTest = false
) {
  setButtonLoading(button, true);

  try {
    // Variant resolution and widget download in parallel — neither blocks
    // on the other.
    const [mod, resolved] = await Promise.all([
      import(/* @vite-ignore */ data.widgetUrl),
      resolveCurrentVariantConfig(data, bootConfig),
    ]);
    mod.mountWidget(root, {
      configToken: resolved.config.config_token,
      productId: data.productId,
      variantId: resolved.variantId,
      customerId: data.customerId,
      product: resolved.config.product,
      // Recording offer for the intro screen — /session still re-checks.
      recording: resolved.config.recording ?? false,
      // Admin test: hide the commerce UI on the result screens.
      adminTest,
      // Blocked shoppers get an explanatory screen inside the modal instead
      // of the intro — the camera is never requested. /session re-checks.
      blocked:
        resolved.config.shopper?.allowed === false ? resolved.config.shopper.reason ?? undefined : undefined,
    });
  } catch (err) {
    console.error('[tryon] widget failed to load', err);
  } finally {
    // The modal is up (or loading failed) — restore the button so the
    // shopper can close the modal and launch again without a page refresh.
    setButtonLoading(button, false);
  }
}

function setButtonLoading(button: HTMLButtonElement, loading: boolean) {
  button.disabled = loading;
  button.setAttribute('aria-busy', String(loading));
  button.classList.toggle('tryon-button--loading', loading);
}

/**
 * The liquid-stamped variant id is whatever was selected at page load. If
 * the shopper switches variants before clicking the button, themes keep the
 * cart form's variant input in sync (it's what Add to cart submits), so read
 * the live value there; the URL ?variant= param is the secondary signal. A
 * changed variant needs a fresh /config — the config_token encodes the
 * variant, and the product payload (price/image/variant title) is per-variant.
 */
async function resolveCurrentVariantConfig(
  data: RootDataset,
  bootConfig: ConfigResponse
): Promise<{ variantId: string; config: ConfigResponse }> {
  const live =
    document.querySelector<HTMLInputElement | HTMLSelectElement>(
      'form[action*="/cart/add"] [name="id"]'
    )?.value.trim() ||
    new URLSearchParams(window.location.search).get('variant') ||
    '';

  if (!live || !/^\d+$/.test(live) || live === data.variantId) {
    return { variantId: data.variantId, config: bootConfig };
  }

  try {
    return { variantId: live, config: await fetchConfig(data.productId, live, data.customerId) };
  } catch {
    // Refetch failed — keep the boot-time config/variant pair consistent.
    return { variantId: data.variantId, config: bootConfig };
  }
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
