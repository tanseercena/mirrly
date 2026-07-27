<?php

namespace App\Console\Commands;

use App\Models\Store;
use Illuminate\Console\Command;

class AddSettingToAllUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:add-setting-to-all-users';

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
        foreach($stores as $store) {
            $store->setting()->updateOrCreate(
                [
                    'store_id' => $store->id,
                ],
                [
                    'send_email' => true,
                    'email_content' => [
                        'subject' => 'Your digital products for order {order_name}',
                        'order_title' => '{order_name}',
                        'intro_text' => 'Hello {full_name},<br> Your digital products are ready for order {order_name}.',
                        'file_title' => 'Files',
                        'footer_text' => 'Thanks,<br> If you have any questions, reply to this email'
                    ],
                ]
            );

            $this->info("Setting added for ".$store->shopify_domain);
        }
    }
}
