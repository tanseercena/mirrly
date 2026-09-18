<?php

namespace App\Jobs;

use App\Mail\CompletionRateMail;
use App\Models\TrySession;
use App\Models\Store;
use App\Support\StoreNotifications;
use App\Support\StoreMailer;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Low completion rate email for one store: completion = completed / started
 * over a trailing 7-day window, with a minimum-volume guard so quiet stores
 * never trigger. At most one alert per 7 days (notification_logs dedupe).
 */
class CheckCompletionRateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private const MIN_STARTED = 10;
    private const RENOTIFY_AFTER_DAYS = 7;

    public function __construct(public Store $store)
    {
    }

    public function handle(): void
    {
        $notification = $this->store->setting?->notification ?? [];
        if (empty($notification['completion_alert'])) {
            return;
        }

        if (StoreNotifications::isFreePlan(StoreNotifications::planFor($this->store))) {
            return; // Free plan: no email notifications
        }

        $to = StoreNotifications::resolveEmail($this->store);
        if (!$to) {
            Log::warning("[notifications] {$this->store->shopify_domain}: completion alert skipped - no resolvable email");
            return;
        }

        $since = now()->subDays(7);
        $counts = TrySession::where('store_id', $this->store->id)
            ->where('tryon_started_at', '>=', $since)
            ->selectRaw('SUM(tryon_started_at IS NOT NULL) as started')
            ->selectRaw('SUM(tryon_completed_at IS NOT NULL) as completed')
            ->first();

        $started = (int) ($counts->started ?? 0);
        if ($started < self::MIN_STARTED) {
            return; // too little volume to be meaningful
        }

        $completed = (int) ($counts->completed ?? 0);
        $rate = ($completed / $started) * 100;
        $threshold = (int) ($notification['completion_threshold'] ?? 60);

        if ($rate >= $threshold) {
            return;
        }

        // At most one low-completion alert per week
        if (StoreNotifications::alreadySent($this->store, 'completion_rate', $since)) {
            return;
        }

        Mail::mailer(StoreMailer::mailerFor($this->store))
            ->to($to)
            ->send(new CompletionRateMail($this->store, $rate, $threshold, $started, $completed));

        StoreNotifications::logSent($this->store, 'completion_rate', [
            'rate' => round($rate, 1),
            'threshold' => $threshold,
            'started' => $started,
            'completed' => $completed,
        ]);
    }
}
