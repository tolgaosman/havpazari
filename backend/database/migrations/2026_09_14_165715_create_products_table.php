<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('brand_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku')->unique();
            $table->string('short_description');
            $table->text('description');
            // Ruhsata tabi ürünlerde bilinçli olarak null bırakılır — "Fiyat için arayın".
            $table->decimal('price', 12, 2)->nullable();
            $table->decimal('compare_at_price', 12, 2)->nullable();
            $table->unsignedInteger('stock')->default(0);
            // true ise stokta tutulmuyor, siparişle getiriliyor (stok sayısından bağımsız).
            $table->boolean('is_order_only')->default(false);
            $table->boolean('requires_license')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new')->default(false);
            $table->json('specs')->nullable();
            $table->json('tags')->nullable();
            // Türkçe normalize edilmiş arama metni (App\Support\TurkishText); ad+açıklama+marka+kategori+sku+etiketler.
            $table->text('search_text');
            $table->timestamps();

            $table->index('is_featured');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
