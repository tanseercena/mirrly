<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\TrySession;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrySessionsController extends Controller
{
    /**
     * Aggregated analytics for the Sessions page.
     * Returns KPI totals, funnel stage counts and a time-bucketed trend
     * for the requested range plus the equal-length window before it
     * (used by the UI for comparison values).
     */
    public function analytics(Request $request): JsonResponse
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if (!$store) {
            return response()->json(['error' => 'Store not found'], 404);
        }

        $interval = in_array($request->input('interval'), ['daily', 'weekly', 'monthly'], true)
            ? $request->input('interval')
            : 'daily';

        $to = $request->filled('to')
            ? Carbon::parse($request->input('to'))->endOfDay()
            : Carbon::today()->endOfDay();
        $from = $request->filled('from')
            ? Carbon::parse($request->input('from'))->startOfDay()
            : Carbon::today()->subDays(29)->startOfDay();

        if ($from->gt($to)) {
            [$from, $to] = [$to->copy()->startOfDay(), $from->copy()->endOfDay()];
        }

        // Comparison window: same length, immediately before the selected one
        [$prevFrom, $prevTo] = $this->previousWindow($from, $to);

        $current = $this->windowStats($store->id, $from, $to);
        $previous = $this->windowStats($store->id, $prevFrom, $prevTo);

        // Full per-bucket metric rows for the trend + KPI sparklines
        $currentRows = $this->trendRows($store->id, $from, $to, $interval);
        $previousRows = $this->trendRows($store->id, $prevFrom, $prevTo, $interval);

        return response()->json([
            'data' => [
                'range' => [
                    'from' => $from->toDateString(),
                    'to' => $to->toDateString(),
                    'interval' => $interval,
                ],
                'kpis' => [
                    'sessions' => ['current' => $current['opened'], 'previous' => $previous['opened']],
                    'orders' => ['current' => $current['orders'], 'previous' => $previous['orders']],
                    // Average try-on duration in seconds (started -> completed)
                    'avg_session_length' => ['current' => $current['avg_duration'], 'previous' => $previous['avg_duration']],
                    'funnel' => ['current' => $current, 'previous' => $previous],
                ],
                'trend' => [
                    'interval' => $interval,
                    'current' => array_map(
                        fn ($row) => ['bucket' => $row['bucket'], 'count' => $row['sessions']],
                        $currentRows
                    ),
                    'previous' => array_map(
                        fn ($row) => ['bucket' => $row['bucket'], 'count' => $row['sessions']],
                        $previousRows
                    ),
                    // Full per-bucket metric rows - feeds the KPI card sparklines
                    'metrics' => [
                        'current' => $currentRows,
                        'previous' => $previousRows,
                    ],
                ],
            ],
        ]);
    }

    /**
     * Previous period of equal length, immediately before [$from, $to].
     * Single source of truth for all current-vs-previous comparisons:
     * works uniformly for "today" (yesterday), "last 7 days" (prior 7)
     * and any custom range (N days before its start).
     */
    private function previousWindow(Carbon $from, Carbon $to): array
    {
        $days = $from->diffInDays($to) + 1;
        $prevTo = $from->copy()->subDay()->endOfDay();
        $prevFrom = $prevTo->copy()->subDays($days - 1)->startOfDay();

        return [$prevFrom, $prevTo];
    }

    /**
     * Cumulative funnel counters for one window.
     * Counts come from the milestone timestamps (source of truth), not
     * funnel_stage, so each step includes every session that got at
     * least that far - exactly what the funnel chart needs.
     */
    private function windowStats(int $storeId, Carbon $from, Carbon $to): array
    {
        $row = TrySession::where('store_id', $storeId)
            ->whereBetween('created_at', [$from, $to])
            ->selectRaw('COUNT(*) as opened')
            ->selectRaw('SUM(tryon_started_at IS NOT NULL) as started')
            ->selectRaw('SUM(tryon_completed_at IS NOT NULL) as completed')
            ->selectRaw('SUM(added_to_cart_at IS NOT NULL) as added_to_cart')
            ->selectRaw('SUM(purchased_at IS NOT NULL) as purchased')
            ->selectRaw('SUM(order_id IS NOT NULL) as orders')
            ->selectRaw('COALESCE(AVG(CASE WHEN tryon_started_at IS NOT NULL AND tryon_completed_at IS NOT NULL THEN TIMESTAMPDIFF(SECOND, tryon_started_at, tryon_completed_at) END), 0) as avg_duration')
            ->first();

        return [
            'opened' => (int) ($row->opened ?? 0),
            'started' => (int) ($row->started ?? 0),
            'completed' => (int) ($row->completed ?? 0),
            'added_to_cart' => (int) ($row->added_to_cart ?? 0),
            'purchased' => (int) ($row->purchased ?? 0),
            'orders' => (int) ($row->orders ?? 0),
            'avg_duration' => (int) round($row->avg_duration ?? 0),
        ];
    }

    /**
     * Time-bucketed metric rows. Daily buckets are zero-filled so the
     * chart renders a continuous line; weekly/monthly return raw buckets.
     * Besides session counts, each row carries started/completed/cart/orders
     * totals - the KPI card sparklines are derived from these.
     */
    private function trendRows(int $storeId, Carbon $from, Carbon $to, string $interval): array
    {
        $groupExpr = match ($interval) {
            'weekly' => "DATE_FORMAT(created_at, '%x-%v')",
            'monthly' => "DATE_FORMAT(created_at, '%Y-%m')",
            default => 'DATE(created_at)',
        };

        $rows = TrySession::where('store_id', $storeId)
            ->whereBetween('created_at', [$from, $to])
            ->selectRaw("$groupExpr as bucket")
            ->selectRaw('COUNT(*) as sessions')
            ->selectRaw('SUM(tryon_started_at IS NOT NULL) as started')
            ->selectRaw('SUM(tryon_completed_at IS NOT NULL) as completed')
            ->selectRaw('SUM(added_to_cart_at IS NOT NULL) as added_to_cart')
            ->selectRaw('SUM(order_id IS NOT NULL) as orders')
            ->groupBy('bucket')
            ->orderBy('bucket')
            ->get()
            ->map(fn ($row) => [
                'bucket' => $row->bucket,
                'sessions' => (int) $row->sessions,
                'started' => (int) ($row->started ?? 0),
                'completed' => (int) ($row->completed ?? 0),
                'added_to_cart' => (int) ($row->added_to_cart ?? 0),
                'orders' => (int) ($row->orders ?? 0),
            ])
            ->keyBy('bucket');

        if ($interval !== 'daily') {
            return $rows->values()->all();
        }

        // Zero-fill missing days so the chart line is continuous
        $series = [];
        foreach (CarbonPeriod::create($from->copy()->startOfDay(), $to->copy()->startOfDay()) as $day) {
            $key = $day->toDateString();
            $row = $rows[$key] ?? null;
            $series[] = [
                'bucket' => $key,
                'sessions' => $row['sessions'] ?? 0,
                'started' => $row['started'] ?? 0,
                'completed' => $row['completed'] ?? 0,
                'added_to_cart' => $row['added_to_cart'] ?? 0,
                'orders' => $row['orders'] ?? 0,
            ];
        }

        return $series;
    }
}
