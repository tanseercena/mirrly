<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $customTitle ?? '503 Service Unavailable' }}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f8fafc;
            color: #333;
            text-align: center;
        }
        .container {
            max-width: 600px;
            padding: 20px;
        }
        h1 {
            font-size: 72px;
            margin: 0;
        }
        p {
            font-size: 18px;
            margin: 10px 0;
        }
        .small {
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
<div class="container">
    <h1>503</h1>
    <p>{{ $customMessage ?? 'Service Unavailable' }}</p>
    <p class="small">Please try again later or contact support.</p>
</div>
</body>
</html>
