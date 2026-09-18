<?php

/**
 * DEV HELPER — forces all three notifications to fire once with a readable
 * report. Sends REAL emails via the configured mailer (Brevo).
 *
 * Run:    php artisan tinker --execute="require base_path('scripts/notif-test.php');"
 * Undo:   php artisan tinker --execute="require base_path('scripts/notif-restore.php');"
 */

use App\Models\Store;
use App\Models\TrySession;
use App\Models\NotificationLog;
use App\Support\StoreNotifications;

$store = Store::whereNotNull('api_token')->first();
$plan = StoreNotifications::planFor($store);
$to = StoreNotifications::resolveEmail($store);

echo "Store: {$store->shopify_domain}\n";
echo 'Plan: ' . ($plan?->name ?? 'none') . " (included sessions: " . ($plan->limits['sessions'] ?? 0) . ")\n";
echo "Email to: {$to}\n";
echo 'Timezone: ' . StoreNotifications::timezoneFor($store) . "\n\n";

// --- force-fire thresholds so every alert triggers on current real data
$n = $store->setting->notification;
$n['spend_threshold'] = '30';
$n['completion_threshold'] = '90';
$n['weekly_summary'] = true;
$n['spend_alert'] = true;
$n['completion_alert'] = true;
$store->setting->notification = $n;
$store->setting->save();

$cycleStart = StoreNotifications::cycleStart($store);
$cycleSessions = TrySession::where('store_id', $store->id)->where('created_at', '>=', $cycleStart)->count();
echo "Spend: {$cycleSessions}/{$plan->limits['sessions']} sessions this cycle (threshold 30%)\n";

$since = now()->subDays(7);
$c = TrySession::where('store_id', $store->id)->where('tryon_started_at', '>=', $since)
    ->selectRaw('SUM(tryon_started_at IS NOT NULL) AS s, SUM(tryon_completed_at IS NOT NULL) AS c')
    ->first();
$rate = $c->s > 0 ? round(($c->c / $c->s) * 100, 1) : null;
echo "Completion: {$c->c}/{$c->s} completed ({$rate}%, threshold 90%)\n\n";

echo "Dispatching jobs...\n";
App\Jobs\SendWeeklySummaryJob::dispatchSync($store);
App\Jobs\CheckSpendMilestoneJob::dispatchSync($store);
App\Jobs\CheckCompletionRateJob::dispatchSync($store);

echo "\nSent (notification_logs):\n";
$logs = NotificationLog::where('store_id', $store->id)->orderByDesc('sent_at')->get();
if ($logs->isEmpty()) {
    echo " - none (a gate skipped everything — see the values above)\n";
}
foreach ($logs as $log) {
    echo " - {$log->type} at {$log->sent_at}  meta=" . json_encode($log->meta) . "\n";
}

echo "\nRe-running this script should add nothing (dedupe).\n";
echo "Check Gmail ({$to}) — spam folder too.\n";
