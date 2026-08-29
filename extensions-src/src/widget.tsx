import { render } from 'preact';
import { TryOnModal } from './TryOnModal';

interface MountOptions {
  configToken: string;
  productId: string;
  variantId: string;
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
      onClose={close}
    />,
    modalHost
  );
}
