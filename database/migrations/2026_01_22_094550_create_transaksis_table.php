<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transaksi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kendaraan_id')->constrained('kendaraan')->cascadeOnDelete();
            $table->timestamp('waktu_masuk');
            $table->timestamp('waktu_keluar')->nullable();
            $table->foreignId('tarif_id')->constrained('tarif')->cascadeOnDelete();
            $table->integer('durasi')->nullable();
            $table->decimal('total_biaya', 10, 2)->nullable();
            $table->enum('status', ['ongoing', 'completed'])->default('ongoing');
            $table->foreignId('petugas_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('area_parkir_id')->constrained('area_parkir')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksi');
    }
};
