<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kendaraan', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('plat_nomor')->unique();
            $table->enum('jenis_kendaraan', ['motor', 'mobil', 'lainnya'])->default('lainnya');
            $table->string('warna');
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index('jenis_kendaraan');
            $table->index(['user_id', 'jenis_kendaraan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kendaraan');
    }
};
