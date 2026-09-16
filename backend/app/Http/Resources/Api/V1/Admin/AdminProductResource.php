<?php

namespace App\Http\Resources\Api\V1\Admin;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Admin form/tablo için ham ürün gösterimi — public `ProductResource`'tan
 * farklı olarak fiyatı gizlemez, `stock`/`categoryId`/`brandId` gibi
 * düzenlenebilir ham alanları döner (stockStatus TÜRETİLMİŞ bir alan,
 * formda ayrıca gösterilir ama gönderilmez).
 *
 * @mixin Product
 */
class AdminProductResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'sku' => $this->sku,
            'name' => $this->name,
            'slug' => $this->slug,
            'shortDescription' => $this->short_description,
            'description' => $this->description,
            'price' => $this->price === null ? null : (float) $this->price,
            'compareAtPrice' => $this->compare_at_price === null ? null : (float) $this->compare_at_price,
            'stock' => $this->stock,
            'isOrderOnly' => $this->is_order_only,
            'requiresLicense' => $this->requires_license,
            'isFeatured' => $this->is_featured,
            'isNew' => $this->is_new,
            'specs' => $this->specs ?? [],
            'tags' => $this->tags ?? [],
            'stockStatus' => $this->stock_status->value,
            'categoryId' => (string) $this->category_id,
            'categoryName' => $this->whenLoaded('category', fn () => $this->category->name),
            'brandId' => (string) $this->brand_id,
            'brandName' => $this->whenLoaded('brand', fn () => $this->brand->name),
            'images' => $this->whenLoaded('images', fn () => $this->images
                ->map(fn (ProductImage $image) => [
                    'id' => (string) $image->id,
                    'url' => $image->url,
                    'alt' => $image->alt,
                    'position' => $image->position,
                ])
                ->values()
                ->all()),
            'createdAt' => $this->created_at?->toIso8601ZuluString(),
        ];
    }
}
