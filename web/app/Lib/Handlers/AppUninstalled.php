<?php

declare(strict_types=1);

namespace App\Lib\Handlers;

use App\Models\Session;
use App\Models\Store;
use App\Services\BrevoService;
use App\Services\MailchimpService;
use App\Services\MixpanelService;
use Illuminate\Support\Facades\Log;
use Shopify\Webhooks\Handler;

class AppUninstalled implements Handler
{

     private function sendAppUninstallAlert(Store $store)
    {
        $date = now()->format('M j, Y');
        $time = now()->format('g:i A T');

        $message = <<<MD
⚠️ **App Uninstalled**

**{$store->shopify_domain}** has uninstalled the app.

### 🏪 Store Information
• Domain: `{$store->shopify_domain}`
• Email: {$store->email}`
• Store ID: #{$store->id}
• Last Plan: {$store->shopify_plan}
• Date: {$date}
• Time: {$time}

MD;

        try {
            PumbleAlert::send($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send uninstall Pumble alert: ' . $e->getMessage());
            // fallback simple message
        }
    }
    public function handle(string $topic, string $shop, array $body): void
    {
        Log::debug("App was uninstalled from $shop");
        $store = Store::query()->where('shopify_domain', $shop)->orWhere('domain', $shop)->first();
        $session = Session::query()->where('shop', $store->shopify_domain)->first();

        if ($session) {
            $session->delete();

            $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();
            $store->status = 'uninstalled';
            $store->uninstalled_at = now();

            $store->save();

            $store->subscription()->delete();

            // $store->delete();

            $mixpanel = new MixpanelService();

            $mixpanel->track('Uninstalled App', $store->shopify_domain);
            //$this->sendAppUninstallAlert($store);

//            $mailchimp = new MailchimpService($store);
//
//            $mailchimp->addTag(config('app.uninstalled_tag'))
//                ->removeTag(config('app.active_tag'))
//                ->removeTag(config('app.paying_tag'));

            if(!empty($store->brevo_id) && config("app.env") == 'production') {
                $brevo = new BrevoService($store);
                $brevo->updateContact([
                    'attributes' => [
                        'INSTALLED_UNINSTALLED_TAG' => config('app.uninstalled_tag'),
                        'ACTIVE_INACTIVE_TAG' => config('app.inactive_tag'),
                        'PAYING_TAG'    => ''
                    ]
                ]);
            }

        }
    }
}
