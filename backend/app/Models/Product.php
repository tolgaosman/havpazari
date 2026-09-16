<?php

namespace App\Models;

use App\Enums\StockStatus;
use App\Support\TurkishText;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * `search_text` mass assignment dışında tutulur: `booted()` her kayıttan önce
 * bunu ad/açıklama/marka/kategori/sku/etiketlerden yeniden hesaplar — elle
 * senkron tutulması gereken bir alan olmasın.
 */
#[Fillable([
    'category_id', 'brand_id', 'name', 'slug', 'sku', 'short_description', 'description',
    'price', 'compare_at_price', 'stock', 'is_order_only', 'requires_license',
    'is_featured', 'is_new', 'specs', 'tags',
])]
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    /** Bu adetin altı "son birkaç adet" sayılır (bkz. lib/mockData.ts stok kararları). */
    public const LOW_STOCK_THRESHOLD = 5;

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'compare_at_price' => 'decimal:2',
            'stock' => 'integer',
            'is_order_only' => 'boolean',
            'requires_license' => 'boolean',
            'is_featured' => 'boolean',
            'is_new' => 'boolean',
            'specs' => 'array',
            'tags' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Product $product) {
            // FK değiştiyse önbellekteki ilişki eski marka/kategoriyi tutar.
            if ($product->isDirty('brand_id')) {
                $product->unsetRelation('brand');
            }
            if ($product->isDirty('category_id')) {
                $product->unsetRelation('category');
            }

            $product->search_text = TurkishText::normalize(implode(' ', array_filter([
                $product->name,
                $product->short_description,
                $product->brand?->name,
                $product->category?->name,
                $product->sku,
                implode(' ', $product->tags ?? []),
            ])));
        });
    }

    /** @return BelongsTo<Category, $this> */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /** @return BelongsTo<Brand, $this> */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    /** @return HasMany<ProductImage, $this> */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('position');
    }

    /** @return HasMany<OrderItem, $this> */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Rafta bulunabilirlik durumu; ayrı bir sütun değil, `stock`/`is_order_only`'den türer.
     * `lib/filters.ts`'teki `StockStatus` ile birebir aynı dört değeri üretir.
     */
    protected function stockStatus(): Attribute
    {
        return Attribute::make(
            get: fn (): StockStatus => match (true) {
                $this->is_order_only => StockStatus::OrderOnly,
                $this->stock <= 0 => StockStatus::OutOfStock,
                $this->stock <= self::LOW_STOCK_THRESHOLD => StockStatus::LowStock,
                default => StockStatus::InStock,
            },
        );
    }

    #[Scope]
    protected function featured(Builder $query): void
    {
        $query->where('is_featured', true);
    }

    /**
     * "Yalnızca stokta" filtresinin karşılığı: stockStatus in_stock ya da low_stock
     * olanlar. Siparişle getirilenler (order_only) ve tükenenler kapsam dışı —
     * bkz. `lib/filters.ts`'teki `isAvailableNow()`.
     */
    #[Scope]
    protected function availableNow(Builder $query): void
    {
        $query->where('is_order_only', false)->where('stock', '>', 0);
    }
}
