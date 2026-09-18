<?php

namespace App\Jobs;

use App\Mail\WeeklySummaryMail;
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
 * Weekly summary email for one store - stats for the previous Mon-Sun in the
 * store local timezone, with a delta against the week before. Gated on the
 * merchant toggle, the Free-plan exclusion and the resolvable email;
 * deduped per local week via notification_logs.
 */
class SendWeeklySummaryJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Store $store)
    {
    }

    public function handle(): void
    {
        $notification = $this->store->setting?->notification ?? [];
        if (empty($notification['weekly_summary'])) {
            return;
        }

        if (StoreNotifications::isFreePlan(StoreNotifications::planFor($this->store))) {
            return; // Free plan: no email notifications
        }

        $to = StoreNotifications::resolveEmail($this->store);
        if (!$to) {
            Log::warning("[notifications] {$this->store->shopify_domain}: weekly summary skipped - no resolvable email");
            return;
        }

        $tz = StoreNotifications::timezoneFor($this->store);
        $now = now($tz);
        $weekStart = $now->copy()->startOfWeek()->subWeek(); // Carbon weeks start Monday
        $weekEnd = (clone $weekStart)->endOfWeek();
        $prevStart = (clone $weekStart)->subWeek();

        $statsFor = fn ($from, $to) => TrySession::where('store_id', $this->store->id)
            ->whereBetween('created_at', [$from->copy()->timezone('UTC'), $to->copy()->timezone('UTC')])
            ->selectRaw('COUNT(*) as sessions')
            ->selectRaw('SUM(tryon_started_at IS NOT NULL) as started')
            ->selectRaw('SUM(tryon_completed_at IS NOT NULL) as completed')
            ->selectRaw('SUM(added_to_cart_at IS NOT NULL) as carts')
            ->selectRaw('SUM(order_id IS NOT NULL) as orders')
            ->first();

        $rate = fn ($row) => ($row->started ?? 0) > 0
            ? (($row->completed ?? 0) / $row->started) * 100
            : null;

        $current = $statsFor($weekStart, $weekEnd);
        $previous = $statsFor($prevStart, $weekStart->copy()->subSecond());

        $stats = [
            'week_start' => $weekStart->toDateString(),
            'week_end' => $weekEnd->toDateString(),
            'sessions' => (int) ($current->sessions ?? 0),
            'started' => (int) ($current->started ?? 0),
            'completed' => (int) ($current->completed ?? 0),
            'carts' => (int) ($current->carts ?? 0),
            'orders' => (int) ($current->orders ?? 0),
            'rate' => $rate($current),
            'prev_rate' => $rate($previous),
        ];

        // Idempotency: one summary per store-local week even if the
        // scheduler fires twice.
        if (StoreNotifications::alreadySent($this->store, 'weekly_summary', $weekStart->copy()->timezone('UTC'))) {
            return;
        }

        Mail::mailer(StoreMailer::mailerFor($this->store))
            ->to($to)
            ->send(new WeeklySummaryMail($this->store, $stats));

        StoreNotifications::logSent($this->store, 'weekly_summary', $stats);
    }
}
