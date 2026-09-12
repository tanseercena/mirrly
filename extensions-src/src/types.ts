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
  image: string | null;
  price: string | null;
  money_format: string;
}

export interface ConfigResponse {
  enabled: boolean;
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
  // A file_… id, already uploaded to Decart's file storage server-side via
  // client.files.upload() using the real API key. The browser only ever
  // receives the resulting id, never a raw image URL passed to the SDK.
  reference_image_file_id?: string;
  // Hard ceiling in seconds enforced client-side (mirrors backend billing unit).
  max_duration_seconds: number;
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
}
