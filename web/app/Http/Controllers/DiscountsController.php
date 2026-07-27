<?php

namespace App\Http\Controllers;

use App\Helpers\Leads;
use App\Helpers\Shopify;
use App\Models\Campaign;
use App\Models\Session;
use App\Models\Store;
use App\Providers\StoreUsage;
use App\Services\MixpanelService;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DiscountsController extends Controller
{
    private const CREATE_FIXED_DISCOUNT_MUTATION = <<<'QUERY'
  mutation createDiscountMutation($startDate: DateTime!, $endDate: DateTime!, $code: String!, $value: Decimal!) {
    discountCodeBasicCreate(basicCodeDiscount: {
      title: "Pushy exit intent discount",
      startsAt: $startDate,
      endsAt: $endDate,
      usageLimit: 1,
      appliesOncePerCustomer: true,
      customerSelection: {
        all: true
      }
      code: $code,
      customerGets: {
        value: {
          discountAmount:  {
            amount: $value,
            appliesOnEachItem: false
          }
        }
        items: {
          all: true
        }
      }}) {
      userErrors { field message code }
      codeDiscountNode {
        id
          discount: codeDiscount {
          ... on DiscountCodeBasic {
            title
            summary
            status
            codes (first:10) {
              edges {
                node {
                  code
                }
              }
            }
          }
        }
      }
    }
  }

  QUERY;
    private const CREATE_PERCENTAGE_DISCOUNT_MUTATION = <<<'QUERY'
  mutation createDiscountMutation($startDate: DateTime!, $endDate: DateTime!, $code: String!, $value: Float!) {
    discountCodeBasicCreate(basicCodeDiscount: {
      title: "Pushy exit intent discount",
      startsAt: $startDate,
      endsAt: $endDate,
      usageLimit: 1,
      appliesOncePerCustomer: true,
      customerSelection: {
        all: true
      }
      code: $code,
      customerGets: {
        value: {
          percentage: $value
        }
        items: {
          all: true
        }
      }}) {
      userErrors { field message code }
      codeDiscountNode {
        id
          discount: codeDiscount {
          ... on DiscountCodeBasic {
            title
            summary
            status
            codes (first:10) {
              edges {
                node {
                  code
                }
              }
            }
          }
        }
      }
    }
  }

  QUERY;

    public function store(Request $request, $shop)
    {
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();
        $campaign = Campaign::where('shop', $store->shopify_domain)->where('type', 'exit_discount')->first();

        if (!$campaign) {
            return response()->json([
                'data' => null
            ]);
        }

        $code = strtoupper(Str::random(7));
        $startDate = date('Y-m-d');
        $days = "+{$campaign->options['discountExpiration']} days";
        $endDate = new DateTime($days);
        $endDate = $endDate->format('Y-m-d');

        $store = Store::query()->where('shopify_domain', $shop)->orWhere('domain', $shop)->first();
        $session = Session::query()->where('shop', $store->shopify_domain)->first();

        if ($request->input('discount_type') == 'fixed') {
            $value = $request->input('discount_amount');
            $response = Shopify::queryOrException($shop, $session->access_token, [
                'query' => DiscountsController::CREATE_FIXED_DISCOUNT_MUTATION,
                'variables' => [
                    'startDate' => $startDate,
                    'endDate' => $endDate,
                    'value' => $value,
                    'code' => $code,
                ]
            ]);
        } else {
            $value = $request->input('discount_percentage') / 100;
            $response = Shopify::queryOrException($shop, $session->access_token, [
                'query' => DiscountsController::CREATE_PERCENTAGE_DISCOUNT_MUTATION,
                'variables' => [
                    'startDate' => $startDate,
                    'endDate' => $endDate,
                    'value' => $value,
                    'code' => $code,
                ]
            ]);
        }


        $campaign = Campaign::find($request->input('campaign_id'));

        $campaign->discounts()->create([
            'options' => [
                'code' => $code
            ]
        ]);

        $campaign->order_intents()->create([
            'options' => [
                'ip' => file_get_contents('https://api.ipify.org'),
                'user_agent' => $_SERVER['HTTP_USER_AGENT'],
                'customer_id' => $request->input('customer_id') ? $request->input('customer_id') : 0
            ]
        ]);

        StoreUsage::dispatch($store, 'discount');

        $mixpanel = new MixpanelService();

        $mixpanel->track('Discount Created', $shop, [
            'Campaign Type' => $campaign->type
        ]);


        if ($store->subscription && $campaign->options['collectLeads']) {
            Leads::capture($request, $campaign, $store);
        }


        return $response;
    }
}
