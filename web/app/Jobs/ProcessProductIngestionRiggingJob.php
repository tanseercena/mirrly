<?php

namespace App\Jobs;

use App\Services\RigStorage;
use App\Models\Product;
use App\Services\GarmentTypeClassifier;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Per-product ingestion & rigging pipeline — entry point.
 *
 * Dispatched once per product (on first catalog import) and re-dispatched
 * only when the product's featured image changes. Fetches the featured
 * image to s3://{merchant_id}/{product_id}/raw.jpg, classifies the
 * garment type, then hands off to the background-removal → landmark
 * detection → score/publish chain.
 */
class ProcessProductIngestionRiggingJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 300;

    public function __construct(public Product $product) {}

    public function handle(GarmentTypeClassifier $classifier): void
    {
        $featuredUrl = $this->product->shopify_product['featuredImage']['url'] ?? null;

        if (empty($featuredUrl)) {
            Log::info('Rigging skipped: product has no featured image', [
                'product_id' => $this->product->id,
            ]);
            return;
        }

        $classification = $classifier->classify($this->product);

        if ($classification === null) {
            Log::info('Rigging skipped: no try-on category detected', [
                'product_id' => $this->product->id,
                'title' => $this->product->title,
            ]);
            return;
        }

        $response = Http::timeout(60)->get($featuredUrl);

        if ($response->failed()) {
            Log::error('Rigging aborted: failed to download featured image', [
                'product_id' => $this->product->id,
                'url' => $featuredUrl,
                'status' => $response->status(),
            ]);
            return;
        }

        // {merchant_id}/{product_id}/raw.jpg — the pipeline's shared
        // staging area; every later stage reads from here.
        $rawPath = "{$this->product->store_id}/{$this->product->id}/raw.jpg";
        RigStorage::disk()->put($rawPath, $response->body());

        RemoveBGJob::dispatch(
            $this->product,
            $rawPath,
            $classification['template_type'],
            $classification['category']
        );
    }
}
