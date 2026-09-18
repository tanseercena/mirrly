<?php

namespace App\Console\Commands;

use App\Jobs\SendWeeklySummaryJob;
use App\Models\Store;
use App\Support\StoreNotifications;
use Illuminate\Console\Command;

/**
 * Runs hourly; dispatches the weekly summary job only for stores whose
 * LOCAL time is Monday 09:00 (timezone comes from the store record), so
 * every store gets its summary in its own timezone.
 */
class SendWeeklySummaries extends Command
{
    protected $signature = 'app:send-weekly-summaries';

    protected $description = 'Dispatch weekly try-on summary emails for stores whose local time is Mon 09:00';

    public function handle()
    {
        $stores = Store::whereHas('setting', function ($query) {
            $query->where('notification->weekly_summary', true);
        })->get();

        $dispatched = 0;
        foreach ($stores as $store) {
            if (StoreNotifications::isFreePlan(StoreNotifications::planFor($store))) {
                continue; // Free plan: no email notifications
            }

            if (!StoreNotifications::resolveEmail($store)) {
                continue;
            }

            $local = now(StoreNotifications::timezoneFor($store));
            if (!$local->isMonday() || $local->hour !== 9) {
                continue;
            }

            SendWeeklySummaryJob::dispatch($store);
            $dispatched++;
        }

        $this->info("Weekly summaries dispatched for {$dispatched} store(s).");
        return self::SUCCESS;
    }
}
