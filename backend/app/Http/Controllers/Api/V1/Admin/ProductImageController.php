<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\Admin\AdminProductResource;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

/**
 * Ürün görsel yönetimi — yükleme, sıra/alt metin güncelleme, silme.
 */
class ProductImageController extends Controller
{
    /** Bir veya birden çok görsel yükler; yeni görseller mevcutların sonuna eklenir. */
    public function store(Request $request, Product $product): AdminProductResource
    {
        $validated = Validator::make($request->all(), [
            'images' => ['required', 'array', 'min:1', 'max:10'],
            'images.*' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
            'alts' => ['array'],
            'alts.*' => ['nullable', 'string', 'max:255'],
        ], [
            'images.required' => 'En az bir görsel seçilmeli.',
            'images.max' => 'Tek seferde en fazla 10 görsel yüklenebilir.',
            'images.*.image' => 'Yüklenen dosya bir görsel olmalı.',
            'images.*.mimes' => 'Görsel yalnızca jpg, png veya webp olabilir.',
            'images.*.max' => 'Her görsel en fazla 8MB olabilir.',
        ])->validate();

        $nextPosition = (int) $product->images()->max('position') + 1;
        $alts = $validated['alts'] ?? [];

        foreach ($validated['images'] as $index => $file) {
            $path = $file->store('products', 'public');

            $product->images()->create([
                'url' => Storage::disk('public')->url($path),
                'path' => $path,
                'alt' => $alts[$index] ?? $product->name,
                'position' => $nextPosition++,
            ]);
        }

        return new AdminProductResource($product->load(['category', 'brand', 'images']));
    }

    /** Görsel sırasını ve/veya alt metnini günceller: `[{id, position, alt}]`. */
    public function update(Request $request, Product $product): AdminProductResource
    {
        $validated = $request->validate([
            'images' => ['required', 'array', 'min:1'],
            'images.*.id' => ['required', 'integer'],
            'images.*.position' => ['required', 'integer', 'min:0'],
            'images.*.alt' => ['required', 'string', 'max:255'],
        ]);

        $imagesById = $product->images()->get()->keyBy('id');

        foreach ($validated['images'] as $entry) {
            /** @var ProductImage|null $image */
            $image = $imagesById->get($entry['id']);
            $image?->update(['position' => $entry['position'], 'alt' => $entry['alt']]);
        }

        return new AdminProductResource($product->load(['category', 'brand', 'images']));
    }

    public function destroy(ProductImage $productImage): JsonResponse
    {
        $productImage->deleteImageFile();
        $productImage->delete();

        return response()->json(status: 204);
    }
}
