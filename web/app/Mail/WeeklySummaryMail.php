<?php

namespace App\Mail;

use App\Models\Store;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WeeklySummaryMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Store $store,
        public array $stats, // sessions, started, completed, rate, prev_rate, carts, orders, week_start, week_end
    ) {
    }

    public function envelope(): Envelope
    {
        $rate = $this->stats['rate'] !== null ? round($this->stats['rate'], 1) . '%' : 'n/a';

        return new Envelope(
            subject: "Your weekly try-on summary — {$this->stats['sessions']} sessions, {$rate} completed",
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.tryon.weekly-summary');
    }
}
