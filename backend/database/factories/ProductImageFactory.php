<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductImage>
 */
class ProductImageFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'url' => 'https://images.unsplash.com/photo-1453563391321-df71955e9289?auto=format&fit=crop&w=1400&q=80',
            'alt' => fake()->sentence(4),
            'position' => 0,
        ];
    }
}
