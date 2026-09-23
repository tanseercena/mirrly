import { render } from 'preact';
import { TryOnModal } from './TryOnModal';
import type { ProductInfo, ShopperBlockReason } from './types';

// Build marker — bump whenever debugging whether the storefront is running
// a stale cached copy of this bundle.
console.log('[tryon] widget bundle 2026-09-22-r1 (recording opt-in)');

interface MountOptions {
  configToken: string;
  productId: string;
  variantId: string;
  // Liquid-stamped customer id ("" for guests) — forwarded to the modal so
  // every /session call carries the shopper identity for the gates.
  customerId: string;
  product: ProductInfo | null;
  // Set when /config already knows the shopper is blocked (login required /
  // try limit reached) — the modal opens on the explanation screen instead
  // of the intro, and the camera is never requested.
  blocked?: ShopperBlockReason;
  // Master switch from /config — when true the intro screen offers the
  // optional recording checkbox. The shopper's opt-in drives the recorder.
  recording?: boolean;
}

export function mountWidget(root: HTMLElement, opts: MountOptions) {
  const modalHost = document.createElement('div');
  modalHost.id = 'tryon-modal-host';
  document.body.appendChild(modalHost); // portal to body so it isn't clipped by theme overflow/z-index

  const close = () => {
    render(null, modalHost);
    modalHost.remove();
  };

  render(
    <TryOnModal
      configToken={opts.configToken}
      productId={opts.productId}
      variantId={opts.variantId}
      customerId={opts.customerId}
      product={opts.product}
      blocked={opts.blocked}
      recording={opts.recording ?? false}
      onClose={close}
    />,
    modalHost
  );
}
