<?php

namespace App\Services;

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
        $body = array_filter([
            'expiresIn' => $expiresIn,
            'allowedModels' => [$modelName],
            'allowedOrigins' => array_values(array_filter($allowedOrigins)),
            'constraints' => $maxSessionDuration !== null
                ? ['realtime' => ['maxSessionDuration' => $maxSessionDuration]]
                : null,
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

        return $response->json();
    }
}
