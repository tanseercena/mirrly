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
        Schema::create('model_versions', function (Blueprint $table) {
            $table->id();
            $table->string('version_tag'); // e.g. v1, v2, v3
            $table->unsignedBigInteger('trained_on_count')->default(0);
            $table->timestamp('deployed_at')->nullable();
            $table->string('runpod_endpoint_id')->nullable();
            $table->json('eval_metrics_json')->nullable(); // accuracy on a fixed held-out validation set
            $table->timestamps();

            $table->unique('version_tag');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('model_versions');
    }
};
