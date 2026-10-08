<?php

namespace App\Http\Middleware;

use App\Models\Store;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureApiTokenIsValid
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $referrer = parse_url($request->headers->get('referer'), PHP_URL_HOST);
        $store = Store::where('shopify_domain', $request->input('shop'))->orWhere('domain',
            $request->input('shop'))->first();

        if (!$store) {
            return response()->json(['error' => 'Store not found'], 404);
        }

        // The app's own host is legitimate too: the onboarding Step 4 live
        // test serves the same widget from public/tryon on this domain, so
        // its referer is the app host rather than the shop's.
        $allowedReferrers = array_filter([
            $store->shopify_domain,
            $store->domain,
            '127.0.0.1',
            'localhost',
            parse_url((string) config('app.url'), PHP_URL_HOST) ?: null,
        ]);

        if (in_array($referrer, $allowedReferrers, true) && $request->input('api-token') === $store->api_token) {
            return $next($request);
        }

        return response()->json(['error' => 'Invalid API token'], 401);
    }
}
