<?php

namespace App\Lib;

/**
 * Signed proof that a storefront try-on was launched from the admin
 * ("Test try-on" in the product drawer) rather than by a shopper.
 *
 * Why it must be signed: the launch link lives on the PUBLIC storefront
 * (`?o_try=1` on a product page), so the flag alone can't authorize a
 * billing/tracking bypass — anyone could append it. The admin mints the
 * link with `o_sig` = HMAC(app key, shop|product|expiry); /config verifies
 * it before treating the visit as an admin test, and the admin_test flag
 * then rides inside the signed config token to /session, where billing and
 * session tracking are skipped.
 */
class AdminTestLink
{
    public const TTL = 86400; // 24h — long enough to test, short enough to expire

    public static function sign(string $shop, string $productId, int $expiresAt): string
    {
        return hash_hmac('sha256', "{$shop}|{$productId}|{$expiresAt}", (string) config('app.key'));
    }

    public static function verify(string $shop, ?string $productId, ?string $expiresAt, ?string $signature): bool
    {
        if (!$signature || !$productId || !ctype_digit((string) $expiresAt) || (int) $expiresAt < time()) {
            return false;
        }

        return hash_equals(
            self::sign($shop, (string) $productId, (int) $expiresAt),
            $signature
        );
    }
}
