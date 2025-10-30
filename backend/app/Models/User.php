<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'role_id',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relacionamento: User pertence a uma role
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    // Relacionamento: User tem muitas comandas como garçom
    public function comandas()
    {
        return $this->hasMany(Comanda::class, 'garcom_id');
    }

    // Relacionamento: User tem muitos caixas
    public function caixas()
    {
        return $this->hasMany(Caixa::class);
    }

    // Verificar se tem permissão
    public function hasPermission($permission)
    {
        if (!$this->role) return false;
        
        $permissions = $this->role->permissions ?? [];
        return in_array($permission, $permissions);
    }

    // Verificar se é admin
    public function isAdmin()
    {
        return $this->role && $this->role->slug === 'admin';
    }

    // Verificar se é caixa
    public function isCaixa()
    {
        return $this->role && $this->role->slug === 'caixa';
    }

    // Verificar se é garçom
    public function isGarcom()
    {
        return $this->role && $this->role->slug === 'garcom';
    }
}
