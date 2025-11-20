<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Buscar as roles
        $adminRole = Role::where('slug', 'admin')->first();
        $caixaRole = Role::where('slug', 'caixa')->first();
        $garcomRole = Role::where('slug', 'garcom')->first();

        // Usuário Admin
        User::create([
            'name' => 'Administrador',
            'username' => 'admin',
            'email' => 'admin@mastermesas.com',
            'password' => Hash::make('123456'),
            'role_id' => $adminRole->id,
            'is_active' => true,
        ]);

        // Usuário Caixa
        User::create([
            'name' => 'Caixa',
            'username' => 'tes',
            'email' => 'caixa@mastermesas.com',
            'password' => Hash::make('123456'),
            'role_id' => $caixaRole->id,
            'is_active' => true,
        ]);

        // Usuário Garçom
        User::create([
            'name' => 'Garçom',
            'username' => 'test',
            'email' => 'garcom@mastermesas.com',
            'password' => Hash::make('123456'),
            'role_id' => $garcomRole->id,
            'is_active' => true,
        ]);
    }
}
