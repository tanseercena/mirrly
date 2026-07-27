<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RetryHookdeckEvents extends Command
{
    /**
     * Usage examples:
     *
     *   # Dry-run to preview matched events without retrying
     *   php artisan hookdeck:retry --dry-run
     *
     *   # Retry failed events from a specific source and date range
     *   php artisan hookdeck:retry \
     *     --source=src_kolw7dwpddguuz \
     *     --date-min="2026-04-18T19:00:00Z" \
     *     --date-max="2026-04-19T06:00:00Z" \
     *     --status=FAILED
     *
     *   # Retry successful events that had side-effect failures (email/Redis etc.)
     *   php artisan hookdeck:retry \
     *     --source=src_kolw7dwpddguuz \
     *     --date-min="2026-04-18T19:00:00Z" \
     *     --date-max="2026-04-19T06:00:00Z" \
     *     --status=SUCCESSFUL
     *
     *   # Filter by Shopify topic via request headers
     *   php artisan hookdeck:retry \
     *     --source=src_kolw7dwpddguuz \
     *     --date-min="2026-04-18T19:00:00Z" \
     *     --date-max="2026-04-19T06:00:00Z" \
     *     --headers='{"x-shopify-topic":"orders/create"}'
     *
     *   # Retry raw requests (server was down scenario)
     *   php artisan hookdeck:retry \
     *     --source=src_kolw7dwpddguuz \
     *     --date-min="2026-04-18T19:00:00Z" \
     *     --date-max="2026-04-19T06:00:00Z" \
     *     --mode=requests
     *
     *   # URL-encoded values pasted directly from browser are supported too
     *   php artisan hookdeck:retry \
     *     --date-min="2026-04-18T19%3A00%3A00.000Z" \
     *     --date-max="2026-04-19T06%3A00%3A00.000Z" \
     *     --headers="%7B%22x-shopify-topic%22%3A%20%22orders%2Fcreate%22%7D"
     */
    protected $signature = 'hookdeck:retry
                            {--source=* : Source ID(s) to filter by (e.g. src_kolw7dwpddguuz)}
                            {--date-min= : Min created_at / ingested_at in ISO 8601 (URL-encoded values are decoded automatically)}
                            {--date-max= : Max created_at / ingested_at in ISO 8601 (URL-encoded values are decoded automatically)}
                            {--headers= : JSON string of request headers to sub-filter on (URL-encoded JSON is decoded automatically)}
                            {--status=FAILED : Event status to filter — FAILED, SUCCESSFUL, QUEUED, HOLD, SCHEDULED (events mode only)}
                            {--mode=events : What to retry: "events" (default) or "requests"}
                            {--dry-run : List matched items without actually retrying them}';

    protected $description = 'Retry Hookdeck events or requests one-by-one with a 1-second pause between each';

    private const API_BASE   = 'https://api.hookdeck.com/2025-07-01';
    private const RETRY_WAIT = 1; // seconds between each individual retry call
    private const PAGE_LIMIT = 250; // max per page Hookdeck allows

    private string $apiKey = '';

    public function handle(): int
    {
        $this->apiKey = config('services.hookdeck.api_key', env('HOOKDECK_API_KEY', ''));

        if (empty($this->apiKey)) {
            $this->error('Hookdeck API key is not set. Add HOOKDECK_API_KEY to your .env file.');
            return self::FAILURE;
        }

        $mode = strtolower($this->option('mode'));

        if (! in_array($mode, ['events', 'requests'])) {
            $this->error('Invalid --mode. Use "events" or "requests".');
            return self::FAILURE;
        }

        $filters = $this->buildFilters($mode);

        $this->info('');
        $this->info("=== Hookdeck Retry ({$mode}) ===");
        $this->line('Filters:');
        foreach ($filters as $key => $value) {
            $this->line("  {$key} = {$value}");
        }
        $this->info('');

        // Fetch all matching IDs across all pages
        $ids = $this->fetchAllIds($mode, $filters);

        if (empty($ids)) {
            $this->warn('No matching ' . $mode . ' found. Nothing to retry.');
            return self::SUCCESS;
        }

        $total = count($ids);
        $this->info("Found {$total} {$mode} to retry.");

        if ($this->option('dry-run')) {
            $this->warn('[Dry-run] No retries sent. Remove --dry-run to execute.');
            return self::SUCCESS;
        }

        if (! $this->confirm("Retry all {$total} {$mode} now? (1-second wait between each)", false)) {
            $this->info('Aborted.');
            return self::SUCCESS;
        }

        $this->info('');
        $this->retryOneByOne($mode, $ids);

        return self::SUCCESS;
    }

    // -------------------------------------------------------------------------
    // Fetch
    // -------------------------------------------------------------------------

    /**
     * Page through the Hookdeck list endpoint and collect every matching ID.
     */
    private function fetchAllIds(string $mode, array $filters): array
    {
        $endpoint = match ($mode) {
            'events'   => self::API_BASE . '/events',
            'requests' => self::API_BASE . '/requests',
        };

        $ids    = [];
        $cursor = null; // next-page cursor

        $this->line('Fetching matching ' . $mode . ' from Hookdeck...');

        do {
            $query = array_merge($filters, ['limit' => self::PAGE_LIMIT]);

            if ($cursor !== null) {
                $query['next'] = $cursor;
            }

            $response = Http::withToken($this->apiKey)->get($endpoint, $query);

            if ($response->failed()) {
                $this->error('Failed to fetch ' . $mode . ': ' . $response->body());
                break;
            }

            $body   = $response->json();
            $models = $body['models'] ?? [];

            foreach ($models as $model) {
                $ids[] = $model['id'];
            }

            // Hookdeck cursor pagination
            $cursor = $body['pagination']['next'] ?? null;

            $this->line('  Fetched ' . count($ids) . ' so far...');

        } while ($cursor !== null);

        return $ids;
    }

    // -------------------------------------------------------------------------
    // Retry
    // -------------------------------------------------------------------------

    /**
     * Retry each event/request individually with a 1-second gap between calls.
     *
     * Endpoints used:
     *   POST /2025-07-01/events/:id/retry
     *   POST /2025-07-01/requests/:id/retry
     */
    private function retryOneByOne(string $mode, array $ids): void
    {
        $total     = count($ids);
        $succeeded = 0;
        $failed    = 0;
        $skipped   = 0;

        foreach ($ids as $index => $id) {
            $position = $index + 1;
            $this->line("[{$position}/{$total}] Retrying {$id}...");

            $endpoint = match ($mode) {
                'events'   => self::API_BASE . "/events/{$id}/retry",
                'requests' => self::API_BASE . "/requests/{$id}/retry",
            };

            $response = Http::withToken($this->apiKey)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->withBody('{}', 'application/json')->post($endpoint);

            if ($response->successful()) {
                $this->info("  ✓ Queued for retry");
                $succeeded++;
            } elseif ($response->status() === 400) {
                // Hookdeck returns 400 when the event/request is not eligible for retry
                $message = $response->json('message') ?? $response->body();
                $this->warn("  ⚠ Skipped (not eligible): {$message}");
                $skipped++;
            } else {
                $message = $response->json('message') ?? $response->body();
                $this->error("  ✗ Failed (HTTP {$response->status()}): {$message}");
                Log::warning("hookdeck:retry — failed to retry {$mode} {$id}: " . $response->body());
                $failed++;
            }

            // 1-second wait between each retry (skip after the last item)
            if ($position < $total) {
                sleep(self::RETRY_WAIT);
            }
        }

        $this->info('');
        $this->info('=== Done ===');
        $this->line("  Total   : {$total}");
        $this->line("  Retried : {$succeeded}");
        $this->line("  Skipped : {$skipped}  (not eligible for retry)");
        $this->line("  Errors  : {$failed}   (API error — check laravel.log)");
    }

    // -------------------------------------------------------------------------
    // Filters
    // -------------------------------------------------------------------------

    /**
     * Map CLI options to Hookdeck query-param filter format.
     * Hookdeck uses bracket notation: source_id[0], created_at[gte], etc.
     * Dates and JSON values from the browser URL are URL-decoded automatically.
     */
    private function buildFilters(string $mode): array
    {
        $filters = [];

        // --source  (multiple values allowed: --source=src_aaa --source=src_bbb)
        foreach (array_values($this->option('source')) as $i => $sourceId) {
            $filters["source_id[{$i}]"] = trim($sourceId);
        }

        // --date-min / --date-max
        // Events are indexed by created_at; requests by ingested_at
        $dateField = ($mode === 'requests') ? 'ingested_at' : 'created_at';

        if ($dateMin = $this->option('date-min')) {
            $filters["{$dateField}[gte]"] = $this->decodeDate($dateMin);
        }

        if ($dateMax = $this->option('date-max')) {
            $filters["{$dateField}[lte]"] = $this->decodeDate($dateMax);
        }

        // --headers  (JSON sub-filter on the original request headers)
        // Hookdeck expects the value as a JSON string in the query param
        if ($rawHeaders = $this->option('headers')) {
            $parsed = $this->decodeJson($rawHeaders, '--headers');
            if ($parsed !== null) {
                $filters['request[headers]'] = json_encode($parsed);
            }
        }

        // --status  (events only — the requests list endpoint has no status filter)
        if ($mode === 'events' && $status = $this->option('status')) {
            $filters['status'] = strtoupper($status);
        }

        return $filters;
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * URL-decode a date string in case it was copy-pasted from a browser address bar.
     */
    private function decodeDate(string $value): string
    {
        return trim(urldecode($value));
    }

    /**
     * URL-decode then JSON-decode a string. Returns null and shows an error on failure.
     */
    private function decodeJson(string $value, string $optionName): ?array
    {
        $decoded = urldecode($value);
        $parsed  = json_decode($decoded, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->error("Invalid JSON for {$optionName}: " . json_last_error_msg());
            $this->line("  Decoded value was: {$decoded}");
            return null;
        }

        return $parsed;
    }
}
