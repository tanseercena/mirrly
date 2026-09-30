# Mirrly — Try-On Architecture Pivot (Decart → Rigged/AR)

**Status: Active migration. Read this before working on anything related to
live try-on, garment rigging, or the try-on runtime engine.**

## What exists today (being replaced)

Mirrly currently uses Decart's Lucy 2.5, a real-time AI video-generation model.
A shopper's webcam feed is sent to Decart, which regenerates the video
frame-by-frame based on a garment prompt and streams it back over WebRTC.
This costs money per customer session, for the full session duration.

## What we're replacing it with

A rigged/AR overlay system (Meet-filter style). Instead of generating new
video, we detect the shopper's body pose client-side (MediaPipe Pose/BlazePose,
plus Face Mesh for glasses) and warp/composite a pre-cut garment image onto
their live camera feed to match their pose. This runs 100% client-side per
customer session — zero per-frame server cost. The only cost is a one-time
async "rigging" job per product, run once when a merchant adds/updates a
product.

**Design principles (locked in):**
- No third-party realtime video generation. Rendering is pose-based
  overlay/warp, entirely client-side.
- Rigging is a one-time, per-product, async job — never something a customer
  waits on.
- One shared detection model across all merchants, continuously fine-tuned on
  pooled corrections — not a separate model per merchant.
- Live try-on is never stopped or gated on review status. Every product ships
  with whatever rig currently exists — best-effort now, corrected in place
  later.
- Accessories (hats, glasses, shoes, bags, jewelry) are NOT a machine-learning
  problem — simple geometric heuristics + existing runtime landmarks only.
  Only clothing (top, jacket, dress, pants, shorts, skirt) uses a trained
  model.

## Three subsystems (connected only via S3/CloudFront + the database — no
synchronous coupling between them)

**A. Ingestion & Rigging Pipeline** (async, one-time per product)
Shopify webhook (`products/create`, `products/update`, `app/installed`) →
Laravel queue job → fetch product image → store to
`s3://{merchant_id}/{product_id}/raw.jpg` → garment-type classification
(Shopify product_type/tags first, classifier fallback) → background removal
(self-hosted, e.g. rembg, on Hetzner) → landmark detection routed by category:
  - Clothing (top/jacket/dress/pants/shorts/skirt): RunPod Serverless
    DeepFashion2-based model + geometric sanity check
  - Accessories (cap/glasses/shoes/bag/necklace): geometric/contour analysis
    only, runs on Hetzner, no RunPod call
→ confidence scoring (detection confidence + geometric sanity + cutout
quality) → `status = auto_approved` or `needs_review` → publish `rig.json` to
S3/CloudFront **regardless of status** (try-on must never be blocked) →
`needs_review` items go into a pooled (cross-merchant) human review queue;
corrections write to `training_examples` and immediately republish that one
product's `rig.json`.

**B. Model Training Loop** (weekly, clothing categories only)
Pull unconsumed `training_examples` → fine-tune the *currently deployed*
model (not from scratch) on RunPod Pod → evaluate against a fixed held-out
validation set (never trained on) → promote only if new accuracy ≥ current →
deploy to the RunPod Serverless endpoint, bump `model_versions` → re-score the
`needs_review` backlog through the new model, auto-promoting whatever now
clears threshold.

**C. Runtime Try-On Engine** (per customer session, 100% client-side)
Storefront widget (Preact) loads the shared pose model (cached at CDN edge) +
Face Mesh if any active item is glasses → fetches only the specific rigged
asset(s) for products actually being tried on → per frame: pose landmarks →
warp each active garment's cutout to match landmarks via `rig.json`'s
anchor-point mapping → composite in z-order (bottoms → top → jacket →
accessories) → draw to canvas. Supports multi-item layering and swap without
pipeline restart. Graceful degradation (lower res/frame-skip) on weaker
devices.

## Schema (new tables)
garment_assets
  id
  merchant_id
  product_id
  template_type          // top, jacket, cap, glasses, shoes, bag, etc.
  detection_method        // 'ml_model' | 'geometric'
  status                  // auto_approved | needs_review
  confidence_score
  anchor_points_json
  asset_url
  model_version           // which model produced this result (null for geometric-only)
  scored_at
  reviewed_by, reviewed_at
  created_at, updated_at

training_examples
  id
  garment_asset_id
  anchor_points_json       // corrected, human-verified points
  corrected_by
  corrected_at
  used_in_model_version    // null until consumed by a retrain

model_versions
  id
  version_tag              // e.g. v1, v2, v3
  trained_on_count
  deployed_at
  runpod_endpoint_id
  eval_metrics_json         // accuracy on a fixed held-out validation set


`training_examples`/`model_versions` only apply to ML-model (clothing)
categories. Accessory corrections improve that product's rig immediately but
don't feed a retrain loop.

## Detection model approach (clothing categories)

DeepFashion2 is a *dataset* (491K images, 13 categories, 294 total
landmarks), not a downloadable pretrained model. Its official baseline is
"Match R-CNN" (Mask R-CNN + keypoint head, built on Detectron2). Our approach:
use Detectron2's keypoint R-CNN, init from COCO-pretrained weights, fine-tune
on DeepFashion2 annotations converted to COCO format (conversion scripts exist
in the official `switchablenorms/DeepFashion2` repo), filtered to just our 6
relevant categories (top/jacket/dress/pants/shorts/skirt) rather than all 13.
Weekly retrain fine-tunes the currently-deployed checkpoint further (not from
scratch). Evaluate via keypoint AP/AP50/AP75 against a fixed held-out
validation set. Known risk: DeepFashion2 is mostly worn-garment photos, while
merchant product photos may be flat-lay/ghost-mannequin — baseline testing on
real merchant images is needed before assuming good transfer.

## Build order (one phase at a time — do not jump ahead or assume a later
phase's requirements)

1. Database migrations (the three tables above)
2. Ingestion pipeline jobs: webhook handlers → FetchProductImageJob →
   ClassifyGarmentTypeJob → BackgroundRemovalJob → DetectLandmarksJob →
   ScoreAndPublishJob (chained, same pattern as the existing catalog-sync job
   pipeline)
3. Internal review-queue admin UI (Polaris/React), pooled across merchants,
   drag-to-correct anchor points
4. Weekly Artisan scheduled retrain command + RunPod Pod fine-tune/eval/promote
   flow
5. Storefront widget rewrite: remove the Decart/WebRTC session-token flow, add
   the client-side pose + warp + composite engine
6. Revisit usage-based billing — per-session cost drops to near zero under
   this model, so billing may shift toward per-product-rigged or catalog-size
   tiers instead of session-seconds
7. Decide rollout strategy: feature-flagged parallel run alongside Decart vs.
   hard cutover, given how much existing code (session tokens, WebRTC flow,
   camera-fallback settings) is built specifically around Decart

## How to work with me on this

I will give you one literal instruction per step (e.g. "create the migration
for garment_assets with these exact columns: ..."). Execute exactly what I
ask. But since you now have the full picture above: if an instruction I give
you would contradict this plan, break the schema, violate a locked-in design
principle (e.g. blocking try-on on review status), or skip something a later
phase depends on — flag it to me before proceeding, rather than silently
complying or silently "fixing" it yourself.