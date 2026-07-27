<?php

namespace App\Lib\Handlers;

use App\Lib\Handlers\OrderCreated;
use Shopify\Webhooks\Handler;

class OrderUpdated implements Handler
{
    public function handle(string $topic, string $shop, array $body): void
    {
        $orderCreatedHandler = app(OrderCreated::class);
        $orderCreatedHandler->handle($topic, $shop, $body);
    }
}
