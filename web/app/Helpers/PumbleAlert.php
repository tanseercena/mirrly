<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PumbleAlert
{
    public static function send(string $message): void
    {
        try {

            $response = Http::withHeaders([
                'Api-Key' => config('services.pumble.api_key'),
                'Accept' => 'application/json',
            ])->post('https://pumble-api-keys.addons.marketplace.cake.com/sendMessage', [
                'text' => $message,
                'channelId' => config('services.pumble.channel_id'),
                'asBot' => true, 
            ]);

        } catch (\Throwable $e) {
            Log::error('Pumble notification failed', [
                'error' => $e->getMessage(),
            ]);
        }
    }
}
