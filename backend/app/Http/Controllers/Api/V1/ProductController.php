<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Support\ProductFilters;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    private const RELATIONS = ['category', 'brand', 'images'];

    /** Filtrelenmiş, sıralanmış, sayfalanmış liste. Aralık dışı sayfa son sayfaya kenetlenir. */
    public function index(Request $request): JsonResponse
    {
        $filters = ProductFilters::fromRequest($request);

        $total = $filters->apply(Product::query())->count();
        $perPage = ProductFilters::PER_PAGE;
        $lastPage = max(1, (int) ceil($total / $perPage));
        $page = min($filters->page, $lastPage);

        $items = $filters->sort($filters->apply(Product::query()))
            ->with(self::RELATIONS)
            ->forPage($page, $perPage)
            ->get();

        $from = $items->isEmpty() ? null : ($page - 1) * $perPage + 1;
        $pageUrl = fn (int $target) => $request->fullUrlWithQuery(['sayfa' => $target > 1 ? $target : null]);

        return response()->json([
            'data' => ProductResource::collection($items)->resolve($request),
            'meta' => [
                'currentPage' => $page,
                'lastPage' => $lastPage,
                'perPage' => $perPage,
                'total' => $total,
                'from' => $from,
                'to' => $from === null ? null : $from + $items->count() - 1,
            ],
            'links' => [
                'first' => $pageUrl(1),
                'last' => $pageUrl($lastPage),
                'prev' => $page > 1 ? $pageUrl($page - 1) : null,
                'next' => $page < $lastPage ? $pageUrl($page + 1) : null,
            ],
        ]);
    }

    public function featured(Request $request): AnonymousResourceCollection
    {
        $products = ProductFilters::recommended(Product::query()->where('is_featured', true))
            ->with(self::RELATIONS)
            ->limit($this->limit($request, 8))
            ->get();

        return ProductResource::collection($products);
    }

    public function slugs(): JsonResponse
    {
        $slugs = Product::query()->orderBy('id')->pluck('slug')
            ->map(fn (string $slug) => ['slug' => $slug]);

        return response()->json(['data' => $slugs]);
    }

    /** Kenar çubuğu sayaçları; her boyut kendi filtresini hariç tutarak sayılır. */
    public function filters(Request $request): JsonResponse
    {
        $filters = ProductFilters::fromRequest($request);

        $prices = Product::query()->whereNotNull('price')
            ->selectRaw('MIN(price) as min_price, MAX(price) as max_price')
            ->toBase()
            ->first();

        $priceRange = $prices?->min_price === null
            ? ['min' => 0, 'max' => 0]
            : [
                'min' => (int) (floor($prices->min_price / 100) * 100),
                'max' => (int) (ceil($prices->max_price / 100) * 100),
            ];

        return response()->json([
            'data' => [
                'categories' => $this->facets($filters, 'category', Category::class, 'category_id'),
                'brands' => $this->facets($filters, 'brands', Brand::class, 'brand_id'),
                'priceRange' => $priceRange,
                'totalProducts' => $filters->apply(Product::query(), 'category')->count(),
            ],
        ]);
    }

    public function show(string $slug): ProductResource
    {
        $product = Product::query()->with(self::RELATIONS)->where('slug', $slug)->firstOrFail();

        return new ProductResource($product);
    }

    /** Önce aynı kategori, yetmezse başka kategorideki aynı marka ürünleri. */
    public function related(Request $request, string $slug): AnonymousResourceCollection
    {
        $product = Product::query()->where('slug', $slug)->firstOrFail();
        $limit = $this->limit($request, 4);

        $sameCategory = ProductFilters::recommended(
            Product::query()->whereKeyNot($product->id)->where('category_id', $product->category_id),
        )->with(self::RELATIONS)->limit($limit)->get();

        $remaining = $limit - $sameCategory->count();
        $sameBrand = $remaining > 0
            ? ProductFilters::recommended(
                Product::query()
                    ->whereKeyNot($product->id)
                    ->where('brand_id', $product->brand_id)
                    ->where('category_id', '!=', $product->category_id),
            )->with(self::RELATIONS)->limit($remaining)->get()
            : collect();

        return ProductResource::collection($sameCategory->concat($sameBrand));
    }

    /**
     * @param  class-string<Category|Brand>  $model
     * @return list<array{slug: string, name: string, count: int}>
     */
    private function facets(ProductFilters $filters, string $skip, string $model, string $foreignKey): array
    {
        $counts = $filters->apply(Product::query(), $skip)
            ->toBase()
            ->select($foreignKey)
            ->selectRaw('COUNT(*) as aggregate')
            ->groupBy($foreignKey)
            ->pluck('aggregate', $foreignKey);

        return $model::query()
            ->whereKey($counts->keys())
            ->get(['id', 'name', 'slug'])
            ->map(fn ($row) => ['slug' => $row->slug, 'name' => $row->name, 'count' => (int) $counts[$row->id]])
            ->sortBy('name', SORT_NATURAL | SORT_FLAG_CASE)
            ->values()
            ->all();
    }

    private function limit(Request $request, int $default): int
    {
        $limit = filter_var($request->query('limit'), FILTER_VALIDATE_INT, [
            'options' => ['min_range' => 1, 'max_range' => 50],
        ]);

        return $limit === false ? $default : $limit;
    }
}
