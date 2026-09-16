<?php

namespace App\Http\Requests\Api\V1\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        // TODO: auth eklenince admin rolüyle sınırlandırılacak.
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', 'unique:categories,slug'],
            'tagline' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'sortOrder' => ['nullable', 'integer', 'min:0'],
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
            'imageAlt' => ['required', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Kategori adı zorunlu.',
            'slug.regex' => 'Bağlantı yalnızca küçük harf, rakam ve tire içerebilir.',
            'slug.unique' => 'Bu bağlantı zaten kullanılıyor.',
            'tagline.required' => 'Tanıtım metni zorunlu.',
            'description.required' => 'Açıklama zorunlu.',
            'image.required' => 'Kategori görseli zorunlu.',
            'image.image' => 'Yüklenen dosya bir görsel olmalı.',
            'image.mimes' => 'Görsel yalnızca jpg, png veya webp olabilir.',
            'image.max' => 'Görsel en fazla 8MB olabilir.',
            'imageAlt.required' => 'Görsel için alternatif metin zorunlu (erişilebilirlik).',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function toCategoryAttributes(): array
    {
        $data = $this->validated();

        return [
            'name' => $data['name'],
            'slug' => $data['slug'] ?? Str::slug($data['name']),
            'tagline' => $data['tagline'],
            'description' => $data['description'],
            'sort_order' => $data['sortOrder'] ?? 0,
            'image_alt' => $data['imageAlt'],
        ];
    }
}
