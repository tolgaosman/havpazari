<?php

namespace App\Support;

/**
 * Türkçeye duyarlı arama normalizasyonu — PHP tarafı.
 *
 * `lib/filters.ts`'teki `normalizeText()` ile birebir aynı sonucu üretir
 * (küçük harfe çevir, aksanlı harfleri ayrıştır, noktasız ı'yı i'ye eşle),
 * böylece "durbun" araması hem mock veri katmanında hem Laravel'de
 * "Dürbün"ü bulur. `intl` gerektirmez — sabit karakter eşleşmesi kullanır.
 */
class TurkishText
{
    /** @var array<string, string> */
    private const MAP = [
        'İ' => 'i', 'I' => 'i', 'ı' => 'i',
        'ü' => 'u', 'Ü' => 'u',
        'ş' => 's', 'Ş' => 's',
        'ğ' => 'g', 'Ğ' => 'g',
        'ç' => 'c', 'Ç' => 'c',
        'ö' => 'o', 'Ö' => 'o',
        'â' => 'a', 'Â' => 'a',
        'î' => 'i', 'Î' => 'i',
        'û' => 'u', 'Û' => 'u',
    ];

    public static function normalize(string $text): string
    {
        $normalized = strtr($text, self::MAP);

        return mb_strtolower($normalized, 'UTF-8');
    }
}
