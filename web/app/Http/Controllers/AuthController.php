<?php

namespace App\Http\Controllers;

use App\Lib\AuthRedirection;
use App\Mail\AppInstalled;
use App\Models\Session;
use App\Models\Store;
use App\Services\BrevoService;
use App\Services\MailchimpService;
use App\Services\MixpanelService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Shopify\Auth\OAuth;
use Shopify\Clients\Rest;
use Shopify\Utils;
use Shopify\Webhooks\Registry;
use Shopify\Webhooks\Topics;
use Shopify\Context;
use Spatie\SlackAlerts\Facades\SlackAlert;
use App\Jobs\SendWelcomeEmailJob;
use App\Helpers\PumbleAlert;

class AuthController extends Controller
{

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
            true
        );

        \Log::info("CHECKING NEW VERSION");

        $host = $request->query('host');
        $shop = Utils::sanitizeShopDomain($request->query('shop'));

        if(config("shopify.hookdeck_webhook_url")) {
            $old_host = Context::$HOST_NAME;
            Context::$HOST_NAME = config("shopify.hookdeck_webhook_url");
            $path = '';
        }else{
            $path = '/api/webhooks';
        }
        $response = Registry::register($path, Topics::APP_UNINSTALLED, $shop, $session->getAccessToken());
        // if ($response->isSuccess()) {
        //     Log::debug("Registered APP_UNINSTALLED webhook for shop $shop");
        // } else {
        //     Log::error(
        //         "Failed to register APP_UNINSTALLED webhook for shop $shop with response body: " .
        //             print_r($response->getBody(), true)
        //     );
        // }

        // Register all needed webhooks
        Registry::register($path, Topics::APP_SUBSCRIPTIONS_UPDATE, $shop, $session->getAccessToken());
        Registry::register($path, Topics::ORDERS_CREATE, $shop, $session->getAccessToken());

        if(config("shopify.hookdeck_webhook_url")) {
            Context::$HOST_NAME = $old_host;
        }

        $client = new Rest($session->getShop(), $session->getAccessToken());
        $result = $client->get('shop');

        $shopData = $result->getDecodedBody()['shop'];
        $mixpanel = new MixpanelService();

        \Log::info("INSTALLING APP");
        $store = Store::where('shopify_domain', $session->getShop())->orWhere('domain', $session->getShop())->first();
        if ($store) {
            $store->uninstalled_at = null;
            $store->status = 'active';
            $store->save();
        } else {
            \Log::info("INSIDE ELSE");
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
                //'per_file_limit' => 104857600,
                //'digital_products_limit' => 20,
                //'digital_lotteries_limit' => 1,
                //'file_storage_limit' => 5368709120,
                //'orders_per_month' => 50,
                //'reply_to_email' =>  $shopData['email'],
            ]);

            // Create Default Setting
            $this->createDefaultSettings($store);

            // Add to Brevo
            if(config("app.env") == 'production' || config("app.env") == "local") {
                try{
                    $brevo = new BrevoService($store);
                    if(!empty($store->brevo_id)) {
                        $brevo->updateContact([
                            'attributes' => [
                                'INSTALLED_UNINSTALLED_TAG' => config('app.installed_tag'),
                                'ACTIVE_INACTIVE_TAG' => config('app.active_tag'),
                                'PAYING_TAG'    => ''
                            ]
                        ]);
                    }else{
                        $brevo->createContact(config('app.installed_tag'), config('app.active_tag'))
                            ->addToList(config('services.sendinblue.list_id'));
                    }

                    // Send Slack notification
                    // $this->sendSlackNotification($store);
                    $this->sendAppInstallAlert($store);
                    SendWelcomeEmailJob::dispatch($store);
                }catch (Exception $e) {
                    Log::error("Error Brevo/Slack App Install: " . $e->getMessage());
                }
            }

            //
            //$mixpanel->addUser($store);

        }

        // Create default free subscription wiht plan selected false
        // When user limit for free plan about to reach then we will check plan selected and send email/notify to choose
        $store->subscription()->create([
            'plan_id' => 1,
            'status' => 'active',
            'interval' => 'monthly',
            'admin_graphql_api_id' => null,
            'plan_selected' => false,
            'next_reset_date' => now()->addMonth(),
            'monthly_reset_date' => now()->addMonth(),
        ]);

        // Add Script Tag
//        $result = $client->post("script_tags", [
//            'script_tag' => [
//                'event' => 'onload',
//                'src'   => config("app.url"). 'script-tag/order-confirmation-page.js',
//                'display_scope' => 'order_status'
//            ]
//        ]);

        //$mixpanel->track('Installed App', $store->shopify_domain);

        // Create Storage folder
        if(!Storage::exists('duser_' . $store->id)) {
            Storage::makeDirectory('duser_' . $store->id, );
        }

        $redirectUrl = Utils::getEmbeddedAppUrl($host);

        //$redirectUrl .= '/plans';
        $redirectUrl .= '/';

        return redirect($redirectUrl);
    }

    public function sendAppInstallAlert($store)
    {
        $date = now()->format('M j, Y');
        $time = now()->format('g:i A T');
        $activeInstallations = Store::where('status', 'active')->count();


        // Single message in Slack-style Markdown
        $message = <<<MD
    🎉 *New App Installation*

    *{$store->shopify_domain}* has installed the app!

    🏪 Store Information
    • Domain: {$store->shopify_domain}
    • Email: {$store->email}
    • Store ID: #{$store->id}
    • Current Plan: {$store->shopify_plan}
    • Date: {$date}
    • Time: {$time}

    :rocket: Total active installations: {$activeInstallations}
    MD;

        try {
            // Send as a single Pumble message
            PumbleAlert::send($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send new install Pumble alert: ' . $e->getMessage());

            // Fallback simple message
            // PumbleAlert::send("🎉 New app installation: {$store->shopify_domain} ({$store->shopify_plan})");
        }
    }


    private function sendSlackNotification($store) {
        SlackAlert::blocks([
            [
                'type' => 'header',
                'text' => [
                    'type' => 'plain_text',
                    'text' => '🎉 New App Installation',
                    'emoji' => true
                ]
            ],
            [
                'type' => 'section',
                'text' => [
                    'type' => 'mrkdwn',
                    'text' => ":white_check_mark: *New store has installed our app!*"
                ],
                'accessory' => [
                    'type' => 'button',
                    'text' => [
                        'type' => 'plain_text',
                        'text' => 'View Store'
                    ],
                    'style' => 'primary',
                    'url' => "https://{$store->shopify_domain}"
                ]
            ],
            [
                'type' => 'divider'
            ],
            [
                'type' => 'section',
                'fields' => [
                    [
                        'type' => 'mrkdwn',
                        'text' => "*Store Domain:*\n{$store->shopify_domain}"
                    ],
                    [
                        'type' => 'mrkdwn',
                        'text' => "*Shopify Plan:*\n{$store->shopify_plan}"
                    ],
                    [
                        'type' => 'mrkdwn',
                        'text' => "*Store Email:*\n{$store->email}"
                    ],
                    [
                        'type' => 'mrkdwn',
                        'text' => "*Installation Time:*\n" . now()->format('Y-m-d H:i:s T')
                    ]
                ]
            ],
            [
                'type' => 'section',
                'fields' => [
                    [
                        'type' => 'mrkdwn',
                        'text' => "*Store ID:*\n{$store->id}"
                    ],
                    [
                        'type' => 'mrkdwn',
                        'text' => "*Store Name:*\n{$store->name}"
                    ],
                    [
                        'type' => 'mrkdwn',
                        'text' => "*Country:*\n{$store->country }"
                    ]
                ]
            ],
            [
                'type' => 'context',
                'elements' => [
                    [
                        'type' => 'mrkdwn',
                        'text' => ':rocket: Welcome to our growing family! Total active installations: ' . (Store::where('status', 'active')->count())
                    ]
                ]
            ]
        ]);
    }

    private function createDefaultSettings($store) {
        $setting = $store->setting()->updateOrCreate(
            ['store_id' => $store->id],
            []
        );
    }
}
