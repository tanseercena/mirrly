<?php

namespace App\Console\Commands;

use App\Models\Session;
use App\Models\Store;
use Illuminate\Console\Command;
use Shopify\Clients\Rest;

class UpdateWebhookUrls extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-webhook-urls';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $stores = Store::all();
        foreach ($stores as $store) {
            $session = Session::query()->where('shop', $store->shopify_domain)->first();
            if (!$session  || is_null($session->access_token) || empty($session->access_token)) {
                $this->info('Access Token Missing for Store: ' . $store->shopify_domain);
                continue;
            }

            $client = new Rest($store->shopify_domain, $session->access_token);
            $response = $client->get('webhooks');
            if ($response->getStatusCode() == 200) {
                $webhooks = $response->getDecodedBody()['webhooks'];
                foreach ($webhooks as $webhook) {
                    $this->info($store->id. ' => ' .$store->shopify_domain.' Webhook Topic: ' . $webhook['topic']. ' address is: '.$webhook['address']);
                    // Update Needed webhook to new server url
                    $update_webhook = [
                        'webhook' => [
                            'id' => $webhook['id'],
                            'address' => "https://" . config("shopify.hookdeck_webhook_url")
                        ]
                    ];

                    $result = $client->put('webhooks/' . $webhook['id'], $update_webhook);
                    if($webhook['address'] == 'https://digitally.gadget.app/api/webhooks/shopify') {
                        $check_error = $result->getDecodedBody();
                        if(isset($check_error['errors']) && isset($check_error['errors']['address'])) {
                            if(isset($check_error['errors']['address'][0]) && $check_error['errors']['address'][0] == 'for this topic has already been taken') {
                                $result = $client->delete('webhooks/' . $webhook['id']);
                            }
                        }
                    }

                }
            }
        }
    }
}
