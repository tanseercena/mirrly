<?php

namespace Database\Seeders;

use App\Models\Campaign;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CampaignsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Campaign::create([
            'shop' => 'storenatic-dev1.myshopify.com',
            'type' => 'sales_popup'
        ]);
        Campaign::create([
            'shop' => 'storenatic-dev1.myshopify.com',
            'type' => 'exit_discount'
        ]);
        Campaign::create([
            'shop' => 'storenatic-dev1.myshopify.com',
            'type' => 'sticky_cart_bar'
        ]);
    }
}
