<?php

namespace App\Services;

use App\Models\Store;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;
use Mixpanel;

class MixpanelService
{
    private Mixpanel $mixpanel;

    public function __construct()
    {
        if (config('app.mixpanel_token')) {
            $this->mixpanel = Mixpanel::getInstance(config('app.mixpanel_token'), ['consumer' => 'socket']);
        }
    }

    public function addUser(Store $store)
    {
        if (config('app.env') == 'production' && config('app.mixpanel_token')) {
            try {
                $this->mixpanel->people->set($store->shopify_domain, [
                    '$first_name' => explode(' ', $store->owner)[0],
                    '$last_name' => explode(' ', $store->owner)[1],
                    '$email' => $store->email,
                    'Store Url' => $store->domain,
                    'Store' => $store->name,
                    'Shopify plan' => $store->shopify_plan,
                    'Country' => $store->country
                ]);
            } catch (Exception $e) {
                Log::error("Error adding mixpanel user: " . $e->getMessage());
            }
        }
    }

    public function track($event, $shop, $options = [])
    {
        $store = Store::query()->where('shopify_domain', $shop)->orWhere('domain', $shop)->first();
        if (config('app.env') == 'production' && config('app.mixpanel_token')) {
            try {
                $this->mixpanel->track($event, array_merge([
                    'distinct_id' => $store->shopify_domain
                ], $options));
            } catch (Exception $e) {
                Log::error("Error tracking mixpanel event: " . $e->getMessage());
            }
        }
    }

    public function trackCharge($shop, $amount)
    {
        $store = Store::query()->where('shopify_domain', $shop)->orWhere('domain', $shop)->first();
        if (config('app.env') == 'production' && config('app.mixpanel_token')) {
            try {
                $this->mixpanel->people->trackCharge($store->shopify_domain, $amount);
            } catch (Exception $e) {
                Log::error("Failed to rack mixpanel event: " . $e->getMessage());
            }
        }
    }
}
