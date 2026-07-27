<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-touch-fullscreen" content="yes">
    <title>Digital Products</title>
    <link rel="icon" type="image/x-icon" href="{{ $settings['download_logo']['url'] ?? '/images/digitally.jpg' }}">
    @if (isset($settings['favicon']['url']))
        <link rel="icon" type="image/x-icon" href="{{ $settings['favicon']['url'] }}">
    @endif
    <style>
        * {
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
        }

        html,
        body {
            touch-action: pan-x pan-y;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 30px;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }

        .header img {
            max-width: 150px;
        }

        .header h1 {
            font-size: 24px;
            margin: 0;
            color: #555;
        }

        .product {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }

        .product img {
            max-width: 120px;
            margin-right: 20px;
            border-radius: 5px;
        }

        .product-details {
            flex-grow: 1;
        }

        .product-details h3 {
            margin: 0;
            font-size: 20px;
            color: #333;
        }

        .product-details p {
            margin: 5px 0 0;
            color: #888;
        }

        .file-list {
            margin-top: 20px;
        }

        .file-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin-bottom: 10px;
            background-color: #f9f9f9;
        }

        .file-item:last-child {
            margin-bottom: 0;
        }

        .file-item .file-info {
            flex-grow: 1;
        }

        .file-item .file-info span {
            display: block;
            font-weight: bold;
        }

        .file-item .file-info small {
            color: #888;
        }

        .file-item a {
            text-decoration: none;
            background-color: #007bff;
            color: #fff;
            padding: 8px 12px;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }

        .file-item a:hover {
            background-color: #0056b3;
        }

        .video-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin-bottom: 10px;
            background-color: #f9f9f9;
        }

        .video-item:last-child {
            margin-bottom: 0;
        }

        .video-item .video-info {
            flex-grow: 1;
        }

        .video-item .video-info span {
            display: block;
            font-weight: bold;
        }

        .video-item .video-info small {
            color: #888;
        }

        .video-item a {
            text-decoration: none;
            background-color: #28a745;
            color: #fff;
            padding: 8px 12px;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }

        .video-item a:hover {
            background-color: #218838;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
            color: #888;
        }

        .footer a {
            color: #007bff;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        /* Add responsive styling for license key and QR code */
        .license-container {
            margin-top: 15px;
            display: flex;
            flex-direction: column;
        }

        .license-key {
            margin-bottom: 10px;
            word-break: break-all;
        }

        .qr-code-container {
            display: flex;
            justify-content: center;
            margin: 10px 0;
        }

        .qr-code {
            width: 200px;
            height: 200px;
            max-width: 100%;
        }

        /* Media query for mobile devices */
        @media (min-width: 768px) {
            .license-container {
                flex-direction: row;
                justify-content: space-between;
                align-items: flex-start;
            }

            .license-key {
                margin-bottom: 0;
                align-self: flex-start;
                max-width: 50%;
            }

            .qr-code-container {
                margin: 0;
            }
        }

        .loading-spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            width: 15px;
            height: 15px;
            animation: spin 2s linear infinite;
            margin-left: 10px;
        }

        .video-title {
            max-width: 600px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div style="text-align: center;">

        </div>
        <div class="header">
            {{--            <img src="{{ asset('images/digitally.jpg') }}" alt="Company Logo"> --}}
            @if (!empty($settings['download_logo']['url']))
                <img src="{{ $settings['download_logo']['url'] }}" alt="Company Logo" style="max-width: 200px;">
            @elseif(!empty($settings['company_name']))
                <h1>{{ $settings['company_name'] }}</h1>
            @endif
            <h1>{{ isset($settings['order_title']) ? str_replace('{order_name}', $order->body['name'], $settings['order_title']) : $orderNumber }}
            </h1>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h3 style="margin: 0;">{{ $settings['digital_products_title'] ?? 'Products' }}</h3>
            @if ($digitalProducts->count() > 0 && $hasAnyFiles)
                @if (
                    (isset($settings['show_zip_downloads']) && $settings['show_zip_downloads']) ||
                        !isset($settings['show_zip_downloads']))
                    <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
                        <a id="download-all-files" href="{{ route('download.all.files', ['id' => $shopifyOrderId]) }}"
                            style="display: inline-flex; align-items: center; background-color: #28a745; color: white; padding: 8px 14px; border-radius: 5px; text-decoration: none; font-size: 14px;">
                            <span id="download-text">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="16" width="16"
                                    stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                                    style="margin-right: 6px;">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" />
                                </svg>
                                {{ $settings['download_order_all_files_button_text'] ?? 'Download All Order Files' }}
                            </span>
                            <div class="loading-spinner" id="loading-spinner-all-files" style="display: none;"></div>
                        </a>
                    </div>
                @endif
            @endif
        </div>

        @foreach ($digitalProducts as $product)
            <div class="product">
                <img src="{{ $product->associatedProduct['images'][0]['originalSrc'] ?? 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081' }}"
                    alt="Product Image">
                <div class="product-details">
                    <h3>{{ $product->associatedProduct['title'] }}</h3>

                    @if (isset($product->associatedProduct['variants']) && count($product->associatedProduct['variants']) > 0)
                        @if (count($product->associatedProduct['variants']) == 1)
                            @if (!isset($product->associatedProduct['hasOnlyDefaultVariant']))
                                <p>{{ $product->associatedProduct['variants'][0]['title'] }}</p>
                            @endif
                        @else
                            <p>All Variants ({{ count($product->associatedProduct['variants']) }})</p>
                        @endif
                    @else
                        <p>No variants available.</p>
                    @endif

                </div>
            </div>

            {{-- Manual Delivery Files Section --}}
            @if(isset($product->manualDeliveryFiles) && $product->manualDeliveryFiles->count() > 0)
            <div class="file-list">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h5 style="margin: 0;">Manual Delivery Files</h5>
                </div>

                @foreach ($product->manualDeliveryFiles as $file)
                    <div class="file-item">
                        <div class="file-info">
                            <span>{{ $file->file_name }}</span>
                            <small>{{ $file->mime_type }} / {{ number_format($file->byte_size / 1024, 2) }} KB</small>
                        </div>
                        <a href="{{ route('download.manual.file', ['manual_file_id' => $file->id, 'product_id' => $product->id, 'order_id' => $shopifyOrderId]) }}" target="_blank">
                            {{ $settings['download_file_button_text'] ?? 'Download file' }}
                        </a>
                    </div>
                @endforeach
            </div>
            @endif

            {{-- Regular Attached Files Section --}}
            @if($product->attachedFiles->count() > 0)
            <div class="file-list">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h5 style="margin: 0;">{{ $settings['files_title'] ?? 'Files' }}</h5>

                        @if ($product->attachedFiles->count() > 1)
                            @if (
                                (isset($settings['show_zip_downloads']) && $settings['show_zip_downloads']) ||
                                    !isset($settings['show_zip_downloads']))
                                <a id="download-product-files-{{ $product->id }}"
                                    href="{{ route('download.single.all', ['id' => $shopifyOrderId, 'dp_id' => $product->id]) }}"
                                    style="display: inline-flex; align-items: center; background-color: #007bff; color: #fff; padding: 6px 10px; border-radius: 5px; text-decoration: none; font-size: 14px;">
                                    <span id="download-text-product-{{ $product->id }}">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            style="width: 16px; height: 16px; margin-right: 5px;" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                                        </svg>
                                        {{ $settings['download_product_all_files_button_text'] ?? 'Download Product Files' }}
                                    </span>
                                    <div class="loading-spinner" id="loading-spinner-product-files-{{ $product->id }}"
                                        style="display: none;"></div>
                                </a>
                            @endif
                        @endif
                    </div>

                    @foreach ($product->attachedFiles as $file)
                        @php
                            $fileDetails = is_array($file) ? $file : json_decode($file, true);
                        @endphp
                        <div class="file-item">
                            <div class="file-info">
                                <span>{{ $fileDetails['fileName'] }}</span>
                                <small>{{ $fileDetails['mimeType'] }} /
                                    {{ number_format($fileDetails['byteSize'] / 1024, 2) }}
                                    KB</small>
                            </div>
                            @php
                                $fileId = base64_encode($file->id);
                            @endphp
                            @if ($product->enable_pdf_stamping && strtolower(pathinfo($file->fileName, PATHINFO_EXTENSION)) == 'pdf')
                                <a href="{{ url('/download-stamped/' . base64_encode($file->id) . '/digital-file/' . $product->id . '/' . $shopifyOrderId) }}"
                                    target="_blank">
                                    {{ $settings['download_file_button_text'] ?? 'Download file' }}
                                </a>
                            @else
                                <a href="{{ url('/download/' . $fileId . '/digital-file/' . $product->id . '/' . $shopifyOrderId) }}"
                                    target="_blank">
                                    {{ $settings['download_file_button_text'] ?? 'Download file' }}
                                </a>
                            @endif
                        </div>
                    @endforeach
                </div>
            @endif

            <div class="file-list">
                @if (count($product->attachedVideos) > 0)
                    <h5>Videos</h5>
                    @foreach ($product->attachedVideos as $video)
                        <div class="video-item">
                            <div class="video-info">
                                <span class="video-title">{{ $video->title }}</span>
                                <small>{{ $video->duration ?? 'N/A' }}</small>
                            </div>
                            @php
                                $videoId = base64_encode($video->id);
                            @endphp
                            <a href="{{ url('/video/' . $videoId . '/stream/' . $product->id . '/' . $shopifyOrderId) }}"
                                target="_blank">
                                {{ 'Watch Video' }}
                            </a>
                        </div>
                    @endforeach
                @endif
            </div>

            <div class="file-list">
                @if(count($product->licenses) > 0)
                    <h5>{{ $settings['license_keys_title'] ?? 'License Keys/Codes' }}</h5>
                    @php
                        // Find matching line items for this product
                        $matchingLineItems = collect($order->body['line_items'])
                            ->where('product_id', last(explode('/', $product->associatedProduct['id'])));
                    @endphp

                    @if($matchingLineItems->isNotEmpty())
                        {{-- NORMAL PRODUCTS: Display licenses via line_items --}}
                        @foreach ($matchingLineItems as $lineItem)
                            <div class="file-item">
                                <div class="file-info">
                                    <span>{{ $lineItem['name'] }}
                                        @if($show_qty)
                                            | x {{ $lineItem['quantity'] }}
                                        @endif
                                    </span>
                                    <div style="margin-top: 10px;"></div>
                                    @php
                                        $lineItemGeneratedLicenses = $generatedLicenses->where("variant_id",$lineItem['variant_id'])->where("item_id", $lineItem['id']);
                                        if($lineItemGeneratedLicenses->count() == 0) {
                                            $lineItemGeneratedLicenses = $generatedLicenses->where("variant_id",$lineItem['variant_id'])->filter(function ($lic) use ($lineItem) {
                                                // Search the 'item_id' attribute for the prefix
                                                return str_starts_with($lic->item_id, $lineItem['id']);
                                            });
                                        }
                                    @endphp
                                    @foreach ($lineItemGeneratedLicenses as $generatedLicense)
                                        <div class="license-container">
                                            <div class="license-key">{{ $generatedLicense->license_key }}</div>
                                            @if ($generatedLicense->license->qr_code_enabled)
                                                <div class="qr-code-container">
                                                    <img src="{{ generateQrCode($product->store_id, $generatedLicense->license_key) }}" alt="QR Code" class="qr-code" />
                                                </div>
                                            @endif
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        @endforeach
                    @else
                        {{-- GLOBAL TRIGGER PRODUCTS: No line_items, display directly --}}
                        @php
                            // For global trigger products, match licenses by product_id
                            // The pseudo line_item created in SendOrderEmail has item_id = 'global_[product_id]'
                            $productLicenses = $generatedLicenses
                                ->filter(function($lic) use ($product) {
                                    // Match by digital_product_id directly on the GeneratedLicense model
                                    return $lic->digital_product_id == $product->id;
                                })
                                ->filter(function($lic) {
                                    // Also check that item_id starts with 'global_' to confirm it's a global trigger product
                                    return str_starts_with($lic->item_id ?? '', 'global_');
                                });
                        @endphp
                        @if($productLicenses->isNotEmpty())
                            @foreach ($productLicenses as $generatedLicense)
                                <div class="file-item">
                                    <div class="file-info">
                                        <div style="margin-top: 10px;"></div>
                                        <div class="license-container">
                                            <div class="license-key">{{ $generatedLicense->license_key }}</div>
                                            @if ($generatedLicense->license->qr_code_enabled)
                                                <div class="qr-code-container">
                                                    <img src="{{ generateQrCode($product->store_id, $generatedLicense->license_key) }}" alt="QR Code" class="qr-code" />
                                                </div>
                                            @endif
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        @endif
                    @endif
                @endif
            </div>

            <div class="file-list">
                @foreach ($product->customLinks as $link)
                    <h5>{{ $settings['custom_links_title'] ?? 'Links' }}</h5>
                    <div class="file-item">
                        <div class="file-info">
                            <span>{{ $link->title }}</span>
                            @if (isset($email_settings['enable_custom_link_button']) && $email_settings['enable_custom_link_button'])
                                <a href="{{ $link->redirect_url }}" target="_blank"
                                    style="background-color: #6297f1; color: white; padding: 4px 12px; text-align: center; text-decoration: none; border-radius: 4px; display: inline-block;margin-bottom: 5px;margin-top: 5px;">
                                    {{ $email_settings['custom_link_button_text'] ?? 'Click Here' }}
                                </a>
                            @else
                                <br>
                                <a href="{{ $link->redirect_url }}" target="_blank"
                                    style="background: transparent; color: blue; padding: 0px;margin-bottom: 5px;display: inline-block">
                                    {{ $link->redirect_url }}
                                </a>
                            @endif

                            @if ($link->link_details)
                                <br><small>Details: {{ $link->link_details }}</small>
                            @endif
                        </div>
                    </div>
                @endforeach
            </div>

        @endforeach

        <div class="footer">
            <div class="footer">
                <p>
                    {!! $settings['contact_details'] ?? '' !!}
                </p>
            </div>
        </div>
    </div>

    @if ($plan == 'free')
        <p style="text-align: center">
            Powered by <a href="https://apps.shopify.com/digitally-digital-products" target="_blank">Digitally - Digital
                Products</a>
        </p>
    @endif

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        $(document).ready(function() {
            $('#download-all-files').click(function(e) {
                e.preventDefault();
                var button = $(this);
                var spinner = $('#loading-spinner-all-files');
                var text = $('#download-text');
                button.prop('disabled', true);
                text.hide();
                spinner.show();

                window.location.href = button.attr('href');
            });

            $('[id^="download-product-files-"]').click(function(e) {
                e.preventDefault();
                var button = $(this);
                var productId = button.attr('id').split('-')[3];
                var spinner = $('#loading-spinner-product-files-' + productId);
                var text = $('#download-text-product-' + productId);

                button.prop('disabled', true);
                text.hide();
                spinner.show();

                window.location.href = button.attr('href');
            });
        });
    </script>
</body>

</html>
