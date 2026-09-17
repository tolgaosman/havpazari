<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CategoryAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Sanctum::actingAs(User::factory()->create(['role' => UserRole::Admin]));
    }

    public function test_store_requires_an_image(): void
    {
        $this->postJson('/api/v1/admin/categories', [
            'name' => 'Taktik Giyim',
            'tagline' => 'Dayanıklı ve konforlu',
            'description' => 'Açıklama.',
        ])->assertUnprocessable()->assertJsonValidationErrors(['image', 'imageAlt']);
    }

    public function test_store_creates_category_with_uploaded_image(): void
    {
        Storage::fake('public');

        $response = $this->post('/api/v1/admin/categories', [
            'name' => 'Taktik Giyim',
            'tagline' => 'Dayanıklı ve konforlu',
            'description' => 'Açıklama.',
            'image' => UploadedFile::fake()->create('kategori.jpg', 100, 'image/jpeg'),
            'imageAlt' => 'Taktik giyim kategorisi',
        ]);

        $response->assertCreated()->assertJsonPath('data.slug', 'taktik-giyim');

        $category = Category::query()->where('slug', 'taktik-giyim')->firstOrFail();
        Storage::disk('public')->assertExists($category->image_path);
    }

    public function test_update_replaces_image_and_removes_the_old_file(): void
    {
        Storage::fake('public');
        $oldPath = UploadedFile::fake()->create('eski.jpg', 100, 'image/jpeg')->store('categories', 'public');
        $category = Category::factory()->create(['image_path' => $oldPath]);

        $this->post("/api/v1/admin/categories/{$category->id}", [
            '_method' => 'PUT',
            'name' => $category->name,
            'slug' => $category->slug,
            'tagline' => $category->tagline,
            'description' => $category->description,
            'imageAlt' => 'Yeni görsel',
            'image' => UploadedFile::fake()->create('yeni.jpg', 100, 'image/jpeg'),
        ])->assertOk();

        Storage::disk('public')->assertMissing($oldPath);
        $this->assertNotSame($oldPath, $category->fresh()->image_path);
    }

    public function test_destroy_blocked_when_category_has_products(): void
    {
        $category = Category::factory()->create();
        Product::factory()->for($category)->create();

        $this->deleteJson("/api/v1/admin/categories/{$category->id}")
            ->assertStatus(409);

        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }
}
