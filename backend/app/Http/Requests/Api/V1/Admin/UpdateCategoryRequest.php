<?php

namespace App\Http\Requests\Api\V1\Admin;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
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
        /** @var Category $category */
        $category = $this->route('category');

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('categories', 'slug')->ignore($category->id)],
            'tagline' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'sortOrder' => ['nullable', 'integer', 'min:0'],
            // Güncellemede görsel opsiyonel — gönderilmezse mevcut görsel korunur.
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:8192'],
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
            'slug' => $data['slug'],
            'tagline' => $data['tagline'],
            'description' => $data['description'],
            'sort_order' => $data['sortOrder'] ?? 0,
            'image_alt' => $data['imageAlt'],
        ];
    }
}
