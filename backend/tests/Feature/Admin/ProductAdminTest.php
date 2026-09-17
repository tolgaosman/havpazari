<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Sanctum::actingAs(User::factory()->create(['role' => UserRole::Admin]));
    }

    public function test_index_lists_and_paginates_products(): void
    {
        Product::factory()->count(3)->create();

        $this->getJson('/api/v1/admin/products')
            ->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [['id', 'sku', 'name', 'slug', 'price', 'stock', 'categoryId', 'brandId', 'images']],
                'meta' => ['currentPage', 'lastPage', 'perPage', 'total'],
            ]);
    }

    public function test_store_creates_product_from_camel_case_payload(): void
    {
        $category = Category::factory()->create();
        $brand = Brand::factory()->create();

        $response = $this->postJson('/api/v1/admin/products', [
            'categoryId' => $category->id,
            'brandId' => $brand->id,
            'name' => 'Vortex Dürbün 10x42',
            'sku' => 'HAD-VOR-1042',
            'shortDescription' => 'Kısa açıklama',
            'description' => 'Uzun açıklama.',
            'price' => 4500,
            'stock' => 12,
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'Vortex Dürbün 10x42')
            ->assertJsonPath('data.slug', 'vortex-durbun-10x42')
            ->assertJsonPath('data.stockStatus', 'in_stock');

        $this->assertDatabaseHas('products', ['sku' => 'HAD-VOR-1042']);
    }

    public function test_store_validates_required_fields(): void
    {
        $this->postJson('/api/v1/admin/products', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['categoryId', 'brandId', 'name', 'sku', 'shortDescription', 'description', 'stock']);
    }

    public function test_update_changes_product(): void
    {
        $product = Product::factory()->create(['name' => 'Eski Ad']);

        $this->putJson("/api/v1/admin/products/{$product->id}", [
            'categoryId' => $product->category_id,
            'brandId' => $product->brand_id,
            'name' => 'Yeni Ad',
            'slug' => $product->slug,
            'sku' => $product->sku,
            'shortDescription' => $product->short_description,
            'description' => $product->description,
            'stock' => 5,
        ])->assertOk()->assertJsonPath('data.name', 'Yeni Ad');

        $this->assertDatabaseHas('products', ['id' => $product->id, 'name' => 'Yeni Ad']);
    }

    public function test_destroy_deletes_product_and_its_uploaded_images(): void
    {
        Storage::fake('public');
        $product = Product::factory()->create();
        $file = UploadedFile::fake()->create('urun.jpg', 100, 'image/jpeg');
        $path = $file->store('products', 'public');
        $product->images()->create(['url' => 'x', 'path' => $path, 'alt' => 'x', 'position' => 0]);

        $this->deleteJson("/api/v1/admin/products/{$product->id}")->assertNoContent();

        $this->assertDatabaseMissing('products', ['id' => $product->id]);
        Storage::disk('public')->assertMissing($path);
    }

    public function test_uploads_multiple_images_and_reorders_them(): void
    {
        Storage::fake('public');
        $product = Product::factory()->create();

        $upload = $this->post("/api/v1/admin/products/{$product->id}/images", [
            'images' => [
                UploadedFile::fake()->create('a.jpg', 100, 'image/jpeg'),
                UploadedFile::fake()->create('b.jpg', 100, 'image/jpeg'),
            ],
        ]);

        $upload->assertOk();
        $this->assertCount(2, $product->fresh()->images);

        $images = $product->fresh()->images()->orderBy('position')->get();
        $reorder = $this->patchJson("/api/v1/admin/products/{$product->id}/images", [
            'images' => [
                ['id' => $images[0]->id, 'position' => 1, 'alt' => 'İkinci'],
                ['id' => $images[1]->id, 'position' => 0, 'alt' => 'Birinci'],
            ],
        ]);

        $reorder->assertOk();
        $this->assertSame('Birinci', $images[1]->fresh()->alt);
        $this->assertSame(0, $images[1]->fresh()->position);
    }

    public function test_deleting_a_single_image_removes_its_file(): void
    {
        Storage::fake('public');
        $product = Product::factory()->create();
        $path = UploadedFile::fake()->create('a.jpg', 100, 'image/jpeg')->store('products', 'public');
        $image = $product->images()->create(['url' => 'x', 'path' => $path, 'alt' => 'x', 'position' => 0]);

        $this->deleteJson("/api/v1/admin/product-images/{$image->id}")->assertNoContent();

        $this->assertDatabaseMissing('product_images', ['id' => $image->id]);
        Storage::disk('public')->assertMissing($path);
    }
}
