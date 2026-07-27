<?php

namespace App\Console\Commands;

use App\Models\Session;
use App\Models\Store;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Shopify\Clients\Rest;

class ApiTesting extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:api-testing';

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
        $store = Store::query()->where('shopify_domain', 'digitally-test-store.myshopify.com')->first();
        $session = Session::query()->where('shop', $store->shopify_domain)->first();
        $client = new Rest($store->shopify_domain, $session->access_token);

        $result1 = $client->get(
            'orders/6014305042522'
        );
        $order = $result1->getDecodedBody();


        // Get fulfill order
        $result = $client->get(
            'orders/6014305042522/fulfillment_orders'
        );

        if ($result->getStatusCode() === 200) {
            $fulfill_order = $result->getDecodedBody();
            $fulfill_order_id = $fulfill_order['fulfillment_orders'][0]['id'] ?? false;
            $fulfill_line_items = $fulfill_order['fulfillment_orders'][0]['line_items'] ?? [];
            $fulfill_line_items = collect($fulfill_line_items);
        }

        foreach ($order['order']['line_items'] as $line_item) {
            $product_id = $line_item['product_id'];
            $found = $store->digitalProducts()->whereJsonContains(
                'associatedProduct',
                ['id' => 'gid://shopify/Product/' . $product_id]
            )->where("auto_fulfill", true)->count();
            if ($found > 0) {
                $fulfill_line_item_id = $fulfill_line_items->where('line_item_id', $line_item['id'])->first();
                if (!isset($fulfill_line_item_id['id'])) {
                    continue;
                }
//
//                dd([
//                    'fulfillment' => [
//                        'line_items_by_fulfillment_order' => [
//                            [
//                                'fulfillment_order_id' => $fulfill_order_id,
//                                'fulfillment_order_line_items' => [
//                                    [
//                                        'id' => $fulfill_line_item_id['id'],
//                                        'quantity' => $line_item['quantity'],
//                                    ]
//                                ]
//                            ]
//                        ]
//                    ]
//                ]);
                // Auto fulfill this line item
                $response = $client->post(
                    path: 'fulfillments',
                    body: [
                        'fulfillment' => [
                            'line_items_by_fulfillment_order' => [
                                [
                                    'fulfillment_order_id' => $fulfill_order_id,
                                    'fulfillment_order_line_items' => [
                                        [
                                            'id' => $fulfill_line_item_id['id'],
                                            'quantity' => $line_item['quantity'],
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                );

//                Log::info("Status: " . $response->getStatusCode());
//                Log::info('Response', [$response->getDecodedBody()]);

                dd($response->getDecodedBody());



                if ($response->getStatusCode() !== 201) {
                    Log::error("Failed to update fulfillment status" . $order['id']);
                }
            }
        }
    }
}
