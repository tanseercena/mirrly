<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * A session row survives person-detection reconnects: every fresh Decart
     * connection for the same shopper bumps this counter instead of creating
     * a new row, keeping funnel counts per shopper rather than per connection.
     */
    public function up(): void
    {
        Schema::table('try_sessions', function (Blueprint $table) {
            $table->unsignedInteger('connection_count')->default(1)->after('session_token');
            $table->timestamp('last_connected_at')->nullable()->after('camera_opened_at');
        });
    }

    public function down(): void
    {
        Schema::table('try_sessions', function (Blueprint $table) {
            $table->dropColumn(['connection_count', 'last_connected_at']);
        });
    }
};
