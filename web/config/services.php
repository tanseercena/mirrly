<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'sendinblue' => [
        'key' => env('BREVO_API_KEY'),
        'list_id' => env('BREVO_LIST_ID'),
    ],

    'sendowl' => [
        'api_key' => env('SENDOWL_API_KEY'),
        'api_secret' => env('SENDOWL_API_SECRET'),
        'base_url' => env('SENDOWL_BASE_URL', 'https://api.sendowl.com/api/v1'),
    ],

    'vimeo' => [
        'client_id' => env('VIMEO_CLIENT_ID', ''),
        'redirect_uri' => env('VIMEO_REDIRECT_URL', ''),
        'client_secret' => env('VIMEO_CLIENT_SECRET', '')
    ],

    'wistia' => [
        'client_id' => env('WISTIA_CLIENT_ID', ''),
        'redirect_uri' => env('WISTIA_REDIRECT_URL', ''),
        'client_secret' => env('WISTIA_CLIENT_SECRET', ''),
    ],

    'google_drive' => [
        'service_file' => env('GOOGLE_DRIVE_SERVICE_ACCOUNT_FILE'),
    ],

    'pumble' => [
        'api_key' => env('PUMBLE_API_KEY'),
        'channel_id' => env('PUMBLE_CHANNEL_ID'),
        'base_url' => env('PUMBLE_BASE_URL', 'https://api.pumble.com'),
    ],

    'hookdeck' => [
      'api_key' => env('HOOKDECK_API_KEY', ''),
    ],

];
