<?php

namespace App\Support;

use App\Models\NotificationLog;
use App\Models\Plan;
use App\Models\Store;
use Carbon\Carbon;

/**
 * Shared helpers for the settings-page notifications (weekly summary,
 * spend milestone, low completion rate): email resolution, plan gating,
 * billing-cycle boundaries, store timezone parsing and send dedupe.
 */
class StoreNotifications
{
    /**
     * settings.notification.email wins; the store account email is the
     * fallback; null when neither is usable (caller skips + logs).
     */
    public static function resolveEmail(Store $store): ?string
    {
        $custom = trim((string) ($store->setting?->notification['email'] ?? ''));
        if ($custom !== '' && filter_var($custom, FILTER_VALIDATE_EMAIL)) {
            return $custom;
        }

        $default = trim((string) $store->email);
        if ($default !== '' && filter_var($default, FILTER_VALIDATE_EMAIL)) {
            return $default;
        }

        return null;
    }

    /**
     * Active subscription plan, falling back to Free (mirrors usage()).
     */
    public static function planFor(Store $store): ?Plan
    {
        if ($store->subscription && $store->subscription->status === 'active') {
            $plan = Plan::find($store->subscription->plan_id);
            if ($plan) {
                return $plan;
            }
        }

        return Plan::whereRaw('LOWER(name) = ?', ['free'])->first();
    }

    /**
     * The Free plan gets no email notifications at all (merchant decision).
     */
    public static function isFreePlan(?Plan $plan): bool
    {
        return !$plan || strcasecmp($plan->name, 'free') === 0 || empty($plan->limits['sessions']);
    }

    /**
     * Start of the store current billing cycle. The subscription
     * monthly_reset_date is the NEXT reset, so the cycle began one month
     * before it; stores without a subscription fall back to the calendar
     * month.
     */
    public static function cycleStart(Store $store): Carbon
    {
        $reset = $store->subscription?->monthly_reset_date;

        return $reset
            ? Carbon::parse($reset)->subMonthNoOverflow()->startOfDay()
            : now()->startOfMonth();
    }

    /**
     * stores.timezone holds a Shopify-style LABEL ("(GMT-05:00) Eastern Time
     * ..."), not an IANA id. Parse the offset into a "-05:00"-style timezone
     * Carbon understands; no DST correction - the label fixed offset wins.
     */
    public static function timezoneFor(Store $store): string
    {
        if (preg_match('/GMT([+-]\d{1,2}):(\d{2})/', (string) $store->timezone, $m)) {
            $hours = ltrim($m[1], '+');

            return $hours . ':' . $m[2];
        }

        return 'UTC';
    }

    /**
     * True when a notification of $type was already sent since $since
     * (optionally narrowed to a meta field, e.g. which spend milestone).
     */
    public static function alreadySent(Store $store, string $type, Carbon $since, array $metaEquals = []): bool
    {
        $query = NotificationLog::where('store_id', $store->id)
            ->where('type', $type)
            ->where('sent_at', '>=', $since);

        foreach ($metaEquals as $key => $value) {
            $query->where("meta->{$key}", $value);
        }

        return $query->exists();
    }

    public static function logSent(Store $store, string $type, array $meta = []): void
    {
        NotificationLog::create([
            'store_id' => $store->id,
            'type' => $type,
            'meta' => $meta,
            'sent_at' => now(),
        ]);
    }
}
