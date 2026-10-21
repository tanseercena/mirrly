<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Mail\AppInstalled;
use Illuminate\Support\Facades\Mail;
use App\Models\Plan;
use App\Models\Store;

class SendWelcomeEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Store $store
    ) {}

    public function handle(): void
    {
        // The Free plan's included-session limit drives the pricing banner
        // ("Start on the Free plan with N try-on sessions"). Free may be
        // named "Free" or "Starter"; missing/unlimited falls back to the
        // generic sentence in the blade.
        $plan = Plan::whereRaw('LOWER(name) = ?', ['free'])->first()
            ?: Plan::whereRaw('LOWER(name) = ?', ['starter'])->first();

        $limit = $plan?->limits['sessions'] ?? null;
        $freeSessions = is_numeric($limit) && $limit > 0 ? (int) $limit : null;

        Mail::to($this->store->email)
            ->send(new AppInstalled($this->store, $freeSessions));
    }
}

