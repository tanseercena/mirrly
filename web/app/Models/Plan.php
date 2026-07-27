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

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
