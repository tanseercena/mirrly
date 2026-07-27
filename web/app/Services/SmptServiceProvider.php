<?php

namespace App\Services;
use App\Models\Setting;
use Illuminate\Support\Facades\Config;
class SmptServiceProvider
{
    

    // public function __construct(private $store)
    // {
    //     $this->config = Configuration::getDefaultConfiguration()->setApiKey('api-key', config('services.sendinblue.key'));
    // }

    public function smtpConfirue(){

        $smtpSettings = Setting::first();
    
            if ($smtpSettings) {
                $data = [
                    'transport' =>  $smtpSettings->smtp_details['mail_transport'],
                    'host' => $smtpSettings->smtp_details['server_name'],
                    'port' => $smtpSettings->smtp_details['port'],
                    'encryption' => $smtpSettings->smtp_details['mail_encryption'],
                    'username' => $smtpSettings->smtp_details['username'],
                    'password' => $smtpSettings->smtp_details['Password'],
                    'timeout' => null,
                    'auth_mode' => null,
                ];
                Config::set('mail',$data);
    };

}

}
