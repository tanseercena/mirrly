# Try-on widget — end-to-end flow

## Files

| File | Loads when | Responsibility |
|---|---|---|
| `src/loader.ts` | Every product page (always) | Fetch config, render button, lazy-load widget on click |
| `src/insertion.ts` | Called by loader | Position the button in the DOM (Option B — swap this file for Option A later) |
| `src/session-api.ts` | Called by loader/widget | All backend calls, via Shopify App Proxy |
| `src/widget.tsx` | Only after button click | Mounts the Preact modal to a body-level portal |
| `src/TryOnModal.tsx` | Only after button click | Camera, engine connection, variant switching, cart, funnel events |
| `src/realtime-engine.ts` | Only after button click | The one file that imports the vendor SDK directly |
| `src/styles.css` | Bundled into widget chunk | Button + modal styling, driven by CSS variables |
| `build.js` | Dev/build time | esbuild config, outputs into the theme extension's `assets/` |

## Auth model — no admin session involved

This script runs entirely on the anonymous storefront, so there's no logged-in
user, no OAuth token, no admin session available to it — and it doesn't need
one. Authentication works like this instead:

1. Your app registers an App Proxy path (e.g. `/apps/tryon/*` → your backend)
   in its Shopify config.
2. Any request the browser makes to that path is intercepted by **Shopify
   itself** first. Shopify appends `shop`, `timestamp`, and a `signature`
   (an HMAC computed server-side using your app's client secret) before
   forwarding the request to your backend.
3. Your Laravel middleware verifies that signature on every incoming proxy
   request. A valid signature proves the request genuinely came through
   *this specific shop's* storefront — no shopper login required anywhere.

The browser-side code never attaches a token to prove this — it's entirely
transparent, handled by Shopify's proxy layer. `config_token` (returned by
`/config`, sent back on `/session`) is a *separate, smaller* mechanism: a
short-lived signed value that just ties a `/session` call back to the exact
`product_id`/`variant_id` a shopper was shown, so `/session` can't be called
directly with an arbitrary product ID without going through `/config` first.
It's an integrity check on your own flow, not the authentication layer.

## Runtime sequence

1. **Page load** — `loader.ts` runs for every `[id^="tryon-root-"]` element the
   Liquid block rendered. It calls `GET /apps/tryon/config` — Shopify's App
   Proxy signature (verified server-side, see above) authenticates this
   automatically; the browser doesn't do anything extra for it to work.
2. **Config decides whether to render anything.** If `enabled: false`, nothing
   is added to the page — zero cost, zero layout shift.
3. **If enabled**, the button is built from `config.button` (text/color/radius/icon)
   and inserted via `insertion.ts`, using theme-selector heuristics for Option B.
4. **Click** → `loader.ts` dynamically `import()`s `widget.tsx` (this is the
   moment the Preact runtime, the modal, and the realtime engine SDK actually
   download — never before).
5. **`TryOnModal` mounts** and:
    - calls `POST /apps/tryon/session` with the short-lived `config_token`
      (the integrity check described above, not an auth token), which creates
      the `sessions` row server-side (`camera_opened_at` set) and returns a
      scoped `engine_token` + prompt + reference image
    - requests `getUserMedia`
    - connects directly to the realtime engine's edge over WebRTC via
      `realtime-engine.ts`
    - on first remote frame: fires `tryon_started`, starts the duration-cap timer
6. **Variant switching** — a capture-phase `change` listener on the document
   watches for Shopify's standard `select[name="id"]`/`input[name="id"]`
   variant controls. On change, it fetches a new prompt for that variant and
   calls `engine.setPrompt()` on the already-open connection — no reconnect.
7. **Add to cart** — posts to Shopify's own `/cart/add.js`, reads the resulting
   cart token from `/cart.js`, and sends `added_to_cart` with that token —
   this is what your `orders/create` webhook later matches against to
   backfill `purchased_at`.
8. **Session end** (close, duration cap, or error) — `tryon_completed` fires
   with the actual elapsed duration; the camera stream and engine connection
   are torn down.

## Backend requirement: proxy signature middleware

Every route in the `/apps/tryon/*` group needs to run signature verification
before anything else — this is the actual auth layer for the whole flow:

```php
public function verifyProxySignature(Request $request): bool
{
    $params = $request->query();
    $signature = $params['signature'] ?? null;
    unset($params['signature']);

    ksort($params);
    $computed = hash_hmac(
        'sha256',
        collect($params)->map(fn ($v, $k) => "{$k}={$v}")->implode(''),
        config('services.shopify.client_secret')
    );

    return hash_equals($computed, $signature ?? '');
}
```

## Backend endpoints this expects (Laravel, behind the App Proxy)

- `GET /apps/tryon/config?product_id&variant_id` → `{ enabled, button, config_token }`
- `POST /apps/tryon/session` → `{ session_token, engine_token, engine_endpoint, prompt, reference_image_url, max_duration_seconds }`
- `GET /apps/tryon/variant-prompt?product_id&variant_id` → `{ prompt }`
- `POST /apps/tryon/event` (sendBeacon) → writes funnel timestamps against `session_token`
- `POST /apps/tryon/telemetry` (sendBeacon) → non-critical diagnostics (e.g. insertion fallback rate)

## Build

Assumes `tryon-src/` sits as a **sibling of `extensions/`** at your Shopify
app's root (i.e. `outdir: '../extensions/tryon-block/assets'` in `build.js`
resolves relative to wherever `npm run build` is invoked from — adjust that
path if your folder layout differs):

```
app-root/
  extensions/tryon-block/...
  tryon-src/              <- this project
```

```
npm install
npm run build   # one-off build
npm run watch   # watch mode, run alongside `shopify app dev`
```

Verified in a clean install: `tryon-loader.js` builds with zero top-level
`import`/`export` statements (safe for its plain `<script src>` tag), and
`tryon-widget.js` builds as a real ES module correctly exporting
`mountWidget` (required for `loader.ts`'s dynamic `import()` to resolve it).
The only build failure in a fresh checkout is `realtime-engine.ts`'s
`@decartai/sdk` import, which is a placeholder — swap it for the real
package name and constructor/method signatures once you're working from
the vendor's actual current SDK docs.

Output lands in `extensions/tryon-block/assets/` as two separate bundles:

- **`tryon-loader.js`** — a classic IIFE bundle. The Liquid block's
  `<script src="{{ 'tryon-loader.js' | asset_url }}" defer></script>` tag
  needs **no** `type="module"` — it never contains top-level import/export.
- **`tryon-widget.js`** — a real ES module, with Preact fully bundled in.
  It's never referenced by a `<script>` tag directly; `loader.ts`'s
  `import(data.widgetUrl)` loads it dynamically. Dynamic `import()` always
  resolves its target as a module regardless of how the calling script was
  loaded, which is why this file specifically needs `format: 'esm'` in
  `build.js` while the loader stays `format: 'iife'`.

Preact never needs to be loaded separately (no CDN `<script>`, no global) —
it's bundled directly into `tryon-widget.js` at build time, since it's only
ever downloaded on click, not on every page load.

## Known limitation worth knowing about

`realtime-engine.ts` keeps the vendor name out of your own source/bundle
strings, but it can't hide the vendor's domain from the browser's Network tab
once the WebRTC connection is live — that's an inherent property of a direct
browser-to-vendor connection, not something fixable at this layer.
