<?php

namespace App\Services;

use App\Models\Store;
use Exception;
use Illuminate\Support\Facades\Log;
use MailchimpMarketing\ApiClient;

class MailchimpService
{
    private $mailchimp;

    public function __construct(private Store $store)
    {
        if (config('app.mailchimp_token')) {
            $this->mailchimp = new ApiClient();

            $this->mailchimp->setConfig([
                'apiKey' => config('app.mailchimp_token'),
                'server' => explode('-', config('app.mailchimp_token'))[1],
            ]);
        }
    }

    public function addSubscriber()
    {
        if (config('app.mailchimp_token')) {
            try {
                $response = $this->mailchimp->lists->setListMember(config('app.mailchimp_list_id'), $this->store->email, [
                    'email_address' => $this->store->email,
                    'status_if_new' => 'subscribed',
                    'status' => 'subscribed',
                    'merge_fields' => [
                        'FNAME' => ($this->store->owner == trim($this->store->owner) && str_contains(
                            $this->store->owner,
                            ' '
                        )) ? explode(
                            ' ',
                            $this->store->owner
                        )[0] : $this->store->owner,
                        'LNAME' => ($this->store->owner == trim($this->store->owner) && str_contains(
                            $this->store->owner,
                            ' '
                        )) && (count(explode(' ', $this->store->owner)) > 1) ? explode(
                            ' ',
                            $this->store->owner
                        )[1] : '',
                        'STORENAME' => $this->store->name,
                        'STOREURL' => $this->store->domain,
                        'STOREPLAN' => $this->store->shopify_plan
                    ],
                ]);
            } catch (Exception $e) {
                Log::error("Mailchimp service error " . $e->getMessage());
            }
        }

        return $this;
    }

    public function addTag($tag)
    {
        if (config('app.mailchimp_token')) {
            $subscriberHash = md5(strtolower($this->store->email));
            try {
                $this->mailchimp->lists->updateListMemberTags(config('app.mailchimp_list_id'), $subscriberHash, [
                    'tags' => [
                        [
                            'name' => $tag,
                            'status' => 'active',
                        ],
                    ],
                ]);
            } catch (Exception $e) {
                Log::error("Mailchimp service error " . $e->getMessage());
            }
        }

        return $this;
    }

    public function removeTag($tag)
    {
        if (config('app.mailchimp_token')) {
            $subscriberHash = md5(strtolower($this->store->email));
            try {
                $this->mailchimp->lists->updateListMemberTags(config('app.mailchimp_list_id'), $subscriberHash, [
                    'tags' => [
                        [
                            'name' => $tag,
                            'status' => 'inactive',
                        ],
                    ],
                ]);
            } catch (Exception $e) {
                Log::error("Mailchimp service error " . $e->getMessage());
            }
        }

        return $this;
    }
}
