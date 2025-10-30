<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customization extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
    ];

    // Método helper para pegar valor
    public static function get($key, $default = null)
    {
        $custom = self::where('key', $key)->first();
        return $custom ? $custom->value : $default;
    }

    // Método helper para setar valor
    public static function set($key, $value)
    {
        return self::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }
}
