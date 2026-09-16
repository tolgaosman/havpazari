<?php

namespace App\Http\Resources\Api\V1\Admin;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Order
 */
class AdminOrderResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'orderNumber' => $this->order_number,
            'status' => $this->status->value,
            'totalAmount' => (float) $this->total_amount,
            'shippingAddress' => $this->shipping_address,
            'notes' => $this->notes,
            'customerName' => $this->whenLoaded('user', fn () => $this->user->name),
            'items' => $this->whenLoaded('items', fn () => $this->items
                ->map(fn (OrderItem $item) => [
                    'id' => (string) $item->id,
                    'productId' => $item->product_id === null ? null : (string) $item->product_id,
                    'productName' => $item->product_name,
                    'productSku' => $item->product_sku,
                    'quantity' => $item->quantity,
                    'unitPrice' => (float) $item->unit_price,
                    'lineTotal' => (float) $item->line_total,
                ])
                ->values()
                ->all()),
            'createdAt' => $this->created_at?->toIso8601ZuluString(),
        ];
    }
}
