<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUsageColumnsToStoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->unsignedBigInteger('monthly_impressions')->default(0);
            $table->unsignedBigInteger('monthly_clicks')->default(0);
            $table->unsignedBigInteger('monthly_discounts')->default(0);
            $table->unsignedBigInteger('monthly_leads')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn('monthly_impressions');
            $table->dropColumn('monthly_clicks');
            $table->dropColumn('monthly_discounts');
            $table->dropColumn('monthly_leads');
        });
    }
}
