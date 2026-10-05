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
        Schema::create('garment_assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('merchant_id')->constrained('stores')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->enum('template_type', [
                'top', 'jacket', 'dress', 'pants', 'shorts', 'skirt',
                'cap', 'glasses', 'shoes', 'bag', 'necklace',
            ]);
            $table->enum('detection_method', ['ml_model', 'geometric']);
            $table->enum('status', ['auto_approved', 'needs_review']);
            $table->decimal('confidence_score', 5, 4)->nullable();
            $table->json('anchor_points_json');
            $table->string('asset_url');
            $table->foreignId('model_version')->nullable()->constrained('model_versions')->nullOnDelete();
            $table->timestamp('scored_at')->nullable();
            $table->string('reviewed_by')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            // One rig per product per template type (re-rigging replaces the row)
            $table->unique(['product_id', 'template_type']);
            // Pooled cross-merchant review queue
            $table->index(['status', 'created_at']);
            $table->index(['merchant_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('garment_assets');
    }
};
