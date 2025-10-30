<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movimento extends Model
{
    use HasFactory;

    protected $fillable = [
        'caixa_id',
        'comanda_id',
        'tipo',
        'valor',
        'forma_pagamento',
        'descricao',
    ];

    protected $casts = [
        'valor' => 'decimal:2',
    ];

    // Relacionamento: Movimento pertence a um caixa
    public function caixa()
    {
        return $this->belongsTo(Caixa::class);
    }

    // Relacionamento: Movimento pode pertencer a uma comanda
    public function comanda()
    {
        return $this->belongsTo(Comanda::class);
    }
}
