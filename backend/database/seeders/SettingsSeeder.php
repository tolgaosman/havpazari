<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

/**
 * `settings` tablosundaki tek `site` kaydını doldurur.
 *
 * Başlangıç değerleri frontend'in eski sabit dosyası `lib/site.ts`'ten
 * birebir kopyalandı — admin panel açıldığında Hasan Bey aynı bilgileri
 * görsün, sonra ayarlar sayfasından günceller.
 *
 * ⚠️ Kasıtlı olarak `contact.email` alanı YOK — site hiçbir yerde satıcı
 * e-postası göstermiyor (bkz. frontend AGENTS/CLAUDE notları).
 */
class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        Setting::put('site', [
            'name' => 'Hasan Av Dünyası',
            'shortName' => 'Hasan Av',
            'tagline' => 'Av, Doğa ve Kamp Ekipmanları',
            'description' => "Düzova'da 20 yıldır avcının yanında. Tüfek, optik, taktik giyim, kamp ve hayatta kalma ekipmanları — hepsi elden görülüp denenebilir.",
            'url' => 'https://hasanavdunyasi.com',
            'contact' => [
                'phone' => '+90 542 850 73 44',
                'phoneDisplay' => '0542 850 73 44',
                'mobile' => '+90 542 850 73 44',
                'mobileDisplay' => '0542 850 73 44',
            ],
            'address' => [
                'street' => 'Lefkoşa İskele Anayolu',
                'locality' => 'Düzova',
                'region' => 'Değirmenlik, Lefkoşa',
                'country' => 'Kuzey Kıbrıs Türk Cumhuriyeti',
                'countryCode' => 'CY',
                'plusCode' => '6GHJ+49G Düzova',
                'full' => 'Lefkoşa İskele Anayolu, Düzova, Lefkoşa, KKTC',
            ],
            'mapsUrl' => 'https://www.google.com/maps/place//data=!4m2!3m1!1s0x14de3907ce7fd31d:0x918946cf4da040fe',
            'geo' => [
                'latitude' => 35.227815,
                'longitude' => 33.5309577,
            ],
            'openingHours' => [
                ['schemaDay' => 'Mo', 'label' => 'Pazartesi', 'opens' => '08:30', 'closes' => '18:30'],
                ['schemaDay' => 'Tu', 'label' => 'Salı', 'opens' => '08:30', 'closes' => '18:30'],
                ['schemaDay' => 'We', 'label' => 'Çarşamba', 'opens' => '08:30', 'closes' => '18:30'],
                ['schemaDay' => 'Th', 'label' => 'Perşembe', 'opens' => '08:30', 'closes' => '18:30'],
                ['schemaDay' => 'Fr', 'label' => 'Cuma', 'opens' => '08:30', 'closes' => '18:30'],
                ['schemaDay' => 'Sa', 'label' => 'Cumartesi', 'opens' => '08:30', 'closes' => '16:00'],
                ['schemaDay' => 'Su', 'label' => 'Pazar', 'opens' => null, 'closes' => null],
            ],
            'social' => [
                'facebook' => 'https://www.facebook.com/p/Hasan-Av-D%C3%BCnyas%C4%B1%C4%B1-61564920326191/',
                'instagram' => '',
            ],
            'announcements' => [
                "Düzova'da elden teslim — ürünü görmeden almak zorunda değilsiniz",
                'Av sezonu hazırlığı: yeni gelen optik ve kamuflaj ürünleri mağazada',
                'Ruhsatlı ürünler yalnızca mağazadan, belge ile satılır',
            ],
        ]);
    }
}
