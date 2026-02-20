<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Kendaraan adalah global (di central DB), bukan per-tenant
        // Jika ada table kendaraan dari migrasi lama, hapus
        Schema::dropIfExists('kendaraan');
    }

    public function down(): void
    {
        // Tidak perlu re-create, karena kendaraan adalah global
    }
};
