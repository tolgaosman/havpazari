<?php

namespace App\Http\Requests\Api\V1\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * `Setting::put('site', ...)` için doğrulama.
 *
 * ⚠️ Kasıtlı olarak `contact.email` alanı burada YOK ve `toSettingsValue()`
 * yalnızca izin verilen anahtarları toplar — gövdede bir e-posta gelse bile
 * veritabanına yazılmaz. Site hiçbir yerde satıcı e-postası göstermiyor.
 */
class UpdateSettingsRequest extends FormRequest
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
        return [
            'name' => ['required', 'string', 'max:255'],
            'shortName' => ['required', 'string', 'max:100'],
            'tagline' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:1000'],
            'url' => ['required', 'url', 'max:255'],

            'contact.phone' => ['required', 'string', 'max:30'],
            'contact.phoneDisplay' => ['required', 'string', 'max:30'],
            'contact.mobile' => ['required', 'string', 'max:30'],
            'contact.mobileDisplay' => ['required', 'string', 'max:30'],

            'address.street' => ['required', 'string', 'max:255'],
            'address.locality' => ['required', 'string', 'max:100'],
            'address.region' => ['required', 'string', 'max:100'],
            'address.country' => ['required', 'string', 'max:100'],
            'address.countryCode' => ['required', 'string', 'max:5'],
            'address.plusCode' => ['nullable', 'string', 'max:50'],
            'address.full' => ['required', 'string', 'max:255'],

            'mapsUrl' => ['required', 'url', 'max:500'],
            'geo.latitude' => ['required', 'numeric', 'between:-90,90'],
            'geo.longitude' => ['required', 'numeric', 'between:-180,180'],

            'openingHours' => ['required', 'array', 'size:7'],
            'openingHours.*.schemaDay' => ['required', 'in:Mo,Tu,We,Th,Fr,Sa,Su'],
            'openingHours.*.label' => ['required', 'string', 'max:20'],
            'openingHours.*.opens' => ['nullable', 'date_format:H:i'],
            'openingHours.*.closes' => ['nullable', 'date_format:H:i', 'after:openingHours.*.opens'],

            'social.facebook' => ['nullable', 'string', 'max:500'],
            'social.instagram' => ['nullable', 'string', 'max:500'],

            'announcements' => ['required', 'array', 'max:10'],
            'announcements.*' => ['required', 'string', 'max:200'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'İşletme adı zorunlu.',
            'contact.phone.required' => 'Telefon numarası zorunlu.',
            'contact.mobile.required' => 'WhatsApp numarası zorunlu.',
            'address.full.required' => 'Adres zorunlu.',
            'mapsUrl.url' => 'Google Maps bağlantısı geçerli bir URL olmalı.',
            'geo.latitude.required' => 'Enlem zorunlu.',
            'geo.longitude.required' => 'Boylam zorunlu.',
            'openingHours.size' => 'Haftanın 7 günü için çalışma saati girilmeli.',
            'openingHours.*.closes.after' => 'Kapanış saati açılış saatinden sonra olmalı.',
            'announcements.required' => 'En az bir duyuru olmalı.',
        ];
    }

    /**
     * Doğrulanmış veriyi olduğu gibi döner — şema zaten `Setting::get('site')`
     * ile aynı şekilde tanımlı, yalnızca izin verilen alanlar burada.
     *
     * @return array<string, mixed>
     */
    public function toSettingsValue(): array
    {
        return $this->validated();
    }
}
