<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            // bkz. 2026_09_14_223053_add_path_to_product_images_table — aynı gerekçe.
            $table->string('image_path')->nullable()->after('image_url');
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('image_path');
        });
    }
};
