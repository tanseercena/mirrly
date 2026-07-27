<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use DB;
use Log;

class MigrateOldFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:migrate-old-files';

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
        $digitalFiles = DB::table('digital_files')->get();

        foreach ($digitalFiles as $digitalFile) {
            $fileData = json_decode($digitalFile->file, true);

            if ($fileData) {
                try {
                    $storeId = $this->getStoreId($digitalFile->digital_product_id);
                    if (!$storeId) {
                        Log::info("Skipping file ID {$digitalFile->id}: No corresponding digital product found.");
                        continue; // Skip if the digital product does not exist
                    }

                    // Insert into files table
                    $fileId = DB::table('files')->insertGetId([
                        'store_id' => $storeId,
                        'url' => $fileData['url'],
                        'byteSize' => $fileData['byteSize'],
                        'fileName' => $fileData['fileName'],
                        'mimeType' => $fileData['mimeType'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    // Insert into digital_product_file table
                    DB::table('digital_product_file')->insert([
                        'digital_product_id' => $digitalFile->digital_product_id,
                        'file_id' => $fileId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                } catch (\Exception $e) {
                    Log::error("Failed to migrate file ID {$digitalFile->id}: " . $e->getMessage());
                }
            }
        }

        $this->info('Old files migrated successfully.');
    }

    private function getStoreId($digitalProductId)
    {
        // Assuming digital_products table has a store_id column
        $digitalProduct = DB::table('digital_products')->where('id', $digitalProductId)->first();
        return $digitalProduct ? $digitalProduct->store_id : null;
    }
}
