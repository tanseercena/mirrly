<?php

namespace App\Http\Controllers;

use App\Exceptions\ShopifyBillingException;
use App\Helpers\Shopify;
use App\Lib\TopLevelRedirection;
use App\Mail\SubscriptionCreated;
use App\Models\Plan;
use App\Models\Session;
use App\Models\Store;
use App\Models\Subscription;
use App\Services\BrevoService;
use App\Services\MailchimpService;
use App\Services\MixpanelService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Shopify\Clients\Rest;
use Shopify\Context;
use Spatie\SlackAlerts\Facades\SlackAlert;
use App\Helpers\PumbleAlert;

class BillingController extends Controller
{
    private const INTERVAL_EVERY_30_DAYS = "EVERY_30_DAYS";
    private const INTERVAL_ANNUAL = "ANNUAL";
    private const RECURRING_PURCHASE_MUTATION = <<<'QUERY'
    mutation createPaymentMutation(
        $name: String!
        $lineItems: [AppSubscriptionLineItemInput!]!
        $returnUrl: URL!
        $test: Boolean
        $trialDays: Int
    ) {
        appSubscriptionCreate(
            name: $name
            lineItems: $lineItems
            returnUrl: $returnUrl
            trialDays: $trialDays
            test: $test
        ) {
            confirmationUrl
            userErrors {
                field, message
            }
        }
    }
QUERY;
    private const ONE_TIME_PURCHASE_MUTATION = <<<'QUERY'
    mutation createPaymentMutation(
        $name: String!
        $price: MoneyInput!
        $returnUrl: URL!
        $test: Boolean
    ) {
        appPurchaseOneTimeCreate(
            name: $name
            price: $price
            returnUrl: $returnUrl
            test: $test
        ) {
            confirmationUrl
            userErrors {
                field, message
            }
        }
    }
QUERY;
    private const CANCEL_SUBSCRIPTION_MUTATION = <<<'QUERY'
    mutation appSubscriptionCancel($id: ID!) {
        appSubscriptionCancel(id: $id) {
        appSubscription {
            id
        }
        userErrors {
            field
            message
        }
        }
    }

QUERY;

    private const RECURRING_PURCHASES_QUERY = <<<'QUERY'
    query appSubscription {
        currentAppInstallation {
            activeSubscriptions {
                name
                test
                lineItems {
                    id
                }
            }
        }
    }
QUERY;

    public function process(Request $request)
    {
        try {
            $session = $request->get('shopifySession');
            if (!$session) {
                return response()->json(['error' => 'Shopify session not found'], 401);
            }

            $shop = $session->getShop();
            $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

            if (!$store) {
                return response()->json(['error' => 'Store not found'], 404);
            }

            $store->intended_plan_interval = $request->input('interval');
            $store->save();

            $plan = Plan::find($request->input('id'));

            if (!$plan) {
                return response()->json(['error' => 'Plan not found'], 404);
            }

            $creationDate = new Carbon();
            $cutoffDate = new Carbon('2025-05-15');

            $originalPrice = $request->input('interval') == "monthly" ? $plan->monthly_charge : $plan->yearly_charge;

            if ($creationDate < $cutoffDate && $request->input('interval') != 'monthly') {
                $discountPercentage = 50;
                $discountedPrice = $originalPrice * (1 - $discountPercentage / 100);
            } else {
                $discountedPrice = $originalPrice;
            }

            $trialDays = $trialDays = !$store->trial_started_on ? 7 : max(0, 7 - $store->trial_started_on->diffInDays());
            if($plan->id == 1) {
                $trialDays = 0;
                $discountedPrice = 0;
            }

            $dev_test_stores = [
                'comp-store-check.myshopify.com',
                'digitally-demo-store.myshopify.com',
                'digitally-tutorial-store.myshopify.com',
                'digitally-prod-onboarding.myshopify.com',
                'digital-dash-store.myshopify.com',
                'farhan-digitally-store.myshopify.com',
                'ghafoor-digitally-store.myshopify.com',
                'furqan-digitally-test.myshopify.com',
            ];

            // Allow all stores in development mode to use test billing
            if (config('app.debug') || config('app.env') === 'local') {
                $dev_test_stores[] = $store->shopify_domain;
            }

            $billing = [
                "chargeName" => ucfirst($plan->name),
                "currencyCode" => "USD", // Currently only supports USD
                "amount" => $discountedPrice,
                "interval" => $request->input('interval') == "monthly" ? BillingController::INTERVAL_EVERY_30_DAYS :
                    BillingController::INTERVAL_ANNUAL,
                'test' => (config('app.debug') || in_array($store->shopify_domain, $dev_test_stores)) ? true : null,
                'trialDays' => $trialDays,
                'usageTerms' => $plan->name == 'unlimited' ? "For each 1,000 over-plan orders you'll pay $1.50" : '$0.1 per additional order beyond monthly plan limit',
                'usageCappedAmount' => $plan->name == 'unlimited' ? 500 : 200,
            ];

    //        Log::debug("Initiated billing for $shop");
    //        Log::debug($billing);

            $hostName = Context::$HOST_NAME;
            $host = base64_encode("$shop/admin");
    //            $returnUrl = "https://$hostName?shop={$shop}&host=$host";
            $returnUrl = route('billing.callback', ['plan' => $plan->name, 'store_id' => $store->id]);

            $session2 = Session::query()->where('shop', $store->shopify_domain)->first();

            if (!$session2) {
                return response()->json(['error' => 'Session not found'], 404);
            }

    //            $data = $this->requestRecurringPayment($shop, $session2->access_token,
    //                $billing, $returnUrl);
            $data = $this->createSubscription($shop, $session2->access_token, $billing, $returnUrl);
            $data = $data["data"]["appSubscriptionCreate"];

            if (!empty($data["userErrors"])) {
                Log::error($data["userErrors"]);
                return response()->json(['error' => 'Error while billing the store', 'details' => $data["userErrors"]], 500);
            }

            $mixpanel = new MixpanelService();
            $mixpanel->track('Billing Charge Requested', $shop, [
                'Plan' => $billing['chargeName'].' '.$billing['interval'],
                'Amount' => $billing['amount']
            ]);


            return response()->json([
                'confirmationUrl' => $data["confirmationUrl"]
            ]);
            //return TopLevelRedirection::redirect($request, $data["confirmationUrl"]);
        } catch (ShopifyBillingException $e) {
            Log::error($e);
            return response()->json(['error' => 'Billing error: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            Log::error($e);
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }

    private function createSubscription(string $shop, string $accessToken, array $billing, string $returnUrl): array
    {
        if ($billing['interval'] === self::INTERVAL_ANNUAL) {
            // For annual plans, create subscription without usage charges
            return $this->createAnnualSubscription($shop, $accessToken, $billing, $returnUrl);
        }

        // For monthly plans, include usage charges
        return $this->requestRecurringPayment($shop, $accessToken, $billing, $returnUrl);
    }

    /*
     * For Monthly Plan Charge with usage charge
     */
    private function requestRecurringPayment(
        string $shop,
        string $accessToken,
        array $billing,
        string $returnUrl
    ): array {
        return Shopify::queryOrException(
            $shop,
            $accessToken,
            [
                "query" => BillingController::RECURRING_PURCHASE_MUTATION,
                "variables" => [
                    "name" => $billing["chargeName"],
                    'trialDays' => $billing["trialDays"],
                    "lineItems" => [
                        [
                            "plan" => [
                                "appRecurringPricingDetails" => [
                                    "interval" => $billing["interval"],
                                    "price" => ["amount" => $billing["amount"], "currencyCode" => $billing["currencyCode"]],
                                ],
                            ],
                        ],
                        [
                            // Usage-based charge
                            "plan" => [
                                "appUsagePricingDetails" => [
                                    "cappedAmount" => [
                                        "amount" => $billing["usageCappedAmount"], // Maximum charge in a billing cycle
                                        "currencyCode" => $billing["currencyCode"],
                                    ],
                                    "terms" => $billing["usageTerms"], // Example: "$0.1 per API request"
                                ],
                            ],
                        ]
                    ],
                    "returnUrl" => $returnUrl,
                    "test" => $billing['test'],
                ],
            ]
        );
    }

    /**
     * For Yearly Plan charge without usage charge
     */
    private function createAnnualSubscription(string $shop, string $accessToken, array $billing, string $returnUrl): array
    {
        return Shopify::queryOrException(
            $shop,
            $accessToken,
            [
                "query" => self::RECURRING_PURCHASE_MUTATION,
                "variables" => [
                    "name" => $billing["chargeName"],
                    'trialDays' => $billing["trialDays"],
                    "lineItems" => [
                        [
                            "plan" => [
                                "appRecurringPricingDetails" => [
                                    "interval" => $billing["interval"],
                                    "price" => [
                                        "amount" => $billing["amount"],
                                        "currencyCode" => $billing["currencyCode"]
                                    ],
                                ],
                            ],
                        ],
                    ],
                    "returnUrl" => $returnUrl,
                    "test" => $billing['test'],
                ],
            ]
        );
    }

    public function cancel(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        $store = Store::query()->where('shopify_domain', $shop)->orWhere('domain', $shop)->first();
        $session2 = Session::query()->where('shop', $store->shopify_domain)->first();
        $response = Shopify::queryOrException($shop, $session2->access_token, [
            "query" => BillingController::CANCEL_SUBSCRIPTION_MUTATION,
            "variables" => [
                "id" => $store->subscription->admin_graphql_api_id
            ]
        ]);

        if (empty($response['data']['appSubscriptionCancel']['userErrors'])) {
            $store->subscription->delete();
        } else {
            Log::error('Error cancelling subcription for'.$shop);
        }
    }

    public function downgradeToFreePlan(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if ($store->subscription) {
            try {
                $session2 = Session::query()->where('shop', $store->shopify_domain)->first();
                $response = Shopify::queryOrException($shop, $session2->access_token, [
                    "query" => BillingController::CANCEL_SUBSCRIPTION_MUTATION,
                    "variables" => [
                        "id" => $store->subscription->admin_graphql_api_id,
                    ]
                ]);

                if (empty($response['data']['appSubscriptionCancel']['userErrors'])) {
                    $store->subscription->update([
                        'status' => 'cancelled',
                        'updated_at' => now()
                    ]);
                } else {
                    Log::error('Error cancelling subscription for ' . $shop);
                    return response()->json(['error' => 'Failed to cancel the subscription'], 500);
                }
            } catch (\Exception $e) {
                Log::error('Error cancelling subscription: ' . $e->getMessage());
                return response()->json(['error' => 'An error occurred while cancelling the subscription'], 500);
            }
        }

        // Cancel other subscriptions
        Subscription::where("store_id", $store->id)
            ->update([
                'status' => 'cancelled',
            ]);

        $freePlan = Plan::where('name', 'free')->first();
        $store->subscription()->create([
            'plan_id' => $freePlan->id,
            'status' => 'active',
            'interval' => 'monthly',
            'admin_graphql_api_id' => null,
            'next_reset_date' => now()->addMonth(),
        ]);

//        $store->intended_plan_interval = 'monthly';
//        $store->per_file_limit = 104857600;
//        $store->digital_products_limit = 20;
//        $store->digital_lotteries_limit = 1;
//        $store->orders_per_month = 30;
//        $store->file_storage_limit = 5368709120;
//        $store->save();

        $currentDigitalProducts = $store->digitalProducts()->where("deleted", false)->count();
        $currentDigitalLotteries = $store->digitalLotteries()->count();
        $startOfMonth = Carbon::now()->startOfMonth();
        $currentOrders = $store->orders()
            ->where('created_at', '>=', $startOfMonth)
            ->count();
        $currentFileStorageUsage = $store->files()->sum('byteSize');
        $plan = $freePlan;
        $store->per_file_limit = $plan->limits['max_file_size'];
        $store->digital_products_limit = $this->getLimitValue($plan->limits['digital_products'], $currentDigitalProducts);
        // $store->digital_lotteries_limit = $this->getLimitValue($plan->limits['digital_lotteries'], $currentDigitalLotteries);
        $store->orders_per_month = $this->getLimitValue($plan->limits['orders'], $currentOrders);
        $store->file_storage_limit = $this->getLimitValue($plan->limits['file_storage'], $currentFileStorageUsage);
        $store->save();

        return response()->json(['message' => 'Successfully downgraded to free plan'], 200);
    }

    private function requestOneTimePayment(string $shop, string $accessToken, array $billing, string $returnUrl): array
    {
        return Shopify::queryOrException(
            $shop,
            $accessToken,
            [
                "query" => BillingController::ONE_TIME_PURCHASE_MUTATION,
                "variables" => [
                    "name" => $billing["chargeName"],
                    "price" => ["amount" => $billing["amount"], "currencyCode" => $billing["currencyCode"]],
                    "returnUrl" => $returnUrl,
                    "test" => $billing['test'],
                ],
            ]
        );
    }

    public function billingCallback(Request $request)
    {
        // Handle the callback from Shopify after the customer accepts the charge
        $store = Store::query()->where('id', $request->input('store_id'))->first();
        $session = Session::query()->where('shop', $store->shopify_domain)->first();

        $chargeId = 'gid://shopify/AppSubscription/' . $request->input('charge_id');
        $plan_id = $request->input('plan');
        $plan = Plan::where("name",$plan_id)->first();

        $mixpanel = new MixpanelService();
        $appSubscriptionLineItemId = $this->getUsageLineItemId($store);


        if ($subscription = Subscription::where('admin_graphql_api_id',
            $chargeId)->first()) {
            $subscription->status = 'active';
            $subscription->next_reset_date = $store->intended_plan_interval == 'monthly' ? now()->addMonth() : now()->addYear();
            $subscription->monthly_reset_date = now()->addMonth();
            $subscription->usage_link_item_id = $appSubscriptionLineItemId;
            $subscription->plan_selected = true;
            $subscription->save();
        } else {
            $subscription = $store->subscription()->create([
                'plan_id' => $plan->id,
                'status' => 'active',
                'interval' => $store->intended_plan_interval,
                'admin_graphql_api_id' => $chargeId,
                'next_reset_date' => $store->intended_plan_interval == 'monthly' ? now()->addMonth() : now()->addYear(),
                'monthly_reset_date' => now()->addMonth(),
                'usage_link_item_id' => $appSubscriptionLineItemId,
                'plan_selected' => true,
            ]);
        }

        // Get active previous subsciption
        $previousSubscription = Subscription::where("store_id", $store->id)
            ->where("status", 'active')
            ->where(function ($query) use ($chargeId) {
                $query->where("admin_graphql_api_id", "!=", $chargeId)
                    ->orWhereNull("admin_graphql_api_id"); // Include NULL values explicitly
            })->latest('created_at')->first();

        // Cancel previous subscriptions if any
        Subscription::where("store_id", $store->id)
            ->where(function ($query) use ($chargeId) {
                $query->where("admin_graphql_api_id", "!=", $chargeId)
                    ->orWhereNull("admin_graphql_api_id"); // Include NULL values explicitly
            })
            ->update([
                'status' => 'cancelled',
            ]);

        if ($plan) {
            /* This is for pro rata calculation based but not need as for now
            if ($previousSubscription) {
                $currentDate = Carbon::now();
                $nextResetDate = Carbon::parse($previousSubscription->next_reset_date);
                $startOfSubscription = Carbon::parse($previousSubscription->created_at);

                if ($currentDate < $nextResetDate) {
                    $remainingDays = $nextResetDate->diffInDays($currentDate);
                    $totalDaysInPeriod = $nextResetDate->diffInDays($startOfSubscription);

                    $prorationFactor = $remainingDays / $totalDaysInPeriod;

                    $currentDigitalProducts = $store->digitalProducts()->count();
                    $currentDigitalLotteries = $store->digitalLotteries()->count();
                    $currentOrders = $store->orders()
                        ->where('created_at', '>=', $startOfSubscription)
                        ->count();
                    $currentFileStorageUsage = $store->files()->sum('byteSize');

                    // Apply prorated limits
                    $store->digital_products_limit = $plan->limits['digital_products'] === 'unlimited'
                        ? -1
                        : $this->getLimitValue(
                            $plan->limits['digital_products'] * $prorationFactor,
                            $currentDigitalProducts
                        );

                    $store->digital_lotteries_limit = $plan->limits['digital_lotteries'] === 'unlimited'
                        ? -1
                        : $this->getLimitValue(
                            $plan->limits['digital_lotteries'] * $prorationFactor,
                            $currentDigitalLotteries
                        );

                        
                    $store->orders_per_month = $plan->limits['orders'] === 'unlimited'
                        ? -1
                        : $this->getLimitValue(
                            $plan->limits['orders'] * $prorationFactor,
                            $currentOrders
                        );

                    $store->file_storage_limit = $plan->limits['file_storage'] === 'unlimited'
                        ? -1
                        : $this->getLimitValue(
                            $plan->limits['file_storage'] * $prorationFactor,
                            $currentFileStorageUsage
                        );
                } else {
                    // Full limits if the reset date has passed
                    $store->digital_products_limit = $plan->limits['digital_products'];
                    $store->digital_lotteries_limit = $plan->limits['digital_lotteries'];
                    $store->orders_per_month = $plan->limits['orders'];
                    $store->file_storage_limit = $plan->limits['file_storage'];
                }
            } else {
                // No previous subscription, set full limits directly
                $store->digital_products_limit = $plan->limits['digital_products'];
                $store->digital_lotteries_limit = $plan->limits['digital_lotteries'];
                $store->orders_per_month = $plan->limits['orders'];
                $store->file_storage_limit = $plan->limits['file_storage'];
            }
            */

            if ($previousSubscription) {
                //$currentDigitalProducts = $store->digitalProducts()->where("deleted", false)->count();
                //$currentDigitalLotteries = $store->digitalLotteries()->count();
                //$currentFileStorageUsage = $store->files()->sum('byteSize');
//                $startOfSubscription = Carbon::parse($previousSubscription->created_at);
//                $currentOrders = $store->orders()
//                    ->where('created_at', '>=', $startOfSubscription)
//                    ->count();

                //$store->digital_products_limit = $this->getLimitValue($plan->limits['digital_products'], $currentDigitalProducts);
                // $store->digital_lotteries_limit = $this->getLimitValue($plan->limits['digital_lotteries'], $currentDigitalLotteries);
                //$store->orders_per_month = $this->getLimitValue($plan->limits['orders'], $currentOrders);
                //$store->orders_per_month = $plan->limits['orders']; // For now just give full new order per month later we will change to prorata
                //$store->file_storage_limit = $this->getLimitValue($plan->limits['file_storage'], $currentFileStorageUsage);
            }else{
                //$store->digital_products_limit = $plan->limits['digital_products'];
                // $store->digital_lotteries_limit = $plan->limits['digital_lotteries'];
                //$store->orders_per_month = $plan->limits['orders'];
                //$store->file_storage_limit = $plan->limits['file_storage'];
            }


//            $currentDigitalProducts = $store->digitalProducts()->count();
//            $currentDigitalLotteries = $store->digitalLotteries()->count();
//            $startOfMonth = Carbon::now()->startOfMonth();
//            $currentOrders = $store->orders()
//                ->where('created_at', '>=', $startOfMonth)
//                ->count();
//            $currentFileStorageUsage = $store->files()->sum('byteSize');
//
//            $store->per_file_limit = $plan->limits['max_file_size'];
//            $store->digital_products_limit = $this->getLimitValue($plan->limits['digital_products'], $currentDigitalProducts);
//            $store->digital_lotteries_limit = $this->getLimitValue($plan->limits['digital_lotteries'], $currentDigitalLotteries);
//            $store->orders_per_month = $this->getLimitValue($plan->limits['orders'], $currentOrders);
//            $store->file_storage_limit = $this->getLimitValue($plan->limits['file_storage'], $currentFileStorageUsage);
//            $store->save();

            //$store->per_file_limit = $plan->limits['max_file_size'];
            $store->save();
        }

        if (!$store->trial_started_on) {
            $store->trial_started_on = Carbon::now();
        }

        // Mark onboarding as complete after billing success
        $store->finish_onboarding = true;
        $store->save();


        if(config("app.env") == 'production' || config("app.env") == "local") {
            try {
                //Mail::to(config('app.new_install_email'))->send(new SubscriptionCreated($store));
                $previousPlanName = $previousSubscription ? $previousSubscription->plan->name : 'free';
                $this->sendPlanChangeAlert($store, $previousPlanName, $plan->name);
            } catch (Exception $e) {
                Log::error("Error sending plan slack notification: ".$e->getMessage());
            }
        }

//        $mixpanel->track('Paid Subscription Started', $store->shopify_domain, [
//            'Plan' => $plan->name
//        ]);
//        $mixpanel->trackCharge($store->shopify_domain,
//            $store->intended_plan_interval == 'monthly' ? $plan->monthly_charge : $plan->yearly_charge);


        // Add Paying tag to brevo contact if paid plan
        if(!empty($store->brevo_id) && config("app.env") == 'production' && $plan->name != 'free') {
            $brevo = new BrevoService($store);
            $brevo->updateContact([
                'attributes' => [
                    'PAYING_TAG'    => config('app.paying_tag'),
                ]
            ]);
        }

        // Remove paying tag if plan is free
        if(!empty($store->brevo_id) && config("app.env") == 'production' && $plan->name == 'free') {
            $brevo = new BrevoService($store);
            $brevo->updateContact([
                'attributes' => [
                    'PAYING_TAG'    => '',
                ]
            ]);
        }

        // Redirect to the index page with embedded app parameters
        $hostName = Context::$HOST_NAME;
        $host = base64_encode("$store->shopify_domain/admin");
        $redirectUrl = "https://$hostName?shop={$store->shopify_domain}&host=$host";

        return redirect($redirectUrl);
    }

    public function getLimitValue($limit, $currentUsage): int
    {
        if ($limit === 'unlimited') {
            return -1;
        }

        return max(0, $limit - $currentUsage);
    }

    private function getUsageLineItemId($store)
    {
        // Execute the query using Shopify::queryOrException
        $session = Session::query()->where('shop', $store->shopify_domain)->first();
        $response = Shopify::queryOrException(
            $store->shopify_domain,
            $session->access_token, // Retrieve the access token for the store
            [
                "query" => self::RECURRING_PURCHASES_QUERY,
            ]
        );

        // Parse the response to get the second line item
        $subscriptions = $response['data']['currentAppInstallation']['activeSubscriptions'] ?? [];

        if (!empty($subscriptions)) {
            foreach ($subscriptions as $subscription) {
                $lineItems = $subscription['lineItems'] ?? [];
                if (count($lineItems) >= 2) {
                    return $lineItems[1]['id']; // Return the second line item ID
                }
                if (count($lineItems) == 1) {
                    return $lineItems[0]['id']; // Return the first line item ID
                }
            }
        }

        // Return null if no second line item is found
        return null;
    }

    // public function sendPlanChangeAlert($store, $oldPlan, $newPlan) {
    //     // Define plan hierarchy and colors
    //     $planHierarchy = [
    //         'free' => ['level' => 1, 'color' => '🟡'],
    //         'pro' => ['level' => 2, 'color' => '🟠'],
    //         'plus' => ['level' => 3, 'color' => '💚'],
    //         'unlimited' => ['level' => 4, 'color' => '💎']
    //     ];

    //     $oldPlanData = $planHierarchy[strtolower($oldPlan)] ?? ['level' => 0, 'color' => '⚪'];
    //     $newPlanData = $planHierarchy[strtolower($newPlan)] ?? ['level' => 0, 'color' => '⚪'];

    //     $isUpgrade = $newPlanData['level'] > $oldPlanData['level'];
    //     $changeDirection = $isUpgrade ? 'upgraded' : 'downgraded';
    //     $emoji = $isUpgrade ? '🚀' : '📉';

    //     try {
    //         SlackAlert::blocks([
    //             [
    //                 'type' => 'header',
    //                 'text' => [
    //                     'type' => 'plain_text',
    //                     'text' => "{$emoji} Plan Change: " . ucfirst($changeDirection),
    //                     'emoji' => true
    //                 ]
    //             ],
    //             [
    //                 'type' => 'section',
    //                 'text' => [
    //                     'type' => 'mrkdwn',
    //                     'text' => "*{$store->shopify_domain}* has {$changeDirection} their plan"
    //                 ]
    //             ],
    //             [
    //                 'type' => 'section',
    //                 'text' => [
    //                     'type' => 'mrkdwn',
    //                     'text' => "{$oldPlanData['color']} *{$oldPlan}* ➡️ {$newPlanData['color']} *{$newPlan}* - {$store->intended_plan_interval}"
    //                 ]
    //             ],
    //             [
    //                 'type' => 'divider'
    //             ],
    //             [
    //                 'type' => 'section',
    //                 'fields' => [
    //                     [
    //                         'type' => 'mrkdwn',
    //                         'text' => "*Store Information:*\n• Domain: `{$store->shopify_domain}`\n• Email: {$store->email}\n• Store ID: #{$store->id}"
    //                     ],
    //                     [
    //                         'type' => 'mrkdwn',
    //                         'text' => "*Change Details:*\n• Previous: {$oldPlan}\n• Current: {$newPlan}\n• Date: " . now()->format('M j, Y') . "\n• Time: " . now()->format('g:i A T')
    //                     ]
    //                 ]
    //             ],
    //             [
    //                 'type' => 'section',
    //                 'text' => [
    //                     'type' => 'mrkdwn',
    //                     'text' => $isUpgrade
    //                         ? "*Impact:* :chart_with_upwards_trend: Increased plan tier - potential for higher revenue and engagement"
    //                         : "*Impact:* :chart_with_downwards_trend: Reduced plan tier - may need customer success follow-up"
    //                 ]
    //             ],
    //             [
    //                 'type' => 'actions',
    //                 'elements' => [
    //                     [
    //                         'type' => 'button',
    //                         'text' => [
    //                             'type' => 'plain_text',
    //                             'text' => 'View Store Details'
    //                         ],
    //                         'style' => 'primary',
    //                         'url' => "https://your-admin-panel.com/stores/{$store->id}"
    //                     ],
    //                     [
    //                         'type' => 'button',
    //                         'text' => [
    //                             'type' => 'plain_text',
    //                             'text' => $isUpgrade ? 'Send Thank You Message' : 'Contact Customer'
    //                         ],
    //                         'url' => "https://your-admin-panel.com/stores/{$store->id}/contact"
    //                     ]
    //                 ]
    //             ],
    //             [
    //                 'type' => 'context',
    //                 'elements' => [
    //                     [
    //                         'type' => 'mrkdwn',
    //                         'text' => $isUpgrade
    //                             ? ':tada: Celebrate this win! Consider reaching out with premium features guide.'
    //                             : ':warning: Consider following up to understand the reason and offer assistance.'
    //                     ]
    //                 ]
    //             ]
    //         ]);
    //     } catch (\Exception $e) {
    //         Log::error('Failed to send plan change Slack alert: ' . $e->getMessage());

    //         // Fallback simple message
    //         SlackAlert::message("{$emoji} Plan Change: {$store->shopify_domain} {$changeDirection} from {$oldPlan} to {$newPlan}");
    //     }
    // }

    public function sendPlanChangeAlert($store, $oldPlan, $newPlan)
    {
        // Define plan hierarchy and colors
        $planHierarchy = [
            'free' => ['level' => 1, 'color' => '🟡'],
            'pro' => ['level' => 2, 'color' => '🟠'],
            'plus' => ['level' => 3, 'color' => '💚'],
            'unlimited' => ['level' => 4, 'color' => '💎'],
        ];

        $oldPlanData = $planHierarchy[strtolower($oldPlan)] ?? ['level' => 0, 'color' => '⚪'];
        $newPlanData = $planHierarchy[strtolower($newPlan)] ?? ['level' => 0, 'color' => '⚪'];

        $isUpgrade = $newPlanData['level'] > $oldPlanData['level'];
        $changeDirection = $isUpgrade ? 'upgraded' : 'downgraded';
        $emoji = $isUpgrade ? '🚀' : '📉';

        // Prepare dates
        $date = now()->format('M j, Y');
        $time = now()->format('g:i A T');

        try {
            $message = <<<MD
    {$emoji} **Plan Change: {$changeDirection}**

    **{$store->shopify_domain}** has {$changeDirection} their plan

    {$oldPlanData['color']} **{$oldPlan}** ➡️ {$newPlanData['color']} **{$newPlan}**
    Interval: **{$store->intended_plan_interval}**

    ---

    ### 🏪 Store Information
    • Domain: `{$store->shopify_domain}`
    • Email: {$store->email}
    • Store ID: #{$store->id}

    ### 🔄 Change Details
    • Previous Plan: {$oldPlan}
    • Current Plan: {$newPlan}
    • Date: {$date}
    • Time: {$time}

    ### 📊 Impact
    MD;

            // Append impact message
            $message .= $isUpgrade
                ? "\n📈 Increased plan tier – potential for higher revenue and engagement"
                : "\n📉 Reduced plan tier – may need customer success follow-up";

            // Append admin actions
            $message .= <<<MD


    MD;

            PumbleAlert::send($message);

        } catch (\Exception $e) {
            Log::error('Failed to send plan change Pumble alert: ' . $e->getMessage());

            // Fallback simple message
            // PumbleAlert::send(
            //     "{$emoji} Plan Change: {$store->shopify_domain} {$changeDirection} from {$oldPlan} to {$newPlan}"
            // );
        }
    }

}
