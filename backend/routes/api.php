<?php

use App\Http\Controllers\Api\V1\Admin\BrandController as AdminBrandController;
use App\Http\Controllers\Api\V1\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\V1\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\V1\Admin\ProductImageController;
use App\Http\Controllers\Api\V1\Admin\SettingsController as AdminSettingsController;
use App\Http\Controllers\Api\V1\BrandController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\SettingsController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Sabit yollar {slug}'dan önce tanımlanmalı, yoksa "featured" bir slug sanılır.
    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/featured', [ProductController::class, 'featured']);
    Route::get('products/slugs', [ProductController::class, 'slugs']);
    Route::get('products/filters', [ProductController::class, 'filters']);
    Route::get('products/{slug}', [ProductController::class, 'show']);
    Route::get('products/{slug}/related', [ProductController::class, 'related']);

    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('categories/{slug}', [CategoryController::class, 'show']);

    Route::get('brands', [BrandController::class, 'index']);

    Route::get('settings', [SettingsController::class, 'show']);

    // ─────────────────────────────────────────────────────────────────
    // Admin — yönetim paneli için yazma uç noktaları.
    //
    // TODO: auth eklenince burada tek bir middleware satırı yeterli olacak:
    //   Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin'])->group(...)
    // Şimdilik panelde kendi oturum çerezi var ama API tarafı açık — backend'e
    // doğrudan erişim yalnızca geliştirme ortamında güvenlidir.
    // ─────────────────────────────────────────────────────────────────
    Route::prefix('admin')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index']);

        Route::apiResource('products', AdminProductController::class);
        Route::post('products/{product}/images', [ProductImageController::class, 'store']);
        Route::patch('products/{product}/images', [ProductImageController::class, 'update']);
        Route::delete('product-images/{productImage}', [ProductImageController::class, 'destroy']);

        Route::apiResource('categories', AdminCategoryController::class);
        Route::apiResource('brands', AdminBrandController::class)->except(['show']);

        Route::get('orders', [AdminOrderController::class, 'index']);
        Route::get('orders/{order}', [AdminOrderController::class, 'show']);
        Route::patch('orders/{order}', [AdminOrderController::class, 'update']);

        Route::get('settings', [AdminSettingsController::class, 'show']);
        Route::put('settings', [AdminSettingsController::class, 'update']);
    });
});
