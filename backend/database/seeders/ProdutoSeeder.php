<?php

namespace Database\Seeders;

use App\Models\Produto;
use App\Models\Categoria;
use Illuminate\Database\Seeder;

class ProdutoSeeder extends Seeder
{
    public function run(): void
    {
        // Buscar as categorias criadas
        $entradas = Categoria::where('slug', 'entradas')->first();
        $arabes = Categoria::where('slug', 'sanduiches-arabe')->first();
        $bolas = Categoria::where('slug', 'sanduiches-bola')->first();
        $artesanais = Categoria::where('slug', 'sanduiches-artesanal')->first();
        $pasteis = Categoria::where('slug', 'pasteis')->first();
        $bebidas = Categoria::where('slug', 'bebidas')->first();

        $produtos = [
            // Entradas
            [
                'categoria_id' => $entradas->id,
                'nome' => 'Batata Frita',
                'descricao' => 'Batata frita crocante (tamanho variável)',
                'preco' => 7.00,
                'disponivel' => true,
            ],

            // Sanduíches Árabe
            [
                'categoria_id' => $arabes->id,
                'nome' => 'Frango Burger',
                'descricao' => 'Hamburguer de frango',
                'preco' => 15.00,
                'disponivel' => true,
            ],
            [
                'categoria_id' => $arabes->id,
                'nome' => 'X-Frango',
                'descricao' => 'X-Frango completo',
                'preco' => 14.00,
                'disponivel' => true,
            ],
            [
                'categoria_id' => $arabes->id,
                'nome' => 'Baurú',
                'descricao' => 'Sanduíche Baurú',
                'preco' => 15.00,
                'disponivel' => true,
            ],

            // Sanduíches Bola
            [
                'categoria_id' => $bolas->id,
                'nome' => 'Misto',
                'descricao' => 'Sanduíche misto',
                'preco' => 7.00,
                'disponivel' => true,
            ],
            [
                'categoria_id' => $bolas->id,
                'nome' => 'Hamburguer',
                'descricao' => 'Sanduíche hamburguer',
                'preco' => 7.00,
                'disponivel' => true,
            ],
            [
                'categoria_id' => $bolas->id,
                'nome' => 'X-Burger',
                'descricao' => 'X-Burger completo',
                'preco' => 8.00,
                'disponivel' => true,
            ],

            // Sanduíches Artesanal
            [
                'categoria_id' => $artesanais->id,
                'nome' => 'CheeseBurger',
                'descricao' => 'CheeseBurger artesanal',
                'preco' => 10.00,
                'disponivel' => true,
            ],
            [
                'categoria_id' => $artesanais->id,
                'nome' => 'CheeseBacon',
                'descricao' => 'CheeseBacon artesanal',
                'preco' => 12.00,
                'disponivel' => true,
            ],
            [
                'categoria_id' => $artesanais->id,
                'nome' => 'CheeseSalada',
                'descricao' => 'CheeseSalada artesanal',
                'preco' => 15.00,
                'disponivel' => true,
            ],

            // Pastéis
            [
                'categoria_id' => $pasteis->id,
                'nome' => 'Pastel Misto',
                'descricao' => 'Pastel misto (tamanho variável)',
                'preco' => 5.00,
                'disponivel' => true,
            ],
            [
                'categoria_id' => $pasteis->id,
                'nome' => 'Pastel de Carne',
                'descricao' => 'Pastel de carne (tamanho variável)',
                'preco' => 5.00,
                'disponivel' => true,
            ],
            [
                'categoria_id' => $pasteis->id,
                'nome' => 'Pastel de Chocolate',
                'descricao' => 'Pastel de chocolate (tamanho variável)',
                'preco' => 5.00,
                'disponivel' => true,
            ],

            // Bebidas
            [
                'categoria_id' => $bebidas->id,
                'nome' => 'Refrigerante',
                'descricao' => 'Refrigerante (tamanho e sabor variável)',
                'preco' => 5.00,
                'disponivel' => true,
            ],
            [
                'categoria_id' => $bebidas->id,
                'nome' => 'Suco',
                'descricao' => 'Suco natural (tamanho e sabor variável)',
                'preco' => 8.00,
                'disponivel' => true,
            ],
            [
                'categoria_id' => $bebidas->id,
                'nome' => 'Vitamina',
                'descricao' => 'Vitamina (tamanho e sabor variável)',
                'preco' => 10.00,
                'disponivel' => true,
            ],
            [
                'categoria_id' => $bebidas->id,
                'nome' => 'Água',
                'descricao' => 'Água (tamanho variável)',
                'preco' => 3.00,
                'disponivel' => true,
            ],
        ];

        foreach ($produtos as $produto) {
            Produto::create($produto);
        }
    }
}
