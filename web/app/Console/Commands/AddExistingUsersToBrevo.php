<?php

namespace App\Console\Commands;

use App\Models\Store;
use App\Services\BrevoService;
use Illuminate\Console\Command;

class AddExistingUsersToBrevo extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:add-existing-users-to-brevo';

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
        $stores = Store::where('brevo_id', '')
            ->orWhereNull('brevo_id')
            ->get();

        foreach ($stores as $store) {
            $brevo = new BrevoService($store);
            $install_tag = $store->status == 'uninstalled' ? config('app.uninstalled_tag')
                : config('app.installed_tag');
            $active_tag = $store->status == 'uninstalled' ? config('app.inactive_tag') : config('app.active_tag');
            $brevo->createContact($install_tag, $active_tag)
                ->addToList(config('services.sendinblue.list_id'));

            $this->info("Store add to Brevo: " . $store->shopify_domain);
        }
    }
}
