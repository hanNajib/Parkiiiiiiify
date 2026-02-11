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
        Schema::create('kendaraan', function (Blueprint $table) {
            $table->id();
            $table->string('plat_nomor');
            $table->enum('jenis_kendaraan', ['motor', 'mobil', 'lainnya'])->default('lainnya');
            $table->string('warna');
            $table->string('pemilik');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->softDeletes();
            $table->timestamps();
            
            // Indexes for performance
            $table->unique('plat_nomor');
            $table->index('jenis_kendaraan');
            $table->index(['user_id', 'jenis_kendaraan']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kendaraans');
    }
};
