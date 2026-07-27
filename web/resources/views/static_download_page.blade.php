<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Download Page</title>
    <style>
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
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            @if(!empty($settings['download_logo']['url']))
                <img src="{{ $settings['download_logo']['url'] }}" alt="Company Logo" style="max-width: 200px;">
            @elseif(!empty($settings['company_name']))
                <h1>{{ $settings['company_name'] }}</h1>
            @endif

            <h1>{{ $settings['order_title'] ?? $sample_order }}</h1>
        </div>

        @if((isset($settings['show_zip_downloads']) && $settings['show_zip_downloads']) || !isset($settings['show_zip_downloads']))
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h3 style="margin: 0;">{{ $settings['digital_products_title'] ?? 'Products' }}</h3>
            <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
                <a href="#" style="display: inline-flex; align-items: center; background-color: #28a745; color: white; padding: 8px 14px; border-radius: 5px; text-decoration: none; font-size: 14px;">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="16" width="16" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin-right: 6px;">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12"/>
                    </svg>
                    {{ $settings['download_order_all_files_button_text'] ?? 'Download All Order Files' }}
                </a>
            </div>
        </div>
        @endif

        <div class="product">
            <img src="{{ $sample_product['image'] }}" alt="Product Image">
            <div class="product-details">
                <h3>{{ $settings['digital_products_title'] ?? $sample_product['title'] }}</h3>
                <p>{{ $sample_product['variant'] }}</p>
            </div>
        </div>

        @if((isset($settings['show_zip_downloads']) && $settings['show_zip_downloads']) || !isset($settings['show_zip_downloads']))
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h5 style="margin: 0;">Files</h5>
            <a href="#" style="display: inline-flex; align-items: center; background-color: #007bff; color: #fff; padding: 6px 10px; border-radius: 5px; text-decoration: none; font-size: 14px;">
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px; margin-right: 5px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                </svg>
                {{ $settings['download_product_all_files_button_text'] ?? 'Download Product Files' }}
            </a>
        </div>
        @endif

        <div class="file-list">
            @foreach($sample_files as $file)
                <div class="file-item">
                    <div class="file-info">
                        <span>{{ $file['name'] }}</span>
                        <small>{{ $file['type'] }} / {{ $file['size'] }}</small>
                    </div>
                    <a href="{{ $file['url'] }}" target="_blank">
                        {{ $settings['download_file_button_text'] ?? "Download file" }}
                    </a>
                </div>
            @endforeach
        </div>

        <div class="footer">
            <p>
                {!! $settings['contact_details'] ?? 'If you have any questions, please contact us at <a href="mailto:support@digitally.test">support@digitally.test</a> or visit our website <a href="https://digitally.test">https://digitally.test</a>.' !!}
            </p>
        </div>
    </div>
</body>

</html>
