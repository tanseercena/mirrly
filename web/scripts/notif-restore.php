<?php

/**
 * DEV HELPER — restores real thresholds and clears the dedupe markers.
 *
 * Run: php artisan tinker --execute="require base_path('scripts/notif-restore.php');"
 */

use App\Models\NotificationLog;
use App\Models\Store;

$store = Store::whereNotNull('api_token')->first();
$n = $store->setting->notification;
$n['spend_threshold'] = '80';
$n['completion_threshold'] = '60';
$store->setting->notification = $n;
$store->setting->save();

NotificationLog::where('store_id', $store->id)->delete();

echo "Thresholds restored (spend 80% / completion 60%), dedupe logs cleared.\n";
