<?php

namespace App\Services;

use App\Helpers\PumbleAlert;
use App\Helpers\Shopify;
use App\Models\Plan;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

/**
 * Usage-based billing for try-on sessions. A plan includes N sessions per
 * billing cycle (limits.sessions — 0 on Free); every session beyond that is
 * charged through the subscription's Shopify usage line item at the plan's
 * session_rate.
 *
 * The counter is stores.monthly_sessions. It rolls over lazily here when the
 * subscription's cycle date has passed (app:reset-monthly-limits-for-stores
 * does the same daily, so the dashboard stays honest without traffic).
 */
class UsageBillingService
{
    private const USAGE_RECORD_MUTATION = <<<'QUERY'
    mutation appUsageRecordCreate(
        $subscriptionLineItemId: ID!
        $description: String!
        $price: MoneyInput!
        $idempotencyKey: String
    ) {
        appUsageRecordCreate(
            subscriptionLineItemId: $subscriptionLineItemId
            description: $description
            price: $price
            idempotencyKey: $idempotencyKey
        ) {
            appUsageRecord {
                id
            }
            userErrors {
                field
                message
            }
        }
    }
QUERY;

    /**
     * Count this start attempt against the store's cycle and charge for it
     * when the plan's included sessions are spent. TRUE = the attempt may go
     * on to create a session; FALSE = refuse it (the counter was rolled back
     * and an alert raised).
     */
    public function chargeForSession(Store $store, Product $product): bool
    {
        $plan = $this->planFor($store);
        $included = (int) ($plan?->limits['sessions'] ?? 0);
        $rate = (float) ($plan?->limits['session_rate'] ?? 0);

        $this->rollCycleIfNeeded($store);

        // Atomic bump. COALESCE covers rows still NULL (the column shipped
        // nullable without a default, and MySQL's NULL + 1 stays NULL). MySQL
        // can't return an UPDATE's new value, so the count is read back right
        // after; every attempt's own +1 guarantees the value it reads already
        // includes its turn — two shoppers landing on the boundary at the same
        // instant can never both slip through as "included".
        DB::table('stores')->where('id', $store->id)->update([
            'monthly_sessions' => DB::raw('COALESCE(monthly_sessions, 0) + 1'),
        ]);
        $used = (int) $store->fresh()->monthly_sessions;

        if (!($rate > 0 && $used > $included)) {
            return true;
        }

        if ($this->chargeUsage($store, $plan, $rate, $product) !== null) {
            return true;
        }

        // Refused — hand the count back, so an attempt that never became a
        // session doesn't consume included quota.
        DB::table('stores')
            ->where('id', $store->id)
            ->where('monthly_sessions', '>', 0)
            ->decrement('monthly_sessions');

        return false;
    }

    /**
     * The store's plan — its active subscription's plan, falling back to the
     * Free plan (same fallback as the analytics history clamp and the usage
     * endpoint).
     */
    public function planFor(Store $store): ?Plan
    {
        return $store->subscription?->plan_id
            ? Plan::find($store->subscription->plan_id)
            : Plan::whereRaw('LOWER(name) = ?', ['free'])->first();
    }

    /**
     * Create the Shopify usage record for one over-limit session. Returns the
     * record id, or null on any failure (no subscription / no usage line item /
     * userErrors / network) — null means the caller refuses the session.
     */
    private function chargeUsage(Store $store, ?Plan $plan, float $rate, Product $product): ?string
    {
        $subscription = $store->subscription;
        $lineItemId = $subscription?->usage_link_item_id;

        if (!$lineItemId) {
            Log::error('Try-on usage billing: no usage line item on the active subscription', [
                'store_id' => $store->id,
                'shop' => $store->shopify_domain,
                'subscription_id' => $subscription?->id,
            ]);
            $this->alertRefusal($store, $plan, 'no usage line item on the active subscription');

            return null;
        }

        try {
            $response = Shopify::queryOrException(
                $store->shopify_domain,
                (string) Shopify::accessTokenFor($store->shopify_domain),
                [
                    'query' => self::USAGE_RECORD_MUTATION,
                    'variables' => [
                        'subscriptionLineItemId' => $lineItemId,
                        // Shopify dedupes on this key — a retried HTTP call can
                        // never create the same charge twice. Each start attempt
                        // is its own billable session, so a fresh uuid per call.
                        'idempotencyKey' => (string) Str::uuid(),
                        'description' => "Try-on session — {$product->title}",
                        // API 2024-04+ types price as MoneyInput (USD only, same
                        // as BillingController's recurring charges).
                        'price' => ['amount' => $rate, 'currencyCode' => 'USD'],
                    ],
                ]
            );
        } catch (Throwable $e) {
            Log::error('Try-on usage charge request failed', [
                'store_id' => $store->id,
                'shop' => $store->shopify_domain,
                'exception' => $e->getMessage(),
            ]);
            $this->alertRefusal($store, $plan, 'usage charge request failed');

            return null;
        }

        $payload = $response['data']['appUsageRecordCreate'] ?? [];
        $recordId = $payload['appUsageRecord']['id'] ?? null;

        if (!$recordId) {
            $reason = collect($payload['userErrors'] ?? [])->pluck('message')->implode('; ')
                ?: json_encode($response['errors'] ?? 'unknown error');
            Log::error('Try-on usage charge rejected', [
                'store_id' => $store->id,
                'shop' => $store->shopify_domain,
                'reason' => $reason,
            ]);
            $this->alertRefusal($store, $plan, "usage charge rejected: {$reason}");

            return null;
        }

        Log::info('Try-on usage charge created', [
            'store_id' => $store->id,
            'shop' => $store->shopify_domain,
            'plan' => $plan?->name,
            'price' => $rate,
            'usage_record' => $recordId,
        ]);

        try {
            (new MixpanelService())->track('Usage Charge Created', $store->shopify_domain, [
                'Plan' => $plan?->name,
                'Amount' => $rate,
                'Product' => $product->title,
            ]);
        } catch (Throwable $e) {
            Log::error('Usage charge Mixpanel tracking failed: ' . $e->getMessage());
        }

        return $recordId;
    }

    /**
     * Cycle rollover — once the subscription's reset date has passed, zero the
     * counter and push the dates forward, mirroring
     * app:reset-monthly-limits-for-stores. Keeps billing correct even when the
     * daily command hasn't fired: the next session start self-heals.
     */
    private function rollCycleIfNeeded(Store $store): void
    {
        $subscription = $store->subscription;
        $cycleEnd = $subscription?->monthly_reset_date ?? $subscription?->next_reset_date;

        if (!$cycleEnd || $cycleEnd->isFuture()) {
            return;
        }

        $store->monthly_sessions = 0;
        $store->save();

        $subscription->monthly_reset_date = now()->addMonth();
        if ($subscription->interval === 'monthly') {
            $subscription->next_reset_date = now()->addMonth();
        }
        $subscription->save();
    }

    private function alertRefusal(Store $store, ?Plan $plan, string $reason): void
    {
        try {
            PumbleAlert::send(
                "⚠️ **Try-on billing: sessions being refused** — `{$store->shopify_domain}` "
                . "(plan: {$plan?->name}, reason: {$reason}). "
                . 'Shoppers see "Try-on is unavailable" until this is fixed.'
            );
        } catch (Throwable $e) {
            Log::error('Try-on billing refusal alert failed: ' . $e->getMessage());
        }
    }
}
