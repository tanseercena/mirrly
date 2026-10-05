<?php

namespace App\Http\Controllers;

use App\Models\GarmentAsset;
use App\Models\TrainingExample;
use App\Services\RigPublisher;
use App\Services\RigStorage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Internal rig review queue — pooled across all merchants.
 *
 * Lists needs_review rigs, and takes human corrections: drag the anchors to
 * the right spots on the cutout, save. A correction sets the asset to
 * auto_approved (human-verified), writes a training_examples row for
 * clothing categories (feeding the weekly retrain — accessories are
 * geometric by design and never retrain), and republishes that product's
 * rig.json so the very next shopper session uses the corrected anchors.
 *
 * Gated by REVIEW_QUEUE_ADMINS (comma-separated shopify domains) — this is
 * an internal tool that sees cross-merchant data, not a merchant feature.
 */
class ReviewQueueController extends Controller
{
    /**
     * GET api/review-queue — pooled queue across all merchants.
     */
    public function index(Request $request): JsonResponse
    {
        if ($denied = $this->denyNonReviewer()) {
            return $denied;
        }

        $status = $request->input('status', 'needs_review');
        $type = $request->input('type');

        $assets = GarmentAsset::query()
            ->with(['product:id,title,shopify_product,store_id', 'merchant:id,shopify_domain'])
            ->when($status !== 'all', fn ($q) => $q->where('status', $status))
            ->when($type, fn ($q) => $q->where('template_type', $type))
            ->orderByRaw("CASE WHEN status = 'needs_review' THEN 0 ELSE 1 END")
            ->orderByDesc('created_at')
            ->limit(200)
            ->get();

        return response()->json([
            'data' => $assets->map(fn (GarmentAsset $asset) => [
                'id' => $asset->id,
                'template_type' => $asset->template_type,
                'status' => $asset->status,
                'confidence_score' => $asset->confidence_score,
                'detection_method' => $asset->detection_method,
                'created_at' => $asset->created_at?->toIso8601String(),
                'product_title' => $asset->product?->title,
                'product_image' => $asset->product?->shopify_product['featuredImage']['url'] ?? null,
                'merchant' => $asset->merchant?->shopify_domain,
            ])->all(),
        ]);
    }

    /**
     * GET api/review-queue/{id} — one asset with everything the correction
     * editor needs: current anchors, cutout, raw product photo.
     */
    public function show($id): JsonResponse
    {
        if ($denied = $this->denyNonReviewer()) {
            return $denied;
        }

        $asset = GarmentAsset::query()
            ->with(['product:id,title,shopify_product,store_id', 'merchant:id,shopify_domain'])
            ->find((int) $id);
        if (!$asset) {
            return response()->json(['error' => 'Asset not found'], 404);
        }

        $product = $asset->product;

        return response()->json([
            'data' => [
                'id' => $asset->id,
                'template_type' => $asset->template_type,
                'status' => $asset->status,
                'confidence_score' => $asset->confidence_score,
                'detection_method' => $asset->detection_method,
                'anchors' => $asset->anchor_points_json['anchors'] ?? [],
                'cutout_url' => $asset->asset_url,
                // Raw (pre-cutout) product photo for reference while correcting.
                'raw_url' => RigStorage::disk()->url("{$asset->product->store_id}/{$asset->product->id}/raw.jpg"),
                'product_title' => $product?->title,
                'product_image' => $product?->shopify_product['featuredImage']['url'] ?? null,
                'merchant' => $asset->merchant?->shopify_domain,
            ],
        ]);
    }

    /**
     * POST api/review-queue/{id}/correct — the drag-to-correct save.
     *
     * Body: { anchors: { <name>: {x, y}, ... } } — normalized 0..1 within
     * the cutout image. Replaces the anchors wholesale (the editor sends
     * the full set), approves the asset, records the correction, republishes.
     */
    public function correct(Request $request, $id): JsonResponse
    {
        if ($denied = $this->denyNonReviewer()) {
            return $denied;
        }

        $asset = GarmentAsset::with('product')->find((int) $id);
        if (!$asset || !$asset->product) {
            return response()->json(['error' => 'Asset not found'], 404);
        }

        $anchors = $this->validateAnchors($request);
        if ($anchors === null) {
            return response()->json(['error' => 'anchors must be { name: {x, y} } with values in 0..1'], 422);
        }

        $reviewer = $this->reviewerShop();
        $anchorJson = $asset->anchor_points_json ?? [];
        $anchorJson['version'] = 2;
        $anchorJson['anchors'] = $anchors;

        $asset->update([
            'anchor_points_json' => $anchorJson,
            'status' => GarmentAsset::STATUS_AUTO_APPROVED,
            'reviewed_by' => $reviewer,
            'reviewed_at' => now(),
        ]);

        // Clothing corrections feed the weekly retrain (phase 4); accessory
        // corrections improve only this product's rig — geometric by design.
        if (in_array($asset->template_type, GarmentAsset::CLOTHING_TYPES, true)) {
            TrainingExample::create([
                'garment_asset_id' => $asset->id,
                'anchor_points_json' => $anchorJson,
                'corrected_by' => $reviewer,
                'corrected_at' => now(),
            ]);
        }

        // The corrected rig goes live immediately — no pipeline restart.
        app(RigPublisher::class)->republish($asset->product, $asset);

        return response()->json(['success' => true]);
    }

    /**
     * POST api/review-queue/{id}/approve — bless the current anchors without
     * moving them. Same flow as a correction, minus the anchor change.
     */
    public function approve($id): JsonResponse
    {
        if ($denied = $this->denyNonReviewer()) {
            return $denied;
        }

        $asset = GarmentAsset::with('product')->find((int) $id);
        if (!$asset || !$asset->product) {
            return response()->json(['error' => 'Asset not found'], 404);
        }

        $reviewer = $this->reviewerShop();
        $asset->update([
            'status' => GarmentAsset::STATUS_AUTO_APPROVED,
            'reviewed_by' => $reviewer,
            'reviewed_at' => now(),
        ]);

        if (in_array($asset->template_type, GarmentAsset::CLOTHING_TYPES, true)) {
            TrainingExample::create([
                'garment_asset_id' => $asset->id,
                'anchor_points_json' => $asset->anchor_points_json,
                'corrected_by' => $reviewer,
                'corrected_at' => now(),
            ]);
        }

        return response()->json(['success' => true]);
    }

    // --- reviewer gate + helpers ---

    /**
     * The authenticated shop must be on the REVIEW_QUEUE_ADMINS allowlist —
     * this queue shows cross-merchant data and is an internal tool only.
     */
    private function denyNonReviewer(): ?JsonResponse
    {
        $allowed = array_filter(array_map(
            'trim',
            explode(',', (string) config('services.rigging.review_admins'))
        ));

        if (empty($allowed)) {
            return response()->json(['error' => 'Review queue is not enabled'], 403);
        }

        if (!in_array($this->reviewerShop(), $allowed, true)) {
            return response()->json(['error' => 'Not a review queue admin'], 403);
        }

        return null;
    }

    private function reviewerShop(): string
    {
        return (string) request()->get('shopifySession')?->getShop();
    }

    /**
     * Anchors body shape: { <name>: {x, y} } — names are snake_case anchor
     * labels, values normalized 0..1 within the cutout. Returns null when
     * the shape is invalid (responded 422 by the caller).
     */
    private function validateAnchors(Request $request): ?array
    {
        $input = $request->input('anchors');
        if (!is_array($input) || count($input) === 0 || count($input) > 20) {
            return null;
        }

        $anchors = [];
        foreach ($input as $name => $point) {
            if (!is_string($name) || !preg_match('/^[a-z][a-z_]{0,39}$/', $name) || !is_array($point)) {
                return null;
            }
            $x = $point['x'] ?? null;
            $y = $point['y'] ?? null;
            if (!is_numeric($x) || !is_numeric($y) || $x < 0 || $x > 1 || $y < 0 || $y > 1) {
                return null;
            }
            $anchors[$name] = ['x' => round((float) $x, 4), 'y' => round((float) $y, 4)];
        }

        return $anchors;
    }
}