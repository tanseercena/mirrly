<?php

namespace App\Console\Commands;

use App\Models\Store;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class UpdateGadgetFileSource extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-gadget-file-source';

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
        $stores = Store::where("gadget_user", true)->where("finish_gadget_migrate", false)->limit(100)->get();
        foreach ($stores as $store) {
            // Create Storage folder if not exists
            if (!Storage::exists('duser_' . $store->id)) {
                Storage::makeDirectory('duser_' . $store->id,);
            }

            foreach($store->digitalProducts as $digitalProduct) {
                foreach ($digitalProduct->files as $file) {
                    $gadget_url = $file->file['url'];
                    if (str_contains($gadget_url, 'gadget.dev')) {
                        $contents = file_get_contents($gadget_url);
                        Storage::put('duser_'.$store->id.'/'.$file->file['fileName'], $contents);
                        $url = Storage::url('duser_'.$store->id.'/'.$file->file['fileName']);
                        $d_file = $file->file;
                        $d_file['url'] = $url;

                        $file->file = $d_file;
                        $file->save();
                    }
                }
            }

            $store->finish_gadget_migrate = true;
            $store->save();

            $this->info("Shop File Source Updated for : " . $store->shopify_domain);
        }
    }
}
