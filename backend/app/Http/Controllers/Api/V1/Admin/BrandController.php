<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\StoreBrandRequest;
use App\Http\Requests\Api\V1\Admin\UpdateBrandRequest;
use App\Http\Resources\Api\V1\Admin\AdminBrandResource;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Marka yönetimi — /api/v1/admin/brands.
 */
class BrandController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $brands = Brand::query()->withCount('products')->orderBy('name')->get();

        return AdminBrandResource::collection($brands);
    }

    public function store(StoreBrandRequest $request): AdminBrandResource
    {
        $brand = Brand::query()->create($request->toBrandAttributes());

        return new AdminBrandResource($brand);
    }

    public function show(Brand $brand): AdminBrandResource
    {
        return new AdminBrandResource($brand->loadCount('products'));
    }

    public function update(UpdateBrandRequest $request, Brand $brand): AdminBrandResource
    {
        $brand->update($request->toBrandAttributes());

        return new AdminBrandResource($brand->loadCount('products'));
    }

    /** Ürünü olan marka silinemez — ürünler `cascadeOnDelete` ile birlikte silinir, bu istenmiyor. */
    public function destroy(Brand $brand): JsonResponse
    {
        if ($brand->products()->exists()) {
            return response()->json([
                'message' => 'Bu markaya ait ürünler var. Önce ürünleri başka bir markaya taşıyın veya silin.',
            ], 409);
        }

        $brand->delete();

        return response()->json(status: 204);
    }
}
