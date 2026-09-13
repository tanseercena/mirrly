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

async function setUpRoot(root: HTMLElement) {
  const data = root.dataset as unknown as RootDataset;

  let config;
  try {
    // Token first — cached in sessionStorage after the first call, so later
    // pages/calls reuse it instead of hitting the api-token route again.
    await fetchApiToken(data.shop);
    config = await fetchConfig(data.productId, data.variantId);
  } catch (err) {
    // Fail silently on the storefront — a broken config fetch should never
    // surface an error to a shopper who wasn't trying to use the feature.
    console.error('[tryon] config fetch failed', err);
    return;
  }

  if (!config.enabled) return; // nothing rendered, zero layout shift, zero cost

  const button = buildButton(config.button);
  insertButton(button, config.button.position);

  button.addEventListener(
    'click',
    () => {
      void launchWidget(root, data, config);
    },
    { once: true } // prevent double-mount on rapid double-click
  );
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
  root: HTMLElement,
  data: RootDataset,
  bootConfig: ConfigResponse
) {
  const loadingButton = root.querySelector('.tryon-button') as HTMLButtonElement | null;
  if (loadingButton) {
    loadingButton.disabled = true;
    loadingButton.setAttribute('aria-busy', 'true');
  }

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
      product: resolved.config.product,
    });
  } catch (err) {
    console.error('[tryon] widget failed to load', err);
    if (loadingButton) {
      loadingButton.disabled = false;
      loadingButton.removeAttribute('aria-busy');
    }
  }
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
    return { variantId: live, config: await fetchConfig(data.productId, live) };
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
