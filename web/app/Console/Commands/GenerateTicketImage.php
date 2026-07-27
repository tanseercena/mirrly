<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Imagine\Gd\Font;
use Imagine\Gd\Imagine;
use Imagine\Image\Point;
use Imagine\Image\Palette\RGB;
use Imagine\Image\Point\Center;

class GenerateTicketImage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
//    protected $signature = 'app:generate-ticket-image {ticket_no} {store_id} {lottery_id}';
    protected $signature = 'app:generate-ticket-image
                            {ticket_no : The ticket number}
                            {store_id : The ID of the store}
                            {lottery_id : The ID of the lottery}
                            {title? : The title of the ticket}
                            {subtitle? : The subtitle of the ticket}
                            {phone? : The phone number to display}
                            {website? : The website URL to display}
                            {address? : The address to display}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
//    public function handle()
//    {
//
//        // Create a new instance of Imagine
//        $imagine = new Imagine();
//
//        // Load the ticket template image
//        $ticket = $imagine->open(public_path('images/custom_ticket_bg.png'));
//
//        // Create a new RGB palette for text color
//        $palette = new RGB();
//
//        // Define text properties
//        $fontPath = public_path('font.otf');
//        $font = new Font($fontPath, 24, $palette->color('#fff'));
//        $fontSize = 24;
//        $textColor = $palette->color('#ffffff');
//
//        // Calculate text position (adjust as needed)
//        $textPosition = new Center($ticket->getSize());
//
//        // Draw text on the ticket image
//        $ticket->draw()->text($this->argument('ticket_no'), $font, new Point(680, 415));
//
//        $ticket
//            ->save(public_path('custom_tickets/ticket_'.$this->argument('store_id').'_'.$this->argument('ticket_no').'.png'));
//
//    }

/*
    public function handle()
    {
        // Create a new instance of Imagine
        $imagine = new Imagine();

        // Load the ticket template image
        $ticket = $imagine->open(public_path('images/custom_ticket_bg.png'));

        // Create a new RGB palette for text color
        $palette = new RGB();

        // Define text properties
        $fontPath = public_path('font.otf');
        $font = new Font($fontPath, 24, $palette->color('#fff'));

        // Draw text on the ticket image
        $ticket->draw()->text($this->argument('ticket_no'), $font, new Point(680, 415));

        // Create a temporary file to store the image
        $tempPath = sys_get_temp_dir() . '/ticket_' . $this->argument('store_id') . '_' . $this->argument('ticket_no'). '_'. $this->argument('lottery_id')  . '.png';
        $ticket->save($tempPath);

        // Define the S3 file path
        $filePath = 'duser_' . $this->argument('store_id') . '/tickets' . '/ticket_' . $this->argument('ticket_no') .'_'. $this->argument('lottery_id') . '.png';

        // Upload the file to S3
        Storage::put($filePath, file_get_contents($tempPath));

        // Delete the temporary file
        unlink($tempPath);

        $this->info('Ticket generated and uploaded to S3 successfully.');
        $this->info('S3 path: ' . $filePath);
    }
    */

    public function handle()
    {
        // Get input arguments
        $storeId = $this->argument('store_id');
        $ticketNo = $this->argument('ticket_no');
        $lotteryId = $this->argument('lottery_id');
        $title = $this->argument('title', 'Lottery'); // Default if not provided
        $subtitle = $this->argument('subtitle', 'TICKET');  // Default if not provided
        $phone = $this->argument('phone', '');
        $website = $this->argument('website', '');
        $address = $this->argument('address', '');

        // Create a new instance of Imagine
        $imagine = new Imagine();

        // Load the blank ticket template image
        $ticket = $imagine->open(public_path('images/ticket_bg.png'));

        // Create a new RGB palette for text color
        $palette = new RGB();

        // Get image dimensions to help position elements
        $size = $ticket->getSize();
        $width = $size->getWidth();
        $height = $size->getHeight();
        $centerX = $width / 2;

        // Calculate positions based on the ticket dimensions
        $titleY = $height * 0.15; // Title at 25% from the top
        $subtitleY = $height * 0.30; // Subtitle at 40% from the top
        $ticketBoxY = $height * 0.55; // Ticket number box at 55% from the top
        $ticketBoxHeight = $height * 0.12; // Box height 12% of image height
        $lineY1 = $height * 0.72; // First line at 72% from the top
        $contactY = $height * 0.76; // Contact info at 82% from the top
        $lineY2 = $height * 0.82; // Second line at 93% from the top
        $addressY = $height * 0.85; // Address at 88% from the top

        // Scale font sizes based on image dimensions
        $titleSize = intval($height * 0.1); // Title 10% of image height
        $subtitleSize = intval($height * 0.06); // Subtitle 7% of image height
        $ticketNoSize = intval($height * 0.05); // Ticket number 5% of image height
        $footerSize = intval($height * 0.030); // Footer text 3.5% of image height

        // Define fonts with scaled sizes
        $titleFont = new Font(public_path('font.otf'), $titleSize, $palette->color('#000000'));
        $subtitleFont = new Font(public_path('font.otf'), $subtitleSize, $palette->color('#000000'));
        $ticketNoFont = new Font(public_path('font.otf'), $ticketNoSize, $palette->color('#ffffff'));
        $footerFont = new Font(public_path('font.otf'), $footerSize, $palette->color('#000000'));

        // Draw title (centered at the top portion)
        $this->drawCenteredText($ticket, $title, $titleFont, $centerX, $titleY);

        // Draw subtitle (centered below title)
        $this->drawCenteredText($ticket, "*{$subtitle}*", $subtitleFont, $centerX, $subtitleY);

        // Draw ticket number (centered in a black box, with white text)
        // First draw a black rectangle
        $boxWidth = $width * 0.35; // Box width 35% of image width
        $ticket->draw()->rectangle(
            new Point($centerX - ($boxWidth/2), $ticketBoxY - ($ticketBoxHeight/2)),
            new Point($centerX + ($boxWidth/2), $ticketBoxY + ($ticketBoxHeight/2)),
            $palette->color('#000000'),
            true
        );

        // Then add the ticket number in white text
        $this->drawCenteredText($ticket, $ticketNo, $ticketNoFont, $centerX, $ticketBoxY);

        // Draw a horizontal line
        $lineMargin = $width * 0.15; // Lines start 15% from edges
        $ticket->draw()->line(
            new Point($lineMargin, $lineY1),
            new Point($width - $lineMargin, $lineY1),
            $palette->color('#000000')
        );

        // Draw contact info in the footer
        $this->drawText($ticket, $phone, $footerFont, $width * 0.2, $contactY);
        $this->drawText($ticket, $website, $footerFont, $width * 0.8, $contactY, 'right');
        // Draw another horizontal line
        $ticket->draw()->line(
            new Point($lineMargin, $lineY2),
            new Point($width - $lineMargin, $lineY2),
            $palette->color('#000000')
        );

        $this->drawCenteredText($ticket, $address, $footerFont, $centerX, $addressY);

        // Create a temporary file to store the image
        $tempPath = sys_get_temp_dir() . '/ticket_' . $storeId . '_' . $ticketNo. '_'. $lotteryId  . '.png';
        $ticket->save($tempPath);

        // Define the S3 file path
        $filePath = 'duser_' . $storeId . '/tickets' . '/ticket_' . $ticketNo .'_'. $lotteryId . '.png';

        // Upload the file to S3
        Storage::put($filePath, file_get_contents($tempPath));

        // Delete the temporary file
        unlink($tempPath);

        $this->info('Ticket generated and uploaded to S3 successfully.');
        $this->info('S3 path: ' . $filePath);

        \Log::info('S3 path: ' . $filePath);

        return 0;
    }

    /**
     * Helper method to draw centered text
     */
    private function drawCenteredText($image, $text, $font, $x, $y)
    {
        $textBox = $font->box($text);
        $textWidth = $textBox->getWidth();
        $image->draw()->text($text, $font, new Point($x - ($textWidth / 2), $y));
    }

    /**
     * Helper method to draw aligned text
     */
    private function drawText($image, $text, $font, $x, $y, $align = 'left')
    {
        if ($align === 'right') {
            $textBox = $font->box($text);
            $textWidth = $textBox->getWidth();
            $x = $x - $textWidth;
        }

        $image->draw()->text($text, $font, new Point($x, $y));
    }
}
