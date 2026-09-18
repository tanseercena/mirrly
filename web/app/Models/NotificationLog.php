<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationLog extends Model
{
    protected $guarded = [];

    protected $casts = [
        'meta' => 'array',
        'sent_at' => 'datetime',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
