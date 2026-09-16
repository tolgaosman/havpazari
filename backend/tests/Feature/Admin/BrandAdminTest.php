<?php

namespace Tests\Feature\Admin;

use App\Models\Brand;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BrandAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_creates_brand(): void
    {
        $this->postJson('/api/v1/admin/brands', ['name' => 'Hatsan', 'country' => 'Türkiye'])
            ->assertCreated()
            ->assertJsonPath('data.slug', 'hatsan');
    }

    public function test_destroy_blocked_when_brand_has_products(): void
    {
        $brand = Brand::factory()->create();
        Product::factory()->for($brand)->create();

        $this->deleteJson("/api/v1/admin/brands/{$brand->id}")->assertStatus(409);
        $this->assertDatabaseHas('brands', ['id' => $brand->id]);
    }

    public function test_destroy_succeeds_when_brand_has_no_products(): void
    {
        $brand = Brand::factory()->create();

        $this->deleteJson("/api/v1/admin/brands/{$brand->id}")->assertNoContent();
        $this->assertDatabaseMissing('brands', ['id' => $brand->id]);
    }
}
