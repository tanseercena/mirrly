<?php

namespace App\Jobs;

use App\Helpers\Shopify;
use App\Models\Store;
use App\Models\SyncJob;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Polls the status of a Shopify bulk operation while it runs, then hands
 * the result off for processing. Re-dispatches itself with a fixed delay
 * until the operation completes or fails.
 */
class PollBulkOperationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Store $store,
        public SyncJob $syncJob
    ) {}

    public function handle(): void
    {
        $accessToken = Shopify::accessTokenFor($this->store->shopify_domain);

        if (!$accessToken) {
            $this->failSyncJob('No access token available for this store');
            return;
        }

        try {
            $this->checkStatus($accessToken);
        } catch (\Throwable $e) {
            // Transient API/network error — poll again instead of dying.
            Log::error('Bulk operation poll failed: ' . $e->getMessage());
            self::dispatch($this->store, $this->syncJob)->delay(now()->addSeconds(20));
        }
    }

    private function checkStatus(string $accessToken): void
    {
        // Hard cap on polling so a stuck operation can't loop forever.
        if ($this->syncJob->started_at?->lt(now()->subMinutes(60))) {
            $this->failSyncJob('Timed out waiting for the bulk operation');
            return;
        }

        $response = Shopify::queryOrException($this->store->shopify_domain, $accessToken, [
            'query' => '{ currentBulkOperation { id status url errorCode objectCount } }',
        ]);

        $op = $response['data']['currentBulkOperation'] ?? null;

        if (!$op) {
            $this->failSyncJob('Bulk operation expired');
            return;
        }

        // If the shop's current operation is no longer ours, a newer sync
        // replaced it — stop polling and mark this one superseded.
        if (!empty($this->syncJob->shopify_bulk_operation_id)
            && $op['id'] !== $this->syncJob->shopify_bulk_operation_id) {
            $this->failSyncJob('Superseded by a newer catalog sync');
            return;
        }

        switch ($op['status']) {
            case 'CREATED':
            case 'RUNNING':
                self::dispatch($this->store, $this->syncJob)->delay(now()->addSeconds(20));
                return;

            case 'COMPLETED':
                $this->syncJob->update(['total_estimated' => (int) $op['objectCount']]);
                ProcessBulkOperationResultJob::dispatch($this->store, $this->syncJob, $op['url']);
                return;

            default:
                $this->failSyncJob($op['errorCode'] ?? $op['status']);
        }
    }

    private function failSyncJob(string $error): void
    {
        $this->syncJob->update([
            'status' => SyncJob::STATUS_FAILED,
            'error' => $error,
        ]);
    }
}