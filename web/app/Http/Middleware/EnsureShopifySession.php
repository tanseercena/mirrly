<?php

namespace App\Http\Middleware;

use App\Exceptions\ShopifyBillingException;
use App\Lib\AuthRedirection;
use App\Lib\EnsureBilling;
use App\Lib\TopLevelRedirection;
use Closure;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Shopify\Clients\Graphql;
use Shopify\Context;
use Shopify\Utils;

class EnsureShopifySession
{
    public const ACCESS_MODE_ONLINE = 'online';
    public const ACCESS_MODE_OFFLINE = 'offline';

    public const TEST_GRAPHQL_QUERY = <<<QUERY
    {
        shop {
            name
        }
    }
    QUERY;

    /** How long a successful token validation is reused before re-checking with Shopify. */
    private const TOKEN_VALIDATION_CACHE_SECONDS = 600;

    /**
     * Checks if there is currently an active Shopify session.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $accessMode
     * @return mixed
     */
    public function handle(Request $request, Closure $next, string $accessMode = self::ACCESS_MODE_OFFLINE)
    {
        switch ($accessMode) {
            case self::ACCESS_MODE_ONLINE:
                $isOnline = true;
                break;
            case self::ACCESS_MODE_OFFLINE:
                $isOnline = false;
                break;
            default:
                throw new Exception(
                    "Unrecognized access mode '$accessMode', accepted values are 'online' and 'offline'"
                );
        }

        $shop = Utils::sanitizeShopDomain($request->query('shop', ''));

        try {
            $session = Utils::loadCurrentSession($request->header(), $request->cookie(), $isOnline);
        } catch (\Throwable $e) {
            // A request can arrive without any session token (e.g. a boot
            // request that fired before App Bridge patched fetch). Treat it as
            // unauthenticated and let the redirect flow below respond — never
            // a 500.
            $session = null;
        }

        if ($session && $shop && $session->getShop() !== $shop) {
            // This request is for a different shop. Go straight to login
            return AuthRedirection::redirect($request);
        }

        if ($session && $session->isValid()) {
            if (Config::get('shopify.billing.required')) {
                // The request to check billing status serves to validate that the access token is still valid.
                try {
                    list($hasPayment, $confirmationUrl) =
                        EnsureBilling::check($session, Config::get('shopify.billing'));
                    $proceed = true;

                    if (!$hasPayment) {
                        return TopLevelRedirection::redirect($request, $confirmationUrl);
                    }
                } catch (ShopifyBillingException $e) {
                    $proceed = false;
                }
            } else {
                // Make a request to ensure the access token is still valid. Otherwise, re-authenticate the user.
                $proceed = $this->isTokenStillValid($session);
            }

            if ($proceed) {
                $request->attributes->set('shopifySession', $session);
                return $next($request);
            }
        }

        $bearerPresent = preg_match("/Bearer (.*)/", $request->header('Authorization', ''), $bearerMatches);
        if (!$shop) {
            if ($session) {
                $shop = $session->getShop();
            } elseif (Context::$IS_EMBEDDED_APP) {
                if ($bearerPresent !== false) {
                    $payload = Utils::decodeSessionToken($bearerMatches[1]);
                    $shop = parse_url($payload['dest'], PHP_URL_HOST);
                }
            }
        }

        // Return JSON response for API calls so frontend can handle the redirect
        if ($request->expectsJson() || $request->ajax() || $request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'error' => 'authentication_required',
                'redirect' => true,
                'url' => "/api/auth?shop=$shop",
                'message' => 'App needs to be re-authenticated or permissions are missing'
            ], 401);
        }

        return TopLevelRedirection::redirect($request, "/api/auth?shop=$shop");
    }

    /**
     * Live-validating the token costs a round trip to Shopify on every request.
     * The dashboard fires several parallel API requests on load and each would
     * otherwise pay that cost, so a successful validation is cached briefly.
     * A short lock keeps those parallel requests from pinging Shopify
     * simultaneously (cache stampede) — the first one validates, the rest
     * read the cached result.
     */
    private function isTokenStillValid($session): bool
    {
        $cacheKey = 'shopify_token_valid:' . md5($session->getShop() . '|' . $session->getAccessToken());

        try {
            if (Cache::get($cacheKey)) {
                return true;
            }
        } catch (\Throwable $e) {
            // Cache unavailable (e.g. Redis down) — validate live below.
        }

        $lock = null;
        try {
            $lock = Cache::lock($cacheKey . ':lock', 10);
            $lock->block(5);
        } catch (\Throwable $e) {
            // Locks unsupported or timed out — fall back to a plain live validation.
            return $this->validateTokenLive($session, $cacheKey);
        }

        try {
            try {
                if (Cache::get($cacheKey)) {
                    return true; // another request finished validating while we waited
                }
            } catch (\Throwable $e) {
            }

            return $this->validateTokenLive($session, $cacheKey);
        } finally {
            try {
                $lock->release();
            } catch (\Throwable $e) {
            }
        }
    }

    private function validateTokenLive($session, string $cacheKey): bool
    {
        $client = new Graphql($session->getShop(), $session->getAccessToken());
        $valid = $client->query(self::TEST_GRAPHQL_QUERY)->getStatusCode() === 200;

        if ($valid) {
            try {
                Cache::put($cacheKey, true, now()->addSeconds(self::TOKEN_VALIDATION_CACHE_SECONDS));
            } catch (\Throwable $e) {
            }
        }

        return $valid;
    }
}
