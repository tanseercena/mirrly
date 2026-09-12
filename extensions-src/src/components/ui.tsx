import type { ProductInfo } from '../types';
import { BagIcon, CameraIcon, CheckIcon, CloseIcon, UserIcon } from './icons';

// --- small shared primitives for the try-on modal ---

export function formatPrice(price: string | null, moneyFormat: string | null): string | null {
  if (price === null) return null;
  const amount = Number(price);
  if (Number.isNaN(amount)) return price;
  const formatted = amount.toFixed(2);
  if (moneyFormat && moneyFormat.includes('{{}}')) {
    // Handle the "{{}}"-style variants by substituting the unformatted amount
    return moneyFormat.replace('{{}}', formatted);
  }
  if (moneyFormat && moneyFormat.includes('{{amount}}')) {
    return moneyFormat.replace(/\{\{amount\}\}/g, formatted);
  }
  return formatted;
}

export function formatMoney(price: string | null, product: ProductInfo | null): string | null {
  if (!product) return null;
  return formatPrice(price, product.money_format);
}

export function IconButton(props: {
  label: string;
  onClick: () => void;
  class?: string;
  children: preact.ComponentChildren;
}) {
  return (
    <button
      type="button"
      class={`tryon-iconbtn ${props.class ?? ''}`}
      aria-label={props.label}
      title={props.label}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export function CloseButton(props: { onClick: () => void }) {
  return (
    <IconButton label="Close try-on" onClick={props.onClick} class="tryon-close">
      <CloseIcon size={18} />
    </IconButton>
  );
}

export function ProductSummary(props: { product: ProductInfo | null; compact?: boolean }) {
  const { product, compact } = props;
  if (!product) return null;
  const price = formatMoney(product.price, product);

  return (
    <div class={`tryon-product ${compact ? 'tryon-product--compact' : ''}`}>
      {product.image && (
        <img class="tryon-product__img" src={product.image} alt="" loading="lazy" />
      )}
      <div class="tryon-product__meta">
        <span class="tryon-product__title">{product.title}</span>
        {price && <span class="tryon-product__price">{price}</span>}
      </div>
    </div>
  );
}

export function StatusPill(props: {
  tone: 'neutral' | 'success' | 'loading';
  text: string;
}) {
  return (
    <div class={`tryon-pill tryon-pill--${props.tone}`} role="status">
      {props.tone === 'success' && <CheckIcon size={15} />}
      {props.tone === 'neutral' && <UserIcon size={15} />}
      {props.tone === 'loading' && <span class="tryon-pill__spinner" aria-hidden="true" />}
      <span>{props.text}</span>
    </div>
  );
}

const RING_RADIUS = 26;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function CountdownRing(props: { remaining: number; total: number; size?: number }) {
  const size = props.size ?? 64;
  const progress = props.total > 0 ? props.remaining / props.total : 0;

  return (
    <div
      class="tryon-ring"
      style={{ width: `${size}px`, height: `${size}px` }}
      role="timer"
      aria-label={`Preparing your look, ${props.remaining} seconds remaining`}
    >
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <circle class="tryon-ring__track" cx="32" cy="32" r={RING_RADIUS} />
        <circle
          class="tryon-ring__progress"
          cx="32"
          cy="32"
          r={RING_RADIUS}
          stroke-dasharray={RING_CIRCUMFERENCE}
          stroke-dashoffset={RING_CIRCUMFERENCE * (1 - progress)}
        />
      </svg>
      <span class="tryon-ring__num">{props.remaining}</span>
    </div>
  );
}

export function GlassBottomBar(props: {
  product: ProductInfo | null;
  onAddToCart: () => void;
  adding: boolean;
}) {
  const { product } = props;
  const price = formatMoney(product?.price ?? null, product);

  return (
    <div class="tryon-glassbar">
      {product?.image && (
        <img class="tryon-glassbar__img" src={product.image} alt="" loading="lazy" />
      )}
      <div class="tryon-glassbar__meta">
        <span class="tryon-glassbar__title">{product?.title}</span>
        {price && <span class="tryon-glassbar__price">{price}</span>}
      </div>
      <button
        type="button"
        class="tryon-btn tryon-btn--accent tryon-glassbar__cta"
        onClick={props.onAddToCart}
        disabled={props.adding}
      >
        <BagIcon size={17} />
        <span>{props.adding ? 'Adding…' : 'Add to cart'}</span>
      </button>
    </div>
  );
}

export function CameraCta(props: { onClick: () => void }) {
  return (
    <button type="button" class="tryon-btn tryon-btn--accent" onClick={props.onClick}>
      <CameraIcon size={18} />
      <span>Start try-on</span>
    </button>
  );
}
