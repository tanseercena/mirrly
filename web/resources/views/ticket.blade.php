<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lottery Ticket</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        .container {
            width: 100%;
            max-width: 690px;
            margin: auto;
            padding: 20px;
            text-align: center;
        }

        .ticket-container {
            position: relative;
            width: 100%;
            height: 0;
            padding-top: 43.48%; /* Aspect ratio of the image (height / width * 100) */
            background: url('{{ asset('images/custom_ticket_bg.png') }}') no-repeat center center;
            background-size: cover;
            border-radius: 10px;
        }

        .ticket-content {
            position: absolute;
            top: 64%; /* Adjust this value to align with the black bar */
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            text-align: center;
        }

        .code {
            display: inline-block;
            font-size: 26px;
            font-weight: bold;
            color: #fff;
            background-color: rgba(0, 0, 0, 0.7); /* Increase background opacity for better readability */
            padding: 10px 20px;
        }

        @media (max-width: 690px) {
            .ticket-content {
                top: 64%; /* Adjust based on the actual position of the black area */
            }
            .code {
                font-size: 20px; /* Adjust font size for smaller screens */
                padding: 5px 10px; /* Adjust padding for smaller screens */
            }
        }
    </style>
</head>
<body>
<div class="container">
    <p>Content</p>
    <div class="ticket-container">
        <div class="ticket-content">
            <div class="code">2332423</div>
        </div>
    </div>
    <p>Content</p>
</div>
</body>
</html>
