<?php

namespace App\Http\Controllers;

use App\Models\Session;
use App\Helpers\Shopify;
use App\Models\Campaign;
use App\Models\OrderIntent;
use App\Services\MixpanelService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ClicksController extends Controller
{
    public function redirect(Request $request, $shop, Campaign $campaign)
    {
        $campaign->clicks()->create();

        $campaign->order_intents()->create([
            'options' => [
                'ip' => file_get_contents('https://api.ipify.org'),
                'user_agent' => $_SERVER['HTTP_USER_AGENT'],
                'customer_id' => $request->get('customer_id') ? $request->get('customer_id') : 0
            ]
        ]);

        $mixpanel = new MixpanelService();

        $mixpanel->track('Campaign Click', $shop, [
            'Campaign Type' => $campaign->type
        ]);


        return redirect($request->get('redirect') . "?utm_source=pushy&utm_campaign={$campaign->type}");
    }
}
