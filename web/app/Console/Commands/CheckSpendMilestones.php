<?php

namespace App\Console\Commands;

use App\Jobs\CheckSpendMilestoneJob;
use App\Models\Store;
use App\Support\StoreNotifications;
use Illuminate\Console\Command;

/**
 * Runs frequently so the milestone email lands close to the moment the
 * threshold is crossed; the job itself dedupes to once per billing cycle.
 */
class CheckSpendMilestones extends Command
{
    protected $signature = 'app:check-spend-milestones';

    protected $description = 'Dispatch spend milestone checks for stores with the alert enabled';

    public function handle()
    {
        $stores = Store::whereHas('setting', function ($query) {
            $query->where('notification->spend_alert', true);
        })->get();

        $dispatched = 0;
        foreach ($stores as $store) {
            if (StoreNotifications::isFreePlan(StoreNotifications::planFor($store))) {
                continue;
            }
                

            if ((int) (StoreNotifications::planFor($store)->limits['sessions'] ?? 0) <= 0) {
                continue;
            }
                    


            if (!StoreNotifications::resolveEmail($store)) {
                continue;
            }
                    


            CheckSpendMilestoneJob::dispatch($store);
            $dispatched++;
        }

        $this->info("Spend milestone checks dispatched for {$dispatched} store(s).");
        return self::SUCCESS;
    }
}
