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
        Schema::create('area_parkir', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('lokasi');
            $table->integer('kapasitas');
            $table->boolean('is_active')->default(true);
            $table->enum('default_rule_type', [
                'choose', // untuk area parkir yang belum punya aturan tarif, agar petugas bisa pilih jenis tarif saat buat transaksi
                'flat',
                'interval',
                'progressive'
            ])->default('choose');

            
            $table->softDeletes();
            $table->timestamps();

            $table->index('nama');
            $table->index('default_rule_type');
            $table->index('is_active');
            $table->index(['is_active', 'kapasitas']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('area_parkir');
    }
};
