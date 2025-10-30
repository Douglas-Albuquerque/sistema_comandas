<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mesa extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero',
        'status',
        'capacidade',
    ];

    // Relacionamento: Mesa tem muitas comandas
    public function comandas()
    {
        return $this->hasMany(Comanda::class);
    }

    // Comanda ativa da mesa
    public function comandaAtiva()
    {
        return $this->hasOne(Comanda::class)
            ->whereIn('status', ['aberta', 'enviada_cozinha']);
    }
}
