<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaksi', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('kendaraan_id')->comment('FK to central kendaraan table');
            $table->timestamp('waktu_masuk');
            $table->timestamp('waktu_keluar')->nullable();
            $table->foreignId('tarif_id')->constrained('tarif')->cascadeOnDelete();
            $table->integer('durasi')->nullable();
            $table->decimal('total_biaya', 10, 2)->nullable();
            $table->enum('status', ['ongoing', 'completed'])->default('ongoing');
            $table->unsignedBigInteger('petugas_id')->comment('FK to central users table');
            $table->foreignId('area_parkir_id')->constrained('area_parkir')->cascadeOnDelete();
            $table->string('token');
            $table->timestamps();

            $table->index('kendaraan_id');
            $table->index('petugas_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksi');
    }
};
