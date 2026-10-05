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

// A product's rig, produced by the offline ingestion pipeline and served by
// /session. Null until the pipeline has processed this product.
export interface RigData {
  template_type: string;
  detection_method: 'ml_model' | 'geometric';
  // v1 rig format (below). Null → the runtime engine falls back to its own
  // per-template-type geometric defaults.
  anchor_points: RigAnchorPoints | null;
  // Background-removed garment cutout (S3/CloudFront) — preferred texture
  // over the raw reference_image_url.
  asset_url: string;
  confidence_score?: number | null;
}

// v2 rig anchor format. The pipeline produces garment-space named anchors
// (0..1 within the cutout image); the engine maps them to MediaPipe body
// landmarks via its per-template ANCHOR_TO_BODY table. The review queue
// (phase 3) edits these same anchor values in place.
export interface RigAnchorPoints {
  version: 2;
  coordinate_space?: string;
  // Named garment anchors — e.g. glasses: lens_left/bridge/lens_right;
  // cap: crown_top/brim_front/side_left/side_right; clothing:
  // shoulder_left/right, hem_left/right. Produced by the pipeline,
  // correctable by the review queue.
  anchors: Record<string, { x: number; y: number }>;
  bounding_box?: { x: number; y: number; width: number; height: number } | null;
  image?: { width: number; height: number } | null;
}

// One try-on layer the engine should render, keyed by garment slot. The
// modal builds these from the /session response: one per product slot, with
// the rig (or null for the best-effort geometric fallback).
export interface EngineLayer {
  // Garment slot, one active item per slot (template_type values).
  slot: string;
  // Garment image URL — the background-removed cutout (rig.asset_url) when
  // a rig exists, else the raw reference image.
  textureUrl: string;
  rig: RigData | null;
}

export interface SessionStartResponse {
  session_token: string;
  // Garment texture for the client-side runtime engine — raw product photo.
  // Used when rig is null (the engine's best-effort geometric overlay);
  // rig.asset_url (background-removed cutout) wins when a rig exists.
  reference_image_url?: string;
  rig?: RigData | null;
  // Hard ceiling in seconds enforced client-side (mirrors backend billing unit).
  max_duration_seconds: number;
  // True only when the merchant enabled recording in Settings → Privacy &
  // recording. The client records the composited try-on output ONLY when
  // this is set; the upload endpoint re-checks the setting server-side.
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
