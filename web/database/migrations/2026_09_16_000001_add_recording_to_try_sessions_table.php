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
            // Set only when the merchant enabled recording in Settings →
            // Privacy & recording. Path is relative to the 'local' disk —
            // recordings are never publicly reachable.
            $table->string('recording_path')->nullable()->after('browser');
            $table->timestamp('recording_expires_at')->nullable()->after('recording_path');

            $table->index('recording_expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('try_sessions', function (Blueprint $table) {
            $table->dropIndex(['recording_expires_at']);
            $table->dropColumn(['recording_path', 'recording_expires_at']);
        });
    }
};
