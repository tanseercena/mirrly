<?php

namespace App\Services;

use Brevo\Client\Api\ContactsApi;
use Brevo\Client\Api\ListsApi;
use Brevo\Client\Configuration;
use Brevo\Client\Model\AddContactToList;
use Brevo\Client\Model\CreateContact;
use Brevo\Client\Model\RemoveContactFromList;
use Brevo\Client\Model\UpdateAttribute;
use Brevo\Client\Model\UpdateContact;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class BrevoService
{
    private $config;

    public function __construct(private $store)
    {
        $this->config = Configuration::getDefaultConfiguration()->setApiKey('api-key', config('services.sendinblue.key'));
    }

    public function createContact($installed_tag, $active_tag)
    {
        try {
            $parts = explode(" ", $this->store->owner);
            $lastname = array_pop($parts);
            $firstname = implode(" ", $parts);

            $attributes = [
                'FIRSTNAME' => $firstname,
                'LASTNAME' => $lastname,
                'STORENAME' => $this->store->name,
                'STOREURL' => $this->store->domain,
                'SHOPIFYPLAN' => $this->store->shopify_plan,
                'INSTALLED_UNINSTALLED_TAG' => $installed_tag,
                'ACTIVE_INACTIVE_TAG' => $active_tag,
            ];

            $contactData = new CreateContact([
                'email' => $this->store->email,
                'attributes' => (object) $attributes,
                "emailBlacklisted" => false,
                "smsBlacklisted" => false,
                "updateEnabled" => true,
            ]);

            $api = new ContactsApi(new Client(), $this->config);
            $result = $api->createContact($contactData);
            if (isset($result['id'])) {
                $this->store->brevo_id = $result['id'];
                $this->store->save();
            }
        } catch (Exception $e) {
            Log::error("Brevo service error " . $e->getMessage());
            Log::error("ERROR", [$e->getTrace()]);
        }

        return $this;
    }

    public function addToList($list)
    {
        try {
            $emails = new AddContactToList([
                'emails' => [$this->store->email]
            ]);

            $api = new ListsApi(new Client(), $this->config);
            $result = $api->addContactToList($list, $emails);
        } catch (Exception $e) {
            Log::error("Brevo service error " . $e->getMessage());
        }

        return $this;
    }

    public function removeFromList($list)
    {
        try {
            $emails = new RemoveContactFromList([
                'emails' => [$this->store->email]
            ]);

            $api = new ListsApi(new Client(), $this->config);
            $result = $api->removeContactFromList($list, $emails);
        } catch (Exception $e) {
            Log::error("Brevo service error " . $e->getMessage());
        }

        return $this;
    }

    public function updateContact($attributes) {
        try {
//            $attributes = [
//                'STORENAME' => $this->store->name,
//                'STOREURL' => $this->store->domain,
//                'SHOPIFYPLAN' => $this->store->shopify_plan,
//            ];

            $api = new ContactsApi(new Client(), $this->config);
            $updateContact = new UpdateContact($attributes);
            $result = $api->updateContact($this->store->brevo_id, $updateContact);
        } catch (Exception $e) {
            Log::error("Brevo service error " . $e->getMessage());
        }

        return $this;
    }
}
