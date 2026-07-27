<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Store;
use App\Providers\StoreUsage;
use App\Services\MixpanelService;
use Illuminate\Http\Request;

class CartAddsController extends Controller
{
    public function store(Request $request, $shop, Campaign $campaign)
    {
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();
        $campaign->cart_adds()->create();

        $campaign->order_intents()->create([
            'options' => [
                'ip' => file_get_contents('https://api.ipify.org'),
                'user_agent' => $_SERVER['HTTP_USER_AGENT'],
                'customer_id' => $request->input('customer_id') ? $request->input('customer_id') : 0
            ]
        ]);

        StoreUsage::dispatch($store, 'cart_add');

        $mixpanel = new MixpanelService();
        $mixpanel->track('Product Added To Cart', $shop, [
            'Campaign Type' => $campaign->type
        ]);

        return response()->json()->status(200);
    }
}
