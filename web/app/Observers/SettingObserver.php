<?php

namespace App\Observers;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SettingObserver
{
    /**
     * Handle the Setting "updated" event.
     * Clear the app setup data cache when settings are updated.
     *
     * @param Setting $setting
     * @return void
     */
    public function updated(Setting $setting)
    {
        try {
            $store = $setting->store;

            if ($store) {
                $cacheKey = 'app-setup-data-' . ($store->shopify_domain);
                Cache::forget($cacheKey);
            }
        } catch (\Exception $e) {
            Log::error("Failed to clear app setup cache for setting", [
                'setting_id' => $setting->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
