<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'shopify_product' => 'array',
        'reference_images' => 'array',
        'variant_images' => 'array',
        'try_on' => 'boolean',
        'shopify_updated_at' => 'datetime',
        'synced_at' => 'datetime',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function trySessions()
    {
        return $this->hasMany(TrySession::class);
    }
}
