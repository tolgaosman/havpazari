<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * `auth:sanctum`'dan sonra çalışır — kimliği doğrulanmış kullanıcının
 * `role=admin` olduğunu doğrular. `/api/v1/admin/*` grubuna bağlanır.
 */
class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->isAdmin()) {
            return response()->json(['message' => 'Bu işlem için yetkiniz yok.'], 403);
        }

        return $next($request);
    }
}
