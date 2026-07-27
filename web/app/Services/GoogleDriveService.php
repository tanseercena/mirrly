<?php

namespace App\Services;

use Google\Client;
use Google\Service\Drive;
use Google\Service\Drive\DriveFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Exception;

class GoogleDriveService
{
    private $client;
    private $service;
    private $tempDir;

    public function __construct()
    {
        $this->tempDir = storage_path('app/temp');
        $this->initializeGoogleClient();
    }

    /**
     * Initialize Google Client with Service Account
     */
    private function initializeGoogleClient()
    {
        $credentialsPath = config("services.google_drive.service_file");

        if (!$credentialsPath || !file_exists($credentialsPath)) {
            throw new Exception('Google Drive service account credentials file not found. Please set GOOGLE_DRIVE_SERVICE_ACCOUNT_FILE in .env');
        }

        $this->client = new Client();
        $this->client->setAuthConfig($credentialsPath);
        $this->client->addScope(Drive::DRIVE_READONLY);
        $this->client->setScopes(Drive::DRIVE_READONLY);

        $this->service = new Drive($this->client);
    }

    /**
     * Extract Google Drive ID from URL
     */
    public function extractId($url)
    {
        $patterns = [
            '/\/file\/d\/([a-zA-Z0-9_-]+)(?:\/|[?]|$)/',
            '/\/folders\/([a-zA-Z0-9_-]+)(?:\/|[?]|$)/',
            '/\/drive\/folders\/([a-zA-Z0-9_-]+)(?:\/|[?]|$)/',
            '/[?&]id=([a-zA-Z0-9_-]+)(?:&|$)/',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $url, $matches)) {
                // Remove any trailing punctuation or extra characters
                return rtrim($matches[1], '.');
            }
        }

        return null;
    }

    /**
     * Download a single file from Google Drive
     */
    public function downloadFile($fileId, $destination = null)
    {
        try {
            // Debug: Log the fileId being used (with hex dump to see hidden chars)
            Log::info('Attempting to download file with ID: ' . $fileId);

            // Clean the file ID - remove any trailing dots or whitespace
            $fileId = trim($fileId);
            $fileId = rtrim($fileId, '.');

            // Try direct download first for public files
            $tempDir = $destination ?? $this->tempDir;
            if (!file_exists($tempDir)) {
                mkdir($tempDir, 0755, true);
            }

            // Try downloading using public URL format
            $downloadUrl = "https://drive.google.com/uc?export=download&id=" . $fileId;
            $tempFilePath = $tempDir . '/temp_' . uniqid();

            // Get headers first to extract filename
            $headers = [];
            $ch = curl_init($downloadUrl);
            curl_setopt($ch, CURLOPT_HEADER, true);
            curl_setopt($ch, CURLOPT_NOBODY, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HEADERFUNCTION, function($curl, $header) use (&$headers) {
                $len = strlen($header);
                $header = explode(':', $header, 2);
                if (count($header) < 2) return $len;
                $headers[strtolower(trim($header[0]))][] = trim($header[1]);
                return $len;
            });

            curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            // Now download the file
            if ($httpCode === 200) {
                $ch = curl_init($downloadUrl);
                $fp = fopen($tempFilePath, 'wb');
                curl_setopt($ch, CURLOPT_FILE, $fp);
                curl_setopt($ch, CURLOPT_HEADER, 0);
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
                $success = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);
                fclose($fp);
            } else {
                $success = false;
            }

            if ($success && $httpCode === 200 && filesize($tempFilePath) > 0) {
                // Extract filename from headers or use default
                $fileName = 'download_' . $fileId;

                // Try to get filename from Content-Disposition header
                if (isset($headers['content-disposition'][0])) {
                    $contentDisposition = $headers['content-disposition'][0];
                    if (preg_match('/filename[^;=\n]*=(([\'"]).*?\2|[^;\n]*)/', $contentDisposition, $matches)) {
                        $fileName = trim($matches[1], '"\'');
                    }
                }

                // If no filename found, check mime type
                if ($fileName === 'download_' . $fileId && function_exists('mime_content_type')) {
                    $mimeType = mime_content_type($tempFilePath);
                    if ($mimeType === 'application/x-rar-compressed') {
                        $fileName .= '.rar';
                    } elseif ($mimeType === 'application/zip') {
                        $fileName .= '.zip';
                    } elseif ($mimeType === 'application/pdf') {
                        $fileName .= '.pdf';
                    }
                }

                $filePath = $tempDir . '/' . $fileName;
                rename($tempFilePath, $filePath);

                return [
                    'fileName' => $fileName,
                    'filePath' => $filePath,
                    'size' => filesize($filePath),
                    'mimeType' => $mimeType ?? 'application/octet-stream'
                ];
            }

            // Clean up temp file if failed
            if (file_exists($tempFilePath)) {
                unlink($tempFilePath);
            }

            // If direct download failed, try with API
            Log::info('Direct download failed (HTTP Code: ' . $httpCode . '), trying with API');

            // Get file metadata
            $file = $this->service->files->get($fileId, [
                'fields' => 'name, mimeType, size, webViewLink'
            ]);

            // Check if it's a Google Workspace file
            if ($this->isGoogleWorkspaceFile($file->getMimeType())) {
                return $this->downloadGoogleWorkspaceFile($file);
            }

            $fileName = $file->getName();
            $filePath = $tempDir . '/' . $fileName;

            // For archive files and files that don't support direct API download
            // Use the webViewLink to download via cURL
            $restrictedFormats = [
                'application/x-rar-compressed',
                'application/zip',
                'application/x-7z-compressed',
                'application/x-tar',
                'application/gzip',
                'application/x-gzip',
                'application/x-bzip2',
                'application/x-xz',
            ];

            if (in_array($file->getMimeType(), $restrictedFormats)) {
                // Download using cURL with webViewLink
                $downloadUrl = $file->getWebViewLink();
                $downloadUrl = str_replace('/view', '/uc?export=download', $downloadUrl);

                $ch = curl_init($downloadUrl);
                $fp = fopen($filePath, 'wb');

                curl_setopt($ch, CURLOPT_FILE, $fp);
                curl_setopt($ch, CURLOPT_HEADER, 0);
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

                $success = curl_exec($ch);
                curl_close($ch);
                fclose($fp);

                if (!$success) {
                    throw new Exception("Failed to download archive file: " . curl_error($ch));
                }
            } else {
                // Download file content via API
                $response = $this->service->files->get($fileId, [
                    'alt' => 'media'
                ]);

                file_put_contents($filePath, $response->getBody());
            }

            return [
                'fileName' => $fileName,
                'filePath' => $filePath,
                'size' => $file->getSize(),
                'mimeType' => $file->getMimeType()
            ];

        } catch (Exception $e) {
            Log::error('Google Drive file download error: ' . $e->getMessage());
            throw new Exception('Failed to download file: ' . $e->getMessage());
        }
    }

    /**
     * Download all files from a Google Drive folder
     */
    public function downloadFolder($folderId, $destination = null)
    {
        try {
            $tempDir = $destination ?? $this->tempDir;
            if (!file_exists($tempDir)) {
                mkdir($tempDir, 0755, true);
            }

            $downloadedFiles = [];

            // Get folder metadata
            $folder = $this->service->files->get($folderId, [
                'fields' => 'name'
            ]);

            $folderName = $folder->getName();
            $folderPath = $tempDir . '/' . $folderName;
            if (!file_exists($folderPath)) {
                mkdir($folderPath, 0755, true);
            }

            // List all files in the folder (including subfolders)
            $optParams = [
                'q' => "'{$folderId}' in parents and trashed=false",
                'fields' => 'files(id, name, mimeType, size)',
                'pageSize' => 1000
            ];

            $results = $this->service->files->listFiles($optParams);
            $files = $results->getFiles();

            if (empty($files)) {
                Log::info("No files found in folder: {$folderName}");
            }

            foreach ($files as $file) {
                // Skip subfolders for now (you can implement recursive download if needed)
                if ($file->getMimeType() === 'application/vnd.google-apps.folder') {
                    Log::info("Skipping subfolder: {$file->getName()}");
                    continue;
                }

                $fileInfo = $this->downloadFile($file->getId(), $folderPath);
                $downloadedFiles[] = $fileInfo;
            }

            return $downloadedFiles;

        } catch (Exception $e) {
            Log::error('Google Drive folder download error: ' . $e->getMessage());
            throw new Exception('Failed to download folder: ' . $e->getMessage());
        }
    }

    /**
     * Download Google Workspace file (Docs, Sheets, Slides)
     */
    private function downloadGoogleWorkspaceFile($file)
    {
        try {
            $fileName = $file->getName();
            $filePath = $this->tempDir . '/' . $fileName;

            // Export Google Workspace files to appropriate format
            $exportFormats = [
                'application/vnd.google-apps.document' => 'application/pdf',
                'application/vnd.google-apps.spreadsheet' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.google-apps.presentation' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'application/vnd.google-apps.drawing' => 'image/svg+xml',
                'application/vnd.google-apps.script' => 'application/vnd.google-apps.script+json'
            ];

            $mimeType = $file->getMimeType();

            if (isset($exportFormats[$mimeType])) {
                $response = $this->service->files->export($file->getId(), $exportFormats[$mimeType]);
                $content = $response->getBody();

                // Change extension based on export type
                $newFileName = $this->changeFileNameExtension($fileName, $mimeType);
                $filePath = $this->tempDir . '/' . $newFileName;

                file_put_contents($filePath, $content);

                return [
                    'fileName' => $newFileName,
                    'filePath' => $filePath,
                    'size' => filesize($filePath),
                    'mimeType' => $exportFormats[$mimeType]
                ];
            }

            throw new Exception('Unsupported Google Workspace file type');

        } catch (Exception $e) {
            throw new Exception('Failed to download Google Workspace file: ' . $e->getMessage());
        }
    }

    /**
     * Check if file is Google Workspace file
     */
    private function isGoogleWorkspaceFile($mimeType)
    {
        $googleWorkspaceTypes = [
            'application/vnd.google-apps.document',
            'application/vnd.google-apps.spreadsheet',
            'application/vnd.google-apps.presentation',
            'application/vnd.google-apps.drawing',
            'application/vnd.google-apps.script',
            'application/vnd.google-apps.forms'
        ];

        return in_array($mimeType, $googleWorkspaceTypes);
    }

    /**
     * Change file extension based on export type
     */
    private function changeFileNameExtension($fileName, $mimeType)
    {
        $nameWithoutExt = pathinfo($fileName, PATHINFO_FILENAME);

        $extensions = [
            'application/vnd.google-apps.document' => '.pdf',
            'application/vnd.google-apps.spreadsheet' => '.xlsx',
            'application/vnd.google-apps.presentation' => '.pptx',
            'application/vnd.google-apps.drawing' => '.svg',
            'application/vnd.google-apps.script' => '.json'
        ];

        if (isset($extensions[$mimeType])) {
            return $nameWithoutExt . $extensions[$mimeType];
        }

        return $fileName;
    }

    /**
     * Get file/folder metadata
     */
    public function getFileInfo($fileId)
    {
        try {
            $file = $this->service->files->get($fileId, [
                'fields' => 'name, mimeType, size, webViewLink, owners'
            ]);

            return [
                'name' => $file->getName(),
                'mimeType' => $file->getMimeType(),
                'size' => $file->getSize(),
                'isFolder' => $file->getMimeType() === 'application/vnd.google-apps.folder',
                'webViewLink' => $file->getWebViewLink()
            ];

        } catch (Exception $e) {
            throw new Exception('Failed to get file info: ' . $e->getMessage());
        }
    }

    /**
     * Clean up temporary files
     */
    public function cleanupTempFiles($filePath)
    {
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }
}
