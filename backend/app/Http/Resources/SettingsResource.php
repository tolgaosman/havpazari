<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * `Setting::get('site')` çıktısını olduğu gibi sarar — değer zaten
 * frontend `SiteConfig` şekliyle (camelCase) veritabanında saklanıyor,
 * burada alan dönüşümü yok.
 */
class SettingsResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var array<string, mixed> $data */
        $data = $this->resource;

        return $data;
    }
}
