<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingExample extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'anchor_points_json' => 'array',
        'corrected_at' => 'datetime',
    ];

    public function garmentAsset()
    {
        return $this->belongsTo(GarmentAsset::class);
    }

    public function usedInModelVersion()
    {
        return $this->belongsTo(ModelVersion::class, 'used_in_model_version');
    }

    /**
     * Corrections not yet consumed by a retrain — what the weekly
     * training loop pulls.
     */
    public function scopeUnconsumed($query)
    {
        return $query->whereNull('used_in_model_version');
    }
}
