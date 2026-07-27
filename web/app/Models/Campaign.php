<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Campaign extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'options' => 'array'
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function impressions()
    {
        return $this->hasMany(Impression::class);
    }

    public function discounts()
    {
        return $this->hasMany(Discount::class);
    }

    public function clicks()
    {
        return $this->hasMany(Click::class);
    }

    public function leads()
    {
        return $this->hasMany(Lead::class);
    }

    public function cart_adds()
    {
        return $this->hasMany(CartAdd::class);
    }
    public function order_intents()
    {
        return $this->hasMany(OrderIntent::class);
    }
}
