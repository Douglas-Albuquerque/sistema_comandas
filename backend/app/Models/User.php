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
        //'avatar',
        'is_active',           // ← NOVO
        'inactive_until',      // ← NOVO
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',        
        'inactive_until' => 'datetime',  
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

    // ← NOVO: Verificar se o usuário está ativo
    public function isActiveNow()
    {
        if (!$this->is_active) {
            return false;
        }

        // Se tem data de inativação temporária e já passou
        if ($this->inactive_until && now()->lt($this->inactive_until)) {
            return false;
        }

        return true;
    }
}
