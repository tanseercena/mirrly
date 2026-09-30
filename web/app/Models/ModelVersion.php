<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModelVersion extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'trained_on_count' => 'integer',
        'deployed_at' => 'datetime',
        'eval_metrics_json' => 'array',
    ];

    /**
     * The model version currently serving the RunPod Serverless endpoint
     * (the one ingestion-time detections and retrains must build on).
     */
    public static function currentlyDeployed(): ?self
    {
        return static::whereNotNull('deployed_at')
            ->orderByDesc('deployed_at')
            ->first();
    }
}
