<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    use HasFactory;

    protected $fillable = [
        'categoria_id',
        'nome',
        'descricao',
        'preco',
        'imagem',
        'disponivel',
    ];

    protected $casts = [
        'preco' => 'decimal:2',
        'disponivel' => 'boolean',
    ];

    // Relacionamento: Produto pertence a uma categoria
    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    // Relacionamento: Produto tem muitos itens de comanda
    public function comandaItems()
    {
        return $this->hasMany(ComandaItem::class);
    }
}
