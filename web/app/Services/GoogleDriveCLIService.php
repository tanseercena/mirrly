<?php

namespace App\Services;

use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\File;

class GoogleDriveCLIService
{
    /**
     * Download file using gdown CLI with proper filename
     */
    public function downloadFile($fileId, $destination = null)
    {
        // Ensure gdown is installed
        if (!$this->isGdownInstalled()) {
            throw new \Exception("gdown is not installed. Run: pip install gdown");
        }

        // Create temp directory if it doesn't exist
        $tempDir = $destination ?? storage_path("app/temp");
        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        // Get the actual filename from Google Drive
        $actualFileName = $this->getFileNameFromGoogleDrive($fileId);

        // Download with the proper filename
        $finalPath = $tempDir . '/' . $actualFileName;

        // Try multiple download methods

        // Method 1: Try with gdown using the direct ID
        $result = Process::run([
            'python3', '-m', 'gdown',
            "https://drive.google.com/uc?id={$fileId}",
            '-O',
            $finalPath
        ]);

        if (!$result->successful()) {
            // Method 2: Try with fuzzy matching
            $result = Process::run([
                'python3', '-m', 'gdown',
                '--fuzzy',
                "https://drive.google.com/file/d/{$fileId}/view",
                '-O',
                $finalPath
            ]);
        }

        if (!$result->successful()) {
            // Method 3: Try with the script directly if available
            $result = Process::run([
                '/home/tanseer/.local/bin/gdown',
                '--fuzzy',
                "https://drive.google.com/file/d/{$fileId}/view",
                '-O',
                $finalPath
            ]);
        }

        if (!$result->successful()) {
            throw new \Exception("Failed to download file: " . $result->errorOutput());
        }

        // Verify file exists
        if (!file_exists($finalPath)) {
            throw new \Exception("File download failed - file not found at: {$finalPath}");
        }

        return [
            'filePath' => $finalPath,
            'fileName' => $actualFileName
        ];
    }

    /**
     * Get actual filename from Google Drive using HTTP request
     */
    private function getFileNameFromGoogleDrive($fileId)
    {
        try {
            // Make a HEAD request to get Content-Disposition header
            $url = "https://drive.google.com/uc?export=download&id={$fileId}";

            $response = Http::withOptions([
                'allow_redirects' => [
                    'max' => 5,
                    'strict' => false,
                    'referer' => true,
                    'track_redirects' => true
                ]
            ])->head($url);

            // Try to get filename from Content-Disposition header
            $contentDisposition = $response->header('Content-Disposition');

            if ($contentDisposition) {
                // Parse filename from Content-Disposition
                if (preg_match('/filename\*?=["\']?(?:UTF-8\'\')?([^;"\']+)/', $contentDisposition, $matches)) {
                    $filename = urldecode($matches[1]);
                    return $filename;
                }
            }

            // Fallback: Try with confirm parameter for large files
            $confirmUrl = "https://drive.google.com/uc?export=download&id={$fileId}&confirm=t";
            $response = Http::head($confirmUrl);

            $contentDisposition = $response->header('Content-Disposition');
            if ($contentDisposition) {
                if (preg_match('/filename\*?=["\']?(?:UTF-8\'\')?([^;"\']+)/', $contentDisposition, $matches)) {
                    $filename = urldecode($matches[1]);
                    return $filename;
                }
            }

            // If all fails, make a GET request and parse from the page
            return $this->getFileNameFromDrivePage($fileId);

        } catch (\Exception $e) {
            // Fallback to a generic name
            return "gdrive_file_{$fileId}";
        }
    }

    /**
     * Get filename by parsing Google Drive page
     */
    private function getFileNameFromDrivePage($fileId)
    {
        try {
            $url = "https://drive.google.com/file/d/{$fileId}/view";
            $response = Http::get($url);

            if ($response->successful()) {
                $html = $response->body();

                // Try to extract filename from meta tags
                if (preg_match('/<meta property="og:title" content="([^"]+)"/', $html, $matches)) {
                    return $matches[1];
                }

                // Try to extract from title tag
                if (preg_match('/<title>([^<]+)<\/title>/', $html, $matches)) {
                    $title = $matches[1];
                    // Remove " - Google Drive" suffix
                    $title = preg_replace('/ - Google Drive$/', '', $title);
                    return $title;
                }
            }

            return "gdrive_file_{$fileId}";

        } catch (\Exception $e) {
            return "gdrive_file_{$fileId}";
        }
    }

    /**
     * Download folder using gdown CLI
     */
    public function downloadFolder($folderId, $destination = null)
    {
        $outputPath = $destination ?? storage_path("app/temp/{$folderId}");

        if (!file_exists($outputPath)) {
            mkdir($outputPath, 0755, true);
        }

        $result = Process::run([
            'gdown',
            '--folder',
            '--remaining-ok',
            "https://drive.google.com/drive/folders/{$folderId}",
            '-O',
            $outputPath
        ]);

        if (!$result->successful()) {
            throw new \Exception("Failed to download folder: " . $result->errorOutput());
        }

        return File::allFiles($outputPath);
    }

    /**
     * Check if gdown is installed
     */
    private function isGdownInstalled()
    {
        // Check if Python can import gdown module
        $result = Process::run([
            'python3',
            '-c',
            'import gdown; print("gdown available")'
        ]);

        return $result->successful();
    }

    /**
     * Extract Google Drive ID from URL
     */
    public function extractId($url)
    {
        $patterns = [
            '/\/file\/d\/([a-zA-Z0-9_-]+)/',
            '/\/folders\/([a-zA-Z0-9_-]+)/',
            '/[?&]id=([a-zA-Z0-9_-]+)/',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $url, $matches)) {
                return $matches[1];
            }
        }

        return null;
    }
}
