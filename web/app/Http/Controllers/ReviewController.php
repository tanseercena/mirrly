<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Services\ReviewService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ReviewController extends Controller
{
    protected $reviewService;

    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }

    /**
     * Check if store is eligible for review modal
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkEligibility(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if (!$store) {
            return response()->json([
                'eligible' => false,
                'reason' => 'store-not-found',
                'message' => 'Store not found',
            ], 404);
        }

        $triggerContext = $request->input('trigger_context', 'dashboard');
        $result = $this->reviewService->checkEligibility($store, $triggerContext);

        Log::info("Review eligibility check for store {$store->id}: " . ($result['eligible'] ? 'ELIGIBLE' : 'NOT ELIGIBLE') . " - {$result['reason']}");

        return response()->json($result);
    }

    /**
     * Log review request result after showing modal
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logRequest(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Store not found',
            ], 404);
        }

        $request->validate([
            'response' => 'required|array',
            'response.success' => 'required|boolean',
            'response.code' => 'required|string',
            'response.message' => 'required|string',
            'trigger_context' => 'required|string',
        ]);

        try {
            $reviewRequest = $this->reviewService->logReviewRequest(
                $store,
                $request->input('response'),
                $request->input('trigger_context')
            );

            Log::info("Review request logged for store {$store->id}: success={$reviewRequest->success}, code={$reviewRequest->response_code}");

            return response()->json([
                'success' => true,
                'review_request_id' => $reviewRequest->id,
                'message' => 'Review request logged successfully',
            ]);
        } catch (\Exception $e) {
            Log::error("Failed to log review request: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to log review request',
            ], 500);
        }
    }

    /**
     * Get review request statistics for the store
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStats(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Store not found',
            ], 404);
        }

        $stats = $this->reviewService->getReviewStats($store);

        return response()->json([
            'success' => true,
            'stats' => $stats,
        ]);
    }

    /**
     * Check eligibility for first order trigger
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkFirstOrderEligibility(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if (!$store) {
            return response()->json([
                'eligible' => false,
                'reason' => 'store-not-found',
                'message' => 'Store not found',
            ], 404);
        }

        $result = $this->reviewService->checkFirstOrderEligibility($store);

        Log::info("First order review eligibility check for store {$store->id}: " . ($result['eligible'] ? 'ELIGIBLE' : 'NOT ELIGIBLE') . " - {$result['reason']}");

        return response()->json($result);
    }
}
