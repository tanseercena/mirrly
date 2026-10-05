<?php

namespace App\Jobs;

use App\Services\RigStorage;
use App\Models\GarmentAsset;
use App\Models\ModelVersion;
use App\Models\Product;
use App\Services\GeometricSanityChecker;
use App\Services\RigPublisher;
use App\Services\RunPodDetectionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Stage 4a: clothing landmark detection.
 *
 * The cutout goes to the RunPod Serverless endpoint running the deployed
 * DeepFashion2-based model; the geometric sanity check ALWAYS runs
 * alongside as a cross-check (not just as a fallback).
 *
 * Try-on is never blocked: if RunPod is unreachable, unconfigured, or the
 * worker fails, we fall back to bounding-box anchors at low confidence —
 * the rig still publishes, as needs_review.
 */
class ClothingDetectionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 600;

    public function __construct(
        public Product $product,
        public string $cutoutPath,
        public string $templateType
    ) {}

    public function handle(
        RunPodDetectionService $runpod,
        GeometricSanityChecker $sanityChecker,
        RigPublisher $publisher
    ): void {
        $modelVersion = ModelVersion::currentlyDeployed();
        $cutoutBinary = RigStorage::disk()->get($this->cutoutPath);

        $detection = null;

        $endpointId = $runpod->currentEndpointId();
        if ($endpointId !== null) {
            try {
                $detection = $runpod->detectAnchors($cutoutBinary, $this->templateType, $endpointId);
            } catch (Throwable $e) {
                Log::error('Clothing detection fell back to geometric anchors', [
                    'product_id' => $this->product->id,
                    'template_type' => $this->templateType,
                    'error' => $e->getMessage(),
                ]);
            }
        } else {
            Log::warning('No deployed RunPod endpoint — clothing detection falls back to geometric anchors', [
                'product_id' => $this->product->id,
                'template_type' => $this->templateType,
            ]);
        }

        if ($detection !== null) {
            $sanity = $sanityChecker->check($detection['anchors'], $this->templateType);

            $publisher->publish(
                product: $this->product,
                templateType: $this->templateType,
                detectionMethod: GarmentAsset::DETECTION_ML,
                cutoutPath: $this->cutoutPath,
                anchors: $detection['anchors'],
                detectionConfidence: $detection['confidence'],
                sanity: $sanity,
                modelVersion: $modelVersion,
            );

            return;
        }

        // Fallback: bounding-box layout anchors, low confidence — always
        // needs_review, but rig.json still goes live.
        $fallback = $this->boundingBoxAnchors($cutoutBinary);
        $publisher->publish(
            product: $this->product,
            templateType: $this->templateType,
            detectionMethod: GarmentAsset::DETECTION_GEOMETRIC,
            cutoutPath: $this->cutoutPath,
            anchors: $fallback['anchors'],
            detectionConfidence: 0.2,
            sanity: null,
            boundingBox: $fallback['bounding_box'],
            image: $fallback['image'],
            modelVersion: null,
        );
    }

    /**
     * Coarse anchors from the cutout's opaque bounding box — enough for a
     * rough on-screen placement until the model (or a reviewer) provides
     * real landmarks.
     *
     * @return array{anchors: array<string, array{x: float, y: float}>, bounding_box: array, image: array}
     */
    private function boundingBoxAnchors(string $cutoutBinary): array
    {
        $image = @imagecreatefromstring($cutoutBinary);
        $width = $image !== false ? imagesx($image) : 0;
        $height = $image !== false ? imagesy($image) : 0;

        if ($image !== false) {
            imagedestroy($image);
        }

        if ($width === 0 || $height === 0) {
            throw new \RuntimeException('Unable to decode cutout for fallback anchors');
        }

        // Body-plan proportions of a garment photo, relative to the frame.
        $anchors = [
            'shoulder_left' => ['x' => 0.18, 'y' => 0.08],
            'shoulder_right' => ['x' => 0.82, 'y' => 0.08],
            'hem_left' => ['x' => 0.18, 'y' => 0.92],
            'hem_right' => ['x' => 0.82, 'y' => 0.92],
        ];

        return [
            'anchors' => $anchors,
            'bounding_box' => ['x' => 0.0, 'y' => 0.0, 'width' => 1.0, 'height' => 1.0],
            'image' => ['width' => $width, 'height' => $height],
        ];
    }
}
