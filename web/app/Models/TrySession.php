<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrySession extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        // Emailed download links expire with the recording's retention —
        // needs to be a Carbon instance for the expiry math in emailRecording().
        'recording_expires_at' => 'datetime',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
