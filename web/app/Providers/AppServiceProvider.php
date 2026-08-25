<?php

namespace App\Providers;

use Shopify\Context;
use Shopify\ApiVersion;
use Shopify\Webhooks\Topics;
use App\Lib\DbSessionStorage;
use Shopify\Webhooks\Registry;
use Illuminate\Support\Facades\URL;
use App\Lib\Handlers\AppUninstalled;
use Illuminate\Support\Facades\Mail;
use App\Lib\Handlers\Gdpr\ShopRedact;
use Illuminate\Support\ServiceProvider;
use App\Lib\Handlers\Gdpr\CustomersRedact;
use Symfony\Component\Mailer\Transport\Dsn;
use App\Lib\Handlers\Gdpr\CustomersDataRequest;



use Symfony\Component\Mailer\Bridge\Sendinblue\Transport\SendinblueTransportFactory;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     * @throws \Shopify\Exception\MissingArgumentException
     */
    public function boot()
    {
        Mail::extend('sendinblue', function () {
            return (new SendinblueTransportFactory)->create(
                new Dsn(
                    'sendinblue+api',
                    'default',
                    config('services.sendinblue.key')
                )
            );
        });

        $host = str_replace('https://', '', config('app.url', 'not_defined'));

        $customDomain = config('shopify.custom_domain', null);
        Context::initialize(
            config('shopify.api_key', 'not_defined'),
            config('shopify.api_secret', 'not_defined'),
            config('shopify.scopes', 'not_defined'),
            $host,
            new DbSessionStorage(),
            config('shopify.version', '2026-07'),
            true,
            false,
            null,
            '',
            null,
            (array)$customDomain,
        );

        URL::forceRootUrl("https://$host");
        URL::forceScheme('https');

        Registry::addHandler(Topics::APP_UNINSTALLED, new AppUninstalled());

        /*
         * This sets up the mandatory GDPR webhooks. You’ll need to fill in the endpoint to be used by your app in the
         * “GDPR mandatory webhooks” section in the “App setup” tab, and customize the code when you store customer data
         * in the handlers being registered below.
         *
         * More details can be found on shopify.dev:
         * https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks
         *
         * Note that you'll only receive these webhooks if your app has the relevant scopes as detailed in the docs.
         */
        Registry::addHandler('CUSTOMERS_DATA_REQUEST', new CustomersDataRequest());
        Registry::addHandler('CUSTOMERS_REDACT', new CustomersRedact());
        Registry::addHandler('SHOP_REDACT', new ShopRedact());


        
    }
}
