<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * WithoutModelEvents kullanılmıyor: Product'ın `saving` olayı
     * search_text'i dolduruyor, olaylar kapatılırsa kayıt NOT NULL hatası verir.
     */
    public function run(): void
    {
        // Hasan Bey'in admin girişi. Şifre 'ADMIN_PASSWORD' ile verilir;
        // tanımlı değilse rastgele üretilip konsola yazılır (yalnızca bu çalıştırmada
        // görülür, veritabanına düz metin kaydedilmez).
        // E-posta yalnızca giriş amaçlı; site hiçbir yerde bunu göstermez.
        $adminPassword = env('ADMIN_PASSWORD') ?: Str::random(16);

        User::factory()->create([
            'name' => 'Hasan Karabaşak',
            'email' => 'hasankarabasak67@gmail.com',
            'password' => Hash::make($adminPassword),
            'role' => UserRole::Admin,
        ]);

        if (! env('ADMIN_PASSWORD')) {
            $this->command?->warn("ADMIN_PASSWORD tanımlı değildi — üretilen şifre: {$adminPassword}");
        }

        $customer = User::factory()->create([
            'name' => 'Test Müşteri',
            'email' => 'test@example.com',
        ]);

        $this->call([
            SettingsSeeder::class,
            CatalogSeeder::class,
        ]);

        $this->seedDemoOrders($customer);
    }

    /** Panel sipariş ekranını boş göstermemek için birkaç örnek sipariş. */
    private function seedDemoOrders(User $customer): void
    {
        $products = Product::query()->inRandomOrder()->limit(16)->get();
        if ($products->isEmpty()) {
            return;
        }

        foreach ($products->chunk(2) as $chunk) {
            $order = Order::factory()->for($customer)->create(['total_amount' => 0]);

            $total = 0;
            foreach ($chunk as $product) {
                $quantity = fake()->numberBetween(1, 2);
                $unitPrice = $product->price ?? fake()->randomFloat(2, 500, 20000);
                $lineTotal = round($quantity * $unitPrice, 2);
                $total += $lineTotal;

                OrderItem::factory()->for($order)->for($product)->create([
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'line_total' => $lineTotal,
                ]);
            }

            $order->update(['total_amount' => $total]);
        }
    }
}
