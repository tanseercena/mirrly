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
        Schema::table('try_sessions', function (Blueprint $table) {
            // Shopper identity: the logged-in Shopify customer id when the
            // shopper has an account, else a browser-persisted anonymous id.
            // The per-product try limit is counted per shopper+product.
            $table->bigInteger('shopify_customer_id')->nullable()->after('session_token');
            $table->string('anonymous_id', 64)->nullable()->after('shopify_customer_id');

            $table->index(['store_id', 'product_id', 'shopify_customer_id']);
            $table->index(['store_id', 'product_id', 'anonymous_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('try_sessions', function (Blueprint $table) {
            $table->dropIndex(['store_id', 'product_id', 'shopify_customer_id']);
            $table->dropIndex(['store_id', 'product_id', 'anonymous_id']);
            $table->dropColumn(['shopify_customer_id', 'anonymous_id']);
        });
    }
};
