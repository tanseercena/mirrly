<?php

namespace App\Console\Commands;

use App\Models\Session;
use App\Models\Store;
use Illuminate\Console\Command;
use Shopify\Clients\Rest;

class RemoveScopeFromStore extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:remove-scope-from-store';

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
        $store = Store::find(5258);
        $session = Session::query()->where('shop', $store->shopify_domain)->first();

        $client = new Rest($store->shopify_domain, $session->access_token);
        $response = $client->get('webhooks');


        if ($response->getStatusCode() == 200) {
            $webhooks = $response->getDecodedBody()['webhooks'];
            foreach ($webhooks as $webhook) {
                echo $webhook['topic'] . "\n";
                if($webhook['topic'] == 'orders/create' || $webhook['topic'] == 'orders/updated') {
                    $result = $client->delete('webhooks/' . $webhook['id']);
                }
            }
        }

    }
}
