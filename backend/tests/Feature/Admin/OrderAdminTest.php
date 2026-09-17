<?php

namespace Tests\Feature\Admin;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Sanctum::actingAs(User::factory()->create(['role' => UserRole::Admin]));
    }

    public function test_index_filters_by_status(): void
    {
        Order::factory()->create(['status' => OrderStatus::Pending]);
        Order::factory()->create(['status' => OrderStatus::Delivered]);

        $this->getJson('/api/v1/admin/orders?durum=pending')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.status', 'pending');
    }

    public function test_update_changes_status_and_notes(): void
    {
        $order = Order::factory()->create(['status' => OrderStatus::Pending]);

        $this->patchJson("/api/v1/admin/orders/{$order->id}", [
            'status' => 'shipped',
            'notes' => 'Kargoya verildi',
        ])->assertOk()->assertJsonPath('data.status', 'shipped');

        $this->assertDatabaseHas('orders', ['id' => $order->id, 'status' => 'shipped', 'notes' => 'Kargoya verildi']);
    }

    public function test_update_rejects_invalid_status(): void
    {
        $order = Order::factory()->create();

        $this->patchJson("/api/v1/admin/orders/{$order->id}", ['status' => 'boyle-bir-durum-yok'])
            ->assertUnprocessable();
    }
}
