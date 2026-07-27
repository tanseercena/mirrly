<?php

namespace App\Http\Controllers;

use App\Helpers\Leads;
use App\Models\Campaign;
use App\Models\Lead;
use App\Models\Store;
use App\Services\MixpanelService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LeadsController extends Controller
{
    public function index(Request $request)
    {
        $shop = $request->get('shopifySession')->getShop();
        $store = Store::query()->where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if ($request->get('campaign') == 'all') {
            $campaigns = Campaign::where('shop', $store->shopify_domain)->get();
            $leads = [];
            foreach ($campaigns as $campaign) {
                foreach ($this->getLeads($campaign->id, $request) as $lead) {
                    array_push($leads, $lead);
                }
            }
        } else {
            if ($campaign = Campaign::query()->where('shop', $shop)->where('type',
                $request->get('campaign'))->first()) {

                $campaign_id = $campaign->id;
                $leads = $this->getLeads($campaign_id, $request);
            } else {
                $leads = [];
            }
        }


        return response()->json([
            'data' => [
                'leads' => $leads,
            ]

        ]);
    }

    public function getLeads($campaign_id, $request)
    {
        $query = Lead::query()->where('campaign_id', $campaign_id);

        $leads = $this->getFilteredData($request, $query);

        return $leads;
    }

    public function getFilteredData($request, $query)
    {
        $now = Carbon::now();
        $startOfWeek = $now->copy()->startOfWeek();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfYear = $now->copy()->startOfYear();

        switch ($request->get('filter')) {
            case 'today':
                $query->whereDate('created_at', $now);
                break;
            case 'yesterday':
                $query->whereDate('created_at', $now->subDay());
                break;
            case 'this_week':
                $query->whereBetween('created_at', [$startOfWeek, $now]);
                break;
            case 'last_7_days':
                $query->whereBetween('created_at', [$now->copy()->subDays(7), $now]);
                break;
            case 'last_week':
                $query->whereBetween('created_at', [$startOfWeek->subWeek(), $startOfWeek->subDay()]);
                break;
            case 'this_month':
                $query->whereBetween('created_at', [$startOfMonth, $now]);
                break;
            case 'last_30_days':
                $query->whereBetween('created_at', [$now->copy()->subDays(30), $now]);
                break;
            case 'last_month':
                $query->whereBetween('created_at', [$startOfMonth->subMonth(), $startOfMonth->subDay()]);
                break;
            case 'this_year':
                $query->whereBetween('created_at', [$startOfYear, $now]);
                break;
            case 'last_year':
                $query->whereYear('created_at', $startOfYear->year - 1);
                break;
            case 'all_time':
            default:
                // No filter is applied
        }

        return $query->get();
    }

    public function store(Request $request, $shop)
    {
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();
        $campaign = Campaign::where('shop', $store->shopify_domain)->where('type', 'promotion_bar')->first();
        Log::debug($campaign->options);

        Leads::capture($request, $campaign, $store);
    }

    public function export(Request $request)
    {
        $shop = $request->get('shopifySession')->getShop();
        $mixpanel = new MixpanelService();

        $mixpanel->track('Leads Exported', $shop);
    }
}
