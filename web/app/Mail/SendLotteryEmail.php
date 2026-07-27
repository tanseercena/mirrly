<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendLotteryEmail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(public $lottery, public $order, public $store, public $ticket_no, public $first_name = '', public $last_name = '')
    {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $fromEmail = 'conversionproplus@gmail.com';
        if($this->mailer == 'mailersend') {
            $fromEmail = 'digitally-app@conversionproplus.com';
        }

        $from_name = $this->store->name;
        if(!is_null($this->store->setting)){
            $from_name = $this->store->setting->email_content['from'] ?? $this->store->name;
        }

//        if ($this->store->id == 282 || $this->store->id == 1771) {
//            return new Envelope(
//                from: new Address($fromEmail, $from_name),
//                cc: 'hello@thesnackattack.ca',
//                replyTo: $this->store->email,
//                subject: !is_null($this->store->setting) ?
//                    $this->store->setting->lottery_content['subject']
//                    : 'Your Lottery Ticket: Purchase Confirmation'
//            );
//        }


        return new Envelope(
            from: new Address($fromEmail, $from_name),
            replyTo: $this->store->email,
            subject: !is_null($this->store->setting) ?
                $this->store->setting->lottery_content['subject']
                : 'Your Lottery Ticket: Purchase Confirmation'
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        if ($this->store->setting->ticket_image) {
            return new Content(
                markdown: 'emails.send-lottery-ticket-bg',
            );
        }

        return new Content(
            view: 'emails.send-lottery-ticket',
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
