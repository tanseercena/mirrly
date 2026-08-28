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
        Schema::create('try_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products');
            $table->bigInteger('shopify_variant_id')->nullable();
            $table->uuid('session_token')->unique();

            // Denormalized current position in the funnel for cheap indexed queries
            $table->enum('funnel_stage', [
                'opened',
                'started',
                'completed',
                'added_to_cart',
                'purchased',
                'abandoned',
            ])->default('opened');

            // Funnel milestones
            $table->timestamp('camera_opened_at');
            $table->timestamp('tryon_started_at')->nullable();
            $table->timestamp('tryon_completed_at')->nullable();
            $table->timestamp('added_to_cart_at')->nullable();
            $table->timestamp('purchased_at')->nullable();

            // Shopify attribution - backfilled after the session ends
            $table->string('cart_token')->nullable();
            $table->bigInteger('order_id')->nullable();

            // Session metrics & device info
            $table->smallInteger('duration_seconds')->nullable();
            $table->enum('device_type', ['mobile', 'desktop', 'tablet', 'unknown'])->default('unknown');
            $table->string('browser')->nullable();

            // Billing snapshot
            $table->boolean('billable')->default(false);
            $table->decimal('billed_rate', 6, 3)->nullable();

            $table->timestamps();

            // Indexes
            $table->index(['store_id', 'created_at']);
            $table->index(['store_id', 'funnel_stage']);
            $table->index('product_id');
            $table->index('cart_token');
            $table->index('order_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('try_sessions');
    }
};
