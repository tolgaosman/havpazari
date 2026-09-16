<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\Admin\AdminOrderResource;
use App\Http\Resources\Api\V1\Admin\AdminProductResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

/**
 * Panel özet ekranı — /api/v1/admin/dashboard.
 * TODO: auth:sanctum + admin rolü middleware'i eklenecek.
 */
class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $lowStock = Product::query()
            ->with(['category', 'brand'])
            ->where('is_order_only', false)
            ->where('stock', '>', 0)
            ->where('stock', '<=', Product::LOW_STOCK_THRESHOLD)
            ->orderBy('stock')
            ->limit(10)
            ->get();

        $recentOrders = Order::query()
            ->with('user')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        return response()->json([
            'data' => [
                'productCount' => Product::query()->count(),
                'outOfStockCount' => Product::query()
                    ->where('is_order_only', false)
                    ->where('stock', '<=', 0)
                    ->count(),
                'lowStockCount' => Product::query()
                    ->where('is_order_only', false)
                    ->where('stock', '>', 0)
                    ->where('stock', '<=', Product::LOW_STOCK_THRESHOLD)
                    ->count(),
                'pendingOrderCount' => Order::query()->where('status', OrderStatus::Pending)->count(),
                'lowStockProducts' => AdminProductResource::collection($lowStock)->resolve(),
                'recentOrders' => AdminOrderResource::collection($recentOrders)->resolve(),
            ],
        ]);
    }
}
