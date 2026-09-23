<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Shopper-facing email from the try-on result screen — hands the shopper a
 * signed, expiring download link to the recording they explicitly opted into.
 * The video is never attached (Brevo/Sendinblue rejects video files) and its
 * 'local' copy stays private; only this HMAC-signed URL exposes it, and only
 * until the link's expiry.
 */
class TryOnRecordingMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $storeName,
        public string $productTitle,
        public string $downloadUrl,
        public string $expiresLabel,
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your try-on video',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.tryon-recording',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
