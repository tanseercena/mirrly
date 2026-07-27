<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Log;
use JsonException;
use Shopify\Clients\Graphql;
use Shopify\Exception\HttpRequestException;
use Shopify\Exception\MissingArgumentException;

class Shopify
{
    /**
     * @param $shop
     * @param $accessToken
     * @param $query
     * @return array
     * @throws JsonException
     * @throws HttpRequestException
     * @throws MissingArgumentException
     */
    public static function queryOrException($shop, $accessToken, $query)
    {
        $client = new Graphql($shop, $accessToken);

        $response = $client->query($query);
        $responseBody = $response->getDecodedBody();

        if (!empty($responseBody["errors"])) {
            Log::error($responseBody["errors"]);
        }

        return $responseBody;
    }
}
