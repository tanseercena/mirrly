<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $casts = [
        'features' => 'array',
        'limits' => 'array',
        'can' => 'array'
    ];

    /**
     * How far back the plan can report analytics, in days.
     * Null means unlimited (any date range).
     */
    public function analyticsHistoryDays(): ?int
    {
        $days = $this->limits['analytics_history_days'] ?? null;

        if ($days === null || $days === '' || $days === 'unlimited') {
            return null;
        }

        return is_numeric($days) ? (int) $days : null;
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
