<?php

namespace App\Console\Commands;

use App\Models\Session;
use App\Models\Store;
use Illuminate\Console\Command;
use Shopify\Clients\Rest;

class RemoveUnusedWebhooks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:remove-unused-webhooks';

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
            if (!$session || is_null($session->access_token) || empty($session->access_token)) {
                $this->info('Access Token Missing for Store: ' . $store->shopify_domain);
                continue;
            }

            $client = new Rest($store->shopify_domain, $session->access_token);
            $response = $client->get('webhooks');
            if ($response->getStatusCode() == 200) {
                $webhooks = $response->getDecodedBody()['webhooks'];
                foreach ($webhooks as $webhook) {
                    if (
                        $webhook['topic'] == 'products/create' || $webhook['topic'] == 'products/update' ||
                        $webhook['topic'] == 'products/delete' || $webhook['topic'] == 'shop/update' ||
                        $webhook['topic'] == 'orders/updated' || $webhook['topic'] == 'orders/delete'
                    ) {
                        // Delete not needed webhooks
                        $result = $client->delete('webhooks/' . $webhook['id']);
                        $this->info('Delete Webhook: ' . $webhook['topic'] . ' for Store: ' . $store->shopify_domain);
                    }
                }
            }
        }
    }
}
