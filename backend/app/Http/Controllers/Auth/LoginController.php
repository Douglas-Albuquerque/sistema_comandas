<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class LoginController extends Controller
{
    /**
     * Login do usuário
     */
    public function login(Request $request)
    {
        try {
            $request->validate([
                'username' => 'required|string',
                'password' => 'required|string',
            ]);

            // Buscar usuário por username
            $user = User::where('username', $request->username)->first();

            // Verificar se existe e se a senha está correta
            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'message' => 'Credenciais inválidas'
                ], 401);
            }

            // Verificar se o usuário está ativo
            if (method_exists($user, 'isActiveNow') && !$user->isActiveNow()) {
                $message = 'Sua conta está inativa.';
                
                if ($user->inactive_until) {
                    $message .= ' Acesso bloqueado até ' . $user->inactive_until->format('d/m/Y');
                } else {
                    $message .= ' Entre em contato com o administrador.';
                }
                
                return response()->json([
                    'message' => $message
                ], 403);
            }

            // Criar token de autenticação
            $token = $user->createToken('auth_token')->plainTextToken;

            // Carregar a role com permissões
            $user->load('role');

            return response()->json([
                'message' => 'Login realizado com sucesso',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    //'avatar' => $user->avatar,
                    'role' => $user->role,
                    'is_active' => $user->is_active ?? true,
                    'inactive_until' => $user->inactive_until ?? null,
                ],
                'token' => $token,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro no servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Logout do usuário
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout realizado com sucesso'
        ], 200);
    }

    /**
     * Pegar usuário autenticado
     */
    public function me(Request $request)
    {
        $user = $request->user();
        $user->load('role');

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                //'avatar' => $user->avatar,
                'role' => $user->role,
                'is_active' => $user->is_active ?? true,
                'inactive_until' => $user->inactive_until ?? null,
            ]
        ], 200);
    }
}
