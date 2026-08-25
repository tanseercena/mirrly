<?php

namespace App\Http\Controllers;

use App\Lib\TopLevelRedirection;
use App\Mail\SendFeedback;
use App\Models\Plan;
use App\Models\Setting;
use App\Models\Session;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Shopify\Clients\Graphql;
use Shopify\Clients\Rest;
use Shopify\Webhooks\Registry;
use Shopify\Webhooks\Topics;
use Shopify\Context;
use DB;


class StoresController extends Controller
{
    public function currency(Request $request, $shop)
    {
        return response()->json([
            'data' => Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first()->money_format
        ]);
    }

    public function getApiToken(Request $request, $shop)
    {
        return response()->json([
            'data' => Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first()->api_token
        ]);
    }


    public function show(Request $request)
    {
        $shop = $request->get('shopifySession')->getShop();
        $store = Store::with("setting")->with("subscription")->where('shopify_domain', $shop)
            ->orWhere('domain', $shop)->first();
        if (is_null($store->setting)) {
            $store->setting()->create([
                'email_content' => [
                    'subject' => 'Your digital products for order {order_name}',
                    'order_title' => '{order_name}',
                    'intro_text' => 'Hello {full_name},<br> Your digital products are ready for order {order_name}.',
                    'file_title' => 'Files',
                    'license_title' => 'License',
                    'custom_link_title' => 'Custom Link',
                    'enable_custom_link_button' => false,
                    'custom_link_button_text' => 'Access Link',
                    'download_button_text' => 'Download',
                    'footer_text' => 'Thanks,<br> If you have any questions, reply to this email',
                    'company_name' => 'Test Company',
                    'contact_details' => 'test@company.com (123-456-7890)',
                    'send_text_email_only' => false,
                    'show_files' => true,
                    'show_custom_links' => true,
                    'show_license_keys' => true,
                ],
                'download_content' => [
                    'order_title' => 'Order {order_name}',
                    'sample_file_title' => 'Sample files',
                    'digital_products_title' => 'Digital Products',
                    'download_file_button_text' => 'Download file',
                    'download_order_all_files_button_text' => 'Download All Order Files',
                    'download_product_all_files_button_text' => 'Download Product Files',
                    'files_title' => 'Files',
                    'license_keys_title' => 'License Keys/Codes',
                    'custom_links_title' => 'Links',
                    'company_name' => 'Test Company',
                    'contact_details' => 'test@company.com (123-456-7890)',
                ],
                'pdf_stamping' => [
                    'text_size' => '12',
                    'text_color' => '#000000',
                    'alignment' => 'center',
                    'font' => 'arial',
                    'page_size' => 'A4',
                    'page_layout' => 'portrait',
                    'vertical_adjustment' => 35,
                    'pages_to_stamp' => 'all',
                    'stamp_text' => 'Prepared exclusively for {{order.receiver_email}}. Transaction: {{order.id}}',
                    'allow_printing' => false,
                    'allow_copying' => false,
                    'password_protect' => false
                ],
            ]);
        }

        $store->load('setting');

        //        $session = $request->get('shopifySession');
        //        $client = new Rest($store->shopify_domain, $session->getAccessToken());
        //        $response = $client->get('webhooks');
        //        $webhooks = $response->getDecodedBody()['webhooks'] ?? [];

        $subscription = $store->subscription;
        if ($subscription && $subscription->plan) {
            $plan = $subscription->plan;
        } else {
            $plan = Plan::find(1);
        }
        $store->plan = $plan;

        return response()->json([
            'data' => $store,
            //            'webhooks' => $webhooks,
        ]);
    }

    public function usage(Request $request, $shopifyDomain = null)
    {
        if (!$shopifyDomain) {
            $shop = $request->get('shopifySession')->getShop();
        } else {
            $shop = $shopifyDomain;
        }
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if ($store->subscription) {
            $plan = Plan::find($store->subscription->plan_id);
        } else {
            $plan = Plan::where('name', 'free')->first();
        }


        return response()->json([
            'data' => [
                'usage' => [
                    'orders' => $store->orders_per_month ?? 0,
                ],
                'limits' => $plan->limits,
                'can' => $plan->can,
                'plan' => $plan
            ]
        ]);
    }

    public function saveSetting(Request $request)
    {
        $shop = $request->get('shopifySession')->getShop();
        $store = Store::with("setting")->where('shopify_domain', $shop)
            ->orWhere('domain', $shop)->first();

        $smtp_details = json_decode($request->smtp_details, true);
        $emailContent = json_decode($request->email_content, true);
        $downloadContent = json_decode($request->download_content, true);
        $licenseTrackingOptions = json_decode($request->license_tracking_options, true);
        $pdfStamping = json_decode($request->pdf_stamping, true);
        $ipRestrictions = json_decode($request->ip_restrictions, true);
        $integrations = json_decode($request->integrations, true);
        $vimeo_integration = json_decode($request->vimeo_integration, true);
        $wistia_integration = json_decode($request->wistia_integration, true);
        $blockedCountries = json_decode($request->blocked_countries, true);
        $restrictedProducts = json_decode($request->restricted_products, true);
        $restrictionTitle = $request->input('restriction_title', 'Access Restricted');
        $restrictionDescription = $request->input('restriction_description', 'This product is not available in your region.');

        if ($request->hasFile('email_logo')) {
            $emailLogoFile = $request->file('email_logo');
            $emailLogoData = $this->storeLogo($emailLogoFile, $store);
            $emailContent['email_logo'] = $emailLogoData;
        }

        if ($request->hasFile('download_logo')) {
            $downloadLogoFile = $request->file('download_logo');
            $downloadLogoData = $this->storeLogo($downloadLogoFile, $store);
            $downloadContent['download_logo'] = $downloadLogoData;
        }

        if ($request->hasFile('favicon')) {
            $faviconFile = $request->file('favicon');
            $faviconData = $this->storeLogo($faviconFile, $store);
            $downloadContent['favicon'] = $faviconData;
        }

        $setting = $store->setting()->updateOrCreate(
            ['store_id' => $store->id],
            [
                'send_email' => $request->send_email,
                'email_content' => $emailContent,
                'download_content' => $downloadContent,
                'pdf_stamping' => $pdfStamping,
                'integrations' => $integrations,
                'vimeo_integration' => $vimeo_integration,
                'wistia_integration' => $wistia_integration,
                'restrict_paid_downloads' => $request->restrict_paid_downloads,
                'license_per_product' => $request->license_per_product,
                'email_per_license_per_qty' => $request->email_per_license_per_qty,
                'track_license_codes' => $request->track_license_codes,
                'tag_customer' => $request->tag_customer,
                'api_enabled' => $request->api_enabled,
                'license_tracking_options' => $licenseTrackingOptions,
                'risky_order_delivery' => $request->risky_order_delivery,
                'ticket_image' => $request->ticket_image,
                'ip_restrictions' => $ipRestrictions,
                'smtp_enabled' => $request->smtp_enabled,
                'smtp_details'=>$smtp_details,
                'country_block_enabled' => $request->country_block_enabled,
                'blocked_countries' => $blockedCountries,
                'restrict_product_access' => $request->restrict_product_access,
                'restricted_products' => $restrictedProducts,
                'restriction_title' => $restrictionTitle,
                'restriction_description' => $restrictionDescription,
            ]
        );

        $restrictPaidDownloads = $request->restrict_paid_downloads;

        $session = $request->get('shopifySession');

        if (config("shopify.hookdeck_webhook_url")) {
            $old_host = Context::$HOST_NAME;
            Context::$HOST_NAME = config("shopify.hookdeck_webhook_url");
            $path = '';
        } else {
            $path = '/api/webhooks';
        }

        if ($restrictPaidDownloads) {
            $this->registerOrderUpdatedWebhook($store, $session, $path);
        } else {
            $this->removeOrderUpdatedWebhook($store, $session, $path);
        }

        // Clear app setup cache
        Cache::forget('app-setup-data-' . base64_encode($shop));

        return response()->json(['success' => 1]);
    }


    public function onboardingFinish(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        // Get or create the store's setting
        $setting = $store->setting;

        if (!$setting) {
            $setting = $store->setting()->create([]);
        }

        // Save collection type and collections data
        $collectionType = $request->input('collection_type', 'all');
        $collections = $request->input('collections');

        $setting->collection_type = $collectionType;
        $setting->collections = $collectionType === 'specific' ? $collections : null;
        $setting->save();

        // Mark onboarding as complete
        //$store->finish_onboarding = true;
        $store->save();

        return response()->json(['message' => 'Finish Onboarding updated successfully']);
    }

    public function saveButtonBranding(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        // Get or create the store's setting
        $setting = $store->setting;

        if (!$setting) {
            $setting = $store->setting()->create([]);
        }

        // Build button branding data structure
        $buttonBranding = [
            'buttonText' => $request->input('buttonText'),
            'position' => $request->input('position', 'below_cart'),
            'buttonStyle' => [
                'textColor' => $request->input('textColor'),
                'bgColor' => $request->input('bgColor'),
                'borderRadius' => $request->input('borderRadius'),
            ],
            'showIcon' => $request->input('showIcon', true),
        ];

        $setting->button_branding = $buttonBranding;
        $setting->save();

        return response()->json(['success' => true, 'message' => 'Button branding saved successfully']);
    }

    public function saveCameraFallback(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        // Get or create the store's setting
        $setting = $store->setting;

        if (!$setting) {
            $setting = $store->setting()->create([]);
        }

        // Build camera fallback data structure
        $cameraFallback = [
            'unsupported' => $request->input('unsupported', 'ai_preview'),
            'permission_denied' => $request->input('permission_denied', 'guidance'),
        ];

        $setting->camera_fallback = $cameraFallback;
        $setting->save();

        return response()->json(['success' => true, 'message' => 'Camera fallback settings saved successfully']);
    }

    public function registerOrderUpdatedWebhook(Store $store, $session, $path)
    {
        $client = new Rest($store->shopify_domain, $session->getAccessToken());
        $response = $client->get('webhooks');
        $webhooks = $response->getDecodedBody()['webhooks'];

        $webhookId = null;

        foreach ($webhooks as $webhook) {
            if ($webhook['topic'] === 'orders/updated') {
                $webhookId = $webhook['id'];
                break;
            }
        }

        if (!$webhookId) {
            Registry::register($path, Topics::ORDERS_UPDATED, $store->shopify_domain, $session->getAccessToken());
        }
    }

    public function removeOrderUpdatedWebhook(Store $store, $session, $path)
    {
        $client = new Rest($store->shopify_domain, $session->getAccessToken());

        $response = $client->get('webhooks');
        $webhooks = $response->getDecodedBody()['webhooks'];

        $webhookId = null;
        foreach ($webhooks as $webhook) {
            if ($webhook['topic'] === 'orders/updated') {
                $webhookId = $webhook['id'];
                break;
            }
        }

        if ($webhookId) {
            $client->delete('webhooks/' . $webhookId);
        }
    }

    private function storeLogo($logoFile, $store)
    {
        $fileName = time() . '-' . $logoFile->getClientOriginalName();
        $filePath = 'duser_' . $store->id . '/' . $fileName;
        //        Storage::disk('public')->put($filePath, File::get($logoFile));
        Storage::put($filePath, File::get($logoFile));
        $url = Storage::url($filePath);

        return [
            'file_name' => $fileName,
            'url' => $url
        ];
    }

    public function sendFeedback(Request $request)
    {
        $shop = $request->get('shopifySession')->getShop();
        $store = Store::with("setting")->where('shopify_domain', $shop)
            ->orWhere('domain', $shop)->first();

        //        $request->validate([
        //            'rating' => 'required',
        //            'feedback' => 'required'
        //        ]);

        try {
            Mail::to(config('app.new_install_email'))->send(new SendFeedback([
                'feedback_type' => "Review",
                'store' => $store->shopify_domain,
                'feedback' => $store->shopify_domain . ' provided ' . $request->rating . '-star rating, and feedback: <br><strong>' . $request->feedback . '</strong>'
            ]));
        } catch (Exception $e) {
            Log::error("Error sending mail: " . $e->getMessage());
        }
    }

    public function getSettings(Request $request): JsonResponse
    {
        $shop = $request->get('shopifySession')->getShop();
        $store = Store::with("setting")->where('shopify_domain', $shop)
            ->orWhere('domain', $shop)->first();

        if ($store && $store->setting) {
            return response()->json([
                'data' => $store->setting
            ]);
        }

        return response()->json([
            'message' => 'Settings not found',
        ], 404);
    }

    public function updateReplyToEmail(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();
        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        $store->reply_to_email = $request->input('reply_to_email');
        $store->save();

        return response()->json(['message' => 'Reply-To email updated successfully']);
    }

    public function updateCcBccEmail(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();

        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        $settings = $store->setting;

        if (!$settings) {
            return response()->json([
                'message' => 'Settings not found',
            ], 404);
        }

        $settings->cc_email = $request->input('cc_email');
        $settings->bcc_email = $request->input('bcc_email');
        $settings->save();

        return response()->json(['message' => 'CC/BCC email updated successfully']);
    }

    public function checkPermissions(Request $request)
    {
        try {
            // Get the current shop and access token
            $session = $request->get('shopifySession');
            $shop = $session->getShop();

            // Call the GraphQL API to get access scopes
            // We'll use the GraphQL Admin API to query access scopes
            $graphqlClient = new Graphql(
                $shop,
                $session->getAccessToken()
            );

            $query = <<<QUERY
            {
              appInstallation {
                accessScopes {
                  handle
                }
              }
            }
            QUERY;

            $response = $graphqlClient->query(['query' => $query]);
            $responseBody = $response->getDecodedBody();

            // Extract the scopes from the response
            $scopes = [];
            if (isset($responseBody['data']['appInstallation']['accessScopes'])) {
                foreach ($responseBody['data']['appInstallation']['accessScopes'] as $scope) {
                    $scopes[] = $scope['handle'];
                }
            }

            return response()->json([
                'success' => true,
                'scopes' => $scopes,
                'has_write_customers' => in_array('write_customers', $scopes)
            ]);
        } catch (\Exception $e) {
            \Log::error('Error checking permissions: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to check permissions',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function requestPermissions(Request $request)
    {
        $session = $request->get('shopifySession');
        $currentShop = $session->getShop();
        $requestedScopes = $request->query('scopes', '');

        // Get base scopes from config
        $baseScopes = explode(',', config('shopify.scopes', ''));

        // Get any additional scopes this shop has already been granted
        // We'll store this in the database
        $shop = Store::where('shopify_domain', $currentShop)->first();
        $additionalScopes = $shop && $shop->additional_scopes
            ? explode(',', $shop->additional_scopes)
            : [];

        // Add the newly requested scopes
        $newAdditionalScopes = array_merge(
            $additionalScopes,
            explode(',', $requestedScopes)
        );

        // Store the updated additional scopes for this shop
        if ($shop) {
            $shop->additional_scopes = implode(',', array_unique($newAdditionalScopes));
            $shop->save();
        }

        // Combine base scopes with all additional scopes for the authorization
        $allScopes = array_unique(array_merge(
            $baseScopes,
            $newAdditionalScopes
        ));

        // Generate authorization URL
        $authUrl = "https://{$currentShop}/admin/oauth/authorize?" . http_build_query([
            'client_id' => config('shopify.api_key'),
            'scope' => implode(',', $allScopes),
            'redirect_uri' => secure_url(''),
            'state' => csrf_token(),
        ]);

        return response()->json([
            'url' => $authUrl
        ]);
        return TopLevelRedirection::redirect($request, $authUrl);
    }

    public function appSetupData(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();
        $store = Store::query()->with("setting")
            ->where('shopify_domain', $shop)
            ->orWhere('domain', $shop)
            ->first();

        // Check if values actually changed before clearing cache
        $themeExtensionChanged = $request->input('themeExtensionEnabled') !== ($store->setup_steps['theme_extension_step'] ?? false);
        $thankYouBlockChanged = $request->input('isThankYouBlockAdded') !== ($store->setup_steps['checkout_step'] ?? false);

        if ($themeExtensionChanged || $thankYouBlockChanged) {
            Cache::forget('app-setup-data-' . $shop);
        }

        $data = Cache::remember('app-setup-data-' . $shop, 86400, function () use ($store, $request) {
            $digital_products_count = 0;
            $digital_lotteries_count = 0;
            $store_updated = false;

            if ($store->setting && $store->setting->created_at != $store->setting->updated_at) {
                $store_updated = true;
            }

            $setupSteps = $store->setup_steps ?? [
                'checkout_step' => false,
                'theme_extension_step' => false,
                'dp_create' => false,
                'settings_updated' => false,
                'dl_create' => false,
            ];

            //if(!$setupSteps['theme_extension_step']) {
            //    $setupSteps['theme_extension_step'] = $this->checkStoreThemeExtension($request);
            //}
            $setupSteps['theme_extension_step'] = $request->input('themeExtensionEnabled', false);
            $setupSteps['checkout_step'] = $request->input('isThankYouBlockAdded', false);

            $setupSteps['dp_create'] = $setupSteps['dp_create'] || $digital_products_count > 0;
            $setupSteps['dl_create'] = $setupSteps['dl_create'] || $digital_lotteries_count > 0;
            $setupSteps['settings_updated'] = $store_updated;

            if ($store->setup_steps !== $setupSteps) {
                $store->update(['setup_steps' => $setupSteps]);
            }

            return [
                'digitalProductsCount' => $digital_products_count,
                'digitalLotteriesCount' => $digital_lotteries_count,
                'storeUpdated' => $store_updated,
                'setupSteps' => $setupSteps,
            ];
        });

        return response()->json($data);
    }

    public function toggleSetupStep(Request $request)
    {
        $request->validate([
            'step_id' => 'required|integer|in:0,1,2,3,4',
        ]);

        $session = $request->get('shopifySession');
        $shop = $session->getShop();

        $store = Store::where('shopify_domain', $shop)
            ->orWhere('domain', $shop)
            ->first();

        if (!$store) {
            return response()->json(['error' => 'Store not found'], 404);
        }

        $setupSteps = $store->setup_steps ?? [
            'checkout_step' => false,
            'theme_extension_step' => false,
            'dp_create' => false,
            'settings_updated' => false,
            'dl_create' => false,
        ];

        if (!isset($setupSteps['theme_extension_step'])) {
            $setupSteps['theme_extension_step'] = false;
        }

        $stepMap = [
            0 => 'checkout_step',
            1 => 'theme_extension_step',
            2 => 'dp_create',
            3 => 'settings_updated',
            4 => 'dl_create',
        ];

        $stepKey = $stepMap[$request->step_id];

        $setupSteps[$stepKey] = !$setupSteps[$stepKey];

        $store->update(['setup_steps' => $setupSteps]);

        Cache::forget('app-setup-data-' . $shop);

        return response()->json([
            'success' => true,
            'setupSteps' => $setupSteps,
        ]);
    }

    public function updateTemplateType(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();

        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        $settings = $store->setting;

        if (!$settings) {
            return response()->json([
                'message' => 'Settings not found',
            ], 404);
        }

        $settings->template_type = $request->input('template_type');
        $settings->email_editor_choosen = true;
        $settings->save();

        return response()->json(['message' => 'Template type updated successfully']);
    }

    public function checkThemeExtension(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();

        try {
            $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

            if (!$store) {
                return response()->json([
                    'activated' => false,
                    'shop' => $shop
                ]);
            }

            // Check database flag - this is set manually when user actually activates the extension
            $isActivated = false;

            if ($store->setting) {
                $themeExtensionEnabled = $store->setting->theme_extension_enabled ?? false;
                $isActivated = $themeExtensionEnabled;
            }

            return response()->json([
                'activated' => $isActivated,
                'shop' => $shop
            ]);

        } catch (\Exception $e) {
            \Log::error('Error checking theme extension: ' . $e->getMessage());

            return response()->json([
                'activated' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function setThemeExtensionEnabled(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();

        try {
            $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'Store not found'
                ], 404);
            }

            // Get or create settings
            $settings = $store->setting;

            if (!$settings) {
                $settings = new \App\Models\Setting();
                $settings->store_id = $store->id;
            }

            // Set theme extension as enabled
            $settings->theme_extension_enabled = true;
            $settings->save();

            return response()->json([
                'success' => true,
                'message' => 'Theme extension marked as enabled'
            ]);

        } catch (\Exception $e) {
            \Log::error('Error setting theme extension enabled: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function checkNewUser(Request $request)
    {
        $session = $request->get('shopifySession');
        $shop = $session->getShop();

        $store = Store::where('shopify_domain', $shop)->orWhere('domain', $shop)->first();

        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        $target = \Carbon\Carbon::parse('2025-08-16')->endOfDay();
        $isNewUser = false;

        if ($store->created_at > $target) {
            $isNewUser = true;
        }

        return response()->json([
            "isNewUser" => $isNewUser
        ]);
    }

    public function dismissBanner(Request $request)
    {
        $request->validate([
            'banner' => 'required|string'
        ]);

        $session = $request->get('shopifySession');
        $shop = $session->getShop();

        $store = Store::where('shopify_domain', $shop)
            ->orWhere('domain', $shop)
            ->firstOrFail();

        $dismissed = $store->dismissed_banners ?? [];
        $dismissed[$request->banner] = true;

        $store->update([
            'dismissed_banners' => $dismissed
        ]);

        return response()->json(['success' => true]);
    }

    public function updateLanguage(Request $request)
    {
        $request->validate([
            'language' => 'required|string'
        ]);

        $session = $request->get('shopifySession');
        $shop = $session->getShop();

        $store = Store::where('shopify_domain', $shop)
            ->orWhere('domain', $shop)
            ->firstOrFail();

        $store->update([
            'primary_locale' => $request->language
        ]);

        return response()->json(['success' => true]);
    }

    public function checkStoreThemeExtension(Request $request)
    {
        $appHandle = config('shopify.app_handle');
        $extensionHandle = 'digitally';
        $appExtensionHandle = $appHandle . '/blocks' . '/' . $extensionHandle;
        $session = $request->get('shopifySession');
        $shop = $session->getShop();

        $store = Store::where('shopify_domain', $shop)
            ->orWhere('domain', $shop)
            ->firstOrFail();
        $session = Session::query()->where('shop', $store->shopify_domain)->first();


        $client = new Rest($shop, $session->access_token);

        // 1. Get the active theme
        $themes = $client->get('themes')->getDecodedBody();
        $activeTheme = collect($themes['themes'])->firstWhere('role', 'main');

        if (!$activeTheme) {
            return ['enabled' => false, 'reason' => 'No active theme found'];
        }

        $themeId = $activeTheme['id'];

        // 2. Get all assets from the active theme
        $assets = $client->get("themes/{$themeId}/assets")->getDecodedBody();

        // 3. Look for JSON templates (e.g., sections/template files)
        $jsonTemplates = collect($assets['assets'])
            ->filter(fn($a) => str_ends_with($a['key'], '.json'))
            ->pluck('key');

        // 4. Check each JSON template for your block
        $asset = $client->get("themes/{$themeId}/assets", [], [
            'asset[key]' => 'config/settings_data.json',
        ])->getDecodedBody();

        $content = json_decode($asset['asset']['value'] ?? '{}', true);

        // Recursively look for your extension handle in blocks
        if ($this->checkAppBlock($content, $appExtensionHandle)) {
            return true;
        }

        return false;
    }

    private function checkAppBlock(array $data, string $handle): bool
    {
        // If this array itself is a block node with a matching type
        if (isset($data['type']) && str_contains($data['type'], $handle)) {
            // Return true only if it's not disabled
            return !($data['disabled'] ?? false);
        }

        // Otherwise recurse into nested arrays
        foreach ($data as $value) {
            if (is_array($value) && $this->checkAppBlock($value, $handle)) {
                return true;
            }
        }

        return false;
    }
}
