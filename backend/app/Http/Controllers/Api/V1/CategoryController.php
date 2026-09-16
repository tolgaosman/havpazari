<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CategoryController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return CategoryResource::collection(
            Category::query()->orderBy('sort_order')->orderBy('id')->get(),
        );
    }

    public function show(string $slug): CategoryResource
    {
        return new CategoryResource(Category::query()->where('slug', $slug)->firstOrFail());
    }
}
