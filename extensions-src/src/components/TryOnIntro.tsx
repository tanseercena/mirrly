import type { ProductInfo } from '../types';
import { BoltIcon, CameraIcon, CheckIcon, ShieldIcon } from './icons';
import { CameraCta, ProductSummary } from './ui';

const BENEFITS = [
  { icon: CameraIcon, title: 'Quick and easy', copy: 'Just allow camera access' },
  { icon: ShieldIcon, title: 'Your privacy matters', copy: 'Nothing is saved or shared' },
  { icon: BoltIcon, title: 'Takes seconds', copy: 'See realistic results instantly' },
];

export function TryOnIntro(props: {
  product: ProductInfo | null;
  // Recording offer (Settings → Privacy & recording). Showing the checkbox
  // doesn't record anything — the shopper's explicit opt-in below does.
  showRecordOption?: boolean;
  recordOptIn?: boolean;
  onRecordChange?: (value: boolean) => void;
  onStart: () => void;
  onCancel: () => void;
}) {
  const { product } = props;

  // The blanket "nothing is saved" line is only honest while there is no
  // recording offer — once the checkbox exists the shopper decides.
  const benefits = props.showRecordOption
    ? BENEFITS.map((b) =>
        b.title === 'Your privacy matters' ? { ...b, copy: 'Saved only if you choose to record' } : b
      )
    : BENEFITS;

  return (
    <div class="tryon-intro">
      <div class="tryon-intro__content">
        <span class="tryon-brand">
          Powered by <b>Mirrly</b>
        </span>
        <ProductSummary product={product} />

        <h2 class="tryon-headline" id="tryon-title">
          See it on you, live
        </h2>
        <p class="tryon-body">
          Use your camera to try this on in real time with AI. No downloads, no hassle.
        </p>

        <ul class="tryon-benefits">
          {benefits.map(({ icon: Icon, title, copy }) => (
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

        {props.showRecordOption && (
          <label class="tryon-record">
            <input
              type="checkbox"
              class="tryon-record__input"
              checked={props.recordOptIn ?? false}
              onChange={(e) => props.onRecordChange?.((e.target as HTMLInputElement).checked)}
            />
            <span class="tryon-record__box" aria-hidden="true">
              <CheckIcon size={12} />
            </span>
            <span class="tryon-record__text">Record my try-on session</span>
          </label>
        )}

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
