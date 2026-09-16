<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = Str::title(fake()->unique()->words(2, true));

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(4)),
            'tagline' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'image_url' => 'https://images.unsplash.com/photo-1542811688-46ff8b8ca890?auto=format&fit=crop&w=1200&q=80',
            'image_alt' => fake()->sentence(3),
            'sort_order' => 0,
        ];
    }
}
