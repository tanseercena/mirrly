<?php

namespace App\Lib;

use GuzzleHttp\Client as GuzzleClient;
use Illuminate\Support\Facades\Log;

class Drip
{
    protected $guzzleClient;
    private $accountID;

    public function __construct($apiKey, $accountID)
    {
        $this->accountID = $accountID;
        $this->guzzleClient = new GuzzleClient([
            'base_uri' => 'https://api.getdrip.com/v2/',
            'auth' => [$apiKey, ''],
            'headers' => [
                'User-Agent' => 'Pushy (www.storenatic.com)',
                'Content-Type' => 'application/json',
            ],
        ]);
    }

    public function addSubscriber($name, $email)
    {
        $params = [
            'subscribers' => [
                [
                    'email' => $email,
                    'custom_fields' => [
                        'name' => $name,
                    ],
                ],
            ],
        ];

        $response = $this->guzzleClient->post($this->accountID . '/subscribers', [
            'json' => $params,
        ]);

        Log::debug($response);
        dd();

        if ($response->getStatusCode() !== 201) {
            // Handle error
            return false;
        }

        return true;
    }

    public function getAllTags()
    {
        $response = $this->guzzleClient->get($this->accountID . '/tags');

        if ($response->getStatusCode() !== 200) {
            // Handle error
            return [];
        }

        $responseData = json_decode($response->getBody(), true);

        $tags = [];
        if (isset($responseData['tags'])) {
            dd($responseData['tags']);
            foreach ($responseData['tags'] as $tag) {
                $tags[] = [
                    'id' => $tag['id'],
                    'name' => $tag['name'],
                ];
            }
        }

        return $tags;
    }
}
