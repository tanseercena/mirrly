<?php

namespace App\Services;

use App\Models\ModelVersion;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * Client for the RunPod Serverless endpoint running the currently deployed
 * DeepFashion2-based landmark model (clothing categories only).
 *
 * Request contract (what the handler side will implement):
 *   input: { image: <base64 png>, template_type: <top|jacket|...> }
 *   response: { anchors: {<name>: {x, y}, ...}, confidence: <0..1> }
 * Anchor coordinates are normalized (0..1) within the cutout image.
 */
class RunPodDetectionService
{
    private string $baseUrl;

    private string $apiKey;

    public function __construct()
    {
        $this->baseUrl = rtrim((string) config('services.runpod.base_url', 'https://api.runpod.ai'), '/');
        $this->apiKey = (string) config('services.runpod.api_key');
    }

    /**
     * Endpoint currently serving the deployed model — from the latest
     * deployed model_versions row, falling back to the env-configured id
     * (used before the first retrain cycle records a version).
     */
    public function currentEndpointId(): ?string
    {
        $endpointId = ModelVersion::currentlyDeployed()?->runpod_endpoint_id
            ?: config('services.runpod.endpoint_id');

        return $endpointId !== null && $endpointId !== '' ? (string) $endpointId : null;
    }

    /**
     * @param  string  $cutoutBinary  PNG bytes of the background-removed garment.
     * @return array{anchors: array<string, array{x: float, y: float}>, confidence: float}
     */
    public function detectAnchors(string $cutoutBinary, string $templateType, string $endpointId): array
    {
        // runsync holds the connection for cold-start + inference (up to the
        // worker's own timeout) instead of forcing us to poll /status/{id}.
        $response = Http::withToken($this->apiKey)
            ->timeout(180)
            ->post("{$this->baseUrl}/v2/{$endpointId}/runsync", [
                'input' => [
                    'image' => base64_encode($cutoutBinary),
                    'template_type' => $templateType,
                ],
            ]);

        if ($response->failed()) {
            Log::error('RunPod landmark detection failed', [
                'endpoint' => $endpointId,
                'template_type' => $templateType,
                'status' => $response->status(),
                'body' => substr($response->body(), 0, 500),
            ]);
            throw new RuntimeException('RunPod detection failed with status ' . $response->status());
        }

        $payload = $response->json();

        // RunPod wraps worker output in `output`; failed worker runs report
        // status !== COMPLETED there.
        $output = $payload['output'] ?? null;

        if (($payload['status'] ?? null) !== 'COMPLETED' || !is_array($output)) {
            Log::error('RunPod landmark detection returned an unusable result', [
                'endpoint' => $endpointId,
                'status' => $payload['status'] ?? null,
            ]);
            throw new RuntimeException('RunPod worker did not complete successfully');
        }

        if (empty($output['anchors']) || !isset($output['confidence'])) {
            throw new RuntimeException('RunPod output missing anchors or confidence');
        }

        return [
            'anchors' => $output['anchors'],
            'confidence' => (float) $output['confidence'],
        ];
    }
}
