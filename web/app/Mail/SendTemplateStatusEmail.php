<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class SendTemplateStatusEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $template;
    public $status;
    public $comment;

    public function __construct($template, $status, $comment)
    {
        $this->template = $template;
        $this->status = $status == 'published' ? 'Approved' : 'Not Approved';
        $this->comment = $comment;
    }

    public function envelope(): Envelope
    {

        $subject = $this->status === "Approved" ? "Email Template Approved - " : "Email Template Requires Changes - ";

        return new Envelope(
            subject: $subject . $this->template->title
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.template-status',
            with: [
                'template' => $this->template,
                'status' => $this->status,
                'comment' => $this->comment
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
