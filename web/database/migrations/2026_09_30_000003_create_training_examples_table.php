<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('training_examples', function (Blueprint $table) {
            $table->id();
            $table->foreignId('garment_asset_id')->constrained('garment_assets')->onDelete('cascade');
            $table->json('anchor_points_json'); // corrected, human-verified points
            $table->string('corrected_by');
            $table->timestamp('corrected_at');
            $table->foreignId('used_in_model_version')->nullable()->constrained('model_versions')->nullOnDelete();
            $table->timestamps();

            // Weekly retrain pulls unconsumed examples
            $table->index(['used_in_model_version', 'corrected_at']);
            $table->index('garment_asset_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_examples');
    }
};
