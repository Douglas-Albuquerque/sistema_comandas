<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customizations', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique(); // primary_color, secondary_color, logo, etc
            $table->text('value'); // Valor da configuração
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customizations');
    }
};
