<?php

namespace App\Http\Resources;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Frontend `types/index.ts` → `Product` şekli (camelCase, id'ler string).
 *
 * @mixin Product
 */
class ProductResource extends JsonResource
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
            'currency' => 'TRY',
            'category' => [
                'id' => (string) $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ],
            'brand' => [
                'id' => (string) $this->brand->id,
                'name' => $this->brand->name,
                'slug' => $this->brand->slug,
            ],
            'images' => $this->images
                ->map(fn (ProductImage $image) => ['url' => $image->url, 'alt' => $image->alt])
                ->values()
                ->all(),
            'specs' => $this->specs ?? [],
            'stockStatus' => $this->stock_status->value,
            'requiresLicense' => $this->requires_license,
            'isFeatured' => $this->is_featured,
            'isNew' => $this->is_new,
            'tags' => $this->tags ?? [],
            'createdAt' => $this->created_at?->toIso8601ZuluString(),
        ];
    }
}
