<?php

namespace App\Http\Middleware;

use App\Lib\AuthRedirection;
use App\Models\Session;
use App\Models\Store;
use Closure;
use Illuminate\Http\Request;
use Shopify\Utils;

class EnsureShopifyInstalled
{
    /**
     * Checks if the shop in the query arguments is currently installed.
     *
     * @param  Request  $request
     * @param  Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $shop = $request->query('shop') ? Utils::sanitizeShopDomain($request->query('shop')) : null;

        $appInstalled = $shop && Session::where('shop', $shop)->where('access_token', '<>', null)->exists();
        $isExitingIframe = preg_match("/^ExitIframe/i", $request->path());

        if ($isExitingIframe) {
            if ($ses = Session::where('shop', $shop)->first()) {
                \Log::info("Exit Iframe (Session issue fix): " . $shop);
                if (is_null($ses->scope) || empty($ses->scope)) {
                    $ses->delete();
                    $appInstalled = false;
                }
            }
        }

        return ($appInstalled || $isExitingIframe) ? $next($request) : AuthRedirection::redirect($request);
    }
}
