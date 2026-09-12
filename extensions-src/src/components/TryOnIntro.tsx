import type { ProductInfo } from '../types';
import { BoltIcon, CameraIcon, ShieldIcon } from './icons';
import { CameraCta, ProductSummary } from './ui';

const BENEFITS = [
  { icon: CameraIcon, title: 'Quick and easy', copy: 'Just allow camera access' },
  { icon: ShieldIcon, title: 'Your privacy matters', copy: 'Nothing is saved or shared' },
  { icon: BoltIcon, title: 'Takes seconds', copy: 'See realistic results instantly' },
];

export function TryOnIntro(props: {
  product: ProductInfo | null;
  onStart: () => void;
  onCancel: () => void;
}) {
  const { product } = props;

  return (
    <div class="tryon-intro">
      <div class="tryon-intro__content">
        <ProductSummary product={product} />

        <h2 class="tryon-headline" id="tryon-title">
          See it on you, live
        </h2>
        <p class="tryon-body">
          Use your camera to try this on in real time with AI. No downloads, no hassle.
        </p>

        <ul class="tryon-benefits">
          {BENEFITS.map(({ icon: Icon, title, copy }) => (
            <li class="tryon-benefit">
              <span class="tryon-benefit__icon">
                <Icon size={17} />
              </span>
              <span class="tryon-benefit__text">
                <strong>{title}</strong>
                <span>{copy}</span>
              </span>
            </li>
          ))}
        </ul>

        <div class="tryon-intro__actions">
          <CameraCta onClick={props.onStart} />
          <button type="button" class="tryon-btn-text" onClick={props.onCancel}>
            Cancel
          </button>
        </div>
      </div>

      {product?.image && (
        <div class="tryon-intro__visual">
          <img src={product.image} alt={product.title} loading="lazy" />
        </div>
      )}
    </div>
  );
}
