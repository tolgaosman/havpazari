<?php

namespace App\Http\Requests\Api\V1\Admin;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @see StoreProductRequest alan/açıklama notları için.
 */
class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Product $product */
        $product = $this->route('product');

        return [
            'categoryId' => ['required', 'integer', 'exists:categories,id'],
            'brandId' => ['required', 'integer', 'exists:brands,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('products', 'slug')->ignore($product->id)],
            'sku' => ['required', 'string', 'max:100', Rule::unique('products', 'sku')->ignore($product->id)],
            'shortDescription' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['nullable', 'numeric', 'min:0', 'max:1000000'],
            'compareAtPrice' => ['nullable', 'numeric', 'min:0', 'max:1000000', 'gt:price'],
            'stock' => ['required', 'integer', 'min:0'],
            'isOrderOnly' => ['boolean'],
            'requiresLicense' => ['boolean'],
            'isFeatured' => ['boolean'],
            'isNew' => ['boolean'],
            'specs' => ['array'],
            'specs.*.label' => ['required_with:specs', 'string', 'max:100'],
            'specs.*.value' => ['required_with:specs', 'string', 'max:255'],
            'tags' => ['array'],
            'tags.*' => ['string', 'max:50'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'categoryId.required' => 'Kategori seçilmeli.',
            'categoryId.exists' => 'Seçilen kategori bulunamadı.',
            'brandId.required' => 'Marka seçilmeli.',
            'brandId.exists' => 'Seçilen marka bulunamadı.',
            'name.required' => 'Ürün adı zorunlu.',
            'slug.regex' => 'Bağlantı yalnızca küçük harf, rakam ve tire içerebilir.',
            'slug.unique' => 'Bu bağlantı zaten kullanılıyor.',
            'sku.unique' => 'Bu stok kodu zaten kullanılıyor.',
            'shortDescription.required' => 'Kısa açıklama zorunlu.',
            'description.required' => 'Açıklama zorunlu.',
            'compareAtPrice.gt' => 'İndirim öncesi fiyat, satış fiyatından büyük olmalı.',
            'stock.required' => 'Stok adedi zorunlu.',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function toProductAttributes(): array
    {
        $data = $this->validated();

        return [
            'category_id' => $data['categoryId'],
            'brand_id' => $data['brandId'],
            'name' => $data['name'],
            'slug' => $data['slug'],
            'sku' => $data['sku'],
            'short_description' => $data['shortDescription'],
            'description' => $data['description'],
            'price' => $data['price'] ?? null,
            'compare_at_price' => $data['compareAtPrice'] ?? null,
            'stock' => $data['stock'],
            'is_order_only' => $data['isOrderOnly'] ?? false,
            'requires_license' => $data['requiresLicense'] ?? false,
            'is_featured' => $data['isFeatured'] ?? false,
            'is_new' => $data['isNew'] ?? false,
            'specs' => $data['specs'] ?? [],
            'tags' => $data['tags'] ?? [],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'isOrderOnly' => $this->boolean('isOrderOnly'),
            'requiresLicense' => $this->boolean('requiresLicense'),
            'isFeatured' => $this->boolean('isFeatured'),
            'isNew' => $this->boolean('isNew'),
        ]);
    }
}
