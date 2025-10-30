<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\Role;

class UserController extends Controller
{
    /**
     * Listar todos os usuários
     */
    public function index()
    {
        $users = User::with('role')->get();

        return response()->json([
            'users' => $users
        ], 200);
    }

    /**
     * Criar novo usuário
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|unique:users,username|max:255',
            'password' => 'required|string|min:6',
            'role_id' => 'required|exists:roles,id',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'sometimes|boolean',           // ← NOVO
            'inactive_until' => 'sometimes|nullable|date', // ← NOVO
        ]);

        $data = [
            'name' => $request->name,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id,
            'is_active' => $request->get('is_active', true),                    // ← NOVO
            'inactive_until' => $request->get('inactive_until', null),         // ← NOVO
        ];

        // Upload avatar se fornecido
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $data['avatar'] = $path;
        }

        $user = User::create($data);
        $user->load('role');

        return response()->json([
            'message' => 'Usuário criado com sucesso',
            'user' => $user
        ], 201);
    }

    /**
     * Mostrar um usuário específico
     */
    public function show($id)
    {
        $user = User::with('role')->findOrFail($id);

        return response()->json([
            'user' => $user
        ], 200);
    }

    /**
     * Atualizar usuário
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|unique:users,username,' . $id . '|max:255',
            'password' => 'sometimes|string|min:6',
            'role_id' => 'sometimes|exists:roles,id',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'sometimes|boolean',           // ← NOVO
            'inactive_until' => 'sometimes|nullable|date', // ← NOVO
        ]);

        // Atualizar dados básicos
        if ($request->has('name')) {
            $user->name = $request->name;
        }

        if ($request->has('username')) {
            $user->username = $request->username;
        }

        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }

        if ($request->has('role_id')) {
            $user->role_id = $request->role_id;
        }

        // ← NOVO
        if ($request->has('is_active')) {
            $user->is_active = $request->is_active;
        }

        // ← NOVO
        if ($request->has('inactive_until')) {
            $user->inactive_until = $request->inactive_until;
        }

        // Upload avatar se fornecido
        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
        }

        $user->save();
        $user->load('role');

        return response()->json([
            'message' => 'Usuário atualizado com sucesso',
            'user' => $user
        ], 200);
    }


    /**
     * Deletar usuário
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Não permitir deletar o próprio usuário
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'Você não pode deletar seu próprio usuário'
            ], 400);
        }

        // Deletar avatar se existir
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->delete();

        return response()->json([
            'message' => 'Usuário deletado com sucesso'
        ], 200);
    }

    /**
     * Listar todas as roles disponíveis
     */
    public function roles()
    {
        $roles = Role::all();

        return response()->json([
            'roles' => $roles
        ], 200);
    }
}
