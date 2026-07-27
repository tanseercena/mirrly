<?php

use App\Lib\EnsureBilling;

return [

    /*
    |--------------------------------------------------------------------------
    | Shopify billing
    |--------------------------------------------------------------------------
    |
    | You may want to charge merchants for using your app. Setting required to true will cause the EnsureShopifySession
    | middleware to also ensure that the session is for a merchant that has an active one-time payment or subscription.
    | If no payment is found, it starts off the process and sends the merchant to a confirmation URL so that they can
    | approve the purchase.
    |
    | Learn more about billing in our documentation: https://shopify.dev/apps/billing
    |
    */
    "billing" => [
        "required" => false,
        // Example set of values to create a charge for $5 one time
        "chargeName" => "Basic",
        "amount" => 9.99,
        "currencyCode" => "USD", // Currently only supports USD
        "interval" => EnsureBilling::INTERVAL_EVERY_30_DAYS,
    ],

    "custom_domain" => env("SHOP_CUSTOM_DOMAIN"),
    "api_key" => env("SHOPIFY_API_KEY", "not_defined"),
    "api_secret" => env("SHOPIFY_API_SECRET", "not_defined"),
    "scopes" => env("SCOPES", "not_defined"),
    "app_handle" => env("SHOPIFY_APP_HANDLE", "digitally"),
    "app_id" => env("SHOPIFY_APP_ID", "88371920897"),

    'hookdeck_webhook_url' => env("HOOKDECK_WEBHOOK_URL", null),

];
