<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyncJob extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'total_estimated' => 'integer',
        'processed' => 'integer',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public const TYPE_CATALOG_SYNC = 'catalog_sync';

    public const STATUS_RUNNING = 'running';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_FAILED = 'failed';

    /**
     * A "running" sync whose row hasn't been touched for this long is
     * considered dead (worker crashed mid-run) and must not block new syncs.
     */
    public const STALE_AFTER_MINUTES = 10;

    /**
     * Running jobs with recent activity — used to decide whether a new
     * sync should be blocked.
     */
    public function scopeRunning($query)
    {
        return $query->where('status', self::STATUS_RUNNING)
            ->where('updated_at', '>=', now()->subMinutes(self::STALE_AFTER_MINUTES));
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Latest catalog sync job for a store (the one the progress UI should show).
     */
    public static function latestCatalogSyncFor(int $storeId): ?self
    {
        return static::where('store_id', $storeId)
            ->where('type', self::TYPE_CATALOG_SYNC)
            ->latest()
            ->first();
    }
}
