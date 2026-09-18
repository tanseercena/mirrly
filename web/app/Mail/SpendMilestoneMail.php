<?php

namespace App\Mail;

use App\Models\Store;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SpendMilestoneMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Store $store,
        public int $used,
        public int $included,
        public int $threshold,
        public float $sessionRate,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "{$this->threshold}% of your included try-on sessions used",
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.tryon.spend-milestone');
    }
}
