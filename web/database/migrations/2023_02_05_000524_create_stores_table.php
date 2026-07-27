<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->string('shopify_domain')->unique();
            $table->string('shopify_id');
            $table->string('email');
            $table->string('name')->nullable();
            $table->string('domain')->nullable();
            $table->string('primary_locale')->nullable();
            $table->string('country')->nullable();
            $table->string('owner')->nullable();
            $table->string('money_format')->nullable();
            $table->string('money_with_currency_format')->nullable();
            $table->string('shopify_plan')->nullable();
            $table->string('timezone')->nullable();
            $table->enum('status', ['active', 'uninstalled'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('stores');
    }
}
