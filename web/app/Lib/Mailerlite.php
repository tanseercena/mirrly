<?php

namespace App\Lib;

use Illuminate\Support\Facades\Log;
use MailerLiteApi\MailerLite as MailerLiteApi;
use MailerLiteApi\Api\Subscribers;
use MailerLiteApi\Api\Groups;

class Mailerlite
{
    private $apiKey;

    public function __construct($apiKey)
    {
        $this->apiKey = $apiKey;
    }

    public function addSubscriber($name, $email, $groupId)
    {

        // Initialize the MailerLite SDK
        $mailerLiteClient = new MailerLiteApi($this->apiKey);

        // Create a new subscriber
        $subscriber = [
            'email' => $email,
            'name' => $name
        ];

        // Add the subscriber to the specified group
        $subscribersApi = $mailerLiteClient->subscribers($groupId);
        $response = $subscribersApi->create($subscriber);

        // Check if the subscriber was added successfully
        // if ($response->isSuccess()) {
        //     return true;
        // } else {
        //     return false;
        // }
    }

    public function getAllGroups()
    {

        // Initialize the MailerLite SDK
        $mailerLiteClient = new MailerLiteApi($this->apiKey);

        // Get all groups
        $groupsApi = $mailerLiteClient->groups();
        $groups = $groupsApi->get();

        // Check if groups were retrieved successfully
        if ($groups) {
            return response()->json([
                'success' => true,
                'message' => 'Lists fetched successfully',
                'data' => collect($groupsApi->get()),
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred'
            ]);
        }
    }
}
