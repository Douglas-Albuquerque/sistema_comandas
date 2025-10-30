<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comandas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mesa_id')->constrained('mesas')->onDelete('cascade');
            $table->foreignId('garcom_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['aberta', 'enviada_cozinha', 'finalizada', 'paga'])->default('aberta');
            $table->decimal('total', 10, 2)->default(0);
            $table->decimal('desconto', 10, 2)->default(0);
            $table->decimal('taxa_servico', 10, 2)->default(0);
            $table->timestamp('aberta_em')->useCurrent();
            $table->timestamp('fechada_em')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comandas');
    }
};
