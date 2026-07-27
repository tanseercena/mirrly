<?php

namespace App\Lib;

use Illuminate\Support\Facades\Log;
use MailchimpMarketing\ApiClient;

class MailChimp
{

    private $mailchimp;

    public function __construct($api_key)
    {
        $this->mailchimp = new ApiClient();
        $this->mailchimp->setConfig([
            'apiKey' => $api_key,
            'server' => explode('-', $api_key)[1]
        ]);
    }

    public function addSubscriber($name, $email, $list_id)
    {

        try {
            $response = $this->mailchimp->lists->addListMember($list_id, [
                'email_address' => $email,
                'status_if_new' => 'subscribed',
                'status' => 'subscribed',
                'merge_fields' => [
                    'Name' => $name
                ],
            ]);

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function getAllLists()
    {
        try {
            $response = $this->mailchimp->lists->getAllLists();

            $lists = [];
            foreach ($response->lists as $list) {
                $lists[] = [
                    'id' => $list->id,
                    'name' => $list->name,
                ];
            }

            return response()->json([
                'success' => true,
                'message' => 'Lists fetched successfully',
                'data' => $lists,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
