<?php

namespace App\Http\Resources\Api\V1\Admin;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Brand
 */
class AdminBrandResource extends JsonResource
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
            'country' => $this->country,
            'productCount' => $this->when(
                array_key_exists('products_count', $this->getAttributes()),
                fn () => $this->products_count,
            ),
        ];
    }
}
