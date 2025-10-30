<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, $permission): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Não autenticado'
            ], 401);
        }

        // Admin tem acesso a tudo
        if ($user->isAdmin()) {
            return $next($request);
        }

        // Verificar permissão específica
        if (!$user->hasPermission($permission)) {
            return response()->json([
                'message' => 'Você não tem permissão para acessar este recurso'
            ], 403);
        }

        return $next($request);
    }
}
