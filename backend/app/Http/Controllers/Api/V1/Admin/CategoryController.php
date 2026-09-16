<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\StoreCategoryRequest;
use App\Http\Requests\Api\V1\Admin\UpdateCategoryRequest;
use App\Http\Resources\Api\V1\Admin\AdminCategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

/**
 * Kategori yönetimi — /api/v1/admin/categories.
 * TODO: auth:sanctum + admin rolü middleware'i eklenecek.
 */
class CategoryController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $categories = Category::query()
            ->withCount('products')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return AdminCategoryResource::collection($categories);
    }

    public function store(StoreCategoryRequest $request): AdminCategoryResource
    {
        $path = $request->file('image')->store('categories', 'public');

        $category = Category::query()->create([
            ...$request->toCategoryAttributes(),
            'image_url' => Storage::disk('public')->url($path),
            'image_path' => $path,
        ]);

        return new AdminCategoryResource($category);
    }

    public function show(Category $category): AdminCategoryResource
    {
        return new AdminCategoryResource($category->loadCount('products'));
    }

    public function update(UpdateCategoryRequest $request, Category $category): AdminCategoryResource
    {
        $attributes = $request->toCategoryAttributes();

        if ($request->hasFile('image')) {
            $category->deleteImageFile();
            $path = $request->file('image')->store('categories', 'public');
            $attributes['image_url'] = Storage::disk('public')->url($path);
            $attributes['image_path'] = $path;
        }

        $category->update($attributes);

        return new AdminCategoryResource($category->loadCount('products'));
    }

    /** Ürünü olan kategori silinemez — ürünler `cascadeOnDelete` ile birlikte silinir, bu istenmiyor. */
    public function destroy(Category $category): JsonResponse
    {
        if ($category->products()->exists()) {
            return response()->json([
                'message' => 'Bu kategoride ürünler var. Önce ürünleri başka bir kategoriye taşıyın veya silin.',
            ], 409);
        }

        $category->deleteImageFile();
        $category->delete();

        return response()->json(status: 204);
    }
}
