<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Store;


class LotteryPreviewController extends Controller
{
    
    public function getEmailPreview(Request $request)
    {
        $shop = $request->get('shopifySession')->getShop();
        $store = Store::query()->with('setting')->where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        $sample_order = [
          'name' => '#1001',
            'customer' => [
                'first_name' => 'John',
                'last_name' => 'Doe'
            ]
        ];

        $html = (new SendOrderEmail([], $sample_order, $store, true))->render();

        return response()->json([
            'success' => true,
            'html' => $html
        ]);
    }
}
