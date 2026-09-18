<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#f4f5f6;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;padding:28px;">
        <h2 style="margin:0 0 12px;font-size:20px;">Try-on completion rate is below {{ $threshold }}%</h2>
        <p style="margin:0 0 16px;font-size:14px;color:#333;">
            Over the last 7 days, <strong>{{ $completed }} of {{ $started }}</strong> started try-ons
            completed on {{ $store->shopify_domain }} — a completion rate of
            <strong>{{ round($rate, 1) }}%</strong>.
        </p>
        <p style="margin:0 0 16px;font-size:14px;color:#333;">
            Things that usually lift completion: better lighting guidance on the product page,
            a clear call-to-action after the try-on, and featured products with accurate garment photos.
        </p>
        <p style="margin:0;font-size:12px;color:#8a8a8a;">
            You receive this because low completion rate alerts are enabled in your Mirrly app settings.
            We check at most once a week.
        </p>
    </div>
</body>
</html>
