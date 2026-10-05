<?php

namespace App\Services;

use App\Models\GarmentAsset;
use App\Models\Product;

// Resolves what the storefront runtime engine needs for one product: the
// garment texture (reference image) and the rig (anchor-point mapping +
// background-removed cutout) produced by the ingestion pipeline.
//
// The rig is never a gate — per the design principles, every product ships
// with whatever rig currently exists. A product with no garment_assets row
// yet (the normal case until the pipeline runs) still gets a session; the
// runtime engine then does a best-effort geometric overlay using the raw
// reference image.
class RigService
{
    /**
     * Best garment photo for a product/variant — the storefront URL the
     * runtime engine uses as the overlay texture when no pipeline-produced
     * cutout (asset_url) exists yet.
     *
     * Garment source priority: merchant-uploaded photo for the variant, then
     * a merchant photo with no variant, then the synced Shopify variant image,
     * then the product's featured image.
     */
    public function resolveReferenceImageUrl(Product $product, ?int $variantId): ?string
    {
        $entry = $this->pickSourceEntry($product, $variantId);
        if (!$entry || empty($entry['url'])) {
            return null;
        }

        return $this->absoluteUrl((string) $entry['url']);
    }

    /**
     * The product's current rig, or null when none exists yet. Preferred over
     * the raw reference image because asset_url is a background-removed
     * cutout with pipeline-measured anchor points.
     *
     * Review status is deliberately NOT a filter: needs_review rigs ship live
     * (best-effort now, corrected in place later).
     */
    public function resolveRig(Product $product): ?array
    {
        $assets = GarmentAsset::where('product_id', $product->id)
            ->get()
            ->sortByDesc(fn (GarmentAsset $asset) => [
                $asset->status === GarmentAsset::STATUS_AUTO_APPROVED ? 1 : 0,
                $asset->confidence_score ?? 0,
                $asset->created_at?->getTimestamp() ?? 0,
            ]);

        /** @var GarmentAsset|null $asset */
        $asset = $assets->first();
        if (!$asset) {
            return null;
        }

        return [
            'template_type' => $asset->template_type,
            'detection_method' => $asset->detection_method,
            // v1 rig format — see runtime-engine.ts on the frontend for the
            // consumer. The ingestion pipeline (phase 2) is the producer.
            'anchor_points' => $asset->anchor_points_json,
            'asset_url' => $this->absoluteUrl($asset->asset_url),
            'confidence_score' => $asset->confidence_score,
        ];
    }

    private function pickSourceEntry(Product $product, ?int $variantId): ?array
    {
        $variantMatch = fn (array $entry): bool => $variantId !== null
            && (int) ($entry['variant_id'] ?? -1) === $variantId;

        foreach ($product->reference_images ?? [] as $entry) {
            if ($variantMatch($entry) && !empty($entry['url'])) {
                return $entry;
            }
        }

        foreach ($product->reference_images ?? [] as $entry) {
            if (($entry['variant_id'] ?? null) === null && !empty($entry['url'])) {
                return $entry;
            }
        }

        foreach ($product->variant_images ?? [] as $entry) {
            if ($variantMatch($entry) && !empty($entry['url'])) {
                return $entry;
            }
        }

        $featured = $product->shopify_product['featuredImage']['url'] ?? null;

        return $featured ? ['variant_id' => $variantId, 'url' => $featured] : null;
    }

    // Merchant reference photos are stored via Storage::url and can be
    // app-relative ("/storage/...") — storefront fetches need them absolute.
    private function absoluteUrl(string $url): string
    {
        if (str_starts_with($url, '/')) {
            return rtrim((string) config('app.url'), '/') . $url;
        }

        return $url;
    }
}
