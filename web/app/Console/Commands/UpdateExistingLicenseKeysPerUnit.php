<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class UpdateExistingLicenseKeysPerUnit extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-existing-license-keys-per-unit';

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
        DB::table('digital_product_license')->get()->each(function ($row) {
            $defaultKeys = DB::table('licenses')
                ->where('id', $row->license_id)
                ->value('per_unit_no_delivery');

            DB::table('digital_product_license')
                ->where('id', $row->id)
                ->update(['keys_per_unit' => $defaultKeys ?? 1]);
        });
    }
}
