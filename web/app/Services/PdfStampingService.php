<?php

namespace App\Services;

use setasign\Fpdi\Tcpdf\Fpdi;
use setasign\FpdiProtection\FpdiProtection;

class PdfStampingService
{
    /**
     * Process a PDF file with custom stamping and protection
     *
     * @param string $inputPath Path to original PDF
     * @param string $outputPath Path where processed PDF will be saved
     * @param array $stampData Customer-specific data for stamping
     * @param array $protectionOptions PDF protection settings
     * @return string Path to processed PDF
     */
    public function processAndProtectPdf(
        string $inputPath,
        string $outputPath,
        array $stampData,
        array $protectionOptions = []
    ): string {
        // Create instance of FPDI Protection
        $pdf = new FpdiProtection('P', 'mm', 'A4', true);
//        $pdf = new FpdiProtection();

        // Set protection if options are provided
        if (!empty($protectionOptions)) {
            $this->applyProtection($pdf, $protectionOptions);
        }

        // Get the number of pages in the original PDF
        $pageCount = $pdf->setSourceFile($inputPath);

        // Parse pages to stamp
        $pagesToStamp = $this->getPagesToStamp($stampData['pages_to_stamp'] ?? 'all', $pageCount);

        // Process each page of the PDF
        for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
            // Import page
            $templateId = $pdf->importPage($pageNo);

            // Get the size of the imported page
            $size = $pdf->getTemplateSize($templateId);

            // Add a page with the same orientation as the imported page
            $pdf->AddPage(
                $size['orientation'],
                [$size['width'], $size['height']]
            );

            // Use the imported page as a template
            $pdf->useTemplate($templateId);

            // Apply stamp to the page only if it's in the pages to stamp list
            if (in_array($pageNo, $pagesToStamp)) {
                $this->applyStamp($pdf, $stampData);
            }
        }

        // Save the processed PDF
        $pdf->Output($outputPath, 'F');

        return $outputPath;
    }

    /**
     * Apply protection settings to the PDF
     */
    private function applyProtection(FpdiProtection $pdf, array $options): void
    {
        // Default protection settings
        $userPassword = $options['user_password'] ?? '';
        $ownerPassword = $options['owner_password'] ?? '';
        $permissions = [];

        // Map protection options to FPDI protection flags
        if (isset($options['allow_printing']) && $options['allow_printing']) {
            $permissions[] = FpdiProtection::PERM_PRINT;
        }

        if (isset($options['allow_copy']) && $options['allow_copy']) {
            $permissions[] = FpdiProtection::PERM_COPY;
        }

        if (isset($options['allow_modify']) && $options['allow_modify']) {
            $permissions[] = FpdiProtection::PERM_MODIFY;
        }

        if (isset($options['allow_annot']) && $options['allow_annot']) {
            $permissions[] = FpdiProtection::PERM_ANNOT;
        }

        // Set PDF protection - the correct method signature
        // The 4th parameter is the revision/compatibility level, not encryption
        // Using 3 for 128-bit RC4 encryption (PDF 1.4)
        $pdf->setProtection(
            $permissions,
            $userPassword,
            $ownerPassword,
            3
        );
    }

    /**
     * Apply stamp to the current page
     */
    private function applyStamp(FpdiProtection $pdf, array $stampData): void {
        // Get page dimensions
        $pageWidth = $pdf->GetPageWidth();
        $pageHeight = $pdf->GetPageHeight();

        // Configure font for the stamp
        $fontFamily = $this->mapFont($stampData['font'] ?? 'arial');
        $fontSize = intval($stampData['text_size'] ?? 12);
        $pdf->SetFont($fontFamily, '', $fontSize);

        // Parse text color
        $textColor = $stampData['text_color'] ?? '#000000';
        list($r, $g, $b) = $this->hexToRgb($textColor);
        $pdf->SetTextColor($r, $g, $b);

        $stampText = $stampData['stamp_text'];
        $textWidth = $pdf->GetStringWidth($stampText);

        // Margin from page edges
        $margin = $stampData['vertical_adjustment'] ?? 5;
        $lineHeight = $fontSize * 1.2;

        // Determine X position based on alignment
        $alignment = $stampData['alignment'] ?? 'center';

        // Check if text needs to be wrapped
        if ($textWidth > $pageWidth - (2 * $margin)) {
            // Text needs wrapping
            $maxWidth = $pageWidth - (2 * $margin);
            $words = explode(' ', $stampText);
            $line = '';
            $lines = [];

            foreach ($words as $word) {
                $testLine = $line ? $line . ' ' . $word : $word;
                $testWidth = $pdf->GetStringWidth($testLine);

                if ($testWidth <= $maxWidth) {
                    $line = $testLine;
                } else {
                    $lines[] = $line;
                    $line = $word;
                }
            }

            if ($line) {
                $lines[] = $line;
            }

            // Calculate total height needed for all lines
            $totalHeight = count($lines) * $lineHeight;

            // Position Y coordinate for the first line
            // Make sure all lines fit on the current page
            $startY = $pageHeight - $margin - $totalHeight + $lineHeight;

            // Draw each line
            foreach ($lines as $index => $line) {
                $lineWidth = $pdf->GetStringWidth($line);

                switch ($alignment) {
                    case 'left':
                        $textX = $margin;
                        break;
                    case 'right':
                        $textX = $pageWidth - $lineWidth - $margin;
                        break;
                    case 'center':
                    default:
                        $textX = ($pageWidth - $lineWidth) / 2;
                        break;
                }

                $textY = $startY + ($index * $lineHeight);
                $pdf->Text($textX, $textY, $line);
            }
        } else {
            // No wrapping needed
            switch ($alignment) {
                case 'left':
                    $textX = $margin;
                    break;
                case 'right':
                    $textX = $pageWidth - $textWidth - $margin;
                    break;
                case 'center':
                default:
                    $textX = ($pageWidth - $textWidth) / 2;
                    break;
            }

            // Position at the bottom of the page with margin
            $textY = $pageHeight - $margin;
            $pdf->Text($textX, $textY, $stampText);
        }
    }

    /**
     * Compose stamp text from customer data
     */
    private function composeStampText(array $stampData): string
    {
        $parts = [];

        if (!empty($stampData['customer_name'])) {
            $parts[] = "Purchased by: " . $stampData['customer_name'];
        }

        if (!empty($stampData['order_id'])) {
            $parts[] = "Order: " . $stampData['order_id'];
        }

        if (!empty($stampData['purchase_date'])) {
            $parts[] = "Date: " . $stampData['purchase_date'];
        }

        if (!empty($stampData['custom_text'])) {
            $parts[] = $stampData['custom_text'];
        }

        return implode(' | ', $parts);
    }

    private function hexToRgb($hex) {
        // Remove # if present
        $hex = ltrim($hex, '#');

        // Parse the hex color
        if(strlen($hex) == 3) {
            $r = hexdec(substr($hex, 0, 1).substr($hex, 0, 1));
            $g = hexdec(substr($hex, 1, 1).substr($hex, 1, 1));
            $b = hexdec(substr($hex, 2, 1).substr($hex, 2, 1));
        } else {
            $r = hexdec(substr($hex, 0, 2));
            $g = hexdec(substr($hex, 2, 2));
            $b = hexdec(substr($hex, 4, 2));
        }

        return [$r, $g, $b];
    }

    /**
     * Parse the pages_to_stamp parameter and return an array of page numbers to stamp
     *
     * @param string|null $pagesToStampStr Page numbers as comma-separated string or 'all'
     * @param int $totalPages Total number of pages in the PDF
     * @return array Array of page numbers to stamp
     */
    private function getPagesToStamp($pagesToStampStr, int $totalPages): array
    {
        // Default to all pages if not specified or explicitly set to 'all'
        if (empty($pagesToStampStr) || $pagesToStampStr === 'all') {
            return range(1, $totalPages);
        }

        $pages = [];
        $pageRanges = explode(',', $pagesToStampStr);

        foreach ($pageRanges as $range) {
            $range = trim($range);

            // Convert to integer and ensure it's within valid range
            $pageNum = (int)$range;
            if ($pageNum >= 1 && $pageNum <= $totalPages) {
                $pages[] = $pageNum;
            }
        }

        return $pages;
    }

    /**
     * Map font names to TCPDF-compatible font names
     *
     * @param string $fontName The font name from frontend
     * @return string The TCPDF-compatible font name
     */
    private function mapFont(string $fontName): string
    {
        // Define font mapping from frontend names to TCPDF font names
        $fontMap = [
            'arial' => 'helvetica',           // TCPDF uses 'helvetica' for Arial-like fonts
            'times' => 'times',               // Times New Roman
            'courier' => 'courier',           // Courier New
            'sans-serif' => 'helvetica',      // Map sans-serif to helvetica (Arial-like)
            'helvetica' => 'helvetica',        // Helvetica
            'dejavu' => 'dejavusans',          // DejaVu Sans
            'dejavusans' => 'dejavusans',      // DejaVu Sans (exact match)
            'freesans' => 'freesans',          // Free Sans
            'freeserif' => 'freeserif',        // Free Serif
            'freemono' => 'freemono',          // Free Mono
            'pdfahelvetica' => 'pdfahelvetica', // PDF/A Helvetica
            'pdfatimes' => 'pdfatimes',        // PDF/A Times
            'pdfacourier' => 'pdfacourier',    // PDF/A Courier
            'ocrb' => 'ocrb',                 // OCR-B
        ];

        // Return the mapped font or default to helvetica if not found
        return $fontMap[strtolower($fontName)] ?? 'helvetica';
    }

    /**
     * Add a custom TTF font to TCPDF (for future use)
     * This method can be used to add custom fonts if needed
     *
     * @param string $fontFamily Font family name
     * @param string $fontPath Path to TTF file
     * @param bool $embedded Whether to embed the font
     * @return bool Success status
     */
    public function addCustomFont(string $fontFamily, string $fontPath, bool $embedded = true): bool
    {
        try {
            // This would require TCPDF instance, so it's for future implementation
            // For now, this is a placeholder for adding custom fonts

            // Example usage when needed:
            // $tcpdf = new TCPDF();
            // $tcpdf->AddFont($fontFamily, '', $fontPath, $embedded);

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
