<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComandaItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'comanda_id',
        'produto_id',
        'quantidade',
        'preco_unitario',
        'subtotal',
        'observacoes',
        'status',
    ];

    protected $casts = [
        'quantidade' => 'integer',
        'preco_unitario' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    // Relacionamento: Item pertence a uma comanda
    public function comanda()
    {
        return $this->belongsTo(Comanda::class);
    }

    // Relacionamento: Item pertence a um produto
    public function produto()
    {
        return $this->belongsTo(Produto::class);
    }

    // Calcular subtotal automaticamente
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($item) {
            $item->subtotal = $item->quantidade * $item->preco_unitario;
        });
    }
}
