<?php

namespace App\Support;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

/**
 * Mağaza sorgusu — frontend'deki `lib/searchParams.ts` + `lib/filters.ts` karşılığı.
 *
 * Parametre adları ve doğrulama sınırları zod şemasıyla aynıdır. Geçersiz değer
 * 422 döndürmez, sessizce düşürülür: bozuk bir link sayfayı çökertmemeli.
 */
final class ProductFilters
{
    public const PER_PAGE = 12;

    private const SORT_KEYS = ['onerilen', 'fiyat-artan', 'fiyat-azalan', 'yeni', 'isim'];

    private const SLUG_PATTERN = '/^[a-z0-9]+(?:-[a-z0-9]+)*$/';

    private const MAX_SEARCH_LENGTH = 80;

    private const PRICE_CEILING = 1_000_000;

    private const MAX_PAGE = 500;

    /**
     * @param  list<string>  $brands
     */
    private function __construct(
        public readonly ?string $q,
        public readonly ?string $category,
        public readonly array $brands,
        public readonly ?float $minPrice,
        public readonly ?float $maxPrice,
        public readonly bool $inStockOnly,
        public readonly string $sort,
        public readonly int $page,
    ) {}

    public static function fromRequest(Request $request): self
    {
        $q = self::scalar($request->query('ara'));
        $q = $q === null ? null : trim($q);
        if ($q === '' || ($q !== null && mb_strlen($q) > self::MAX_SEARCH_LENGTH)) {
            $q = null;
        }

        $category = self::scalar($request->query('kategori'));
        if ($category !== null && ! preg_match(self::SLUG_PATTERN, $category)) {
            $category = null;
        }

        $brands = [];
        foreach ((array) $request->query('marka', []) as $entry) {
            if (! is_string($entry)) {
                continue;
            }
            foreach (explode(',', $entry) as $slug) {
                $slug = trim($slug);
                if ($slug !== '' && preg_match(self::SLUG_PATTERN, $slug)) {
                    $brands[] = $slug;
                }
            }
        }

        $minPrice = self::price($request->query('min'));
        $maxPrice = self::price($request->query('max'));
        if ($minPrice !== null && $maxPrice !== null && $minPrice > $maxPrice) {
            [$minPrice, $maxPrice] = [$maxPrice, $minPrice];
        }

        $sort = self::scalar($request->query('sirala'));

        $page = filter_var(self::scalar($request->query('sayfa')), FILTER_VALIDATE_INT, [
            'options' => ['min_range' => 1, 'max_range' => self::MAX_PAGE],
        ]);

        return new self(
            q: $q,
            category: $category,
            brands: array_values(array_unique($brands)),
            minPrice: $minPrice,
            maxPrice: $maxPrice,
            inStockOnly: self::scalar($request->query('stok')) === '1',
            sort: in_array($sort, self::SORT_KEYS, true) ? $sort : 'onerilen',
            page: $page === false ? 1 : $page,
        );
    }

    /**
     * Filtreleri uygular. `$skip` ile bir boyut atlanır — kenar çubuğu sayaçları
     * kendi boyutunu hariç tutarak sayar (bkz. `filterProducts(..., skip)`).
     *
     * @param  Builder<Product>  $query
     * @return Builder<Product>
     */
    public function apply(Builder $query, ?string $skip = null): Builder
    {
        if ($this->q !== null) {
            $terms = preg_split('/\s+/u', TurkishText::normalize($this->q), -1, PREG_SPLIT_NO_EMPTY);
            foreach ($terms as $term) {
                $escaped = str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $term);
                $query->whereRaw(
                    $query->qualifyColumn('search_text')." LIKE ? ESCAPE '!'",
                    ['%'.$escaped.'%'],
                );
            }
        }

        if ($skip !== 'category' && $this->category !== null) {
            $query->whereHas('category', fn (Builder $q) => $q->where('slug', $this->category));
        }

        if ($skip !== 'brands' && $this->brands !== []) {
            $query->whereHas('brand', fn (Builder $q) => $q->whereIn('slug', $this->brands));
        }

        // Fiyatı gizli ürünler bir fiyat aralığına dahil edilemez.
        if ($this->minPrice !== null || $this->maxPrice !== null) {
            $query->whereNotNull($query->qualifyColumn('price'));
            if ($this->minPrice !== null) {
                $query->where($query->qualifyColumn('price'), '>=', $this->minPrice);
            }
            if ($this->maxPrice !== null) {
                $query->where($query->qualifyColumn('price'), '<=', $this->maxPrice);
            }
        }

        if ($this->inStockOnly) {
            $query->where($query->qualifyColumn('is_order_only'), false)
                ->where($query->qualifyColumn('stock'), '>', 0);
        }

        return $query;
    }

    /**
     * @param  Builder<Product>  $query
     * @return Builder<Product>
     */
    public function sort(Builder $query): Builder
    {
        return match ($this->sort) {
            'fiyat-artan' => $query->orderByRaw('price IS NULL')->orderBy('price')->orderBy('id'),
            'fiyat-azalan' => $query->orderByRaw('price IS NULL')->orderByDesc('price')->orderBy('id'),
            'yeni' => $query->orderByDesc('created_at')->orderByDesc('id'),
            'isim' => $query->orderBy('name')->orderBy('id'),
            default => self::recommended($query),
        };
    }

    /**
     * "Önerilen" sırası: öne çıkanlar → stok durumu (rafta, son adetler,
     * siparişle, tükendi) → en yeni.
     *
     * @param  Builder<Product>  $query
     * @return Builder<Product>
     */
    public static function recommended(Builder $query): Builder
    {
        return $query
            ->orderByDesc('is_featured')
            ->orderByRaw(
                'CASE WHEN is_order_only THEN 2 WHEN stock <= 0 THEN 3 WHEN stock <= ? THEN 1 ELSE 0 END',
                [Product::LOW_STOCK_THRESHOLD],
            )
            ->orderByDesc('created_at')
            ->orderByDesc('id');
    }

    private static function scalar(mixed $value): ?string
    {
        return is_string($value) ? $value : null;
    }

    private static function price(mixed $value): ?float
    {
        $value = self::scalar($value);
        if ($value === null || trim($value) === '' || ! is_numeric(trim($value))) {
            return null;
        }

        $number = (float) trim($value);

        return is_finite($number) && $number >= 0 && $number <= self::PRICE_CEILING ? $number : null;
    }
}
