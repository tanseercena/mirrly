<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GarmentAsset extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'anchor_points_json' => 'array',
        'confidence_score' => 'float',
        'scored_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    public const STATUS_AUTO_APPROVED = 'auto_approved';
    public const STATUS_NEEDS_REVIEW = 'needs_review';

    public const DETECTION_ML = 'ml_model';
    public const DETECTION_GEOMETRIC = 'geometric';

    /** Clothing categories — the only ones that use the trained ML model. */
    public const CLOTHING_TYPES = ['top', 'jacket', 'dress', 'pants', 'shorts', 'skirt'];

    /** Accessories — geometric/contour detection only, never a RunPod call. */
    public const ACCESSORY_TYPES = ['cap', 'glasses', 'shoes', 'bag', 'necklace'];

    public function merchant()
    {
        return $this->belongsTo(Store::class, 'merchant_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function modelVersion()
    {
        return $this->belongsTo(ModelVersion::class, 'model_version');
    }

    public function trainingExamples()
    {
        return $this->hasMany(TrainingExample::class);
    }

    /**
     * Items awaiting human correction, pooled across all merchants
     * (the review queue is not a gate — their rig.json is already live).
     */
    public function scopeNeedsReview($query)
    {
        return $query->where('status', self::STATUS_NEEDS_REVIEW);
    }
}
