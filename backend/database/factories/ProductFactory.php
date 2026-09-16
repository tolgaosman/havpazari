<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = Str::title(fake()->unique()->words(3, true));

        return [
            'category_id' => Category::factory(),
            'brand_id' => Brand::factory(),
            'name' => $name,
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(5)),
            'sku' => 'HAD-'.fake()->unique()->bothify('???-####'),
            'short_description' => fake()->sentence(8),
            'description' => fake()->paragraphs(2, true),
            'price' => fake()->randomFloat(2, 500, 30000),
            'compare_at_price' => null,
            'stock' => fake()->numberBetween(6, 40),
            'is_order_only' => false,
            'requires_license' => false,
            'is_featured' => false,
            'is_new' => false,
            'specs' => [['label' => 'Ağırlık', 'value' => fake()->numberBetween(100, 3000).' g']],
            'tags' => fake()->words(3),
        ];
    }

    /** Ruhsatlı ürün: fiyat gizli. */
    public function licensed(): static
    {
        return $this->state(fn () => ['requires_license' => true, 'price' => null]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn () => ['stock' => 0]);
    }

    public function orderOnly(): static
    {
        return $this->state(fn () => ['is_order_only' => true, 'stock' => 0]);
    }

    public function featured(): static
    {
        return $this->state(fn () => ['is_featured' => true]);
    }
}
