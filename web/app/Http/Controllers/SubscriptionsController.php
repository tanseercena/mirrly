<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Store;
use Illuminate\Http\Request;

class SubscriptionsController extends Controller
{
    public function show(Request $request)
    {
        $shop = $request->get('shopifySession')->getShop();
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if ($store->subscription) {
            $plan = Plan::find($store->subscription->plan_id);
        } else {
            $plan = Plan::whereRaw('LOWER(name) = ?', ['free'])->first();
        }

        return response()->json([
            'data' => [
                'plan' => $plan,
                'subscription' => $store->subscription
            ]
        ]);
    }
}
