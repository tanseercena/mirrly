<?php

namespace App\Services;

use App\Services\RigStorage;
use App\Models\GarmentAsset;
use App\Models\ModelVersion;
use App\Models\Product;
use Illuminate\Support\Facades\Log;

/**
 * Single place where a rigging pipeline run is scored, recorded and
 * published. Called at the end of both detection paths (ML clothing and
 * geometric accessory).
 *
 * Two invariants from the architecture live here:
 *  - rig.json is published REGARDLESS of status — try-on uses whatever
 *    rig currently exists, best-effort; review only improves it later.
 *  - The garment_assets row is upserted, so a re-rig (new product image)
 *    replaces the previous rig for the same product + template type.
 */
class RigPublisher
{
    /** Weights of the three score components. */
    private const WEIGHT_DETECTION = 0.5;

    private const WEIGHT_SANITY = 0.3;

    private const WEIGHT_CUTOUT_QUALITY = 0.2;

    public function __construct(private GeometricSanityChecker $sanityChecker) {}

    /**
     * Score, upsert the garment asset, and publish rig.json to S3.
     *
     * @param  array<string, array{x: float, y: float}>  $anchors  Normalized anchor points.
     * @param  array{x: float, y: float, width: float, height: float}|null  $boundingBox
     * @param  array{width: int, height: int}|null  $image
     * @param  array{passed: bool, score: float, reasons: string[]}|null  $sanity  Null for the geometric path (the layout IS the sanity check).
     */
    public function publish(
        Product $product,
        string $templateType,
        string $detectionMethod,
        string $cutoutPath,
        array $anchors,
        float $detectionConfidence,
        ?array $sanity,
        ?array $boundingBox = null,
        ?array $image = null,
        ?ModelVersion $modelVersion = null
    ): GarmentAsset {
        $cutoutQuality = $this->assessCutoutQuality($cutoutPath);

        $score = self::WEIGHT_DETECTION * $detectionConfidence
            + self::WEIGHT_SANITY * ($sanity['score'] ?? 0.7)
            + self::WEIGHT_CUTOUT_QUALITY * $cutoutQuality;

        $threshold = (float) config('services.rigging.auto_approve_threshold', 0.75);
        $sanityPassed = $sanity === null || $sanity['passed'];

        $status = ($sanityPassed && $score >= $threshold)
            ? GarmentAsset::STATUS_AUTO_APPROVED
            : GarmentAsset::STATUS_NEEDS_REVIEW;

        $asset = GarmentAsset::updateOrCreate(
            ['product_id' => $product->id, 'template_type' => $templateType],
            [
                'merchant_id' => $product->store_id,
                'detection_method' => $detectionMethod,
                'status' => $status,
                'confidence_score' => round($score, 4),
                'anchor_points_json' => array_filter([
                    // Rig format v2: garment-space named anchors (0..1 within
                    // the cutout). The runtime engine maps them to MediaPipe
                    // body landmarks via its per-template ANCHOR_TO_BODY table
                    // (see extensions-src/src/engine-layers.ts).
                    'version' => 2,
                    'coordinate_space' => 'normalized',
                    'anchors' => $anchors,
                    'bounding_box' => $boundingBox,
                    'image' => $image,
                    'sanity' => $sanity,
                ]),
                'asset_url' => RigStorage::disk()->url($cutoutPath),
                'model_version' => $modelVersion?->id,
                'scored_at' => now(),
                // A re-rig resets any previous review state — the new
                // detection is what's live now.
                'reviewed_by' => null,
                'reviewed_at' => null,
            ]
        );

        $this->writeRigJson($product, $asset, $cutoutPath);

        Log::info('Rig published', [
            'product_id' => $product->id,
            'template_type' => $templateType,
            'status' => $status,
            'score' => $score,
            'sanity_reasons' => $sanity['reasons'] ?? [],
        ]);

        return $asset;
    }

    /**
     * Re-write rig.json for an already-published asset — used after a review
     * correction. No re-scoring: the human-corrected anchors ARE the ground
     * truth, so the asset ships them immediately.
     */
    public function republish(Product $product, GarmentAsset $asset): void
    {
        $this->writeRigJson($product, $asset, "{$product->store_id}/{$product->id}/cutout.png");
    }

    /**
     * rig.json at s3://{merchant_id}/{product_id}/rig.json — the only file
     * the storefront runtime fetches. Written for every status.
     */
    private function writeRigJson(Product $product, GarmentAsset $asset, string $cutoutPath): void
    {
        $rig = [
            'product_id' => $product->shopify_product_id,
            'template_type' => $asset->template_type,
            'asset_url' => RigStorage::disk()->url($cutoutPath),
            'anchor_points' => $asset->anchor_points_json,
            'confidence_score' => $asset->confidence_score,
            'status' => $asset->status,
            'detection_method' => $asset->detection_method,
            'model_version' => $asset->modelVersion?->version_tag,
            'scored_at' => $asset->scored_at?->toIso8601String(),
        ];

        RigStorage::disk()->put(
            "{$product->store_id}/{$product->id}/rig.json",
            json_encode($rig, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT)
        );
    }

    /**
     * Cutout quality signal: what fraction of the image is opaque garment.
     * A clean ghosted cutout typically covers 15–70% of the frame; a
     * failed removal leaves near-full coverage (background kept) or
     * near-zero (everything erased).
     */
    private function assessCutoutQuality(string $cutoutPath): float
    {
        $binary = RigStorage::disk()->get($cutoutPath);
        $image = @imagecreatefromstring($binary);

        if ($image === false) {
            return 0.0;
        }

        try {
            $width = imagesx($image);
            $height = imagesy($image);
            $stride = max(1, (int) floor(max($width, $height) / 300));
            $opaque = 0;
            $sampled = 0;

            for ($y = 0; $y < $height; $y += $stride) {
                for ($x = 0; $x < $width; $x += $stride) {
                    $sampled++;
                    if (((imagecolorat($image, $x, $y) >> 24) & 0xFF) < 64) {
                        $opaque++;
                    }
                }
            }

            $coverage = $opaque / max($sampled, 1);

            // Peak quality inside the healthy band, falling off toward both
            // failure modes (background kept / garment erased).
            if ($coverage < 0.15) {
                return round($coverage / 0.15, 4);
            }
            if ($coverage <= 0.7) {
                return 1.0;
            }

            return round(max(0.0, 1.0 - ($coverage - 0.7) / 0.3), 4);
        } finally {
            imagedestroy($image);
        }
    }
}
