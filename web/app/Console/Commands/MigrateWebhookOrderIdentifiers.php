<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MigrateWebhookOrderIdentifiers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'webhook-orders:migrate-identifiers {--batch=1000} {--force}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate existing orders to use dedicated shopify_order_id and checkout_token columns';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $batchSize = $this->option('batch');
        $force = $this->option('force');

        $this->info('Starting order identifiers migration...');
        $this->info("Batch size: {$batchSize}");

        // Check if columns exist
        if (!$this->columnsExist()) {
            $this->error('Required columns do not exist. Please run the migration first.');
            return 1;
        }

        // Get total orders that need migration
        $totalOrders = DB::table('webhook_orders')
            ->whereNull('shopify_order_id')
            //->orWhereNull('checkout_token')
            ->count();

        if ($totalOrders === 0) {
            $this->info('All orders are already migrated!');
            return 0;
        }

        $this->info("Found {$totalOrders} orders to migrate.");

        if (!$force && !$this->confirm('This will update existing orders. Do you want to continue?')) {
            $this->info('Migration cancelled.');
            return 0;
        }

        $progressBar = $this->output->createProgressBar($totalOrders);
        $progressBar->start();

        $processed = 0;
        $updated = 0;
        $errors = 0;

        // Process orders in batches
        DB::table('webhook_orders')
            ->whereNull('shopify_order_id')
            //->orWhereNull('checkout_token')
            ->orderBy('id')
            ->chunk($batchSize, function ($orders) use (&$processed, &$updated, &$errors, $progressBar) {
                foreach ($orders as $order) {
                    try {
                        $body = json_decode($order->body, true);
                        if (!$body) {
                            $this->warn("Invalid JSON for order ID: {$order->id}");
                            $errors++;
                            $progressBar->advance();
                            continue;
                        }

                        $updateData = [];

                        // Extract shopify_order_id from JSON
                        if (isset($body['id']) && !$order->shopify_order_id) {
                            $updateData['shopify_order_id'] = $body['id'];
                        }

                        // Extract checkout_token from JSON
                        if (isset($body['checkout_token']) && !$order->checkout_token) {
                            $updateData['checkout_token'] = $body['checkout_token'];
                        }


                        // Update if we have data to update
                        if (!empty($updateData)) {
                            DB::table('webhook_orders')
                                ->where('id', $order->id)
                                ->update($updateData);
                            $updated++;
                        }

                        $processed++;
                    } catch (\Exception $e) {
                        $this->line("\nError processing order ID {$order->id}: " . $e->getMessage());
                        Log::error("Order migration error for ID {$order->id}: " . $e->getMessage());
                        $errors++;
                    }

                    $progressBar->advance();
                }
            });

        $progressBar->finish();
        $this->newLine();

        // Summary
        $this->info('Migration completed!');
        $this->info("Total processed: {$processed}");
        $this->info("Total updated: {$updated}");
        $this->info("Errors: {$errors}");

        // Verify migration
        $remainingOrders = DB::table('webhook_orders')
            ->whereNull('shopify_order_id')
            //->orWhereNull('checkout_token')
            ->count();

        if ($remainingOrders > 0) {
            $this->warn("Warning: {$remainingOrders} orders still need migration.");
            return 1;
        }

        $this->info('All orders successfully migrated!');
        return 0;
    }

    /**
     * Check if required columns exist in the orders table.
     */
    private function columnsExist(): bool
    {
        try {
            $columns = DB::select("DESCRIBE orders");
            $columnNames = array_column($columns, 'Field');

            return in_array('shopify_order_id', $columnNames) &&
                   in_array('checkout_token', $columnNames);
        } catch (\Exception $e) {
            return false;
        }
    }
}
