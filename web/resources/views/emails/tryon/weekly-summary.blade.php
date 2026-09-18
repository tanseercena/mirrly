<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#f4f5f6;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;padding:28px;">
        <h2 style="margin:0 0 4px;font-size:20px;">Your weekly try-on summary</h2>
        <p style="margin:0 0 20px;color:#616161;font-size:14px;">
            {{ \Carbon\Carbon::parse($stats['week_start'])->format('M j') }} –
            {{ \Carbon\Carbon::parse($stats['week_end'])->format('M j, Y') }} ·
            {{ $store->shopify_domain }}
        </p>

        <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eee;">Try-on sessions</td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;font-weight:bold;">{{ $stats['sessions'] }}</td>
            </tr>
            <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eee;">Started try-on</td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;font-weight:bold;">{{ $stats['started'] }}</td>
            </tr>
            <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eee;">Completed</td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;font-weight:bold;">{{ $stats['completed'] }}</td>
            </tr>
            <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eee;">Completion rate</td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;font-weight:bold;">
                    {{ $stats['rate'] !== null ? round($stats['rate'], 1) . '%' : 'n/a' }}
                    @if ($stats['prev_rate'] !== null && $stats['rate'] !== null)
                        <span style="color:{{ $stats['rate'] >= $stats['prev_rate'] ? '#0F6E5C' : '#B3261E' }};font-weight:normal;">
                            ({{ $stats['rate'] >= $stats['prev_rate'] ? '▲' : '▼' }} {{ abs(round($stats['rate'] - $stats['prev_rate'], 1)) }} pts vs prior week)
                        </span>
                    @endif
                </td>
            </tr>
            <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eee;">Added to cart</td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;font-weight:bold;">{{ $stats['carts'] }}</td>
            </tr>
            <tr>
                <td style="padding:10px 0;">Orders attributed</td>
                <td style="padding:10px 0;text-align:right;font-weight:bold;">{{ $stats['orders'] }}</td>
            </tr>
        </table>

        <p style="margin:24px 0 0;font-size:12px;color:#8a8a8a;">
            You receive this because weekly summaries are enabled in your Mirrly app settings.
        </p>
    </div>
</body>
</html>
