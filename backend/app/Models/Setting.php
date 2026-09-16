<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * Anahtar/değer ayar deposu. Şu an tek satır kullanılıyor: `key = 'site'`,
 * `value` frontend `SiteConfig` şekliyle birebir eşleşen JSON (bkz.
 * `SettingsResource` / `Database\Seeders\SettingsSeeder`).
 */
#[Fillable(['key', 'value'])]
class Setting extends Model
{
    protected function casts(): array
    {
        return [
            'value' => 'array',
        ];
    }

    /** Anahtara göre değeri okur; kayıt yoksa `$default` döner. */
    public static function get(string $key, array $default = []): array
    {
        return static::query()->where('key', $key)->value('value') ?? $default;
    }

    /** Anahtarın değerini oluşturur veya günceller. */
    public static function put(string $key, array $value): self
    {
        return static::query()->updateOrCreate(['key' => $key], ['value' => $value]);
    }
}
