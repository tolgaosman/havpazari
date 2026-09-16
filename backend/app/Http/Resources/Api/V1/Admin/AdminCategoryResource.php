<?php

namespace App\Http\Resources\Api\V1\Admin;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Category
 */
class AdminCategoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'tagline' => $this->tagline,
            'description' => $this->description,
            'imageUrl' => $this->image_url,
            'imageAlt' => $this->image_alt,
            'sortOrder' => $this->sort_order,
            'productCount' => $this->when(
                $this->relationLoaded('products') || array_key_exists('products_count', $this->getAttributes()),
                fn () => $this->products_count ?? $this->products->count(),
            ),
        ];
    }
}
