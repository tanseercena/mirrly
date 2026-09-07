<?php

namespace App\Http\Controllers;

use App\Helpers\Shopify;
use App\Jobs\TriggerCatalogSyncJob;
use App\Models\Product;
use App\Models\Store;
use App\Models\SyncJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProductsController extends Controller
{
    /**
     * Paginated list of the store's synced products for the Products page.
     * Served from our own database — no live Shopify calls.
     */
    public function index(Request $request)
    {
        $store = $this->resolveStore($request);

        if (!$store) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $query = Product::where('store_id', $store->id)->withCount('trySessions');

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where('title', 'like', '%' . $search . '%');
        }

        $status = $request->query('status', 'all');
        if ($status === 'enabled') {
            $query->where('try_on', true);
        } elseif ($status === 'disabled') {
            $query->where('try_on', false);
        }

        // Collections live inside the shopify_product JSON payload
        if ($collectionId = $request->query('collection_id')) {
            $query->whereJsonContains('shopify_product->collections', [
                'id' => 'gid://shopify/Collection/' . (int) $collectionId,
            ]);
        }

        $perPage = in_array((int) $request->query('per_page', 25), [10, 25, 50, 100])
            ? (int) $request->query('per_page', 25)
            : 25;

        $products = $query->orderByDesc('synced_at')->paginate($perPage);

        $collectionOptions = $this->storeCollectionOptions($store);

        return response()->json([
            'products' => collect($products->items())
                ->map(fn ($product) => $this->mapProduct($product, $collectionOptions))
                ->all(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
            ],
            'stats' => [
                'total' => Product::where('store_id', $store->id)->count(),
                'enabled' => Product::where('store_id', $store->id)->where('try_on', true)->count(),
                'last_synced_at' => Product::where('store_id', $store->id)->max('synced_at'),
            ],
            'collections' => $collectionOptions,
        ]);
    }

    /**
     * Map a synced product row into the shape the Products page UI expects.
     */
    private function mapProduct(Product $product, $collectionOptions): array
    {
        $payload = $product->shopify_product ?? [];
        $image = $payload['featuredImage']['url'] ?? null;

        // The stored variant images already carry the featured-image fallback
        $variants = collect($payload['variants'] ?? [])->map(fn ($v) => [
            'id' => Shopify::numericId($v['id'] ?? ''),
            'name' => $v['title'] ?? 'Variant',
            'image' => $v['image']['url'] ?? null,
            'status' => !empty($v['image']['url']) ? 'matched' : 'missing',
        ])->values();

        $collectionTitle = null;
        $collections = collect($payload['collections'] ?? []);
        if ($collections->isNotEmpty()) {
            $first = $collections->first();
            // Prefer the title synced from Shopify (present on new syncs);
            // fall back to the scope's saved collection list, then the id.
            $collectionTitle = $first['title']
                ?? $collectionOptions->firstWhere('id', (string) Shopify::numericId($first['id'] ?? ''))['title']
                ?? 'Collection #' . Shopify::numericId($first['id'] ?? '');
        }

        // Reference options: product-level featured image + only variants
        // with their OWN image (no featured fallback here — it would repeat
        // the default once per variant), plus uploaded references.
        $referenceOptions = [];
        if (!empty($image)) {
            $referenceOptions[] = ['variant_id' => null, 'variant_title' => null, 'url' => $image];
        }
        foreach ($payload['variants'] ?? [] as $v) {
            $url = $v['image']['url'] ?? null;
            if (!empty($url)) {
                $referenceOptions[] = [
                    'variant_id' => Shopify::numericId($v['id'] ?? ''),
                    'variant_title' => $v['title'] ?? null,
                    'url' => $url,
                ];
            }
        }

        $referenceOptions = collect($referenceOptions)
            ->merge($this->normalizeImageEntries($product->reference_images))
            ->unique('url')
            ->values()
            ->all();

        $warning = empty($referenceOptions) ? 'no_usable_image' : null;

        return [
            'id' => $product->id,
            'shopify_product_id' => $product->shopify_product_id,
            'name' => $product->title,
            'image' => $image,
            'warning' => $warning,
            'collection' => $collectionTitle,
            'sessions' => $product->try_sessions_count,
            'tryOn' => (bool) $product->try_on,
            'style_hint' => $product->style_hint,
            'variants' => $variants->all(),
            'variant_images' => $this->normalizeImageEntries($product->variant_images),
            'reference_images' => $referenceOptions,
            'shopify_status' => strtolower($payload['status'] ?? ''),
        ];
    }

    /**
     * Enable/disable try-on for a single product.
     */
    public function toggleTryOn(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer',
            'try_on' => 'required|boolean',
        ]);

        $store = $this->resolveStore($request);

        if (!$store) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $product = Product::where('store_id', $store->id)
            ->where('id', $request->input('product_id'))
            ->first();

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product->update(['try_on' => $request->boolean('try_on')]);

        return response()->json(['success' => true, 'try_on' => (bool) $product->try_on]);
    }

    /**
     * Enable/disable try-on for a set of products.
     */
    public function bulkToggleTryOn(Request $request)
    {
        $request->validate([
            'product_ids' => 'required|array',
            'product_ids.*' => 'integer',
            'try_on' => 'required|boolean',
        ]);

        $store = $this->resolveStore($request);

        if (!$store) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        Product::where('store_id', $store->id)
            ->whereIn('id', $request->input('product_ids'))
            ->update(['try_on' => $request->boolean('try_on')]);

        return response()->json(['success' => true]);
    }

    /**
     * Save product drawer settings: try-on flag, style hint, and newly
     * uploaded reference images (stored on our disk, appended to the
     * reference_images JSON column).
     */
    public function updateSettings(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer',
            'style_hint' => 'nullable|string|max:120',
            'try_on' => 'nullable|boolean',
            'reference_images' => 'nullable|array|max:5',
            'reference_images.*' => 'image|max:5120',
            'variant_ids' => 'nullable|array',
            'variant_ids.*' => 'nullable',
        ]);

        $store = $this->resolveStore($request);

        if (!$store) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $product = Product::where('store_id', $store->id)
            ->where('id', $request->input('product_id'))
            ->first();

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $data = [];

        if ($request->has('style_hint')) {
            $data['style_hint'] = $request->input('style_hint');
        }

        if ($request->has('try_on')) {
            $data['try_on'] = $request->boolean('try_on');
        }

        if ($request->hasFile('reference_images')) {
            $referenceImages = $this->normalizeImageEntries($product->reference_images);
            $variantIds = $request->input('variant_ids', []);

            foreach ($request->file('reference_images') as $index => $file) {
                if (count($referenceImages) >= 10) {
                    break;
                }

                $fileName = time() . '-' . uniqid() . '.' . strtolower($file->getClientOriginalExtension() ?: 'png');
                $path = 'reference_images/store_' . $store->id . '/' . $fileName;

                Storage::put($path, File::get($file->getRealPath()));

                $variantId = is_array($variantIds) && isset($variantIds[$index]) && $variantIds[$index] !== ''
                    ? (int) $variantIds[$index]
                    : null;

                $referenceImages[] = [
                    'variant_id' => $variantId,
                    'variant_title' => $variantId ? $this->variantTitleFor($product, $variantId) : null,
                    'url' => Storage::url($path),
                ];
            }

            $data['reference_images'] = $referenceImages;
        }

        $product->update($data);

        $product->refresh();

        return response()->json([
            'success' => true,
            'product' => $this->mapProduct($product, $this->scopeCollectionOptions($store)),
        ]);
    }

    /**
     * Upload images for ONE variant — appended as keyed entries to the
     * product's variant_images column.
     */
    public function uploadVariantImages(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer',
            'variant_id' => 'required|integer',
            'variant_images' => 'required|array|max:5',
            'variant_images.*' => 'image|max:5120',
        ]);

        $store = $this->resolveStore($request);

        if (!$store) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $product = Product::where('store_id', $store->id)
            ->where('id', $request->input('product_id'))
            ->first();

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $variantId = (int) $request->input('variant_id');
        $variantTitle = $this->variantTitleFor($product, $variantId);

        if ($variantTitle === null) {
            return response()->json(['message' => 'Variant not found on this product'], 422);
        }

        $entries = $this->normalizeImageEntries($product->variant_images);
        $storedForVariant = count(array_filter(
            $entries,
            fn ($entry) => $entry['variant_id'] === $variantId
        ));

        foreach ($request->file('variant_images') as $file) {
            if ($storedForVariant >= 10) {
                break;
            }

            $fileName = time() . '-' . uniqid() . '.' . strtolower($file->getClientOriginalExtension() ?: 'png');
            $path = 'variant_images/store_' . $store->id . '/' . $fileName;

            Storage::put($path, File::get($file->getRealPath()));

            $entries[] = [
                'variant_id' => $variantId,
                'variant_title' => $variantTitle,
                'url' => Storage::url($path),
            ];

            $storedForVariant++;
        }

        $product->update(['variant_images' => $entries]);

        $product->refresh();

        return response()->json([
            'success' => true,
            'product' => $this->mapProduct($product, $this->scopeCollectionOptions($store)),
        ]);
    }

    /**
     * Kick off a manual catalog re-sync (the "Sync now" button).
     */
    public function syncNow(Request $request)
    {
        $store = $this->resolveStore($request);

        if (!$store) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $syncRunning = SyncJob::where('store_id', $store->id)
            ->where('type', SyncJob::TYPE_CATALOG_SYNC)
            ->running()
            ->exists();

        if (!$syncRunning) {
            TriggerCatalogSyncJob::dispatch($store);
        }

        return response()->json(['success' => true, 'sync_running' => $syncRunning]);
    }

    /**
     * Resolve the authenticated store from the Shopify session.
     */
    private function resolveStore(Request $request): ?Store
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();

        return Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();
    }

    /**
     * Collection filter options from the store's saved try-on scope.
     */
    private function scopeCollectionOptions(Store $store)
    {
        return collect($store->setting->collections ?? [])
            ->filter(fn ($c) => is_array($c) && !empty($c['id']))
            ->map(fn ($c) => [
                'id' => (string) Shopify::numericId($c['id']),
                'title' => $c['title'] ?? null,
            ])
            ->values();
    }

    /**
     * Collection filter options: union of the store's saved scope and every
     * collection found on synced products — so the filter also works for
     * stores scoped to "all products".
     */
    private function storeCollectionOptions(Store $store)
    {
        $options = collect($this->scopeCollectionOptions($store))->keyBy('id');

        Product::where('store_id', $store->id)
            ->select('shopify_product')
            ->orderBy('id')
            ->chunk(500, function ($products) use ($options) {
                foreach ($products as $product) {
                    foreach ($product->shopify_product['collections'] ?? [] as $collection) {
                        if (empty($collection['id'])) {
                            continue;
                        }

                        $id = (string) Shopify::numericId($collection['id']);
                        $title = $collection['title'] ?? null;

                        if (!$options->has($id)) {
                            $options->put($id, ['id' => $id, 'title' => $title]);
                        } elseif ($title && empty($options->get($id)['title'])) {
                            $options->put($id, ['id' => $id, 'title' => $title]);
                        }
                    }
                }
            });

        return $options
            ->sortBy(fn ($option) => strtolower($option['title'] ?? '~'))
            ->values()
            ->all();
    }

    /**
     * Normalize stored image entries to keyed objects ({variant_id,
     * variant_title, url}). Legacy rows stored plain URL strings — they
     * read back as product-level entries with no variant key.
     */
    private function normalizeImageEntries($entries): array
    {
        return collect($entries ?? [])
            ->map(fn ($entry) => is_array($entry) ? [
                'variant_id' => isset($entry['variant_id']) ? (int) $entry['variant_id'] : null,
                'variant_title' => $entry['variant_title'] ?? null,
                'url' => $entry['url'] ?? null,
            ] : [
                'variant_id' => null,
                'variant_title' => null,
                'url' => $entry,
            ])
            ->filter(fn ($entry) => !empty($entry['url']))
            ->values()
            ->all();
    }

    /**
     * Resolve a variant title from the product's stored payload.
     */
    private function variantTitleFor(Product $product, int $variantId): ?string
    {
        foreach ($product->shopify_product['variants'] ?? [] as $variant) {
            if (Shopify::numericId($variant['id'] ?? '') === $variantId) {
                return $variant['title'] ?? null;
            }
        }

        return null;
    }

    /**
     * Status of the store's latest catalog sync — polled by the onboarding
     * progress bar (processed / total_estimated).
     */
    public function syncStatus(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        $syncJob = SyncJob::latestCatalogSyncFor($store->id);

        return response()->json([
            'sync' => $syncJob ? [
                'id' => $syncJob->id,
                'status' => $syncJob->status,
                'processed' => $syncJob->processed,
                'total_estimated' => $syncJob->total_estimated,
                'error' => $syncJob->error,
                'started_at' => $syncJob->started_at?->toIso8601String(),
                'completed_at' => $syncJob->completed_at?->toIso8601String(),
            ] : null,
        ]);
    }

    /**
     * Fetch ALL products from the store with pagination
     * Returns products in the same format as getProducts in CollectionController
     */
    public function getAllProducts(Request $request)
    {
        try {
            $session = $request->get('shopifySession');
            $shop = $session->getShop();
            $accessToken = $session->getAccessToken();

            $allProducts = [];
            $hasNextPage = true;
            $cursor = null;

            // GraphQL query to fetch all products with pagination
            while ($hasNextPage) {
                $afterCursor = $cursor ? ', after: "' . $cursor . '"' : '';

                $query = <<<QUERY
                query GetAllProducts(\$num: Int!) {
                  products(first: \$num$afterCursor) {
                    edges {
                      node {
                        id
                        title
                        featuredImage {
                          url
                          altText
                        }
                      }
                    }
                    pageInfo {
                      hasNextPage
                      endCursor
                    }
                  }
                }
                QUERY;

                $variables = [
                    'num' => 50, // Fetch 50 products per page
                ];

                $responseBody = Shopify::queryOrException($shop, $accessToken, [
                    'query' => $query,
                    'variables' => $variables,
                ]);

                if (isset($responseBody['data']['products']['edges'])) {
                    foreach ($responseBody['data']['products']['edges'] as $edge) {
                        $product = $edge['node'];
                        $allProducts[] = [
                            'id' => $product['id'],
                            'title' => $product['title'],
                            'image' => [
                                'src' => $product['featuredImage']['url'] ?? null,
                            ],
                        ];
                    }
                }

                // Check if there are more products to fetch
                $pageInfo = $responseBody['data']['products']['pageInfo'] ?? null;
                $hasNextPage = $pageInfo['hasNextPage'] ?? false;
                $cursor = $pageInfo['endCursor'] ?? null;
            }

            return response()->json([
                'products' => $allProducts,
                'total' => count($allProducts),
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch all products: ' . $e->getMessage());
            return response()->json([
                'products' => [],
                'total' => 0,
                'error' => 'Failed to fetch products',
            ], 500);
        }
    }
}
