<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Caixa extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'saldo_inicial',
        'saldo_final',
        'status',
        'aberto_em',
        'fechado_em',
    ];

    protected $casts = [
        'saldo_inicial' => 'decimal:2',
        'saldo_final' => 'decimal:2',
        'aberto_em' => 'datetime',
        'fechado_em' => 'datetime',
    ];

    // Relacionamento: Caixa pertence a um usuário
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relacionamento: Caixa tem muitos movimentos
    public function movimentos()
    {
        return $this->hasMany(Movimento::class);
    }
}
