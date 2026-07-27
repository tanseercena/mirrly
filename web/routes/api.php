<?php

use App\Http\Controllers\CampaignsController;
use App\Http\Controllers\CartAddsController;
use App\Http\Controllers\ClicksController;
use App\Http\Controllers\DiscountsController;
use App\Http\Controllers\ImpressionsController;
use App\Http\Controllers\LeadsController;
use App\Http\Controllers\StoresController;
use App\Http\Middleware\EnsureApiTokenIsValid;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::get('invalid', function () {
    return "Invalid Api Token";
})->name('api.invalid-token');

Route::get('{shop}/api-token', [StoresController::class, 'getApiToken']);

Route::group(['prefix' => '{shop}', 'middleware' => EnsureApiTokenIsValid::class], function () {
    Route::get('/currency', [StoresController::class, 'currency']);
    // Route::get('campaigns', 'CampaignsController@show');
    Route::post('discounts/create', [DiscountsController::class, 'store']);
    Route::post('leads/create', [LeadsController::class, 'store']);
    Route::get('campaigns', [CampaignsController::class, 'shopIndex']);
    Route::get('usage', [StoresController::class, 'usage']);

    Route::post('{campaign}/impressions', [ImpressionsController::class, 'store']);
    Route::post('{campaign}/cart_adds', [CartAddsController::class, 'store']);

    Route::get('{campaign}/clicks', [ClicksController::class, 'redirect']);
});
