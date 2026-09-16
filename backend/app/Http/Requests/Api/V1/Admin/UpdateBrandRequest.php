<?php

namespace App\Http\Requests\Api\V1\Admin;

use App\Models\Brand;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBrandRequest extends FormRequest
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
        /** @var Brand $brand */
        $brand = $this->route('brand');

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('brands', 'slug')->ignore($brand->id)],
            'country' => ['required', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Marka adı zorunlu.',
            'slug.regex' => 'Bağlantı yalnızca küçük harf, rakam ve tire içerebilir.',
            'slug.unique' => 'Bu bağlantı zaten kullanılıyor.',
            'country.required' => 'Marka menşei zorunlu.',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function toBrandAttributes(): array
    {
        $data = $this->validated();

        return [
            'name' => $data['name'],
            'slug' => $data['slug'],
            'country' => $data['country'],
        ];
    }
}
