<?php

namespace Tests\Feature\Api;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_frontend_shape_and_paginates(): void
    {
        Product::factory()->count(13)->create();

        $this->getJson('/api/v1/products')
            ->assertOk()
            ->assertJsonCount(12, 'data')
            ->assertJsonPath('meta.total', 13)
            ->assertJsonPath('meta.lastPage', 2)
            ->assertJsonPath('meta.from', 1)
            ->assertJsonPath('meta.to', 12)
            ->assertJsonStructure([
                'data' => [[
                    'id', 'sku', 'name', 'slug', 'shortDescription', 'description', 'price',
                    'compareAtPrice', 'currency', 'category' => ['id', 'name', 'slug'],
                    'brand' => ['id', 'name', 'slug'], 'images', 'specs', 'stockStatus',
                    'requiresLicense', 'isFeatured', 'isNew', 'tags', 'createdAt',
                ]],
                'links' => ['first', 'last', 'prev', 'next'],
            ]);
    }

    public function test_out_of_range_page_clamps_to_last_page(): void
    {
        Product::factory()->count(13)->create();

        $this->getJson('/api/v1/products?sayfa=99')
            ->assertOk()
            ->assertJsonPath('meta.currentPage', 2)
            ->assertJsonCount(1, 'data');
    }

    public function test_search_ignores_turkish_characters(): void
    {
        Product::factory()->create(['name' => 'Vortex Dürbün 10x42']);
        Product::factory()->create(['name' => 'Kamp Ocağı']);

        $this->getJson('/api/v1/products?ara=durbun')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Vortex Dürbün 10x42');
    }

    public function test_price_filter_excludes_hidden_prices(): void
    {
        Product::factory()->licensed()->create();
        Product::factory()->create(['price' => 1500]);

        $this->getJson('/api/v1/products?min=0&max=2000')
            ->assertOk()
            ->assertJsonPath('meta.total', 1);
    }

    public function test_facets_skip_their_own_dimension(): void
    {
        $category = Category::factory()->create();
        $vortex = Brand::factory()->create(['slug' => 'vortex']);
        $petzl = Brand::factory()->create(['slug' => 'petzl']);
        Product::factory()->count(2)->for($vortex)->for($category)->create();
        Product::factory()->for($petzl)->create();

        $response = $this->getJson('/api/v1/products/filters?marka=vortex')->assertOk();

        $this->assertCount(2, $response->json('data.brands'));
        $this->assertSame(2, $response->json('data.totalProducts'));
        $this->assertSame([2], array_column($response->json('data.categories'), 'count'));
    }

    public function test_show_returns_404_for_unknown_slug(): void
    {
        $this->getJson('/api/v1/products/yok-boyle-bir-urun')->assertNotFound();
    }

    public function test_static_routes_are_not_treated_as_slugs(): void
    {
        Product::factory()->featured()->create();

        $this->getJson('/api/v1/products/featured')->assertOk()->assertJsonCount(1, 'data');
        $this->getJson('/api/v1/products/slugs')->assertOk()->assertJsonCount(1, 'data');
    }
}
