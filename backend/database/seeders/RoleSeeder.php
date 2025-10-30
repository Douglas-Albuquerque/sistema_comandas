<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Administrador',
                'slug' => 'admin',
                'permissions' => json_encode([
                    'usuarios',
                    'mesas',
                    'caixa',
                    'relatorios',
                    'perfil',
                    'customizacao'
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Caixa',
                'slug' => 'caixa',
                'permissions' => json_encode([
                    'mesas',
                    'caixa',
                    'relatorios',
                    'perfil'
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Garçom',
                'slug' => 'garcom',
                'permissions' => json_encode([
                    'mesas',
                    'perfil'
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('roles')->insert($roles);
    }
}
