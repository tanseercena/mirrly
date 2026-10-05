<?php

namespace App\Jobs;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Stage 3: route to the right detection path. Clothing goes to the ML
 * model (RunPod); accessories to pure geometric analysis (no RunPod call).
 */
class LandmarkDetectionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Product $product,
        public string $cutoutPath,
        public string $templateType,
        public string $category
    ) {}

    public function handle(): void
    {
        if ($this->category === 'clothing') {
            ClothingDetectionJob::dispatch(
                $this->product,
                $this->cutoutPath,
                $this->templateType
            );

            return;
        }

        AccessoryDetectionJob::dispatch(
            $this->product,
            $this->cutoutPath,
            $this->templateType
        );
    }
}
