<?php

namespace App\Jobs;

use App\Mail\SpendMilestoneMail;
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
 * Spend milestone email for one store: when consumed sessions this billing
 * cycle reach the selected threshold (80/90/100 percent) of the plan
 * included sessions. Sent ONCE per cycle per selected threshold - deduped
 * via notification_logs against the cycle start.
 */
class CheckSpendMilestoneJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Store $store)
    {
    }

    public function handle(): void
    {
                

        $notification = $this->store->setting?->notification ?? [];
        if (empty($notification['spend_alert'])) {
            return;
        }

        $plan = StoreNotifications::planFor($this->store);
        if (StoreNotifications::isFreePlan($plan)) {
            return; // Free plan: no email notifications
        }

        $included = (int) ($plan->limits['sessions'] ?? 0);
        if ($included <= 0) {
            return;
        }

        $to = StoreNotifications::resolveEmail($this->store);
        if (!$to) {
            Log::warning("[notifications] {$this->store->shopify_domain}: spend milestone skipped - no resolvable email");
            return;
        }

        $cycleStart = StoreNotifications::cycleStart($this->store);
        $used = TrySession::where('store_id', $this->store->id)
            ->where('created_at', '>=', $cycleStart)
            ->count();

        $threshold = (int) ($notification['spend_threshold'] ?? 80);
        $percent = ($used / $included) * 100;

        if ($percent < $threshold) {
            return;
        }

        // Once per billing cycle at the SELECTED threshold (not per level).
        if (StoreNotifications::alreadySent($this->store, 'spend_milestone', $cycleStart, ['milestone' => $threshold])) {
            return;
        }

        Mail::mailer(StoreMailer::mailerFor($this->store))
            ->to($to)
            ->send(new SpendMilestoneMail(
                $this->store,
                $used,
                $included,
                $threshold,
                (float) ($plan->limits['session_rate'] ?? 0)
            ));

        StoreNotifications::logSent($this->store, 'spend_milestone', [
            'milestone' => $threshold,
            'used' => $used,
            'included' => $included,
            'percent' => round($percent, 1),
            'cycle_start' => $cycleStart->toDateString(),

        ]);
    }
}
