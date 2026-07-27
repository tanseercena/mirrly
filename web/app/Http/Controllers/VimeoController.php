<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Session;
use App\Models\Store;
use Illuminate\Support\Facades\Http;
use App\Models\Setting;
use Log;

class VimeoController extends Controller
{
    public function connect(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();
        $state = encrypt($shop);

        $redirectUri = config('services.vimeo.redirect_uri');

        $authUrl = 'https://api.vimeo.com/oauth/authorize?' . http_build_query([
            'client_id'     => config('services.vimeo.client_id'),
            'redirect_uri'  => $redirectUri,
            'response_type' => 'code',
            'scope'         => 'public private video_files interact edit',
            'state' => $state,
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
            return response('Vimeo authorization failed', 400);
        }

        $response = Http::asForm()
            ->withBasicAuth(
                config('services.vimeo.client_id'),
                config('services.vimeo.client_secret')
            )
            ->post('https://api.vimeo.com/oauth/access_token', [
                'grant_type'   => 'authorization_code',
                'code'         => $code,
                'redirect_uri' => config('services.vimeo.redirect_uri'),
            ]);

        if (!$response->successful()) {
            Log::error('Vimeo token error', $response->json());
            return response('Token exchange failed', 500);
        }

        $data = $response->json();


        // Save token against Shopify shop

        $settings = $store->setting;

        if (!$settings) {
            return response()->json([
                'message' => 'Settings not found',
            ], 404);
        }

        $store->setting()->update(
            [
                'vimeo_integration' => [
                    'vimeo_integration_enabled' => $settings->vimeo_integration['vimeo_integration_enabled'] ?? false,
                    'token_data' => $data,
                ],
            ]
        );

        return response('<script>window.close()</script>');
    }

    public function fetchAllVimeoVideos(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();
        $store = Store::with("setting")->where('shopify_domain', $shop)->orWhere('domain', $shop)->first();


        if (!$store || !$store->setting->vimeo_integration["token_data"]["access_token"]) {
            return response()->json(['error' => 'Vimeo not connected'], 401);
        }

        $access_token = $store->setting->vimeo_integration["token_data"]["access_token"] ?? null;
        $allVideos = [];
        $page = 1;
        $perPage = 100;

        do {

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $access_token,
                'Accept' => 'application/vnd.vimeo.*+json;version=3.4'
            ])->get('https://api.vimeo.com/me/videos', [
                'page' => $page,
                'per_page' => $perPage,
                'fields' => 'name,uri,link,duration,pictures'
            ]);

            if ($response->failed()) {
                return response()->json([
                    'error' => 'Vimeo API failed',
                    'details' => $response->json()
                ], 400);
            }

            $data = $response->json()['data'];

            $allVideos = array_merge($allVideos, $data);

            $hasMorePages = count($data) === $perPage;

            $page++;
        } while ($hasMorePages);

        return response()->json([
            'success' => true,
            'total' => count($allVideos),
            'videos' => $allVideos
        ]);
    }

    public function delete(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        $setting = $store->setting()->first();
        $vimeo_enable_status = $setting?->vimeo_integration["vimeo_integration_enabled"] ?? [];
        $vimeoAccountIntegration = $setting?->vimeo_integration ?? [];
        unset($vimeoAccountIntegration['token_data']);

        $setting->update([
            'vimeo_integration' => [
                "vimeo_integration_enabled" => $vimeo_enable_status
            ]
        ]);
    }
}
