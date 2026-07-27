<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Store;
use App\Providers\StoreUsage;
use App\Services\MixpanelService;
use Illuminate\Http\Request;

class ImpressionsController extends Controller
{
    public function store(Request $request, $shop, Campaign $campaign)
    {
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();
        $campaign->impressions()->create();

        StoreUsage::dispatch($store, 'impression');

        $mixpanel = new MixpanelService();

        $mixpanel->track('Campaign Impression', $shop, [
            'Campaign Type' => $campaign->type
        ]);


        return response()->json()->status(200);
    }
}
