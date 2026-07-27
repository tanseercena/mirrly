<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SendOwlService
{
    private $baseUrl;

    public function __construct(private $store, private $apiKey = null, private $apiSecret = null)
    {
        $this->baseUrl = config('services.sendowl.base_url');
    }

    /**
     * Check if SendOwl credentials are configured
     */
    public function isConfigured()
    {
        return !empty($this->apiKey) && !empty($this->apiSecret);
    }

    /**
     * Set API credentials
     */
    public function setCredentials($apiKey, $apiSecret)
    {
        $this->apiKey = $apiKey;
        $this->apiSecret = $apiSecret;
    }

    /**
     * Make authenticated request to SendOwl API
     */
    private function makeRequest($method, $endpoint, $data = [])
    {
        if (!$this->isConfigured()) {
            throw new Exception('SendOwl API credentials are not configured');
        }

        $url = $this->baseUrl . $endpoint;

        try {
            Log::info("SendOwl API Request", [
                'method' => $method,
                'url' => $url,
                'data' => $data
            ]);

            $response = Http::withBasicAuth($this->apiKey, $this->apiSecret)
                ->withHeaders([
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->timeout(30)
                ->{$method}($url, $data);

            if (!$response->successful()) {
                throw new Exception("SendOwl API request failed: {$response->status()} {$response->body()}");
            }

            return $response->json();
        } catch (Exception $e) {
            Log::error("SendOwl API error: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get all products from SendOwl with pagination
     */
    public function getAllProducts($page = 1)
    {
        try {
            $response = $this->makeRequest('GET', "/products?per_page=50&page={$page}");

            // Handle rate limiting - wait 1 second between requests
            sleep(1);

            return $response;
        } catch (Exception $e) {
            Log::error("Failed to fetch SendOwl products: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get single product details
     */
    public function getProduct($productId)
    {
        try {
            $response = $this->makeRequest('GET', "/products/{$productId}");

            // Handle rate limiting
            sleep(1);

            Log::info("SendOwl product response for {$productId}", $response);

            return $response;
        } catch (Exception $e) {
            Log::error("Failed to fetch SendOwl product {$productId}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Issue an order for a product to get download URLs
     */
    public function issueOrder($productId, $buyerDetails = [])
    {
        try {
            // Simple approach - just required fields first
            $requestData = [
                'order' => [
                    'buyer_email' => $this->store->email,
                    'buyer_name' => $this->store->owner,
                ]
            ];

            // Add any additional buyer details if provided
            if (!empty($buyerDetails)) {
                $requestData['order'] = array_merge($requestData['order'], $buyerDetails);
            }

            Log::info("SendOwl issue order request for product {$productId}", $requestData);

            $response = $this->makeRequest('POST', "/products/{$productId}/issue", $requestData);

            // Handle rate limiting
            sleep(1);

            return $response;
        } catch (Exception $e) {
            Log::error("Failed to issue order for SendOwl product {$productId}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Download file from SendOwl URL
     */
    public function downloadFile($url, $fileName)
    {
        try {
            $response = Http::withBasicAuth($this->apiKey, $this->apiSecret)
                ->timeout(60)
                ->get($url);

            if (!$response->successful()) {
                throw new Exception("Failed to download file: {$response->status()}");
            }

            // Get file content
            $fileContent = $response->body();

            // Extract filename from headers or use parameter as fallback
            $disposition = $response->header('Content-Disposition');
            $extractedFileName = null;

            if ($disposition) {
                // Parse Content-Disposition header to extract filename
                if (preg_match('/filename[^;=\n]*=((["\']).*?\2|[^;\n]*)/', $disposition, $matches)) {
                    $extractedFileName = trim($matches[1], '"\'');
                }
            }

            // Use extracted filename, fallback to parameter, then to default
            $actualFileName = $fileName;

            // Ensure filename has proper extension based on MIME type
            $finalFileName = $actualFileName;
            $extension = pathinfo($actualFileName, PATHINFO_EXTENSION);
            $mimeType = $response->header('Content-Type') ?: $this->getMimeTypeFromFilename($actualFileName);

            if (empty($extension)) {
                $extensionFromMime = $this->getExtensionFromMimeType($mimeType);
                if ($extensionFromMime) {
                    $finalFileName .= '.' . $extensionFromMime;
                }
            }

            // Create storage path similar to regular file uploads
            $storagePath = 'duser_' . $this->store->id . '/' . $fileName;

            // Store file using Laravel's Storage facade
            Storage::put($storagePath, $fileContent);

            // Get the URL using Storage::url()
            $fileUrl = Storage::url($storagePath);

            // Get file metadata
            $byteSize = strlen($fileContent);

            Log::info("SendOwl file downloaded successfully", [
                'content_disposition' => $disposition,
                'extracted_filename' => $extractedFileName,
                'parameter_filename' => $fileName,
                'actual_filename' => $fileName,
                'storage_path' => $storagePath,
                'file_url' => $fileUrl,
                'size' => $byteSize,
                'mime_type' => $mimeType
            ]);

            return [
                'path' => $storagePath,
                'url' => $fileUrl,
                'size' => $byteSize,
                'mime_type' => $mimeType,
                'original_filename' => $actualFileName,
                'filename' => $fileName,
            ];
        } catch (Exception $e) {
            Log::error("Failed to download file from {$url}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Process SendOwl product and get file information
     */
    public function processProductFiles($productId)
    {
        try {
            // Get product details directly
            $product = $this->getProduct($productId);
            \Log::info("SendOwl product details", [$product]);

            // Extract actual product data from nested structure
            $actualProduct = $product['product'] ?? $product;
            $orginalFileName = $actualProduct['name'];

            $downloadedFiles = [];

            // Check if product has attachment info
            if (isset($actualProduct['attachment']) && !empty($actualProduct['attachment'])) {
                $attachment = $actualProduct['attachment'];
                $orginalFileName = $attachment['filename'];

                // Create a file record with attachment info but no URL
                $fileData = [
                    'original_filename' => $attachment['filename'] ?? 'unknown-file',
                    'size' => $attachment['size'] ?? 0,
                    'mime_type' => $this->getMimeTypeFromFilename($attachment['filename'] ?? ''),
                    'source' => 'sendowl_product_metadata_only',
                    'product_id' => $productId,
                    'note' => 'File metadata from SendOwl (download URL unavailable - requires manual access)',
                    'url' => null, // No actual URL available without order issuance
                ];

                //$downloadedFiles[] = $fileData;
            }

            // Check for self-hosted URL
            if (!empty($actualProduct['self_hosted_url'])) {
                $fileData = [
                    'original_filename' => 'self-hosted-file',
                    'url' => $actualProduct['self_hosted_url'],
                    'source' => 'sendowl_self_hosted',
                    'product_id' => $productId,
                    'note' => 'Self-hosted file URL'
                ];

                $downloadedFiles[] = $fileData;
            }

            // Try to get download URLs from existing orders only
            try {
                Log::info("Checking existing orders for download URLs...");
                $orders = $this->getProductOrders($productId);

                if (isset($orders) && is_array($orders) && !empty($orders)) {
                    Log::info("Found " . count($orders) . " orders for product {$productId}");

                    // Reverse the array to check most recent orders first
                    $reversedOrders = array_reverse($orders);

                    // Find first order with download_items (starting from most recent)
                    $orderWithDownloads = null;
                    foreach ($reversedOrders as $order) {
                        // The order structure is nested: ["order" => [...]]
                        $orderData = $order['order'] ?? $order;

                        if (isset($orderData['download_items']) && !empty($orderData['download_items'])) {
                            $orderWithDownloads = $order;
                            Log::info("Found order with download_items for product {$productId}");
                            break;
                        }
                    }

                    if ($orderWithDownloads) {
                        $orderData = $orderWithDownloads['order'] ?? $orderWithDownloads;
                        foreach ($orderData['download_items'] as $downloadItem) {
                            // Download items are also nested: ["download_item" => [...]]
                            $downloadItemData = $downloadItem['download_item'] ?? $downloadItem;

                            if (isset($downloadItemData['url']) && isset($downloadItemData['name'])) {
                                Log::info("Downloading file from existing order download_item: " . $downloadItemData['url']);
                                $fileData = $this->downloadFile($downloadItemData['url'], $orginalFileName);

                                // Extract the actual filename from the response path
                                $actualFileName = $fileData['filename'] ?: $downloadItemData['name'];

                                $downloadedFiles[] = array_merge($fileData, [
                                    'original_filename' => $actualFileName,
                                    'source' => 'sendowl_existing_order',
                                    'order_id' => $orderData['id'] ?? null,
                                ]);
                            }
                        }
                    } else {
                        Log::info("No order with download_items found for product {$productId} after checking all orders");
                    }
                } else {
                    Log::info("No existing orders found for product {$productId}");
                }
            } catch (\Exception $ordersError) {
                Log::warning("Could not get existing orders: " . $ordersError->getMessage());
            }

            return $downloadedFiles;
        } catch (Exception $e) {
            Log::error("Failed to process files for product {$productId}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get MIME type from filename
     */
    private function getMimeTypeFromFilename($filename)
    {
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

        $mimeTypes = [
            'pdf' => 'application/pdf',
            'zip' => 'application/zip',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'mp3' => 'audio/mpeg',
            'mp4' => 'video/mp4',
            'txt' => 'text/plain',
            'csv' => 'text/csv',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls' => 'application/vnd.ms-excel',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];

        return $mimeTypes[$extension] ?? 'application/octet-stream';
    }

    /**
     * Get file extension from MIME type
     */
    private function getExtensionFromMimeType($mimeType)
    {
        $extensions = [
            'application/pdf' => 'pdf',
            'application/zip' => 'zip',
            'application/x-zip-compressed' => 'zip',
            'image/jpeg' => 'jpg',
            'image/pjpeg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'audio/mpeg' => 'mp3',
            'audio/mp3' => 'mp3',
            'video/mp4' => 'mp4',
            'text/plain' => 'txt',
            'text/csv' => 'csv',
            'application/msword' => 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
            'application/vnd.ms-excel' => 'xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'xlsx',
            'application/epub+zip' => 'epub',
            'application/x-mobipocket-ebook' => 'mobi',
            'image/webp' => 'webp',
            'image/svg+xml' => 'svg',
            'audio/wav' => 'wav',
            'audio/ogg' => 'ogg',
            'video/webm' => 'webm',
            'application/json' => 'json',
            'application/xml' => 'xml',
        ];

        return $extensions[$mimeType] ?? null;
    }

    /**
     * Get existing orders for a product to find download URLs
     */
    public function getProductOrders($productId)
    {
        try {
            // Use orderable parameter with Product-{id} format
            $response = $this->makeRequest('GET', "/orders?orderable=Product-{$productId}&state=free");

            // Handle rate limiting
            sleep(1);

            return $response;
        } catch (Exception $e) {
            Log::error("Failed to get orders for SendOwl product {$productId}: " . $e->getMessage());
            throw $e;
        }
    }


    /**
     * Search products by term
     */
    public function searchProducts($term)
    {
        try {
            $response = $this->makeRequest('GET', "/products/search?term=" . urlencode($term));

            // Handle rate limiting
            sleep(1);

            return $response;
        } catch (Exception $e) {
            Log::error("Failed to search SendOwl products: " . $e->getMessage());
            throw $e;
        }
    }
}
