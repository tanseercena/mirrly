<?php

namespace App\Http\Middleware;

use App\Lib\AuthRedirection;
use App\Models\Session as SessionModel;
use App\Lib\DbSessionStorage;
use Closure;
use Illuminate\Http\Request;
use Shopify\Auth\OAuth;
use Shopify\Utils;
use Shopify\Context;
use Carbon\Carbon;

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

        $isExitingIframe = preg_match("/^ExitIframe/i", $request->path());

        if ($isExitingIframe) {
            if ($ses = SessionModel::where('shop', $shop)->first()) {
                \Log::info("Exit Iframe (Session issue fix): " . $shop);
                if (is_null($ses->scope) || empty($ses->scope)) {
                    $ses->delete();
                    return AuthRedirection::redirect($request);
                }
            }
            return $next($request);
        }

        if (!$shop) {
            return AuthRedirection::redirect($request);
        }

        // Check if shop has a session with access token
        $sessionRecord = SessionModel::where('shop', $shop)->where('access_token', '<>', null)->first();

        if (!$sessionRecord) {
            return AuthRedirection::redirect($request);
        }

        // Load the full session to check expiry
        $sessionStorage = new DbSessionStorage();
        $session = $sessionStorage->loadSession($sessionRecord->session_id);

        if (!$session) {
            \Log::warning("Session exists in DB but failed to load: {$shop}");
            return AuthRedirection::redirect($request);
        }

        // Check if access token is expired or will expire soon (within 5 minutes)
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

        return $next($request);
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