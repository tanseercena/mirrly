<?php

namespace App\Mail;

use App\Models\Store;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CompletionRateMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Store $store,
        public float $rate,
        public int $threshold,
        public int $started,
        public int $completed,
    ) {
    }

    public function envelope(): Envelope
    {
        $rate = round($this->rate, 1);

        return new Envelope(
            subject: "Low try-on completion rate — {$rate}% (below {$this->threshold}%)",
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.tryon.completion-rate');
    }
}
