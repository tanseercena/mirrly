<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * Client for the self-hosted rembg background-removal service running on
 * our Hetzner box. Sends the raw product image, receives the garment
 * cutout as PNG bytes. The endpoint contract: multipart field `image`,
 * response body is the PNG binary. (The service is deployed separately —
 * adjust `endpoint`/field name in config if the wrapper differs.)
 */
class RembgService
{
    private string $baseUrl;

    private string $endpoint;

    private string $apiKey;

    public function __construct()
    {
        $this->baseUrl = rtrim((string) config('services.rembg.base_url', ''), '/');
        $this->endpoint = (string) config('services.rembg.endpoint', '/removebg');
        $this->apiKey = (string) config('services.rembg.api_key');
    }

    /**
     * @param  string  $imageBinary  Raw product image bytes (jpg/png).
     * @return string PNG bytes of the garment with background removed.
     */
    public function removeBackground(string $imageBinary): string
    {
        if ($this->baseUrl === '') {
            throw new RuntimeException('REMBG_BASE_URL is not configured');
        }

        $request = Http::timeout(120);

        if ($this->apiKey !== '') {
            $request = $request->withHeaders(['x-api-key' => $this->apiKey]);
        }

        $response = $request
            ->attach('image', $imageBinary, 'image.jpg')
            ->post($this->baseUrl . $this->endpoint);

        if ($response->failed()) {
            Log::error('rembg background removal failed', [
                'status' => $response->status(),
                'body' => substr($response->body(), 0, 500),
            ]);
            throw new RuntimeException('rembg request failed with status ' . $response->status());
        }

        $cutout = $response->body();

        if ($cutout === '' || !str_starts_with($cutout, "\x89PNG")) {
            throw new RuntimeException('rembg returned a non-PNG response');
        }

        return $cutout;
    }
}
