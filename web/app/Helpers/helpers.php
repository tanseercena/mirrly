<?php

use App\Models\Store;
use Asikam\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;

if (!function_exists('generateQrCode')) {
    /**
     * Generate a QR code from a string
     *
     * @return mixed
     */
    function generateQrCode($store_id, string $content, int $size = 200, string $format = 'png')
    {
        if(empty($content)) {
            return '';
        }

        // Create Storage folder if not exists
        $store = Store::find($store_id);
        if (!Storage::exists('duser_' . $store->id)) {
//            mkdir('duser_' . $store->id, 0755, true);
            Storage::makeDirectory('duser_' . $store->id);
        }

        if (!Storage::exists('duser_' . $store->id . '/qr_codes')) {
//            mkdir('duser_' . $store->id . '/qr_codes', 0755, true);
            Storage::makeDirectory('duser_' . $store->id . '/qr_codes');
        }

        $qrCode = null;

        switch (strtolower($format)) {
            case 'svg':
                $qrCode = QrCode::size($size)->encoding('UTF-8')->generate($content);
            case 'eps':
                $qrCode = QrCode::size($size)->encoding('UTF-8')->format('eps')->generate($content);
            default: // png
                $qrCode = QrCode::size($size)->encoding('UTF-8')->format('png')->generate($content);
        }

        if(!Storage::exists('d_user_' . $store_id . '/qr_codes/qr_' . base64_encode($content) . '.png')) {
            Storage::put('d_user_' . $store_id . '/qr_codes/qr_' . base64_encode($content) . '.png', $qrCode);
        }

        return Storage::url('d_user_' . $store_id . '/qr_codes/qr_' . base64_encode($content) . '.png');
    }
}
