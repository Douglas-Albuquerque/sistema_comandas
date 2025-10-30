<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movimentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('caixa_id')->constrained('caixas')->onDelete('cascade');
            $table->foreignId('comanda_id')->nullable()->constrained('comandas')->onDelete('set null');
            $table->enum('tipo', ['entrada', 'saida', 'sangria']); // Tipo de movimento
            $table->decimal('valor', 10, 2);
            $table->string('forma_pagamento')->nullable(); // dinheiro, cartao, pix
            $table->text('descricao')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movimentos');
    }
};
