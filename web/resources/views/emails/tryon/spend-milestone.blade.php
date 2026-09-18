<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#f4f5f6;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;padding:28px;">
        <h2 style="margin:0 0 12px;font-size:20px;">{{ $threshold }}% of your included sessions used</h2>
        <p style="margin:0 0 16px;font-size:14px;color:#333;">
            Your {{ $store->shopify_domain }} store has used
            <strong>{{ $used }} of {{ $included }}</strong> included try-on sessions
            ({{ $included > 0 ? round(($used / $included) * 100, 1) : 0 }}%).
        </p>
        <p style="margin:0 0 16px;font-size:14px;color:#333;">
            Once all included sessions are used, each additional try-on session is billed at
            <strong>${{ number_format($sessionRate, 2) }}</strong> per session.
        </p>
        <p style="margin:0 0 20px;font-size:14px;color:#333;">
            Upgrade your plan or keep going — your sessions keep running either way.
        </p>
        <p style="margin:0;font-size:12px;color:#8a8a8a;">
            You receive this because spend milestone alerts are enabled in your Mirrly app settings.
        </p>
    </div>
</body>
</html>
