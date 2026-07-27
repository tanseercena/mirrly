<?php

namespace App\Console\Commands;

use App\Models\Store;
use App\Services\BrevoService;
use Illuminate\Console\Command;

class AddOrderCreatedStoresToBrevo extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:add-order-created-stores-to-brevo';

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
        $stores = Store::where('status', 'active')
            ->whereHas('orders')
            ->get();

        foreach ($stores as $store) {
            $brevo = new BrevoService($store);

            $brevo->updateContact([
                'attributes' => [
                    'ORDER_CREATED_TAG'    => config('app.order_created_tag'),
                ]
            ]);
        }
    }
}
