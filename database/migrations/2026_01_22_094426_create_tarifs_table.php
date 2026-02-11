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
        Schema::create('tarif', function (Blueprint $table) {
            $table->id();
            $table->foreignId('area_parkir_id')->constrained('area_parkir')->cascadeOnDelete();
            $table->enum('rule_type', ['flat', 'per_jam']);
            $table->enum('jenis_kendaraan', ['motor', 'mobil', 'lainnya'])->default('lainnya');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Indexes for performance
            $table->index('jenis_kendaraan');
            $table->index('is_active');
            $table->index('rule_type');
            $table->index(['area_parkir_id', 'jenis_kendaraan', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tarifs');
    }
};
