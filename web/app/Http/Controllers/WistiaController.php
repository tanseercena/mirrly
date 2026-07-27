<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Store;
use App\Models\Setting;
use App\Models\Session;

class WistiaController extends Controller
{
    public function connect(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();
        $state = encrypt($shop);

        $authUrl = "https://app.wistia.com/oauth/authorize?" . http_build_query([
            'client_id' => config('services.wistia.client_id'),
            'redirect_uri' => config('services.wistia.redirect_uri'),
            'response_type' => 'code',
            'state' => $state
        ]);

        return response()->json([
            'url' => $authUrl,
        ]);
    }

    public function callback(Request $request)
    {
        $code = $request->query('code');
        $shop = decrypt($request->query('state'));
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if (!$store) {
            echo "Store Not Found";
            exit;
        }

        if (!$code) {
            return response('Wistia authorization failed', 400);
        }

        $response = Http::asForm()->post(
            'https://app.wistia.com/oauth/token',
            [
                'grant_type' => 'authorization_code',
                'client_id' => config('services.wistia.client_id'),
                'client_secret' => config('services.wistia.client_secret'),
                'redirect_uri' => config('services.wistia.redirect_uri'),
                'code' => $code,
            ]
        );

        if (!$response->successful()) {
            Log::error('Wistia token error', $response->json());
            return response('Token exchange failed', 500);
        }

        $data = $response->json();
        $data['expires_at'] = now()->addSeconds($data['expires_in']);


        // Save token against Shopify shop

        $settings = $store->setting;

        if (!$settings) {
            return response()->json([
                'message' => 'Settings not found',
            ], 404);
        }

        $store->setting()->update(
            [
                'wistia_integration' => [
                    'wistia_integration_enabled' => $settings->wistia_integration['wistia_integration_enabled'] ?? false,
                    'token_data' => $data,
                ],
            ]
        );

        // Closing tab when token exchanged.
        return response('<script>window.close()</script>');
    }

    public function getValidWistiaToken($store)
    {
        if (!$store->setting->wistia_integration['token_data']['access_token']) {
            throw new \Exception("Wistia not connected");
        }

        if (isset($store->setting->wistia_integration['token_data']['expires_at']) && now()->gte($store->setting->wistia_integration['token_data']['expires_at'])) {
            $newTokenData = $this->refreshWistiaToken($store->setting->wistia_integration['token_data']['refresh_token']);

            $wistiaIntegration = $store->setting->wistia_integration ?? [];

            $wistiaIntegration['token_data']['access_token'] = $newTokenData['access_token'];

            $wistiaIntegration['token_data']['expires_in'] = $newTokenData['expires_in'];

            $wistiaIntegration['token_data']['expires_at'] =
                now()->addSeconds($newTokenData['expires_in']);

            $wistiaIntegration['token_data']['refresh_token'] =
                $newTokenData['refresh_token']
                ?? $wistiaIntegration['token_data']['refresh_token'];

            $store->setting->update([
                'wistia_integration' => $wistiaIntegration
            ]);
        }

        return $store->setting->wistia_integration['token_data']['access_token'];
    }

    private function refreshWistiaToken($refreshToken)
    {
        $response = Http::asForm()->post('https://api.wistia.com/oauth/token', [
            'grant_type' => 'refresh_token',
            'refresh_token' => $refreshToken,
            'client_id' => config('services.wistia.client_id'),
            'client_secret' => config('services.wistia.client_secret'),
        ]);

        if ($response->failed()) {
            throw new \Exception('Wistia refresh token failed');
        }

        return $response->json();
    }

    public function fetchAllWistiaVideos(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();
        $store = Store::with("setting")->where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if (!$store || !$store->setting->wistia_integration['token_data']['access_token']) {
            return response()->json([
                'success' => false,
                'message' => 'Wistia not connected'
            ], 401);
        }

        try {
            $token = $this->getValidWistiaToken($store);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'Accept' => 'application/json'
            ])->get('https://api.wistia.com/v1/medias.json');

            if ($response->failed()) {
                return response()->json([
                    'success' => false,
                    'error' => $response->json()
                ], 400);
            }
            $allVideos = [];
            $data = $response->json();

            $allVideos = array_merge($allVideos, $data);

            return response()->json([
                'success' => true,
                'total' => count($allVideos),
                'videos' => $response->json()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => ['error' => $e->getMessage()]
            ], 400);
        }
    }

    public function delete(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        $setting = $store->setting()->first();
        $wistia_enable_status = $setting?->wistia_integration["wistia_integration_enabled"] ?? [];
        $wistiaAccountIntegration = $setting?->wistia_integration ?? [];
        unset($wistiaAccountIntegration['token_data']);

        $setting->update([
            'wistia_integration' => [
                "wistia_integration_enabled" => $wistia_enable_status
            ]
        ]);
    }
}
