<?php

namespace App\Http\Middleware;

use App\Exceptions\ShopifyBillingException;
use App\Lib\AuthRedirection;
use App\Lib\DbSessionStorage;
use App\Lib\EnsureBilling;
use App\Lib\TopLevelRedirection;
use Carbon\Carbon;
use Closure;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Shopify\Auth\OAuth;
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
        $session = Utils::loadCurrentSession($request->header(), $request->cookie(), $isOnline);

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
                $client = new Graphql($session->getShop(), $session->getAccessToken());
                $response = $client->query(self::TEST_GRAPHQL_QUERY);

                $proceed = $response->getStatusCode() === 200;
            }

            if ($proceed) {
                $request->attributes->set('shopifySession', $session);
                return $next($request);
            }
        }

        // Check if access token is expired or will expire soon (within 5 minutes)
        $sessionStorage = new DbSessionStorage();
        if ($this->isAccessTokenExpired($session)) {
            \Log::info("Access token expired for {$shop}, attempting refresh...");

            // Check if we have a refresh token available
            if ($session->getRefreshToken()) {
                // Check if refresh token is still valid
                if (!$this->isRefreshTokenExpired($session)) {
                    try {
                        // Refresh the access token
                        $newSession = OAuth::refreshAccessToken($session);
                        \Log::info("Successfully refreshed access token for {$shop}");

                        // Save the refreshed session to database
                        $sessionStorage->storeSession($newSession);
                        \Log::info("Saved refreshed session for {$shop}");

                        // Continue with the refreshed session
                        return $next($request);

                    } catch (\Exception $e) {
                        \Log::error("Failed to refresh access token for {$shop}: " . $e->getMessage());
                        // Fall through to re-auth
                    }
                } else {
                    \Log::warning("Refresh token expired for {$shop}");
                }
            }

            // No refresh token available or refresh failed - need to re-authenticate
            \Log::info("Session expired for {$shop}, redirecting to re-authenticate");
            return AuthRedirection::redirect($request);
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
     * Check if access token is expired or will expire soon
     */
    protected function isAccessTokenExpired(\Shopify\Auth\Session $session): bool
    {
        $expires = $session->getExpires();
        if (!$expires) {
            return false; // Non-expiring offline token
        }

        // Consider expired if within 5 minutes of expiry
        $expiryBuffer = Carbon::now()->addMinutes(5);
        return Carbon::now()->isAfter($expires) || $expiryBuffer->isAfter($expires);
    }

    /**
     * Check if refresh token is expired
     */
    protected function isRefreshTokenExpired(\Shopify\Auth\Session $session): bool
    {
        $expiresAt = $session->getRefreshTokenExpiresAt();
        if (!$expiresAt) {
            return false; // Shouldn't happen if we have a refresh token
        }

        return Carbon::now()->isAfter($expiresAt);
    }
}
