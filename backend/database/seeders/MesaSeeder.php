<?php

namespace Database\Seeders;

use App\Models\Mesa;
use Illuminate\Database\Seeder;

class MesaSeeder extends Seeder
{
    public function run(): void
    {
        // Criar 10 mesas (numeradas de 1 a 10)
        for ($i = 1; $i <= 10; $i++) {
            Mesa::create([
                'numero' => $i,
                'status' => $i % 3 === 0 ? 'ocupada' : 'disponivel',
                'capacidade' => 4,
            ]);
        }
    }
}
