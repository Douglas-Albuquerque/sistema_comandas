<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Role;

class RoleController extends Controller
{
    /**
     * Listar todas as roles
     */
    public function index()
    {
        $roles = Role::all();

        return response()->json([
            'roles' => $roles
        ], 200);
    }

    /**
     * Mostrar uma role específica
     */
    public function show($id)
    {
        $role = Role::findOrFail($id);

        return response()->json([
            'role' => $role
        ], 200);
    }
}
