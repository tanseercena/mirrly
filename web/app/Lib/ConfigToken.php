<?php

namespace App\Lib;

// Short-lived (~5 min) signed JWT tying a /session call back to the exact
// /config response the shopper was shown. Signed with the app key so it can
// only be minted server-side; /session verifies it before doing any work.
class ConfigToken
{
    public const TTL = 300;

    public static function mint(string $shop, ?string $productId, ?string $variantId): string
    {
        $segments = [
            self::base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT'])),
            self::base64UrlEncode(json_encode([
                'shop' => $shop,
                'product_id' => $productId,
                'variant_id' => $variantId,
                'exp' => time() + self::TTL,
            ])),
        ];
        $signature = hash_hmac('sha256', implode('.', $segments), (string) config('app.key'), true);
        $segments[] = self::base64UrlEncode($signature);

        return implode('.', $segments);
    }

    /**
     * Returns the claims array for a valid, unexpired token; null otherwise.
     */
    public static function verify(?string $token): ?array
    {
        if (!$token) {
            return null;
        }

        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$header, $payload, $signature] = $parts;
        $expected = self::base64UrlEncode(
            hash_hmac('sha256', $header . '.' . $payload, (string) config('app.key'), true)
        );
        if (!hash_equals($expected, $signature)) {
            return null;
        }

        $claims = json_decode(self::base64UrlDecode($payload), true);
        if (!is_array($claims) || ($claims['exp'] ?? 0) < time()) {
            return null;
        }

        return $claims;
    }

    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string
    {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', (4 - strlen($data) % 4) % 4));
    }
}
