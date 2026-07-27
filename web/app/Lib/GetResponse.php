<?php

namespace App\Lib;

use Illuminate\Http\Request;
use Getresponse\Sdk\GetresponseClientFactory;
use Getresponse\Sdk\Operation\Contacts\CreateContact\CreateContact;
use Getresponse\Sdk\Operation\Model\CampaignReference;
use Getresponse\Sdk\Operation\Model\NewContact;
use Getresponse\Sdk\Operation\Contacts\GetContacts\GetContacts;
use Getresponse\Sdk\Operation\Campaigns\GetCampaigns\GetCampaigns;
use Illuminate\Support\Facades\Log;

class GetResponse
{
    private $client;

    public function __construct($apiKey)
    {
        $this->client = GetresponseClientFactory::createWithApiKey($apiKey);
    }

    public function addSubscriber(string $name, string $email, string $listId)
    {
        $createContact = new NewContact(
            new CampaignReference($listId),
            $email
        );

        $createContact->setName($name);
        $operation = new CreateContact($createContact);

        $response = $this->client->call($operation);


        // if ($response->isSuccess()) {
        //     return $response->getData();
        // } else {
        //     return ['error' => $response->getError()->getMessage()];
        // }
    }


    public function getLists()
    {
        $operation = new GetCampaigns();

        $response = $this->client->call($operation);

        if ($response->isSuccess()) {
            $lists = $response->getData();
            return response()->json(['lists' => $lists], 200);
        } else {
            // return ['error' => $response->getError()->getMessage()];
            return response()->json(['message' => 'Error retrieving lists: ' . $response->getError()->getMessage()], 400);
        }

        return null;
    }
}
