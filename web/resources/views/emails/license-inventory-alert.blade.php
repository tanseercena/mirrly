<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>License Inventory Alert</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-bottom: 3px solid #dc3545;
        }
        .content {
            padding: 20px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 10px;
            border: 1px solid #dee2e6;
            text-align: left;
        }
        th {
            background-color: #f8f9fa;
        }
        .alert {
            color: #721c24;
            background-color: #f8d7da;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            padding: 8px 16px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 4px;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Digitally License/Code Inventory Alert</h1>
        <p>Store: {{ $store->name }}</p>
    </div>

    <div class="content">
        <div class="alert">
            <strong>Action Required:</strong> The following licenses are running low on available codes.
        </div>

        <p>This is an automated notification to inform you that the following licenses in your store have reached or fallen below your notification threshold of <strong>{{ $threshold ?? 'N/A' }}</strong> remaining codes:</p>

        <table>
            <thead>
            <tr>
                <th>License/Code Name</th>
                <th>Remaining Codes</th>
                <th>Status</th>
            </tr>
            </thead>
            <tbody>
            @foreach($license_warnings as $license)
                <tr>
                    <td>{{ $license->title }}</td>
                    <td>{{ $license->codes_remaining }}</td>
                    <td>
                        @if($license->codes_remaining <= 0)
                            <span style="color: #dc3545; font-weight: bold;">OUT OF STOCK</span>
                        @elseif($license->codes_remaining <= 2)
                            <span style="color: #dc3545;">Critical</span>
                        @elseif($license->codes_remaining <= 5)
                            <span style="color: #fd7e14;">Low</span>
                        @else
                            <span style="color: #ffc107;">Warning</span>
                        @endif
                    </td>
                </tr>
            @endforeach
            </tbody>
        </table>

        <p>Please take immediate action to replenish your license inventory to ensure uninterrupted service for your customers.</p>

        <p>If you have any questions or need assistance, please contact support.</p>

        <p>Thank you,<br>
        <p>Digitally App</p>
    </div>

    <div class="footer">
        <p>This is an automated notification.</p>
        <p>To change your notification settings, visit your Digitally app license tracking settings.</p>
    </div>
</div>
</body>
</html>
