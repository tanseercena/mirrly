import type { ButtonPosition } from './types';
import { reportTelemetry } from './session-api';

// Option B: JS-based DOM insertion against common theme selector patterns.
// This is the ONLY file that needs to change when Option A (merchant-placed
// app block) ships later — loader.ts, widget.tsx, and the backend are
// already position-agnostic and don't need to touch this logic at all.

interface InsertionConfig {
  selectors: string[];
  mode: InsertPosition;
}

const SELECTOR_MAP: Record<ButtonPosition, InsertionConfig> = {
  below_add_to_cart: {
    selectors: [
      '.product-form__buttons',      // Dawn and most OS 2.0 themes
      'button[name="add"]',
      '.product-form__cart-submit',
      '.shopify-payment-button',
      '.product-form',
    ],
    mode: 'afterend',
  },
  above_add_to_cart: {
    selectors: [
      '.product-form__buttons',
      'button[name="add"]',
      '.product-form',
    ],
    mode: 'beforebegin',
  },
  below_buy_now: {
    selectors: [
      '.shopify-payment-button',      // dynamic checkout button container
      '.product-form__buttons',
    ],
    mode: 'afterend',
  },
};

export function insertButton(button: HTMLElement, position: ButtonPosition) {
  const config = SELECTOR_MAP[position] ?? SELECTOR_MAP.below_add_to_cart;

  for (const selector of config.selectors) {
    const el = document.querySelector(selector);
    if (el) {
      el.insertAdjacentElement(config.mode, button);
      return;
    }
  }

  // Last-resort fallback — never render nothing, but track that it happened.
  const fallbackTarget =
    document.querySelector('form[action*="/cart/add"]') ?? document.body;
  fallbackTarget.appendChild(button);

  reportTelemetry('insertion_fallback', {
    position,
    theme: (window as any).Shopify?.theme?.name ?? 'unknown',
    path: window.location.pathname,
  });
}
