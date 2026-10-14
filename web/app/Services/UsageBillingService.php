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
 * billing cycle (limits.sessions); once those are spent, sessions are granted
 * in prepaid BLOCKS — one usage charge of limits.block_price through the
 * subscription's Shopify usage line item unlocks the next
 * limits.block_sessions sessions. No per-session billing: the charge fires
 * only on the attempt that crosses into a fresh block, and the rest of the
 * block rides on it. Blocks repeat within the cycle until it resets.
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
     * when it crosses into a fresh overage block. TRUE = the attempt may go
     * on to create a session; FALSE = refuse it (the counter was rolled back
     * and an alert raised).
     */
    public function chargeForSession(Store $store, Product $product): bool
    {
        $plan = $this->planFor($store);
        $included = (int) ($plan?->limits['sessions'] ?? 0);
        $blockPrice = (float) ($plan?->limits['block_price'] ?? 0);
        $blockSessions = (int) ($plan?->limits['block_sessions'] ?? 0);

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

        if ($used <= $included) {
            return true;
        }

        // Over the included allowance. Sessions are granted in prepaid blocks:
        // the attempt that opens a fresh block pays limits.block_price once
        // and unlocks the whole block; every other over-limit attempt rides on
        // a block that was already paid for.
        if ($blockSessions <= 0 || $blockPrice <= 0) {
            // Misconfigured plan — refuse rather than grant unbounded
            // over-limit sessions, and flag it loudly.
            DB::table('stores')
                ->where('id', $store->id)
                ->where('monthly_sessions', '>', 0)
                ->decrement('monthly_sessions');
            $this->alertRefusal($store, $plan, 'plan has no usable block terms (block_price/block_sessions missing)');

            return false;
        }

        $opensNewBlock = ($used - $included - 1) % $blockSessions === 0;

        if (!$opensNewBlock) {
            return true;
        }

        if ($this->chargeUsage($store, $plan, $blockPrice, $product, $blockSessions) !== null) {
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
     * Create the Shopify usage record that grants one overage block. Returns
     * the record id, or null on any failure (no subscription / no usage line
     * item / userErrors / network) — null means the caller refuses the session.
     */
    private function chargeUsage(Store $store, ?Plan $plan, float $blockPrice, Product $product, int $blockSessions): ?string
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
                        // never create the same charge twice. A fresh uuid per
                        // call: each block is its own charge.
                        'idempotencyKey' => (string) Str::uuid(),
                        'description' => "Try-on sessions — block of {$blockSessions} ({$product->title})",
                        // API 2024-04+ types price as MoneyInput (USD only, same
                        // as BillingController's recurring charges).
                        'price' => ['amount' => $blockPrice, 'currencyCode' => 'USD'],
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
            'price' => $blockPrice,
            'block_sessions' => $blockSessions,
            'usage_record' => $recordId,
        ]);

        try {
            (new MixpanelService())->track('Usage Charge Created', $store->shopify_domain, [
                'Plan' => $plan?->name,
                'Amount' => $blockPrice,
                'Block Sessions' => $blockSessions,
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
