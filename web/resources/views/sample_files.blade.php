<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Files</title>
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
        <div style="text-align: center;">

        </div>
        <div class="header">
            @if(!empty($settings['download_logo']['url']))
                <img src="{{ $settings['download_logo']['url'] }}" alt="Company Logo" style="max-width: 200px;">
            @elseif(!empty($settings['company_name']))
                <h1>{{ $settings['company_name'] }}</h1>
            @endif
            <h1>{{ $settings['sample_file_title'] ?? $orderNumber }}</h1>
        </div>

        <h3>{{ $settings['digital_products_title'] ?? 'Products' }}</h3>
        <div class="product">
            <img
                src="{{ $product->associatedProduct['images'][0]['originalSrc'] ?? 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081' }}"
                alt="Product Image">
            <div class="product-details">
                <h3>{{ $product->associatedProduct['title'] }}</h3>

                @if(isset($product->associatedProduct['variants']) && count($product->associatedProduct['variants']) > 0)
                    @if(count($product->associatedProduct['variants']) == 1)
                        @if(!$product->associatedProduct['hasOnlyDefaultVariant'])
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

        <div class="file-list">
            @foreach ($files as $file)
                        <div class="file-item">
                            <div class="file-info">
                                <span>{{ $file['name'] }}</span>
                                <small>{{ $file['type'] }} / {{ $file['size'] }}</small>
                            </div>
                            @php
                                $fileId = base64_encode($file['id']);
                            @endphp
                            <a href="{{ url('/download/' . $fileId . '/file') }}" target="_blank">
                                {{ $settings['download_file_button_text'] ?? 'Download file' }}
                            </a>
                        </div>
            @endforeach
        </div>

        <div class="footer">
            <div class="footer">
                <p>
                    {!! $settings['contact_details'] ?? '' !!}
                </p>

            </div>
        </div>
    </div>

    <p style="text-align: center">
        Powered by <a href="https://apps.shopify.com/digitally-digital-products" target="_blank">Digitally - Digital Products</a>
    </p>
</body>

</html>
