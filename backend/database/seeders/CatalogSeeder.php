<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Frontend'deki örnek kataloğu (lib/mockData.ts) veritabanına aktarır.
 *
 * Kaynak `database/data/catalog.json` — mockData.ts'ten üretilir, böylece
 * slug'lar birebir aynı kalır ve API'ye geçişte sitedeki linkler bozulmaz.
 */
class CatalogSeeder extends Seeder
{
    /** Frontend'in stockStatus değerini stok sayısına çevirir. */
    private const STOCK_BY_STATUS = [
        'in_stock' => 20,
        'low_stock' => 3,
        'out_of_stock' => 0,
        'order_only' => 0,
    ];

    public function run(): void
    {
        $catalog = json_decode(
            file_get_contents(database_path('data/catalog.json')),
            true,
            flags: JSON_THROW_ON_ERROR,
        );

        DB::transaction(function () use ($catalog) {
            $brandIds = [];
            foreach ($catalog['brands'] as $brand) {
                $brandIds[$brand['slug']] = Brand::updateOrCreate(
                    ['slug' => $brand['slug']],
                    ['name' => $brand['name'], 'country' => $brand['country']],
                )->id;
            }

            $categoryIds = [];
            foreach ($catalog['categories'] as $index => $category) {
                $categoryIds[$category['slug']] = Category::updateOrCreate(
                    ['slug' => $category['slug']],
                    [
                        'name' => $category['name'],
                        'tagline' => $category['tagline'],
                        'description' => $category['description'],
                        'image_url' => $category['imageUrl'],
                        'image_alt' => $category['imageAlt'],
                        'sort_order' => $index,
                    ],
                )->id;
            }

            foreach ($catalog['products'] as $data) {
                $product = Product::firstOrNew(['slug' => $data['slug']]);
                $product->fill([
                    'category_id' => $categoryIds[$data['category']['slug']],
                    'brand_id' => $brandIds[$data['brand']['slug']],
                    'name' => $data['name'],
                    'sku' => $data['sku'],
                    'short_description' => $data['shortDescription'],
                    'description' => $data['description'],
                    'price' => $data['price'],
                    'compare_at_price' => $data['compareAtPrice'],
                    'stock' => self::STOCK_BY_STATUS[$data['stockStatus']],
                    'is_order_only' => $data['stockStatus'] === 'order_only',
                    'requires_license' => $data['requiresLicense'],
                    'is_featured' => $data['isFeatured'],
                    'is_new' => $data['isNew'],
                    'specs' => $data['specs'],
                    'tags' => $data['tags'],
                ]);
                $product->created_at = Carbon::parse($data['createdAt']);
                $product->save();

                $product->images()->delete();
                foreach ($data['images'] as $position => $image) {
                    $product->images()->create([
                        'url' => $image['url'],
                        'alt' => $image['alt'],
                        'position' => $position,
                    ]);
                }
            }
        });
    }
}
