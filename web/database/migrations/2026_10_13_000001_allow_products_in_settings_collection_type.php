<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * collection_type was an ENUM('all','specific') — the "products" scope
     * (onboarding "Choose specific products") silently truncated to '' on
     * non-strict MySQL. Widen it to a varchar so new scope values don't
     * need a schema change, and repair the rows the enum ate.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE settings MODIFY collection_type VARCHAR(20) NOT NULL DEFAULT 'all'");

        // Rows the enum truncated to '' — the scope they carried is unknown,
        // so fall back to the column's old default rather than a lie.
        DB::table('settings')->where('collection_type', '')->update(['collection_type' => 'all']);
    }

    public function down(): void
    {
        DB::table('settings')->whereNotIn('collection_type', ['all', 'specific'])->update(['collection_type' => 'all']);

        DB::statement("ALTER TABLE settings MODIFY collection_type ENUM('all','specific') NOT NULL DEFAULT 'all'");
    }
};
