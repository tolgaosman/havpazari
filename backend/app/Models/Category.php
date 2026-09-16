<?php

namespace App\Models;

use Database\Factories\CategoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

#[Fillable(['name', 'slug', 'tagline', 'description', 'image_url', 'image_path', 'image_alt', 'sort_order'])]
class Category extends Model
{
    /** @use HasFactory<CategoryFactory> */
    use HasFactory;

    /** @return HasMany<Product, $this> */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Admin panelden yüklenmiş eski görseli `public` diskten siler
     * (görsel değiştirildiğinde). Seed verisinde `image_path` boştur.
     */
    public function deleteImageFile(): void
    {
        if ($this->image_path !== null) {
            Storage::disk('public')->delete($this->image_path);
        }
    }
}
