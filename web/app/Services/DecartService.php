<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

// Thin client for the Decart platform API. Holds the only places in the
// codebase that talk to Decart server-side — the permanent account API key
// never leaves this class (the browser only ever receives short-lived,
// scoped client tokens minted through it).
class DecartService
{
    private string $baseUrl;

    private string $apiKey;

    public function __construct()
    {
        $this->baseUrl = rtrim((string) config('services.decart.base_url', 'https://api.decart.ai'), '/');
        $this->apiKey = (string) config('services.decart.api_key');
    }

    /**
     * Mint a short-lived client token for browser-side realtime sessions,
     * restricted to the given model and storefront origins.
     *
     * Returns the raw Decart response — the browser needs `apiKey`
     * (the client token) from it.
     */
    public function createClientToken(
        string $modelName,
        array $allowedOrigins,
        int $expiresIn = 300,
        ?int $maxSessionDuration = null
    ): array {
        // TEMP DEBUG: match Decart's working ecommerce example exactly —
        // bare token, no scoping options. Re-add allowedModels /
        // allowedOrigins / constraints one at a time once streaming works.
        $body = array_filter([
            'expiresIn' => $expiresIn,
            //'allowedModels' => [$modelName],
            //'allowedOrigins' => array_values(array_filter($allowedOrigins)),
//            'constraints' => $maxSessionDuration !== null
//                ? ['realtime' => ['maxSessionDuration' => $maxSessionDuration]]
//                : null,
        ], fn ($value) => $value !== null);

        $response = Http::withHeaders(['x-api-key' => $this->apiKey])
            ->post("{$this->baseUrl}/v1/client/tokens", $body);

        if ($response->failed()) {
            Log::error('Decart client token mint failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new RuntimeException('Failed to mint Decart client token');
        }

        Log::info('Decart client token minted', [
            'model' => $modelName,
            'origins' => $body['allowedOrigins'] ?? [],
            'constraints' => $body['constraints'] ?? null,
        ]);

        return $response->json();
    }

    /**
     * Best garment photo for a product/variant — the storefront URL the
     * browser converts into a flat-background Blob and applies post-connect
     * via setImage (realtime sessions take File/Blob/URL references; the
     * files-API upload flow is for the batch API, not realtime).
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
    // app-relative ("/storage/...") — downloads need them absolute.
    private function absoluteUrl(string $url): string
    {
        if (str_starts_with($url, '/')) {
            return rtrim((string) config('app.url'), '/') . $url;
        }

        return $url;
    }
}
