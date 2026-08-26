<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\CampaignsController;
use App\Http\Controllers\HookDeckController;
use App\Http\Controllers\LeadsController;
use App\Http\Controllers\PlansController;
use App\Http\Controllers\StoresController;
use App\Http\Controllers\SubscriptionsController;
use App\Http\Controllers\TestSmtpController;
use App\Http\Controllers\WebhooksController;
use App\Http\Controllers\VimeoController;
use App\Http\Controllers\WistiaController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\ProductsController;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Shopify\Context;
use Shopify\Utils;
use Spatie\SlackAlerts\Facades\SlackAlert;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::controller(AuthController::class)->prefix('/api/auth')->group(function () {
    Route::get('/', 'request');
    Route::get('callback', 'install');
});

Route::post('/api/webhooks', [WebhooksController::class, 'handle']);


Route::get('/vimeo/callback', [VimeoController::class, 'callback']);
Route::get('/wistia/callback', [WistiaController::class, 'callback']);

Route::group(['middleware' => 'shopify.auth', 'prefix' => 'api'], function () {

    Route::controller(StoresController::class)->group(function () {
        Route::get('store', 'show');
        Route::get('usage', 'usage');
        Route::post('save-setting', 'saveSetting');
        Route::get('settings', 'getSettings');
        Route::get("check-permissions", "checkPermissions");
        Route::get("request-permissions", "requestPermissions");
        Route::post("app-setup-data", "appSetupData");
        Route::post("finish-onboarding", "onboardingFinish");
        Route::post("button-branding", "saveButtonBranding");
        Route::post("camera-fallback", "saveCameraFallback");
        Route::post("privacy-recording", "savePrivacyRecording");
        Route::post("notification", "saveNotification");
        Route::post("toggle-setup-step", "toggleSetupStep");
        Route::get("check-theme-extension", "checkThemeExtension");
        Route::post("set-theme-extension-enabled", "setThemeExtensionEnabled");

    });
    Route::post('/collections/product-count', [CollectionController::class, 'productCount']);
    Route::post('/collections/products', [CollectionController::class, 'getProducts']);
    Route::post('/products/all', [ProductsController::class, 'getAllProducts']);

    Route::post('/update-reply-to-email', [StoresController::class, 'updateReplyToEmail']);
    Route::post('/update-cc-bcc-email', [StoresController::class, 'updateCcBccEmail']);
    Route::post('/dismiss-banner', [StoresController::class, 'dismissBanner']);
    Route::post('/update-language', [StoresController::class, 'updateLanguage']);

    Route::post("/sendsmtp", [TestSmtpController::class, 'sendSmtpMail']);

    Route::controller(CampaignsController::class)->prefix('campaigns')->group(function () {
        Route::get('status', 'status');
        Route::post('/', 'save');
        Route::get('/', 'index');
    });

    Route::controller(LeadsController::class)->prefix('leads')->group(function () {
        Route::get('/', 'index');
        Route::post('export', 'export');
    });

    Route::get('plans', [PlansController::class, 'index']);
    Route::get('check-new-user', [StoresController::class, 'checkNewUser']);
    Route::get('user-plan', [PlansController::class, 'getUserPlan']);
    Route::get('current-plan', [PlansController::class, 'getCurrentPlan']);
    Route::get('subscription', [SubscriptionsController::class, 'show']);

    // Billing routes
    Route::post('billing', [BillingController::class, 'process']);
    Route::post('billing/cancel', [BillingController::class, 'cancel']);
    Route::post('billing/free', [BillingController::class, 'downgradeToFreePlan']);

    Route::post('send-feedback', [StoresController::class, 'sendFeedback']);

    Route::get('/vimeo/connect', [VimeoController::class, 'connect']);
    Route::get('/delete-vimeo-account', [VimeoController::class, 'delete']);
    Route::get('/vimeo/videos', [VimeoController::class, 'fetchAllVimeoVideos']);

    Route::get('/wistia/connect', [WistiaController::class, 'connect']);
    Route::get('/delete-wistia-account', [WistiaController::class, 'delete']);
    Route::get('/wistia/videos', [WistiaController::class, 'fetchAllWistiaVideos']);
});

// Billing callback route (outside auth middleware - Shopify redirects here)
Route::get('billing/callback', [BillingController::class, 'billingCallback'])->name('billing.callback');

Route::post("hd-webhooks", [HookDeckController::class, 'handle']);
Route::get("prev", function () {
    $html = (new App\Mail\SendOrderEmail([], ['name' => '#1001', 'customer' => ['name' => 'Test Customer']], Store::with('setting')->find(7), true))->render();
    echo $html;
});

Route::fallback(function (Request $request) {
    if (Context::$IS_EMBEDDED_APP && $request->query("embedded", false) === "1") {
        if (env('APP_ENV') === 'production') {
            return file_get_contents(base_path('frontend/dist/index.html'));
        } else {
            //return file_get_contents(base_path('frontend/index.html'));
            return file_get_contents(base_path('frontend/dist/index.html'));
        }
    } else {
        return redirect(Utils::getEmbeddedAppUrl($request->query("host", null)) . "/" . $request->path());
    }
})->middleware('shopify.installed');


Route::get("/ticket", function () {
    return view('ticket');
});
