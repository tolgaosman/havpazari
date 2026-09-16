<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'order_number' => 'HAD-'.fake()->unique()->numerify('######'),
            'status' => OrderStatus::Pending,
            'total_amount' => fake()->randomFloat(2, 500, 50000),
            'shipping_address' => [
                'fullName' => fake()->name(),
                'phone' => fake()->phoneNumber(),
                'city' => 'Lefkoşa',
                'district' => 'Değirmenlik',
                'line1' => fake()->streetAddress(),
            ],
            'notes' => null,
        ];
    }
}
