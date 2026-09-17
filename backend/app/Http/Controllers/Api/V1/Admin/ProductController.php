<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\StoreProductRequest;
use App\Http\Requests\Api\V1\Admin\UpdateProductRequest;
use App\Http\Resources\Api\V1\Admin\AdminProductResource;
use App\Models\Product;
use App\Support\TurkishText;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Ürün yönetimi — /api/v1/admin/products.
 */
class ProductController extends Controller
{
    private const PER_PAGE = 20;

    private const RELATIONS = ['category', 'brand', 'images'];

    public function index(Request $request): JsonResponse
    {
        $query = Product::query()->with(self::RELATIONS);

        if ($search = trim((string) $request->query('ara', ''))) {
            $query->where('search_text', 'LIKE', '%'.TurkishText::normalize($search).'%');
        }

        if ($categoryId = $request->query('kategoriId')) {
            $query->where('category_id', $categoryId);
        }

        if ($brandId = $request->query('markaId')) {
            $query->where('brand_id', $brandId);
        }

        $query->orderByDesc('created_at')->orderByDesc('id');

        $perPage = self::PER_PAGE;
        $total = (clone $query)->toBase()->getCountForPagination();
        $lastPage = max(1, (int) ceil($total / $perPage));
        $page = min(max(1, (int) $request->query('sayfa', 1)), $lastPage);

        $items = $query->forPage($page, $perPage)->get();

        return response()->json([
            'data' => AdminProductResource::collection($items)->resolve($request),
            'meta' => [
                'currentPage' => $page,
                'lastPage' => $lastPage,
                'perPage' => $perPage,
                'total' => $total,
            ],
        ]);
    }

    public function store(StoreProductRequest $request): AdminProductResource
    {
        $product = Product::query()->create($request->toProductAttributes());

        return new AdminProductResource($product->load(self::RELATIONS));
    }

    public function show(Product $product): AdminProductResource
    {
        return new AdminProductResource($product->load(self::RELATIONS));
    }

    public function update(UpdateProductRequest $request, Product $product): AdminProductResource
    {
        $product->update($request->toProductAttributes());

        return new AdminProductResource($product->load(self::RELATIONS));
    }

    public function destroy(Product $product): JsonResponse
    {
        foreach ($product->images as $image) {
            $image->deleteImageFile();
        }

        $product->delete();

        return response()->json(status: 204);
    }
}
