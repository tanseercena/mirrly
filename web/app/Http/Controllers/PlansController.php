<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Store;
use Illuminate\Http\Request;

class PlansController extends Controller
{
    public function index()
    {

        return response()->json([
            'data' => Plan::all()
        ]);
    }

    public function getUserPlan(Request $request)
    {
        $shop = $request->get('shopifySession')->getShop();
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if ($store) {
            $subscription = $store->subscription;

            if ($subscription && $subscription->plan) {
                return response()->json([
                    'plan' => $subscription->plan->name,
                ]);
            }
        }

        return response()->json([
            'plan' => 'Free',
        ]);
    }

    public function getCurrentPlan(Request $request)
    {
        $shop = $request->get('shopifySession')->getShop();
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if ($store) {
            $subscription = $store->subscription;

            if ($subscription && $subscription->status === 'active' && $subscription->plan) {
                return response()->json([
                    'plan' => $subscription->plan,
                ]);
            }
        }

        return response()->json([
            'plan' => Plan::find(1),
        ]);
    }

}
