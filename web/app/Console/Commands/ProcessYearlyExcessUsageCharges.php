<?php

namespace App\Console\Commands;

use App\Helpers\Shopify;
use App\Models\Session;
use Exception;
use App\Models\Store;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessYearlyExcessUsageCharges extends Command
{
    private const APPLICATION_CHARGE = <<<'QUERY'
     mutation createApplicationCharge($name: String!, $amount: Decimal!, $returnUrl: URL!, $test: Boolean) {
        applicationChargeCreate(
            name: $name,
            price: $amount,
            test: $test
        ) {
            applicationCharge {
                id
                status
            }
            userErrors {
                field
                message
            }
        }
    }
QUERY;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:process-yearly-excess-usage-charges';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // This method should be run at the start of each month
        $lastMonth = Carbon::now()->subMonth();
        $monthStart = $lastMonth->copy()->startOfMonth();
        $monthEnd = $lastMonth->copy()->endOfMonth();

        $activeStoresWithYearlySubscriptions = Store::activeWithYearlySubscription()->get();
        foreach ($activeStoresWithYearlySubscriptions as $store) {
            $subscription = $store->subscription;
            if ($subscription) {
                $plan = $subscription->plan;
                if ($plan && $plan->limits['orders'] != 'unlimited') {
                    $usage = $store->usage_trackings()
                        ->where('charged', false)
                        ->whereBetween('created_at', [$monthStart, $monthEnd])->get();

                    $excessUsage = $this->calculateExcessUsage($usage->count(), $plan->limits['orders']);
                    $excessUsage = 20;

                    if($excessUsage > 0) {
                        $chargeAmount = $excessUsage * 0.1;
                        $monthName = $lastMonth->format('F Y');

                        try {
                            $session = Session::query()->where('shop', $store->shopify_domain)->first();
                            $charge = $this->createOneTimeCharge(
                                $store->shopify_domain,
                                $session->access_token,
                                "Orders usage Overage Charge for {$monthName}",
                                $chargeAmount,
                                $subscription->admin_graphql_api_id
                            );

                            dd($charge);


                            // Mark usage records as charged
                            DB::table('usage_trackings')
                                ->whereIn('id', $usage->pluck('id'))
                                ->update(['charged' => true]);

                        } catch (Exception $e) {
                            Log::error("Failed to create usage charge for {$store->shopify_domain}: " . $e->getMessage());
                        }
                    }

                }
            }

        }

    }

    private function calculateExcessUsage($totalUsage, $monthlyLimit): int
    {
        return max(0, $totalUsage - $monthlyLimit);
    }

    private function createOneTimeCharge($shopify_domain, $access_token, string $description, float $chargeAmount, $subscriptionLineItemId)
    {
        try {
            $priceInput = [
                'amount' => $chargeAmount, // Monetary value
                'currencyCode' => 'USD', // Replace with the correct currency code
            ];
            return Shopify::queryOrException(
                $shopify_domain,
                $access_token,
                [
                    "query" => self::APPLICATION_CHARGE,
                    "variables" => [
                        "subscriptionLineItemId" => $subscriptionLineItemId,
                        "description" => $description,
                        "price" => $priceInput,
                        "test" => true,
                    ],
                ]
            );
        }catch(\Exception $exception){
            Log::error("Usage Record Exception for store : ".$shopify_domain.' => '.$exception->getMessage());
        }
    }
}
