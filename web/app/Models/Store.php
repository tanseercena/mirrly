<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    /**
     * @var mixed
     */
    protected $guarded = [];

    protected $casts = [
        'trial_started_on' => 'datetime',
        'usage_warnings' => 'array',
        'skip_template_review' => 'boolean',
        'setup_steps' => 'array',
        'dismissed_banners' => 'array',
    ];

    public function campaigns()
    {
        return $this->hasMany(Campaign::class);
    }

    public function subscription()
    {
        return $this->hasOne(Subscription::class)->where("status", "=", "active");
    }

    public function scopeActiveWithYearlySubscription($query)
    {
        return $query->where('status', 'active')
            ->whereHas('subscription', function ($q) {
                $q->where('interval', 'yearly')
                    ->where('status', 'active');
            });
    }

    public function setting()
    {
        return $this->hasOne(Setting::class);
    }

    public function usage_trackings()
    {
        return $this->hasMany(UsageTracking::class);
    }
}
