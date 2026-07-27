<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderIntent extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'options' => 'array'
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }
}
