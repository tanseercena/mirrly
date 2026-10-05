<?php

namespace App\Jobs;

use App\Services\RigStorage;
use App\Models\Product;
use App\Services\RembgService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Stage 2: remove the background from the raw product image via the
 * self-hosted rembg service, store the cutout on S3, and hand off to
 * landmark detection.
 */
class RemoveBGJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 300;

    public function __construct(
        public Product $product,
        public string $rawPath,
        public string $templateType,
        public string $category
    ) {}

    public function handle(RembgService $rembg): void
    {
        $rawBinary = RigStorage::disk()->get($this->rawPath);
        $cutoutBinary = $rembg->removeBackground($rawBinary);

        $cutoutPath = "{$this->product->store_id}/{$this->product->id}/cutout.png";
        RigStorage::disk()->put($cutoutPath, $cutoutBinary);

        LandmarkDetectionJob::dispatch(
            $this->product,
            $cutoutPath,
            $this->templateType,
            $this->category
        );
    }
}
