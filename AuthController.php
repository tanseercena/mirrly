<?php

namespace App\Http\Controllers;

use App\Lib\AuthRedirection;
use App\Mail\AppInstalled;
use App\Models\Session;
use App\Models\Store;
use App\Services\MailchimpService;
use App\Services\MixpanelService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Shopify\Auth\OAuth;
use Shopify\Clients\Rest;
use Shopify\Utils;
use Shopify\Webhooks\Registry;
use App\Helpers\PumbleAlert;
use Shopify\Webhooks\Topics;

class AuthController extends Controller
{
    public function sendAppInstallAlert($store)
    {
        \Log::info("INSIDE APP INSTALL ALERT");

        $date = now()->format('M j, Y');
        $time = now()->format('g:i A T');

        $message = <<<MD
    🎉 **New App Installation**

    **{$store->shopify_domain}** has installed the app!

    ### 🏪 Store Information
    • Domain: `{$store->shopify_domain}`
    • Email: {$store->email}
    • Store ID: #{$store->id}
    • Current Plan: {$store->shopify_plan}
    • Date: {$date}
    • Time: {$time}

    ### 🔗 Admin Actions
    • View Store Details:
      https://your-admin-panel.com/stores/{$store->id}

    • Contact Store:
      https://your-admin-panel.com/stores/{$store->id}/contact
    MD;

        try {
            PumbleAlert::send($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send new install Pumble alert: ' . $e->getMessage());

            // Fallback simple message
            PumbleAlert::send("🎉 New app installation: {$store->shopify_domain} ({$store->shopify_plan})");
        }
    }

    public function request(Request $request)
    {
        $shop = Utils::sanitizeShopDomain($request->query('shop'));
        $store = Store::query()->where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        // Delete any previously created OAuth sessions that were not completed (don't have an access token)
        Session::where('shop', $store->shopify_domain)->where('access_token', null)->delete();

        return AuthRedirection::redirect($request);
    }

    public function install(Request $request)
    {
        $session = OAuth::callback(
            $request->cookie(),
            $request->query(),
            ['App\Lib\CookieHandler', 'saveShopifyCookie'],
        );

        \Log::info("INSTALLING APP");

        $host = $request->query('host');
        $shop = Utils::sanitizeShopDomain($request->query('shop'));

        $response = Registry::register('/api/webhooks', Topics::APP_UNINSTALLED, $shop, $session->getAccessToken());
        // if ($response->isSuccess()) {
        //     Log::debug("Registered APP_UNINSTALLED webhook for shop $shop");
        // } else {
        //     Log::error(
        //         "Failed to register APP_UNINSTALLED webhook for shop $shop with response body: " .
        //             print_r($response->getBody(), true)
        //     );
        // }

        // Register all needed webhooks
        Registry::register('/api/webhooks', Topics::APP_SUBSCRIPTIONS_UPDATE, $shop, $session->getAccessToken());
        Registry::register('/api/webhooks', Topics::ORDERS_CREATE, $shop, $session->getAccessToken());

        $client = new Rest($session->getShop(), $session->getAccessToken());
        $result = $client->get('shop');

        $shopData = $result->getDecodedBody()['shop'];
        $mixpanel = new MixpanelService();


        if ($store = Store::where('shopify_domain', $session->getShop())->orWhere('domain',
            $session->getShop())->first()) {
            $store->uninstalled_at = null;
        } else {
            $store = Store::create([
                'shopify_domain' => $session->getShop(),
                'shopify_id' => $shopData['id'],
                'email' => $shopData['email'],
                'name' => $shopData['name'],
                'domain' => $shopData['domain'],
                'primary_locale' => $shopData['primary_locale'],
                'country' => $shopData['country_name'],
                'owner' => $shopData['shop_owner'],
                'money_format' => $shopData['money_format'],
                'money_with_currency_format' => $shopData['money_with_currency_format'],
                'shopify_plan' => $shopData['plan_display_name'],
                'timezone' => $shopData['timezone'],
                'api_token' => bin2hex(random_bytes(32)),
                'per_file_limit' => 104857600, 
                'digital_products_limit' => 20,
                'digital_lotteries_limit' => 1,
                'file_storage_limit' => 5368709120, 
                'orders_per_month' => 30,
                'reply_to_email' =>  $shopData['email'],
            ]);
            \Log::info("SENDING PUMBLE");
            $mixpanel->addUser($store);
            

        }

        try {
            Mail::to(config('app.new_install_email'))->send(new AppInstalled($store));
        } catch (Exception $e) {
            Log::error("Error sending mail: ".$e->getMessage());
        }

        $mixpanel->track('Installed App', $store->shopify_domain);

        $mailchimp = new MailchimpService($store);

        $mailchimp->addSubscriber()
            ->removeTag(config('app.uninstalled_tag'))
            ->addTag(config('app.active_tag'))
            ->addTag(config('app.cpp_tag'))
            ->addTag(config('app.installed_tag'));

        $redirectUrl = Utils::getEmbeddedAppUrl($host);

        $redirectUrl .= '/plans';

        return redirect($redirectUrl);
    }
}
