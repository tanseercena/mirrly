<?php

namespace App\Jobs;

use App\Services\RigStorage;
use App\Models\GarmentAsset;
use App\Models\Product;
use App\Services\AccessoryDetectionService;
use App\Services\RigPublisher;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;

/**
 * Stage 4b: accessory landmark detection - geometric/contour analysis
 * only, no RunPod call. Cheap and fast, runs on our own box.
 */
class AccessoryDetectionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Product $product,
        public string $cutoutPath,
        public string $templateType
    ) {}

    public function handle(AccessoryDetectionService $detector, RigPublisher $publisher): void
    {
        $cutoutBinary = RigStorage::disk()->get($this->cutoutPath);

        try {
            $result = $detector->detect($cutoutBinary, $this->templateType);
        } catch (Throwable $e) {
            // Even a failed geometric pass publishes a frame-level rig -
            // try-on is never blocked.
            $this->publishFallback($publisher);
            return;
        }

        $publisher->publish(
            product: $this->product,
            templateType: $this->templateType,
            detectionMethod: GarmentAsset::DETECTION_GEOMETRIC,
            cutoutPath: $this->cutoutPath,
            anchors: $result['anchors'],
            detectionConfidence: $result['confidence'],
            sanity: null,
            boundingBox: $result['bounding_box'],
            image: $result['image'],
            modelVersion: null,
        );
    }

    private function publishFallback(RigPublisher $publisher): void
    {
        $publisher->publish(
            product: $this->product,
            templateType: $this->templateType,
            detectionMethod: GarmentAsset::DETECTION_GEOMETRIC,
            cutoutPath: $this->cutoutPath,
            anchors: $this->frameAnchors(),
            detectionConfidence: 0.1,
            sanity: null,
            boundingBox: ['x' => 0.0, 'y' => 0.0, 'width' => 1.0, 'height' => 1.0],
            image: null,
        );
    }

    private function frameAnchors(): array
    {
        return [
            'center' => ['x' => 0.5, 'y' => 0.5],
            'bottom' => ['x' => 0.5, 'y' => 0.95],
            'top' => ['x' => 0.5, 'y' => 0.05],
        ];
    }
}
