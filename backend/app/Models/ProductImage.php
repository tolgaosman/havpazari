<?php

namespace App\Models;

use Database\Factories\ProductImageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

#[Fillable(['product_id', 'url', 'path', 'alt', 'position'])]
class ProductImage extends Model
{
    /** @use HasFactory<ProductImageFactory> */
    use HasFactory;

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Admin panelden yüklenmiş dosyayı `public` diskten siler.
     * Seed verisindeki (Unsplash) görsellerde `path` boştur, dokunulmaz.
     */
    public function deleteImageFile(): void
    {
        if ($this->path !== null) {
            Storage::disk('public')->delete($this->path);
        }
    }
}
