<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>@lang('emails.new_installation', ['app' => config('app.name')])</title>
</head>

<body style="margin:0;padding:0;background:#f4f6f8;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f6f8">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="margin:20px auto;">

    <!-- HEADER -->
    <tr>
        <td align="center" style="padding:20px;border-bottom:1px solid #eeeeee;">
            <table cellpadding="0" cellspacing="0">
                <tr>
                    <td style="padding-right:15px;">
                        <img src="https://cdn.shopify.com/app-store/listing_images/78b2cf9c2a9c63431defd44ad600ee8f/icon/CPjNw7_F8v8CEAE=.png"
                             width="50"
                             alt="{{ config('app.name') }}"
                             style="display:block;">
                    </td>
                    <td style="font-size:20px;font-weight:700;color:#2C3E50;">
                        {{ config('app.name') }}
                        <span style="color:#3498db;">@lang('emails.digital_product')</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    @php
        $shopDomain = explode('.', $store->shopify_domain)[0];
        $appHandle = config('shopify.app_handle');
        $planPathUrl = "https://admin.shopify.com/store/{$shopDomain}/apps/{$appHandle}/pricing";
        $embeddedAppUrl = "https://admin.shopify.com/store/{$shopDomain}/apps/{$appHandle}/createDigitalProduct";
    @endphp

    <!-- HERO -->
    <tr>
        <td align="center" bgcolor="#eef2f7" style="padding:40px;">
            <h1 style="margin:0 0 15px;font-size:24px;color:#2c3e50;">
                @lang('emails.welcome_title')
            </h1>
            <p style="margin:0 0 25px;font-size:16px;color:#555;line-height:1.6;">
                @lang('emails.welcome_text')
            </p>

            <table cellpadding="0" cellspacing="0">
                <tr>
                    <td bgcolor="#3498db" style="padding:15px 35px;">
                        <a href="{{ $embeddedAppUrl }}"
                           style="color:#ffffff;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
                            @lang('emails.cta_create')
                        </a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- FEATURES -->
    <tr>
        <td align="center" style="padding:40px;">
            <h3 style="margin:0 0 25px;color:#2c3e50;">
                @lang('emails.why_love_us')
            </h3>

            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center" style="padding:15px;">
                        📦<br>
                        <strong>@lang('emails.instant_delivery')</strong><br>
                        <span style="font-size:13px;color:#777;">@lang('emails.instant_desc')</span>
                    </td>
                    <td align="center" style="padding:15px;">
                        📂<br>
                        <strong>@lang('emails.files')</strong><br>
                        <span style="font-size:13px;color:#777;">@lang('emails.files_desc')</span>
                    </td>
                    <td align="center" style="padding:15px;">
                        🔑<br>
                        <strong>@lang('emails.license')</strong><br>
                        <span style="font-size:13px;color:#777;">@lang('emails.license_desc')</span>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding:15px;">
                        ✉️<br>
                        <strong>@lang('emails.email')</strong><br>
                        <span style="font-size:13px;color:#777;">@lang('emails.email_desc')</span>
                    </td>
                    <td align="center" style="padding:15px;">
                        🔐<br>
                        <strong>@lang('emails.pdf')</strong><br>
                        <span style="font-size:13px;color:#777;">@lang('emails.pdf_desc')</span>
                    </td>
                    <td align="center" style="padding:15px;">
                        🎥<br>
                        <strong>@lang('emails.video')</strong><br>
                        <span style="font-size:13px;color:#777;">@lang('emails.video_desc')</span>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <!-- PRICING -->
    <tr>
        <td align="center" bgcolor="#2c3e50" style="padding:30px;">
            <h2 style="margin:0 0 10px;color:#ffffff;">
                @lang('emails.pricing_title')
            </h2>
            <p style="margin:0 0 15px;color:#ffffff;font-size:14px;">
                @lang('emails.pricing_desc')
            </p>
            <a href="{{ $planPathUrl }}" style="color:#ffffff;text-decoration:underline;font-weight:600;">
                @lang('emails.view_pricing')
            </a>
        </td>
    </tr>

    <!-- RESOURCES -->
    <tr>
        <td style="padding:30px;background:#f9f9f9;">
            <table width="100%" cellpadding="0" cellspacing="0">

                <tr>
                    <td style="padding-bottom:15px;border-bottom:1px solid #e0e0e0;">
                        📚 <strong>@lang('emails.docs')</strong><br>
                        <span style="font-size:13px;color:#666;">@lang('emails.docs_desc')</span>
                    </td>
                    <td align="right">
                        <a href="https://conversionproplus.com/guide"
                           style="border:1px solid #ddd;padding:8px 15px;text-decoration:none;color:#555;font-size:12px;font-weight:600;">
                            @lang('emails.read_docs')
                        </a>
                    </td>
                </tr>

                <tr>
                    <td colspan="2" style="height:15px;"></td>
                </tr>

                <tr>
                    <td style="padding-bottom:15px;border-bottom:1px solid #e0e0e0;">
                        🎥 <strong>@lang('emails.video')</strong><br>
                        <span style="font-size:13px;color:#666;">@lang('emails.video_desc')</span>
                    </td>
                    <td align="right">
                        <a href="https://www.youtube.com/@ConversionProPlus"
                           style="border:1px solid #ddd;padding:8px 15px;text-decoration:none;color:#555;font-size:12px;font-weight:600;">
                            @lang('emails.watch')
                        </a>
                    </td>
                </tr>

                <tr>
                    <td colspan="2" style="height:15px;"></td>
                </tr>

                <tr>
                    <td>
                        💬 <strong>@lang('emails.support')</strong><br>
                        <span style="font-size:13px;color:#666;">@lang('emails.support_desc')</span>
                    </td>
                    <td align="right">
                        <a href="https://conversionproplus.com/contact-us"
                           style="border:1px solid #ddd;padding:8px 15px;text-decoration:none;color:#555;font-size:12px;font-weight:600;">
                            @lang('emails.contact')
                        </a>
                    </td>
                </tr>

            </table>
        </td>
    </tr>

    <!-- FOOTER -->
    <tr>
        <td align="center" style="padding:30px;border-top:1px solid #eeeeee;">
            <p style="font-size:12px;color:#888;margin:5px 0;">
                <strong>@lang('emails.footer', ['app' => config('app.name')])</strong>
            </p>
            <p style="font-size:12px;color:#888;margin:5px 0;">
                @lang('emails.copyright', [
                    'year' => now()->year,
                    'app' => config('app.name')
                ])
            </p>
        </td>
    </tr>

</table>

</td>
</tr>
</table>

</body>
</html>
