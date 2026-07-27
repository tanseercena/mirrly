<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;

class MailService
{
    protected $statusUrl = 'https://status.brevo.com/api/v2/summary.json';

    public function getBrevoStatus()
    {
        //        return 'issue'; // For temp fix brevo suspend issue
        return Cache::remember('brevo_service_status', 300, function () {
            $response = Http::get($this->statusUrl);

            if (!$response->successful()) {
                return 'unknown';
            }

            $components = collect($response->json('components'));

            $servicesToCheck = [
                'SMTP',
                'Outbound Emails Delivery',
            ];

            $issues = $components->whereIn('name', $servicesToCheck)
                ->filter(function ($component) {
                    return $component['status'] !== 'operational';
                });

            return $issues->isEmpty() ? 'operational' : 'issue';
        });
    }

    public function send($to, $mailable, $store = null)
    {
        $status = $this->getBrevoStatus();

        $mailer = $status === 'operational' ? 'sendinblue' : 'mailersend';

        // For Store that has lots of orders then use mailer send maielr
        $stores = [
            //7,  // For my local need to remove or comment before push
            5272,   // f0cwyr-bb.myshopify.com
        ];
        if ($store && in_array($store->id, $stores)) {
            $mailer = 'mailersend';
        }


        if ($store && $store->setting->smtp_enabled) {
            $smtp_details = $store->setting->smtp_details;

            try {
            // Clean and validate SMTP details before configuration
            $host = trim(str_replace(['smtp://', 'smtps://', 'http://', 'https://'], '', $smtp_details['server_name']));
            $port = (int) $smtp_details['port'];
            $username = isset($smtp_details['username']) ? trim($smtp_details['username']) : null;
            $password = isset($smtp_details['password']) ? trim($smtp_details['password']) : null;

            // Set up the mailer configuration dynamically
            config([
                'mail.mailers.custom_smtp_' . $store->id => [
                    'transport' => 'smtp',
                    'host' => $host,
                    'port' => $port,
                    'encryption' => $this->getEncryption($smtp_details),
                    'username' => ($smtp_details['require_authentication'] && $username) ? $username : null,
                    'password' => ($smtp_details['require_authentication'] && $password) ? $password : null,
                    'timeout' => 30,
                    'local_domain' => env('MAIL_EHLO_DOMAIN', '[127.0.0.1]'),
                    'auth_mode' => null, // Let Laravel auto-detect
                ]
            ]);

            // Send email using custom mailer with error handling
                Mail::mailer('custom_smtp_' . $store->id)->to($to)->send($mailable);
            } catch (\Exception $e) {
                // Log error and fallback to default mailer
                \Log::error('Custom SMTP failed for store:  '. $store->shopify_domain . ' => ' . $e->getMessage());

                // Fallback to app mailer
                Mail::mailer($mailer)->to($to)->send($mailable);
            }
        } else {
            Mail::mailer($mailer)->to($to)->send($mailable);
        }
    }

    // Helper method for encryption
    private function getEncryption($smtp_details)
    {
        // Handle different encryption formats
        if (isset($smtp_details['encryption'])) {
            $encryption = strtolower(trim($smtp_details['encryption']));
            if (in_array($encryption, ['tls', 'ssl', 'starttls'])) {
                return $encryption === 'starttls' ? 'tls' : $encryption;
            }
        }

        if (isset($smtp_details['tls_secure'])) {
            if ($smtp_details['tls_secure'] === true || $smtp_details['tls_secure'] === 'true' || $smtp_details['tls_secure'] === 1 || $smtp_details['tls_secure'] === '1') {
                return 'tls';
            } elseif ($smtp_details['tls_secure'] === 'ssl') {
                return 'ssl';
            }
        }

        // Auto-detect based on port
        $port = (int) $smtp_details['port'];
        if ($port === 465) {
            return 'ssl';
        } elseif ($port === 587 || $port === 2587) {
            return 'tls';
        }

        // No encryption for port 25 or others
        return null;
    }
}
