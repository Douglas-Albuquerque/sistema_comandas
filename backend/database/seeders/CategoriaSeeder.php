<?php

namespace Database\Seeders;

use App\Models\Categoria;
use Illuminate\Database\Seeder;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = [
            [
                'nome' => 'Entradas',
                'slug' => 'entradas',
                'descricao' => 'Entradas e acompanhamentos',
                'ativo' => true,
            ],
            [
                'nome' => 'Sanduíches Árabe',
                'slug' => 'sanduiches-arabe',
                'descricao' => 'Sanduíches árabes',
                'ativo' => true,
            ],
            [
                'nome' => 'Sanduíches Bola',
                'slug' => 'sanduiches-bola',
                'descricao' => 'Sanduíches de bola',
                'ativo' => true,
            ],
            [
                'nome' => 'Sanduíches Artesanal',
                'slug' => 'sanduiches-artesanal',
                'descricao' => 'Sanduíches artesanais',
                'ativo' => true,
            ],
            [
                'nome' => 'Pastéis',
                'slug' => 'pasteis',
                'descricao' => 'Pastéis fritos',
                'ativo' => true,
            ],
            [
                'nome' => 'Bebidas',
                'slug' => 'bebidas',
                'descricao' => 'Bebidas variadas',
                'ativo' => true,
            ],
            [
                'nome' => 'Adicionais',
                'slug' => 'adicionais',
                'descricao' => 'Adicionais para sanduíches',
            ],
        ];

        foreach ($categorias as $categoria) {
            Categoria::create($categoria);
        }
    }
}
