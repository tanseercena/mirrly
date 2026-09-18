<?php

namespace App\Support;

use App\Models\Store;

/**
 * Resolves the mailer a store notifications go out on: the store own SMTP
 * when enabled in Settings, otherwise the app default. Mirrors the dynamic
 * mailer configuration TestSmtpController uses for its test send.
 */
class StoreMailer
{
    public static function mailerFor(Store $store): string
    {
        $details = $store->setting?->smtp_details;

        if (empty($store->setting?->smtp_enabled) || !is_array($details)) {
            return (string) config('mail.default');
        }

        $name = 'store_' . $store->id;
        $host = trim(str_replace(['smtp://', 'smtps://', 'http://', 'https://'], '', (string) ($details['server_name'] ?? '')));
        $username = isset($details['username']) ? trim((string) $details['username']) : null;
        $password = isset($details['password']) ? trim((string) $details['password']) : null;

        config([
            'mail.mailers.' . $name => [
                'transport' => 'smtp',
                'host' => $host,
                'port' => (int) ($details['port'] ?? 587),
                'encryption' => self::encryption($details),
                'username' => (!empty($details['require_authentication']) && $username) ? $username : null,
                'password' => (!empty($details['require_authentication']) && $password) ? $password : null,
                'timeout' => 30,
                'local_domain' => env('MAIL_EHLO_DOMAIN', '[127.0.0.1]'),
                'auth_mode' => null,
            ],
        ]);

        return $name;
    }

    private static function encryption(array $details): ?string
    {
        if (!isset($details['encryption'])) {
            return 'tls';
        }

        $encryption = strtolower(trim((string) $details['encryption']));
        if (in_array($encryption, ['tls', 'ssl', 'starttls'], true)) {
            return $encryption === 'starttls' ? 'tls' : $encryption;
        }

        return null;
    }
}
