<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'email_content' => 'array',
        'lottery_content' => 'array',
        'download_content' => 'array',
        'pdf_stamping' => 'array',
        'send_email' => 'boolean',
        'restrict_paid_downloads' => 'boolean',
        'license_per_product' => 'boolean',
        'email_per_license_per_qty' => 'boolean',
        'track_license_codes' => 'boolean',
        'api_enabled' => 'boolean',
        'tag_customer' => 'boolean',
        'license_tracking_options' => 'array',
        'cc_email' => 'string',
        'bcc_email' => 'string',
        'risky_order_delivery' => 'boolean',
        'ticket_image' => 'boolean',
        'ip_restrictions' => 'array',
        'smtp_enabled' => 'boolean',
        'smtp_details' => 'array',
        'integrations' => 'array',
        'vimeo_integration' => 'array',
        'wistia_integration' => 'array',
        'country_block_enabled' => 'boolean',
        'blocked_countries' => 'array',
        'restrict_product_access' => 'boolean',
        'restricted_products' => 'array',
        'collections' => 'array',
        'button_branding' => 'array',
        'camera_fallback' => 'array',
        'privacy_recording' => 'array',
        'notification' => 'array',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
