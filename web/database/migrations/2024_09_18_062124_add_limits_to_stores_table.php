<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->bigInteger('per_file_limit')->default(104857600); 
            $table->bigInteger('digital_products_limit')->default(20);
            $table->bigInteger('digital_lotteries_limit')->default(1);
            $table->bigInteger('file_storage_limit')->default(5368709120);
            $table->bigInteger('orders_per_month')->default(30);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn([
                'per_file_limit',
                'digital_products_limit',
                'digital_lotteries_limit',
                'file_storage_limit',
                'orders_per_month'
            ]);
        });
    }
};
