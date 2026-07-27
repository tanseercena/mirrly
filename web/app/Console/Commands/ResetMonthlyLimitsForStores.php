<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Store;
use Carbon\Carbon;

class ResetMonthlyLimitsForStores extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:reset-monthly-limits-for-stores';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset monthly limits for all active stores based on their subscription plan';

    /**
     * Execute the console command.
     */
    public function handle()
    {
//        $stores = Store::where('status', 'active')->get();
//        foreach ($stores as $store) {
//            $subscription = $store->subscription;
//            if (
//                $subscription && $subscription->status === 'active' &&
//                Carbon::parse($subscription->created_at)->lessThanOrEqualTo(now()->subMonth())
//            ) {
//
//                $plan = $subscription->plan;
//
//                if ($plan) {
//                    $store->orders_per_month = $plan->limits['orders'] === 'unlimited' ? -1 : $plan->limits['orders'];
//                    $store->save();
//                }
//            }
//        }

        $stores = Store::whereHas('subscription', function ($query) {
            $query->where('status', 'active')
                ->where(function ($subQuery) {
                    $subQuery->whereDate('next_reset_date', '<=', now())
                        ->orWhereDate('monthly_reset_date', '<=', now());
                });
        })->get();

        foreach ($stores as $store) {
            $subscription = $store->subscription;

            if ($subscription) {
                $plan = $subscription->plan;

                if ($plan) {
                    // Reset limits
                    $store->orders_per_month = $plan->limits['orders'] === 'unlimited' ? -1 : $plan->limits['orders'];
                    $store->save();

                    // Update next_reset_date
                    if($subscription->interval == 'monthly') {
                        //$subscription->next_reset_date = $subscription->next_reset_date->addMonth();
                        $subscription->next_reset_date = Carbon::now()->addMonth();
                    }
                    //$subscription->monthly_reset_date = $subscription->monthly_reset_date->addMonth();  // For both yearly and monthly
                    $subscription->monthly_reset_date = Carbon::now()->addMonth();

                    $subscription->save();
                }
            }
        }

        $this->info('Monthly limits reset for all eligible stores.');
    }
}
