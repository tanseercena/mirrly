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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->bigInteger('shopify_product_id');
            $table->bigInteger('shopify_collection_id')->nullable();
            $table->string('title');
            $table->string('product_type')->nullable();
            $table->json('shopify_product');
            $table->boolean('try_on')->default(false);
            $table->json('reference_images')->nullable();
            $table->json('variant_images')->nullable();
            $table->string('style_hint')->nullable();
            $table->timestamp('shopify_updated_at')->nullable();
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['store_id', 'shopify_product_id']);
            $table->index(['store_id', 'try_on']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
