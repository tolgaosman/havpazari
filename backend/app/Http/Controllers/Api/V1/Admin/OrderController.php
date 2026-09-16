<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\UpdateOrderRequest;
use App\Http\Resources\Api\V1\Admin\AdminOrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Sipariş yönetimi — /api/v1/admin/orders. Yalnızca durum/not güncellenir;
 * yeni sipariş oluşturma yok (site sepetsiz, siparişler telefon/WhatsApp'tan).
 * TODO: auth:sanctum + admin rolü middleware'i eklenecek.
 */
class OrderController extends Controller
{
    private const PER_PAGE = 15;

    public function index(Request $request): JsonResponse
    {
        $query = Order::query()->with('user')->orderByDesc('created_at');

        if ($status = $request->query('durum')) {
            if (OrderStatus::tryFrom($status) !== null) {
                $query->where('status', $status);
            }
        }

        $perPage = self::PER_PAGE;
        $total = (clone $query)->toBase()->getCountForPagination();
        $lastPage = max(1, (int) ceil($total / $perPage));
        $page = min(max(1, (int) $request->query('sayfa', 1)), $lastPage);

        $items = $query->forPage($page, $perPage)->get();

        return response()->json([
            'data' => AdminOrderResource::collection($items)->resolve($request),
            'meta' => [
                'currentPage' => $page,
                'lastPage' => $lastPage,
                'perPage' => $perPage,
                'total' => $total,
            ],
        ]);
    }

    public function show(Order $order): AdminOrderResource
    {
        return new AdminOrderResource($order->load(['user', 'items']));
    }

    public function update(UpdateOrderRequest $request, Order $order): AdminOrderResource
    {
        $order->update($request->validated());

        return new AdminOrderResource($order->load(['user', 'items']));
    }
}
