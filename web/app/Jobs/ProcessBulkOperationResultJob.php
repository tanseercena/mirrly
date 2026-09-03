<?php

namespace App\Jobs;

use App\Helpers\Shopify;
use App\Models\Product;
use App\Models\Store;
use App\Models\SyncJob;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Streams the bulk operation's JSONL result and upserts products.
 *
 * The JSONL is FLATTENED, not nested: variants and collections arrive as
 * separate lines linked back via __parentId (children follow their parent
 * line). Two passes: upsert products as the stream is consumed, then flip
 * try_on for everything the scope covers.
 */
class ProcessBulkOperationResultJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Store $store,
        public SyncJob $syncJob,
        public string $resultUrl
    ) {}

    public function handle(): void
    {
        $stream = @fopen($this->resultUrl, 'r');

        if ($stream === false) {
            Log::error('Unable to open bulk operation result: ' . $this->resultUrl);
            $this->syncJob->update([
                'status' => SyncJob::STATUS_FAILED,
                'error' => 'Unable to download bulk operation result',
            ]);
            return;
        }

        try {
            $this->consumeStream($stream);
        } catch (\Throwable $e) {
            Log::error('Bulk result processing failed: ' . $e->getMessage());
            $this->syncJob->update([
                'status' => SyncJob::STATUS_FAILED,
                'error' => $e->getMessage(),
            ]);
        } finally {
            fclose($stream);
        }
    }

    /**
     * Single pass over the JSONL stream. Children of each product
     * (variants, collections) follow their parent line contiguously, so
     * products are finalized as the next product line arrives.
     */
    private function consumeStream($stream): void
    {
        $buffer = [];
        $current = null;        // product node being assembled
        $variants = [];         // variant rows for $current
        $collectionRows = [];   // collection rows (id + title) for $current
        $scopeIds = [];         // numeric ids of every product this sync covers

        while (($line = fgets($stream)) !== false) {
            $line = trim($line);

            if ($line === '') {
                continue;
            }

            $row = json_decode($line, true);

            if (!is_array($row) || empty($row['id'])) {
                continue;
            }

            $gid = $row['id'];

            if (str_starts_with($gid, 'gid://shopify/Product/')) {
                // A new product starts; the previous one is complete
                // (its children always precede the next parent).
                if ($current !== null) {
                    $buffer[] = $this->buildRow($current, $variants, $collectionRows);
                    $variants = [];
                    $collectionRows = [];
                }

                $current = $row;
                $scopeIds[] = Shopify::numericId($gid);

                if (count($buffer) >= 200) {
                    $this->flushBuffer($buffer);
                    $buffer = [];
                }

            } elseif (str_starts_with($gid, 'gid://shopify/ProductVariant/')) {
                $variants[] = $row;

            } elseif (str_starts_with($gid, 'gid://shopify/Collection/')) {
                $collectionRows[] = $row;

            }
            // Any other line type is not part of this sync's schema; skip it.
        }

        if ($current !== null) {
            $buffer[] = $this->buildRow($current, $variants, $collectionRows);
        }

        $this->flushBuffer($buffer);

        $this->enableTryOnForScope($scopeIds);
    }

    /**
     * Upsert a chunk of product rows in one transaction and advance the
     * sync job's progress counter.
     */
    private function flushBuffer(array $buffer): void
    {
        if (empty($buffer)) {
            return;
        }

        DB::transaction(function () use ($buffer) {
            foreach ($buffer as $row) {
                Product::updateOrCreate(
                    ['store_id' => $this->store->id, 'shopify_product_id' => $row['shopify_product_id']],
                    [
                        'shopify_collection_id' => $row['shopify_collection_id'],
                        'title' => $row['title'],
                        'product_type' => $row['product_type'],
                        'shopify_product' => $row['shopify_product'],
                        'variant_images' => $row['variant_images'],
                        'shopify_updated_at' => $row['shopify_updated_at'],
                        'synced_at' => now(),
                    ]
                );
            }
        });

        $this->syncJob->update(['processed' => $this->syncJob->processed + count($buffer)]);
    }

    /**
     * Second pass: flip try_on on for every product this sync covers.
     */
    private function enableTryOnForScope(array $scopeIds): void
    {
        foreach (array_chunk($scopeIds, 1000) as $chunk) {
            Product::where('store_id', $this->store->id)
                ->whereIn('shopify_product_id', $chunk)
                ->update(['try_on' => true]);
        }
    }

    /**
     * Merge a product node with its collected variant/collection rows into
     * the columns we persist.
     */
    private function buildRow(array $node, array $variants, array $collectionRows): array
    {
        // Variants without a dedicated image inherit the product's featured
        // image — Shopify omits the image key for them in the JSONL, so the
        // effective image is own-image-else-featured. Entries are keyed by
        // variant so images can be mapped back per variant.
        $featuredImageUrl = $node['featuredImage']['url'] ?? null;

        $variantImages = [];
        foreach ($variants as $variant) {
            $url = $variant['image']['url'] ?? $featuredImageUrl;
            if (!empty($url)) {
                $variantImages[] = [
                    'variant_id' => Shopify::numericId($variant['id'] ?? ''),
                    'variant_title' => $variant['title'] ?? null,
                    'url' => $url,
                ];
            }
        }

        // Enrich the raw node with its flattened children so the stored
        // payload is self-contained, then persist the columns we have.
        $node['variants'] = array_map(
            fn ($v) => [
                'id' => $v['id'],
                'title' => $v['title'],
                'image' => $v['image'] ?? ($featuredImageUrl ? ['url' => $featuredImageUrl] : null),
            ],
            $variants
        );
        $node['collections'] = array_map(
            fn ($c) => ['id' => $c['id'], 'title' => $c['title'] ?? null],
            $collectionRows
        );

        return [
            'shopify_product_id' => Shopify::numericId($node['id']),
            'shopify_collection_id' => !empty($collectionRows) ? Shopify::numericId($collectionRows[0]['id']) : null,
            'title' => $node['title'],
            'product_type' => $node['productType'] ?? null,
            'shopify_product' => $node,
            'variant_images' => $variantImages,
            'shopify_updated_at' => $node['updatedAt'] ?? null,
        ];
    }
}