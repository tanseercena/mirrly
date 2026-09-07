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
 * Kicks off the catalog bulk sync for a store's try-on scope.
 *
 * Fired right after the merchant saves their onboarding product scope,
 * so the catalog is syncing while the merchant walks the remaining steps.
 */
class TriggerCatalogSyncJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Store $store,
        public ?SyncJob $syncJob = null
    ) {}

    public function handle(): void
    {
        // Reuse the sync job across cancel-and-replace retries so the
        // progress UI follows one row instead of flickering through many.
        $syncJob = $this->syncJob ?: SyncJob::create([
            'store_id' => $this->store->id,
            'type' => SyncJob::TYPE_CATALOG_SYNC,
            'status' => SyncJob::STATUS_RUNNING,
            'started_at' => now(),
        ]);

        $accessToken = Shopify::accessTokenFor($this->store->shopify_domain);

        if (!$accessToken) {
            $syncJob->update([
                'status' => SyncJob::STATUS_FAILED,
                'error' => 'No access token available for this store',
            ]);
            return;
        }

        try {
            $this->submitBulkQuery($syncJob, $this->store->shopify_domain, $accessToken);
        } catch (\Throwable $e) {
            Log::error('Catalog sync trigger failed: ' . $e->getMessage());
            $syncJob->update([
                'status' => SyncJob::STATUS_FAILED,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Submit the bulk query, or if another bulk operation is already
     * running for this shop, cancel it and retry shortly (Shopify allows
     * only one active bulk operation per shop).
     */
    private function submitBulkQuery(SyncJob $syncJob, string $shop, string $accessToken): void
    {
        $current = $this->currentBulkOperation($shop, $accessToken);

        if ($this->isActiveBulkOperation($current)) {
            Shopify::queryOrException($shop, $accessToken, [
                'query' => 'mutation { bulkOperationCancel(id: "' . $current['id'] . '") { id } }',
            ]);
            self::dispatch($this->store, $syncJob)->delay(now()->addSeconds(25));
            return;
        }

        // Never submitted successfully and stuck retrying for too long —
        // give up instead of looping forever.
        if (empty($syncJob->shopify_bulk_operation_id)
            && $syncJob->started_at?->lt(now()->subMinutes(15))) {
            $syncJob->update([
                'status' => SyncJob::STATUS_FAILED,
                'error' => 'Timed out waiting to start the bulk operation',
            ]);
            return;
        }

        $response = Shopify::queryOrException($shop, $accessToken, [
            'query' => $this->buildMutation($this->buildProductsQuery($this->store)),
        ]);

        $result = $response['data']['bulkOperationRunQuery'] ?? null;

        // Shopify can still refuse with userErrors (e.g. the previous
        // operation is mid-cancel); back off and retry rather than fail.
        if (!empty($result['userErrors'])) {
            Log::warning('bulkOperationRunQuery userErrors: ' . json_encode($result['userErrors']));
            self::dispatch($this->store, $syncJob)->delay(now()->addSeconds(25));
            return;
        }

        $syncJob->update([
            'shopify_bulk_operation_id' => $result['bulkOperation']['id'] ?? null,
        ]);

        PollBulkOperationJob::dispatch($this->store, $syncJob)->delay(now()->addSeconds(15));
    }

    private function buildMutation(string $query): string
    {
        // Block strings (""") tolerate the double quotes inside the
        // scope filter, so plain interpolation is safe here.
        return <<<GRAPHQL
        mutation {
          bulkOperationRunQuery(
            query: """
            {$query}
            """
          ) {
            bulkOperation { id status }
            userErrors { field message }
          }
        }
        GRAPHQL;
    }

    private function currentBulkOperation(string $shop, string $accessToken): ?array
    {
        $response = Shopify::queryOrException($shop, $accessToken, [
            'query' => '{ currentBulkOperation { id status } }',
        ]);

        return $response['data']['currentBulkOperation'] ?? null;
    }

    private function isActiveBulkOperation(?array $op): bool
    {
        return $op !== null && in_array($op['status'] ?? '', ['CREATED', 'RUNNING', 'CANCELING']);
    }

    /**
     * The try-on scope lives on the store's Setting (collection_type +
     * collections), which is what onboarding Step 2 just saved.
     */
    private function buildProductsQuery(Store $store): string
    {
        $setting = $store->setting;

        $collectionIds = collect($setting->collections ?? [])
            ->filter(fn ($c) => is_array($c) && !empty($c['id']))
            ->map(fn ($c) => Shopify::numericId($c['id']));

        $filter = '';
        if ($setting && $setting->collection_type === 'specific' && $collectionIds->isNotEmpty()) {
            $filter = '(query: "' . $collectionIds->map(fn ($id) => "collection_id:{$id}")->implode(' OR ') . '")';
        }

        return "{ products{$filter} { edges { node {
            id title handle status productType
            featuredImage { url }
            updatedAt
            variants { edges { node { id title image { url } } } }
            collections { edges { node { id title } } }
        } } } }";
    }
}
