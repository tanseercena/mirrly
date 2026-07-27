<?php

namespace App\Http\Controllers;

use App\Mail\TestSmtpEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;
use App\Models\Store;

class TestSmtpController extends Controller
{
    public function sendSmtpMail(Request $request)
    {
        $shop = $request->get('shopifySession')->getShop();
        $store = Store::with("setting")->where('shopify_domain', $shop)
        ->orWhere('domain', $shop)->first();
        $from_name = $store->setting->email_content['from'] ?? $store->name;

        $to = $request->email;
        $message = "Hello welcome to our website";
        $subject = "SMTP Email Test";
        $mailer = 'smtp';
        $smtp_details = $store->setting->smtp_details;

//        Mail::mailer($mailer)->to($to)->send(new TestSmtpEmail($message, $subject, $from_name, $smtp_details['fromEmail']));


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
        try {
            Mail::mailer('custom_smtp_' . $store->id)->to($to)->send(new TestSmtpEmail($message, $subject, $from_name, $smtp_details['fromEmail']));
        } catch (\Exception $e) {
            // Log error and fallback to default mailer
            \Log::error('Custom SMTP failed: ' . $e->getMessage(), [
                'store_id' => $store->id,
                'host' => $host,
                'port' => $port,
                'error' => $e->getMessage()
            ]);
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
