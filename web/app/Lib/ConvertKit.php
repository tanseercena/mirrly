<?php

namespace App\Lib;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class ConvertKit
{
    private $apiKey;
    private $client;

    public function __construct($apiKey)
    {
        $this->apiKey = $apiKey;
        $this->client = new Client([
            'base_uri' => 'https://api.convertkit.com/v3/',
        ]);
    }

    public function addSubscriber($name, $email, $tagId)
    {
        try {
            // Create a new subscriber or get an existing one
            $subscriberResponse = $this->client->post('tags/' . $tagId . '/subscribe', [
                'query' => [
                    'api_key' => $this->apiKey,
                ],
                'json' => [
                    'email' => $email,
                    'first_name' => $name,
                ],
            ]);
        } catch (\Exception $e) {
            return false;
        }
    }

    public function getAllTags()
    {
        try {
            $response = $this->client->get('tags', [
                'query' => [
                    'api_key' => $this->apiKey,
                ],
            ]);

            $data = json_decode($response->getBody(), true);
            return response()->json(['tags' => $data], 200);
        } catch (\Exception $e) {
            // Handle exceptions
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
