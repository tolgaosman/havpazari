<?php

namespace Tests\Feature\Admin;

use Database\Seeders\SettingsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingsAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_show_returns_seeded_settings_without_email(): void
    {
        $this->seed(SettingsSeeder::class);

        $response = $this->getJson('/api/v1/settings')->assertOk();

        $response->assertJsonPath('data.name', 'Hasan Av Dünyası');
        $this->assertArrayNotHasKey('email', $response->json('data.contact'));
    }

    public function test_admin_update_persists_changes(): void
    {
        $this->seed(SettingsSeeder::class);

        $payload = $this->validSettingsPayload();
        $payload['contact']['phoneDisplay'] = '0533 000 00 00';

        $this->putJson('/api/v1/admin/settings', $payload)
            ->assertOk()
            ->assertJsonPath('data.contact.phoneDisplay', '0533 000 00 00');

        $this->getJson('/api/v1/settings')
            ->assertJsonPath('data.contact.phoneDisplay', '0533 000 00 00');
    }

    public function test_update_ignores_an_email_field_if_sent(): void
    {
        $this->seed(SettingsSeeder::class);

        $payload = $this->validSettingsPayload();
        $payload['contact']['email'] = 'sizinti@example.com';

        $this->putJson('/api/v1/admin/settings', $payload)->assertOk();

        $response = $this->getJson('/api/v1/settings')->assertOk();
        $this->assertArrayNotHasKey('email', $response->json('data.contact'));
    }

    /**
     * @return array<string, mixed>
     */
    private function validSettingsPayload(): array
    {
        return [
            'name' => 'Hasan Av Dünyası',
            'shortName' => 'Hasan Av',
            'tagline' => 'Av, Doğa ve Kamp Ekipmanları',
            'description' => 'Açıklama metni.',
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
            'mapsUrl' => 'https://www.google.com/maps/place/test',
            'geo' => ['latitude' => 35.227815, 'longitude' => 33.5309577],
            'openingHours' => [
                ['schemaDay' => 'Mo', 'label' => 'Pazartesi', 'opens' => '08:30', 'closes' => '18:30'],
                ['schemaDay' => 'Tu', 'label' => 'Salı', 'opens' => '08:30', 'closes' => '18:30'],
                ['schemaDay' => 'We', 'label' => 'Çarşamba', 'opens' => '08:30', 'closes' => '18:30'],
                ['schemaDay' => 'Th', 'label' => 'Perşembe', 'opens' => '08:30', 'closes' => '18:30'],
                ['schemaDay' => 'Fr', 'label' => 'Cuma', 'opens' => '08:30', 'closes' => '18:30'],
                ['schemaDay' => 'Sa', 'label' => 'Cumartesi', 'opens' => '08:30', 'closes' => '16:00'],
                ['schemaDay' => 'Su', 'label' => 'Pazar', 'opens' => null, 'closes' => null],
            ],
            'social' => ['facebook' => 'https://facebook.com/test', 'instagram' => ''],
            'announcements' => ['Duyuru 1', 'Duyuru 2'],
        ];
    }
}
