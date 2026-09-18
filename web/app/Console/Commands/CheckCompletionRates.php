<?php

namespace App\Console\Commands;

use App\Jobs\CheckCompletionRateJob;
use App\Models\Store;
use App\Support\StoreNotifications;
use Illuminate\Console\Command;

/**
 * Daily sweep for low completion rates; the job applies the 7-day window,
 * minimum-volume guard and weekly re-notify dedupe.
 */
class CheckCompletionRates extends Command
{
    protected $signature = 'app:check-completion-rates';

    protected $description = 'Dispatch low completion rate checks for stores with the alert enabled';

    public function handle()
    {
        $stores = Store::whereHas('setting', function ($query) {
            $query->where('notification->completion_alert', true);
        })->get();

        $dispatched = 0;
        foreach ($stores as $store) {
            if (StoreNotifications::isFreePlan(StoreNotifications::planFor($store))) {
                continue;
            }

            if (!StoreNotifications::resolveEmail($store)) {
                continue;
            }

            CheckCompletionRateJob::dispatch($store);
            $dispatched++;
        }

        $this->info("Completion rate checks dispatched for {$dispatched} store(s).");
        return self::SUCCESS;
    }
}
