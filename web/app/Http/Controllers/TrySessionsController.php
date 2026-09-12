<?php

namespace App\Http\Controllers;

use App\Helpers\Shopify;
use App\Lib\ConfigToken;
use App\Models\Product;
use App\Models\Store;
use App\Models\TrySession;
use App\Services\DecartService;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use RuntimeException;

class TrySessionsController extends Controller
{
    // Client-reported funnel events → try_sessions columns. camera_opened is
    // deliberately absent (written at session creation); purchased/abandoned
    // are server-side only (orders webhook / completion logic).
    private const EVENT_COLUMNS = [
        'tryon_started' => 'tryon_started_at',
        'tryon_completed' => 'tryon_completed_at',
        'added_to_cart' => 'added_to_cart_at',
    ];

    private const STAGE_RANK = [
        'opened' => 0,
        'started' => 1,
        'completed' => 2,
        'added_to_cart' => 3,
        'purchased' => 4,
        'abandoned' => 5,
    ];

    /**
     * Storefront POST /api/{shop}/event — funnel milestones sent fire-and-forget
     * (sendBeacon). Milestone timestamps are only set once and funnel_stage
     * only moves forward, so beacon retries can never regress a session.
     */
    public function event(Request $request, $shop)
    {
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();
        if (!$store) {
            return response()->json(['error' => 'Store not found'], 404);
        }

        $event = $request->input('event');
        if (!isset(self::EVENT_COLUMNS[$event])) {
            return response()->json(['error' => 'Unknown event'], 400);
        }

        $session = TrySession::where('store_id', $store->id)
            ->where('session_token', $request->input('session_token'))
            ->first();
        if (!$session) {
            return response()->json(['error' => 'Session not found'], 404);
        }

        $update = [];
        $column = self::EVENT_COLUMNS[$event];
        if (!$session->{$column}) {
            $update[$column] = now();
        }

        if ($event === 'tryon_completed' && $request->filled('duration_seconds')) {
            $update['duration_seconds'] = max(0, (int) $request->input('duration_seconds'));
        }

        if ($event === 'added_to_cart' && $request->filled('cart_token')) {
            $update['cart_token'] = (string) $request->input('cart_token');
        }

        $newStage = match ($event) {
            'tryon_started' => 'started',
            'tryon_completed' => 'completed',
            'added_to_cart' => 'added_to_cart',
        };
        if (self::STAGE_RANK[$newStage] > (self::STAGE_RANK[$session->funnel_stage] ?? 0)) {
            $update['funnel_stage'] = $newStage;
        }

        if ($update) {
            $session->update($update);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Storefront POST /api/{shop}/session. The moment this call lands is the
     * camera_opened funnel event (the session row's camera_opened_at write).
     * Verifies the /config-issued token, checks the product is try-on able,
     * mints a scoped Decart client token and returns everything the browser
     * needs to open the camera and connect.
     */
    public function start(Request $request, $shop)
    {
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();
        if (!$store) {
            return response()->json(['error' => 'Store not found'], 404);
        }

        // Integrity check: ties this call back to the exact /config response
        // the shopper was shown — /session can't be reached with an arbitrary
        // product_id without going through /config first.
        $claims = ConfigToken::verify($request->input('config_token'));
        $productId = (string) ($claims['product_id'] ?? '');
        if (!$claims || ($claims['shop'] ?? null) !== $shop || $productId === '') {
            return response()->json(['error' => 'Invalid or expired config token'], 401);
        }

        $variantId = (string) ($request->input('variant_id') ?: $claims['variant_id']);

        // A product without try_on enabled can't be tried on, even if someone
        // crafts the request directly.
        $product = Product::where('store_id', $store->id)
            ->where('shopify_product_id', $productId)
            ->where('try_on', true)
            ->first();
        if (!$product) {
            return response()->json(['error' => 'Try-on is not available for this product'], 404);
        }

        // Client tokens are single-use and short-lived, so a shopper who steps
        // out of frame and back in needs a fresh one — but against the SAME
        // session row (one row per shopper visit, not per connection).
        // Unknown or mismatched tokens just fall through to a new row.
        $session = TrySession::where('session_token', (string) $request->input('session_token'))
            ->where('store_id', $store->id)
            ->where('product_id', $product->id)
            ->first();

        $modelName = (string) config('services.decart.model', 'lucy-vton-latest');
        $maxDuration = max(30, (int) config('services.decart.max_session_duration', 30));

        // Garment reference image for the try-on model — the storefront URL
        // the browser converts to a Blob and applies post-connect via
        // setImage (realtime sessions don't accept files-API ids). Non-fatal:
        // without it the session runs prompt-only.
        $referenceImageUrl = app(DecartService::class)->resolveReferenceImageUrl(
            $product,
            ctype_digit($variantId) ? (int) $variantId : null
        );

        try {
            $clientToken = app(DecartService::class)->createClientToken(
                $modelName,
                $this->storeOrigins($store),
                300,
                $maxDuration
            );
        } catch (RuntimeException) {
            return response()->json(['error' => 'Failed to prepare try-on session'], 502);
        }

        if (empty($clientToken['apiKey'])) {
            return response()->json(['error' => 'Failed to prepare try-on session'], 502);
        }

        if ($session) {
            $session->connection_count += 1;
            $session->last_connected_at = now();
            $session->save();
        } else {
            // Create the row only after the token mint succeeded, so a Decart
            // failure can't leave an orphaned session behind.
            $session = TrySession::create([
                'store_id' => $store->id,
                'product_id' => $product->id,
                'shopify_variant_id' => ctype_digit($variantId) ? (int) $variantId : null,
                'session_token' => (string) Str::uuid(),
                'funnel_stage' => 'opened',
                'camera_opened_at' => now(),
                'last_connected_at' => now(),
                'device_type' => in_array($request->input('device_type'), ['mobile', 'desktop', 'tablet'], true)
                    ? $request->input('device_type')
                    : 'unknown',
            ]);
        }

        return response()->json([
            'session_token' => $session->session_token,
            'client_token' => $clientToken['apiKey'],
            'model_name' => $modelName,
            'prompt' => $this->buildPrompt($product, $variantId),
            'reference_image_url' => $referenceImageUrl,
            'max_duration_seconds' => $maxDuration,
        ]);
    }

    /**
     * The browser connects to Decart from the storefront, so the client token
     * must be scoped to the store's own web origins.
     */
    private function storeOrigins(Store $store): array
    {
        return array_map(
            fn ($domain) => 'https://' . $domain,
            array_filter([$store->shopify_domain, $store->domain])
        );
    }

    private function buildPrompt(Product $product, string $variantId): string
    {
        $variantTitle = $this->variantTitle($product->shopify_product, $variantId);

        $item = trim(
            ($variantTitle && $variantTitle !== 'Default Title' ? $variantTitle . ' ' : '')
            . $product->title
        );

        // Decart's VTON prompting guide: realtime sessions respond best to
        // explicit "substitute" instructions that reference the garment image.
        $description = collect([$product->style_hint, $item])->filter()->implode(' ');

        return trim("Substitute the person's current outfit with the {$description} from the reference garment image.");
    }

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
