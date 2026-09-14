import { render } from 'preact';
import { TryOnModal } from './TryOnModal';
import type { ProductInfo } from './types';

// Build marker — bump whenever debugging whether the storefront is running
// a stale cached copy of this bundle.
console.log('[tryon] widget bundle 2026-09-12-r6 (blob setImage flow)');

interface MountOptions {
  configToken: string;
  productId: string;
  variantId: string;
  product: ProductInfo | null;
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
      product={opts.product}
      onClose={close}
    />,
    modalHost
  );
}
