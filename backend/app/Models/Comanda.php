<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comanda extends Model
{
    use HasFactory;

    protected $fillable = [
        'mesa_id',
        'garcom_id',
        'status',
        'total',
        'desconto',
        'taxa_servico',
        'aberta_em',
        'fechada_em',
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'desconto' => 'decimal:2',
        'taxa_servico' => 'decimal:2',
        'aberta_em' => 'datetime',
        'fechada_em' => 'datetime',
    ];

    // Relacionamento: Comanda pertence a uma mesa
    public function mesa()
    {
        return $this->belongsTo(Mesa::class);
    }

    // Relacionamento: Comanda pertence a um garçom (user)
    public function garcom()
    {
        return $this->belongsTo(User::class, 'garcom_id');
    }

    // Relacionamento: Comanda tem muitos itens
    public function items()
    {
        return $this->hasMany(ComandaItem::class);
    }

    // Relacionamento: Comanda tem movimentos
    public function movimentos()
    {
        return $this->hasMany(Movimento::class);
    }

    // Calcular total
    public function calcularTotal()
    {
        $subtotal = $this->items()->sum('subtotal');
        $this->total = $subtotal - $this->desconto + $this->taxa_servico;
        $this->save();
    }
}
