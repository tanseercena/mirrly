<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

// Single accessor for the rigging pipeline's storage disk. Every pipeline
// stage (raw image staging, cutouts, rig.json) reads and writes through
// this so the disk is switchable per environment: 's3' in production,
// RIGGING_STORAGE_DISK=public for local dev (see config/services.php).
class RigStorage
{
    public static function disk(): \Illuminate\Filesystem\FilesystemAdapter
    {
        return Storage::disk((string) config('services.rigging.storage_disk', 's3'));
    }
}
