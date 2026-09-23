// Shared types across loader, widget, and API layers

export type ButtonPosition = 'below_add_to_cart' | 'above_add_to_cart' | 'below_buy_now';
export type BorderRadius = 'pill' | 'rounded' | 'square';

export interface ButtonSettings {
  text: string;
  position: ButtonPosition;
  text_color: string;
  background_color: string;
  border_radius: BorderRadius;
  show_icon: boolean;
}

// Display-only product info for the try-on modal UI (intro screen, bottom bar).
// price is the raw numeric string ("89.00") — render it through money_format
// (the shop's own Shopify format string, e.g. "${{amount}}") for the
// locale-correct symbol. All fields may be null on older syncs.
export interface ProductInfo {
  title: string;
  // Selected variant's title (e.g. "M / Blue") — null for single-variant
  // products ("Default Title" is stripped server-side).
  variant_title?: string | null;
  image: string | null;
  price: string | null;
  money_format: string;
}

export interface ConfigResponse {
  enabled: boolean;
  // Shopper eligibility for the contract gates (login requirement +
  // per-product try limit), evaluated server-side per request. The loader
  // uses this to pass a "blocked" reason into the widget so the shopper sees
  // a friendly message before the camera is ever requested. Optional so a
  // stale cached config (60s sessionStorage cache) treats a missing shopper
  // as allowed — /session is the enforcement point either way.
  shopper?: {
    allowed: boolean;
    reason: ShopperBlockReason | null;
  };
  // Master switch from Settings → Privacy & recording. When true the intro
  // screen offers the optional "record my session" checkbox; the shopper's
  // explicit opt-in — not this flag — is what starts the recorder. Optional
  // so a stale cached config without the flag simply means "no checkbox".
  recording?: boolean;
  button: ButtonSettings;
  product: ProductInfo | null;
  // Short-lived (~5 min) signed JWT (product_id, variant_id, shop, exp).
  // NOT an auth token — App Proxy's HMAC signature (verified server-side on
  // every /apps/tryon/* request) already proves the request came through
  // this shop's storefront. This just ties a later /session call back to
  // the exact config the shopper was shown, so /session can't be called
  // directly with an arbitrary product_id without going through /config first.
  config_token: string;
}

// Why the shopper is blocked from starting a try-on. Surfaced by /config
// (pre-camera) and enforced again by /session (authoritative).
export type ShopperBlockReason = 'login_required' | 'try_limit_reached';

export interface SessionStartResponse {
  session_token: string;
  // Short-lived, scoped client token from client.tokens.create() — never the
  // permanent account API key. Passed as `apiKey` when the browser calls
  // createDecartClient() in realtime-engine.ts.
  client_token: string;
  // e.g. "lucy-vton-3.5" — which realtime model to connect with. Server-driven
  // so this can change without a frontend redeploy.
  model_name: string;
  prompt: string;
  // Storefront URL of the best garment photo. Realtime sessions take the
  // reference image as a Blob/URL — NOT a files-API id — so the browser
  // converts this to a flat-background JPEG blob and applies it post-connect
  // via setImage (see garment-image.ts / realtime-engine.ts).
  reference_image_url?: string;
  // Hard ceiling in seconds enforced client-side (mirrors backend billing unit).
  max_duration_seconds: number;
  // True only when the merchant enabled recording in Settings → Privacy &
  // recording. The client records the try-on output stream ONLY when this is
  // set; the upload endpoint re-checks the setting server-side.
  recording?: boolean;
}
// Note: a successful call to this endpoint is itself the `camera_opened`
// event — the backend writes camera_opened_at when this session row is
// created, no separate event call needed for that specific stage.

// Events the frontend can report. camera_opened is emitted implicitly by the
// backend at session creation (see startSession/session-api.ts) rather than
// via a separate sendEvent call, since the moment /session succeeds IS the
// camera-opened moment — included here so the type accurately reflects the
// full frontend-visible funnel, not just the ones sent through sendEvent().
//
// 'purchased' is deliberately NOT part of this union — it's never known or
// sent by the client. It's set server-side only, by the orders/create
// webhook matching against session.cart_token after checkout completes.
export type FunnelEvent = 'camera_opened' | 'tryon_started' | 'tryon_completed' | 'added_to_cart';

export interface RootDataset {
  productId: string;
  variantId: string;
  shop: string;
  widgetUrl: string;
  // Logged-in Shopify customer id, stamped by Liquid ("{{ customer.id }}").
  // Empty string for guests — the widget then falls back to its anonymous id.
  customerId: string;
}
