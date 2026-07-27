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
            return redirect()->route('api.invalid-token');
        }

        if (($referrer === $store->shopify_domain || $referrer === $store->domain || $referrer === '127.0.0.1') && $request->input('api-token') === $store->api_token) {
            return $next($request);
        }

        return redirect()->away('https://pushy.conversionproplus.com/api/invalid');
    }
}
