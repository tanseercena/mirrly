<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $title }}</title>

    @if($provider === 'wistia')
        <!-- Wistia Player Script -->
        <script src="https://fast.wistia.com/player.js" async></script>
    @endif

    <style>
        body {
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #1A1A1A;
            color: #fff;
            font-family: Arial, sans-serif;
            flex-direction: column;
        }

        h2 {
            margin-bottom: 20px;
            text-align: center;
        }

        .video-wrapper {
            width: 100%;
            max-width: 900px;
            aspect-ratio: 16/9;
            position: relative;
        }

        .spinner-wrapper {
            position: absolute;
            inset: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #1A1A1A;
            z-index: 10;
        }

        .spinner {
            border: 8px solid #444;
            border-top: 8px solid #1AB7EA;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
        }

        iframe, .wistia_embed {
            width: 100% !important;
            height: 100% !important;
            border-radius: 8px;
        }
    </style>
</head>
<body>

@if($provider === 'wistia')
    <h2>{{ $title }}</h2>
@endif

<div class="video-wrapper">
    <div class="spinner-wrapper" id="spinner">
        <div class="spinner"></div>
    </div>

    @if($provider === 'vimeo')
        {!! $embed_frame !!}
    @elseif($provider === 'wistia')
        <iframe src="{{ $embed_frame }}"
                frameborder="0"
                allowfullscreen
                allow="autoplay; fullscreen">
        </iframe>
    @endif
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {

    const spinner = document.getElementById('spinner');

    @if($provider === 'vimeo')
        const iframe = document.querySelector('iframe');
        if (iframe) {
            iframe.addEventListener('load', function() {
                spinner.style.display = 'none';
            });
        }
    @endif

    @if($provider === 'wistia')
        const iframe = document.querySelector('iframe');
        if (iframe) {
            iframe.addEventListener('load', function() {
                spinner.style.display = 'none';
            });
        }
    @endif

});
</script>

</body>
</html>
