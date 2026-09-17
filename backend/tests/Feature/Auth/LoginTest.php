<?php

namespace Tests\Feature\Auth;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Testler arasında throttle sayacı sızmasın.
        Cache::flush();
    }

    public function test_admin_can_login_with_correct_credentials(): void
    {
        User::factory()->create([
            'email' => 'admin@example.com',
            'password' => Hash::make('dogru-sifre'),
            'role' => UserRole::Admin,
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'admin@example.com',
            'password' => 'dogru-sifre',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.user.email', 'admin@example.com')
            ->assertJsonStructure(['data' => ['token', 'user' => ['name', 'email']]]);
    }

    public function test_login_rejects_wrong_password(): void
    {
        User::factory()->create([
            'email' => 'admin@example.com',
            'password' => Hash::make('dogru-sifre'),
            'role' => UserRole::Admin,
        ]);

        $this->postJson('/api/v1/login', [
            'email' => 'admin@example.com',
            'password' => 'yanlis-sifre',
        ])->assertUnprocessable();
    }

    public function test_login_rejects_non_admin_role(): void
    {
        User::factory()->create([
            'email' => 'musteri@example.com',
            'password' => Hash::make('sifre123'),
            'role' => UserRole::Customer,
        ]);

        $this->postJson('/api/v1/login', [
            'email' => 'musteri@example.com',
            'password' => 'sifre123',
        ])->assertUnprocessable();
    }

    public function test_login_rejects_unknown_email(): void
    {
        $this->postJson('/api/v1/login', [
            'email' => 'yok-boyle-kullanici@example.com',
            'password' => 'ne-olursa-olsun',
        ])->assertUnprocessable();
    }

    public function test_login_is_throttled_after_repeated_failures(): void
    {
        User::factory()->create([
            'email' => 'admin@example.com',
            'password' => Hash::make('dogru-sifre'),
            'role' => UserRole::Admin,
        ]);

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/v1/login', [
                'email' => 'admin@example.com',
                'password' => 'yanlis',
            ])->assertUnprocessable();
        }

        $this->postJson('/api/v1/login', [
            'email' => 'admin@example.com',
            'password' => 'yanlis',
        ])->assertStatus(429);
    }

    public function test_authenticated_admin_can_logout(): void
    {
        $user = User::factory()->create(['role' => UserRole::Admin]);
        $token = $user->createToken('test')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/logout')
            ->assertNoContent();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_me_returns_current_user(): void
    {
        $user = User::factory()->create(['role' => UserRole::Admin, 'name' => 'Hasan Karabaşak']);
        $token = $user->createToken('test')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/me')
            ->assertOk()
            ->assertJsonPath('data.name', 'Hasan Karabaşak');
    }
}
