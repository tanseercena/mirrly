<?php

namespace App\Http\Controllers;

use App\Helpers\Shopify;
use App\Models\Campaign;
use App\Models\Session;
use App\Models\Store;
use App\Services\MixpanelService;
use Illuminate\Http\Request;

class CampaignsController extends Controller
{
    private const LAST_PRODUCT_QUERY = <<<QUERY
    {
        products(first: 1, reverse: true) {
            edges {
                node {
                    id
                    handle
                }
            }
        }
    }
QUERY;

    public function index(Request $request)
    {
        $shop = $request->get('shopifySession')->getShop();
        $store = Store::query()->where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        $campaign = Campaign::where('shop', $store->shopify_domain)->where('is_draft', 0)->where('type',
            $request->get('type'))->first();

        if (!$campaign) {
            return response()->json([
                'data' => null
            ]);
        }

        return response()->json([
            'data' => $campaign
        ]);
    }

    public function save(Request $request)
    {
        $shop = $request->get('shopifySession')->getShop();
        $store = Store::query()->where('shopify_domain', $shop)->orWhere('domain', $shop)->first();
        $mixpanel = new MixpanelService();
        $lastProduct = null;

        if ($request->input('is_status_update')) {
            if ($campaign = Campaign::where('shop', $store->shopify_domain)->where('is_draft', 0)->where('type',
                $request->input('type'))->first()) {
                $campaign->update([
                    'status' => $request->input('status') ? 1 : 0
                ]);
                $mixpanel->track('Switched Campaign Status', $shop, [
                    'Campaign Type' => $campaign->type,
                    'Status' => $campaign->status
                ]);
            } else {
                $campaign = Campaign::create([
                    'shop' => $shop,
                    'type' => $request->input('type'),
                    'options' => $request->input('options'),
                    'status' => $request->input('status') ? 1 : 0
                ]);
                $mixpanel->track('Created Campaign', $shop, [
                    'Campaign Type' => $campaign->type
                ]);
            }
        } else {
            if ($request->input('is_draft')) {
                if (
                    $campaign = Campaign::where('shop', $store->shopify_domain)->where('type',
                        $request->input('type'))->where('is_draft', 1)->first()
                ) {
                    $campaign->update([
                        'type' => $request->input('type'),
                        'options' => $request->input('options'),
                        'status' => 1,
                        'is_draft' => 1
                    ]);
                } else {
                    $campaign = Campaign::create([
                        'shop' => $shop,
                        'type' => $request->input('type'),
                        'options' => $request->input('options'),
                        'status' => 1,
                        'is_draft' => 1
                    ]);
                }

                $mixpanel->track('Previewed Campaign Changes', $shop, [
                    'Campaign Type' => $campaign->type
                ]);
            } else {
                if ($campaign = Campaign::where('shop', $store->shopify_domain)->where('is_draft', 0)->where('type',
                    $request->input('type'))->first()) {
                    $campaign->update([
                        'type' => $request->input('type'),
                        'options' => $request->input('options'),
                        'status' => $request->input('status') ? 1 : 0
                    ]);
                    $mixpanel->track('Updated Campaign', $shop, [
                        'Campaign Type' => $campaign->type
                    ]);
                } else {
                    $campaign = Campaign::create([
                        'shop' => $shop,
                        'type' => $request->input('type'),
                        'options' => $request->input('options'),
                        'status' => $request->input('status') ? 1 : 0
                    ]);
                    $mixpanel->track('Created Campaign', $shop, [
                        'Campaign Type' => $campaign->type
                    ]);
                }
            }

            if ($request->input('is_draft') && $request->input('type') == 'sticky_cart_bar') {
                $store = Store::query()->where('shopify_domain', $shop)->orWhere('domain', $shop)->first();
                $session = Session::query()->where('shop', $store->shopify_domain)->first();

                $lastProduct = Shopify::queryOrException(
                    $shop,
                    $session->access_token,
                    CampaignsController::LAST_PRODUCT_QUERY
                );
            }
        }


        return response()->json([
            'data' => [
                'campaign' => $campaign,
                'last_product' => $lastProduct
            ]
        ]);
    }

    public function show(Request $request, $shop)
    {
        $store = Store::query()->where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        $campaign = Campaign::where('shop', $store->shopify_domain)->where('is_draft', 0)->where('type',
            $request->get('type'))->first();

        if (!$campaign) {
            return response()->json([
                'data' => null
            ]);
        }

        return response()->json([
            'data' => $campaign
        ]);
    }

    public function shopIndex(Request $request, $shop)
    {
        $store = Store::query()->where('shopify_domain', $shop)->orWhere('domain', $shop)->first();
        if ($request->input('isPreview') === 'false') {
            $salesPopupCampaign = Campaign::where('shop', $store->shopify_domain)->where('is_draft', 0)->where('type',
                'sales_popup')->first();
            $exitDiscountCampaign = Campaign::where('shop', $store->shopify_domain)->where('is_draft', 0)->where('type',
                'exit_discount')->first();
            $stickyCartBarCampaign = Campaign::where('shop', $store->shopify_domain)->where('is_draft',
                0)->where('type',
                'sticky_cart_bar')->first();
            $promotionBarCampaign = Campaign::where('shop', $store->shopify_domain)->where('is_draft', 0)->where('type',
                'promotion_bar')->first();
            $liveVisitorCounterCampaign = Campaign::where('shop', $store->shopify_domain)->where('is_draft', 0)->where(
                'type',
                'live_visitor_counter'
            )->first();
        } else {
            $salesPopupCampaign = $request->input('previewType') == 'sales_popup' ? Campaign::where(
                'shop',
                $store->shopify_domain
            )->where('type', 'sales_popup')->where('is_draft', 1)->first() : null;

            $exitDiscountCampaign = $request->input('previewType') == 'exit_discount' ? Campaign::where(
                'shop',
                $store->shopify_domain
            )->where('type', 'exit_discount')->where('is_draft', 1)->first() : null;

            $stickyCartBarCampaign = $request->input('previewType') == 'sticky_cart_bar' ? Campaign::where(
                'shop',
                $store->shopify_domain
            )->where('type', 'sticky_cart_bar')->where('is_draft', 1)->first() : null;

            $promotionBarCampaign = $request->input('previewType') == 'promotion_bar' ? Campaign::where(
                'shop',
                $store->shopify_domain
            )->where('type', 'promotion_bar')->where('is_draft', 1)->first() : null;

            $liveVisitorCounterCampaign = $request->input('previewType') == 'live_visitor_counter' ? Campaign::where(
                'shop',
                $store->shopify_domain
            )->where('type', 'live_visitor_counter')->where('is_draft', 1)->first() : null;
        }

        return response()->json([
            'data' => [
                'sales_popup' => [
                    'status' => $salesPopupCampaign ? $salesPopupCampaign->status : 0,
                    'id' => $salesPopupCampaign ? $salesPopupCampaign->id : 0,
                    'options' => $salesPopupCampaign ? $salesPopupCampaign->options : null
                ],
                'exit_discount' => [
                    'status' => $exitDiscountCampaign ? $exitDiscountCampaign->status : 0,
                    'id' => $exitDiscountCampaign ? $exitDiscountCampaign->id : 0,
                    'options' => $exitDiscountCampaign ? $exitDiscountCampaign->options : null
                ],
                'sticky_cart_bar' => [
                    'status' => $stickyCartBarCampaign ? $stickyCartBarCampaign->status : 0,
                    'id' => $stickyCartBarCampaign ? $stickyCartBarCampaign->id : 0,
                    'options' => $stickyCartBarCampaign ? $stickyCartBarCampaign->options : null,
                ],
                'promotion_bar' => [
                    'status' => $promotionBarCampaign ? $promotionBarCampaign->status : 0,
                    'id' => $promotionBarCampaign ? $promotionBarCampaign->id : 0,
                    'options' => $promotionBarCampaign ? $promotionBarCampaign->options : null
                ],
                'live_visitor_counter' => [
                    'status' => $liveVisitorCounterCampaign ? $liveVisitorCounterCampaign->status : 0,
                    'id' => $liveVisitorCounterCampaign ? $liveVisitorCounterCampaign->id : 0,
                    'options' => $liveVisitorCounterCampaign ? $liveVisitorCounterCampaign->options : null
                ],
            ]
        ]);
    }

    public function status(Request $request)
    {
        return response()->json([
            'status' => 0
        ]);

        $shop = $request->get('shopifySession')->getShop();
        $store = Store::query()->where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if ($request->get('type')) {
            $campaign = Campaign::where('shop', $store->shopify_domain)->where('is_draft', 0)->where('type',
                $request->get('type'))->first();

            return response()->json([
                'status' => $campaign ? $campaign->status : 0
            ]);
        }

        $salesPopupCampaign = Campaign::where('shop', $store->shopify_domain)->where('is_draft', 0)->where('type',
            'sales_popup')->first();
        $exitDiscountCampaign = Campaign::where('shop', $store->shopify_domain)->where('is_draft', 0)->where('type',
            'exit_discount')->first();
        $stickyCartBarCampaign = Campaign::where('shop', $store->shopify_domain)->where('is_draft', 0)->where('type',
            'sticky_cart_bar')->first();
        $promotionBarCampaign = Campaign::where('shop', $store->shopify_domain)->where('is_draft', 0)->where('type',
            'promotion_bar')->first();
        $liveVistorCounterCampaign = Campaign::where('shop', $store->shopify_domain)->where('is_draft',
            0)->where('type',
            'live_visitor_counter')->first();

        $statuses = [
            'sales_popup' => $salesPopupCampaign ? $salesPopupCampaign->status : 0,
            'exit_discount' => $exitDiscountCampaign ? $exitDiscountCampaign->status : 0,
            'sticky_cart_bar' => $stickyCartBarCampaign ? $stickyCartBarCampaign->status : 0,
            'promotion_bar' => $promotionBarCampaign ? $promotionBarCampaign->status : 0,
            'live_visitor_counter' => $liveVistorCounterCampaign ? $liveVistorCounterCampaign->status : 0,
        ];

        return response()->json([
            'data' => $statuses
        ]);
    }
}
