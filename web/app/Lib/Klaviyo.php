<?php

namespace App\Lib;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use KlaviyoAPI\KlaviyoAPI;
use Klaviyo\Model\ProfileModel;
use GuzzleHttp\Client;

class Klaviyo
{
    protected $klaviyo;
    protected $apiKey;

    public function __construct($api_key)
    {
        $this->apiKey = $api_key;
        $this->klaviyo = new KlaviyoAPI($this->apiKey);
    }

    public function addSubscriber($name, $email, $listId)
    {

        $subscriberData = [
            'profiles' => [
                [
                    'email' => $email,
                    '$first_name' => $name,
                ]
            ]
        ];
        $client = new Client();
        try {
            $response = $client->post("https://a.klaviyo.com/api/v2/list/{$listId}/members?api_key={$this->apiKey}", [
                'json' => $subscriberData,
            ]);
            // return response()->json(['message' => 'Subscriber added successfully'], 200);
        } catch (\Exception $e) {
            // return response()->json(['message' => 'Error adding subscriber: ' . $e->getMessage()], 400);
        }
    }

    public function getLists()
    {
        try {
            $lists = $this->klaviyo->Lists->getLists();
            return response()->json(['lists' => $lists], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error retrieving lists: ' . $e->getMessage()], 400);
        }
    }
}
