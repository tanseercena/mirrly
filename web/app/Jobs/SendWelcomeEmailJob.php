<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Mail\AppInstalled;
use Illuminate\Support\Facades\Mail;
use App\Models\Store;

class SendWelcomeEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Store $store
    ) {}

    public function handle(): void
    {
        Mail::to($this->store->email)
            ->send(new AppInstalled($this->store));
    }
}

