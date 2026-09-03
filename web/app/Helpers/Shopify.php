<?php

namespace App\Helpers;

use App\Models\Session;
use Illuminate\Support\Facades\Log;
use JsonException;
use Shopify\Clients\Graphql;
use Shopify\Exception\HttpRequestException;
use Shopify\Exception\MissingArgumentException;

class Shopify
{
    /**
     * Resolve the offline access token for a shop from the sessions table
     * (background jobs have no Shopify session context).
     *
     * @param $shop
     * @return string|null
     */
    public static function accessTokenFor($shop)
    {
        $session = Session::where('shop', $shop)
            ->whereNotNull('access_token')
            ->first();

        return $session->access_token ?? null;
    }

    /**
     * Extract the numeric id from a Shopify GID (e.g. gid://shopify/Product/123 -> 123).
     *
     * @param $gid
     * @return int
     */
    public static function numericId($gid)
    {
        return (int) substr((string) $gid, strrpos((string) $gid, '/') + 1);
    }

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
