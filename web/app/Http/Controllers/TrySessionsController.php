<?php

namespace App\Http\Controllers;

use App\Helpers\Shopify;
use App\Models\Product;
use App\Models\Store;
use App\Models\TrySession;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrySessionsController extends Controller
{
    /**
     * Latest try-on sessions with their product — feeds the dashboard's
     * "Recent sessions" table.
     */
    public function recent(Request $request): JsonResponse
    {
        $store = $this->resolveStore($request);

        if (!$store) {
            return response()->json(['error' => 'Store not found'], 404);
        }

        $sessions = TrySession::where('store_id', $store->id)
            ->with('product:id,title,shopify_product')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        return response()->json([
            'data' => $sessions->map(fn ($session) => [
                'id' => $session->id,
                'product' => $session->product?->title,
                'product_image' => $session->product?->shopify_product['featuredImage']['url'] ?? null,
                'variant' => $this->variantTitle(
                    $session->product?->shopify_product,
                    $session->shopify_variant_id
                ),
                'created_at' => $session->created_at?->toIso8601String(),
                'duration_seconds' => $session->duration_seconds,
                'device_type' => $session->device_type,
                'browser' => $session->browser,
                'result' => $this->resultSlug($session),
            ])->all(),
        ]);
    }

    /**
     * Per-product session aggregates over a range — feeds the Sessions
     * page's top / lowest performing products tables.
     */
    public function productPerformance(Request $request): JsonResponse
    {
        $store = $this->resolveStore($request);

        if (!$store) {
            return response()->json(['error' => 'Store not found'], 404);
        }

        $to = $request->filled('to')
            ? Carbon::parse($request->input('to'))->endOfDay()
            : Carbon::today()->endOfDay();
        $from = $request->filled('from')
            ? Carbon::parse($request->input('from'))->startOfDay()
            : Carbon::today()->subDays(29)->startOfDay();

        $rows = TrySession::where('try_sessions.store_id', $store->id)
            ->whereBetween('try_sessions.created_at', [$from, $to])
            ->join('products', 'products.id', '=', 'try_sessions.product_id')
            ->groupBy('products.id')
            ->selectRaw('try_sessions.product_id as product_id')
            ->selectRaw('products.title as title')
            ->selectRaw('products.shopify_product as payload')
            ->selectRaw('COUNT(*) as sessions')
            ->selectRaw('SUM(tryon_started_at IS NOT NULL) as started')
            ->selectRaw('SUM(tryon_completed_at IS NOT NULL) as completed')
            ->selectRaw('SUM(added_to_cart_at IS NOT NULL) as added_to_cart')
            ->get()
            ->map(fn ($row) => [
                'id' => (int) $row->product_id,
                'name' => $row->title,
                'image' => json_decode((string) $row->payload, true)['featuredImage']['url'] ?? null,
                'sessions' => (int) $row->sessions,
                'completion' => $row->sessions > 0
                    ? round(((int) $row->completed / $row->sessions) * 100, 1)
                    : 0,
                'addToCart' => (int) $row->started > 0
                    ? round(((int) $row->added_to_cart / $row->started) * 100, 1)
                    : 0,
            ]);

        // Precomputed rankings per metric, so the UI can switch between
        // them without a refetch. Lowest lists exclude the products already
        // shown in the matching top list, keeping the tables disjoint.
        $topSessions = $rows->sortByDesc('sessions')->take(5)->values();
        $topCompletion = $rows->sortBy([['completion', 'desc'], ['sessions', 'desc']])->take(5)->values();
        $topAddToCart = $rows->sortBy([['addToCart', 'desc'], ['sessions', 'desc']])->take(5)->values();

        return response()->json([
            'data' => [
                'top' => [
                    'sessions' => $topSessions->all(),
                    'completion' => $topCompletion->all(),
                    'addToCart' => $topAddToCart->all(),
                ],
                'lowest' => [
                    'sessions' => $this->lowestRows($rows, $topSessions, [['sessions', 'asc'], ['completion', 'desc']]),
                    'completion' => $this->lowestRows($rows, $topCompletion, [['completion', 'asc'], ['sessions', 'desc']]),
                    'addToCart' => $this->lowestRows($rows, $topAddToCart, [['addToCart', 'asc'], ['sessions', 'desc']]),
                ],
            ],
        ]);
    }

    /**
     * Lowest-performing rows for one metric, excluding the products already
     * shown in that metric's top list.
     */
    private function lowestRows($rows, $top, array $sort): array
    {
        $topIds = $top->pluck('id');

        return $rows
            ->reject(fn ($row) => $topIds->contains($row['id']))
            ->sortBy($sort)
            ->take(5)
            ->values()
            ->all();
    }

    /**
     * Session performance for ONE product over a range plus the equal-length
     * window before it — feeds the product drawer's performance stats.
     */
    public function productStats(Request $request): JsonResponse
    {
        $store = $this->resolveStore($request);

        if (!$store) {
            return response()->json(['error' => 'Store not found'], 404);
        }

        $product = Product::query()
            ->where('store_id', $store->id)
            ->where('id', (int) $request->input('product_id'))
            ->first();

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $to = $request->filled('to')
            ? Carbon::parse($request->input('to'))->endOfDay()
            : Carbon::today()->endOfDay();
        $from = $request->filled('from')
            ? Carbon::parse($request->input('from'))->startOfDay()
            : Carbon::today()->subDays(29)->startOfDay();

        [$prevFrom, $prevTo] = $this->previousWindow($from, $to);

        $statsFor = fn (Carbon $rangeFrom, Carbon $rangeTo) => TrySession::where('store_id', $store->id)
            ->where('product_id', $product->id)
            ->whereBetween('created_at', [$rangeFrom, $rangeTo])
            ->selectRaw('COUNT(*) as sessions')
            ->selectRaw('SUM(tryon_completed_at IS NOT NULL) as completed')
            ->selectRaw('COALESCE(AVG(duration_seconds), 0) as avg_duration')
            ->first();

        $current = $statsFor($from, $to);
        $previous = $statsFor($prevFrom, $prevTo);

        $completionRate = fn ($row) => $row->sessions > 0
            ? round(($row->completed / $row->sessions) * 100, 1)
            : 0;

        return response()->json([
            'data' => [
                'sessions' => [
                    'current' => (int) $current->sessions,
                    'previous' => (int) $previous->sessions,
                ],
                'completion_rate' => [
                    'current' => $completionRate($current),
                    'previous' => $completionRate($previous),
                ],
                'avg_session_length' => [
                    'current' => (int) round($current->avg_duration),
                    'previous' => (int) round($previous->avg_duration),
                ],
            ],
        ]);
    }

    /**
     * Furthest funnel milestone reached — one slug the UI can translate
     * and tone-map.
     */
    private function resultSlug(TrySession $session): string
    {
        if ($session->purchased_at) {
            return 'purchased';
        }
        if ($session->added_to_cart_at) {
            return 'added_to_cart';
        }
        if ($session->tryon_completed_at) {
            return 'completed';
        }
        if ($session->tryon_started_at) {
            return 'started';
        }

        return 'opened';
    }

    /**
     * Resolve a variant's title from the product's stored payload.
     */
    private function variantTitle($payload, $shopifyVariantId): ?string
    {
        if (!$payload || !$shopifyVariantId) {
            return null;
        }

        foreach ($payload['variants'] ?? [] as $variant) {
            if (Shopify::numericId($variant['id'] ?? '') === (int) $shopifyVariantId) {
                return $variant['title'] ?? null;
            }
        }

        return null;
    }

    private function resolveStore(Request $request): ?Store
    {
        $shop = $request->get('shopifySession')?->getShop();

        return Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();
    }

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
