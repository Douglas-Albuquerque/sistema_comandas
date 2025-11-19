<?php

namespace Database\Seeders;

use App\Models\Mesa;
use Illuminate\Database\Seeder;

class MesaSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Criar 10 mesas (numeradas de 1 a 10)
        for ($i = 1; $i <= 10; $i++) {
            Mesa::create([
                'numero' => $i,
                'status' => $i % 3 === 0 ? 'ocupada' : 'disponivel', // A cada 3ª mesa, marca como ocupada
                'capacidade' => 4,
            ]);
        }
    }
}
