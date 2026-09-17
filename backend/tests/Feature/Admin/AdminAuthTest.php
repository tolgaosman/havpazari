<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Her admin ucunun `auth:sanctum` + `admin` middleware'i arkasında olduğunu
 * doğrular: kimliksiz istek 401, müşteri rolüyle istek 403 dönmeli.
 */
class AdminAuthTest extends TestCase
{
    use RefreshDatabase;

    /** @return array<int, array{0: string, 1: string}> */
    private function endpoints(): array
    {
        $product = Product::factory()->create();
        $category = Category::factory()->create();
        $brand = Brand::factory()->create();
        $order = Order::factory()->create();
        $image = ProductImage::factory()->for($product)->create();

        return [
            ['GET', '/api/v1/admin/dashboard'],
            ['GET', '/api/v1/admin/products'],
            ['POST', '/api/v1/admin/products'],
            ['GET', "/api/v1/admin/products/{$product->id}"],
            ['PUT', "/api/v1/admin/products/{$product->id}"],
            ['DELETE', "/api/v1/admin/products/{$product->id}"],
            ['POST', "/api/v1/admin/products/{$product->id}/images"],
            ['PATCH', "/api/v1/admin/products/{$product->id}/images"],
            ['DELETE', "/api/v1/admin/product-images/{$image->id}"],
            ['GET', '/api/v1/admin/categories'],
            ['POST', '/api/v1/admin/categories'],
            ['GET', "/api/v1/admin/categories/{$category->id}"],
            ['PUT', "/api/v1/admin/categories/{$category->id}"],
            ['DELETE', "/api/v1/admin/categories/{$category->id}"],
            ['GET', '/api/v1/admin/brands'],
            ['POST', '/api/v1/admin/brands'],
            ['PUT', "/api/v1/admin/brands/{$brand->id}"],
            ['DELETE', "/api/v1/admin/brands/{$brand->id}"],
            ['GET', '/api/v1/admin/orders'],
            ['GET', "/api/v1/admin/orders/{$order->id}"],
            ['PATCH', "/api/v1/admin/orders/{$order->id}"],
            ['GET', '/api/v1/admin/settings'],
            ['PUT', '/api/v1/admin/settings'],
        ];
    }

    public function test_every_admin_endpoint_rejects_unauthenticated_requests(): void
    {
        foreach ($this->endpoints() as [$method, $uri]) {
            $this->json($method, $uri)
                ->assertStatus(401, "Beklenen 401, dönen farklı: {$method} {$uri}");
        }
    }

    public function test_every_admin_endpoint_rejects_non_admin_users(): void
    {
        $customer = User::factory()->create(['role' => UserRole::Customer]);
        $token = $customer->createToken('test')->plainTextToken;

        foreach ($this->endpoints() as [$method, $uri]) {
            $this->withHeader('Authorization', "Bearer {$token}")
                ->json($method, $uri)
                ->assertStatus(403, "Beklenen 403, dönen farklı: {$method} {$uri}");
        }
    }

    public function test_admin_user_passes_the_gate(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $token = $admin->createToken('test')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/admin/dashboard')
            ->assertOk();
    }
}
