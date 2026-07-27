<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-touch-fullscreen" content="yes">
    <title>Loading Downloads...</title>
    <link rel="icon" type="image/x-icon" href="/images/loading_icon.png">
    <style>
        * {
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
        }

        html, body {
            touch-action: pan-x pan-y;
            height: 100%;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .loading-container {
            text-align: center;
            background-color: #fff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 100%;
        }

        .loading-spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .loading-text {
            font-size: 18px;
            color: #555;
            margin-bottom: 10px;
        }

        .loading-subtext {
            font-size: 14px;
            color: #888;
            margin-bottom: 20px;
        }

        .error-message {
            background-color: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            display: none;
        }

        .retry-button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
            font-size: 14px;
        }

        .retry-button:hover {
            background-color: #0056b3;
        }

        .retry-button:disabled {
            background-color: #6c757d;
            cursor: not-allowed;
        }

        .logo {
            max-width: 150px;
            margin-bottom: 20px;
        }
    </style>
</head>

<body>
    <div class="loading-container">
        <div class="loading-spinner"></div>
        <div class="loading-text">Preparing Your Downloads...</div>
        <div class="loading-subtext">Please wait while we fetch your files</div>

        <div id="error-message" class="error-message">
            <strong>Error:</strong> <span id="error-text"></span>
            <br>
            <button id="retry-button" class="retry-button">Retry</button>
        </div>
    </div>

    <script>
        let retryCount = 0;
        const maxRetries = 5;
        let retryTimeout;

        function fetchDownloadContent() {
            const orderId = '{{ $order_id }}';

            if (!orderId) {
                showError('Order ID not found');
                return;
            }

            fetch(`/file/${orderId}/download-content`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'text/html'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else if (response.status === 503) {
                    // Order still being processed
                    throw new Error('Order is being processed. Please wait and refresh this page after a few seconds.');
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            })
            .then(html => {
                // Replace the entire page content
                document.documentElement.innerHTML = html;
            })
            .catch(error => {
                console.error('Error fetching download content:', error);

                if (error.message.includes('Order is being processed')) {
                    // For order processing errors, retry after a delay
                    if (retryCount < maxRetries) {
                        retryCount++;
                        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff

                        document.querySelector('.loading-subtext').textContent =
                            `Order is being processed... Retrying in ${delay/1000} seconds (Attempt ${retryCount}/${maxRetries})`;

                        retryTimeout = setTimeout(fetchDownloadContent, delay);
                    } else {
                        showError('Order is taking longer than expected to process. Please refresh the page manually in a few moments.');
                    }
                } else {
                    showError(error.message);
                }
            });
        }

        function showError(message) {
            document.getElementById('error-text').textContent = message;
            document.getElementById('error-message').style.display = 'block';
            document.querySelector('.loading-spinner').style.display = 'none';
            document.querySelector('.loading-text').style.display = 'none';
            document.querySelector('.loading-subtext').style.display = 'none';
        }

        function resetLoading() {
            document.getElementById('error-message').style.display = 'none';
            document.querySelector('.loading-spinner').style.display = 'block';
            document.querySelector('.loading-text').style.display = 'block';
            document.querySelector('.loading-subtext').style.display = 'block';
            document.querySelector('.loading-subtext').textContent = 'Please wait while we fetch your files';
            retryCount = 0;
        }

        document.getElementById('retry-button').addEventListener('click', function() {
            resetLoading();
            fetchDownloadContent();
        });

        // Start fetching content when page loads
        document.addEventListener('DOMContentLoaded', fetchDownloadContent);

        // Cleanup on page unload
        window.addEventListener('beforeunload', function() {
            if (retryTimeout) {
                clearTimeout(retryTimeout);
            }
        });
    </script>
</body>

</html>
