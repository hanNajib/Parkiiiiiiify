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

            $table->foreignId('area_parkir_id')
                ->constrained('area_parkir')
                ->cascadeOnDelete();

            $table->enum('rule_type', [
                'flat',
                'interval',
                'progressive'
            ]);

            $table->enum('jenis_kendaraan', [
                'motor',
                'mobil',
                'lainnya'
            ])->default('lainnya');

            /*
            |--------------------------------------------------------------------------
            | INTERVAL / BLOCK CONFIG
            |--------------------------------------------------------------------------
            */

            $table->integer('interval_menit')->nullable(); // ganti durasi_awal_menit
            $table->decimal('harga_awal', 12, 2)->nullable();
            $table->decimal('harga_lanjutan', 12, 2)->nullable();

            /*
            |--------------------------------------------------------------------------
            | PROGRESSIVE CONFIG
            |--------------------------------------------------------------------------
            */

            $table->json('progressive_rules')->nullable();

            /*
            |--------------------------------------------------------------------------
            | LIMITER
            |--------------------------------------------------------------------------
            */

            $table->decimal('maksimal_per_hari', 12, 2)->nullable();

            /*
            |--------------------------------------------------------------------------
            | TIME BASED (Optional Advanced)
            |--------------------------------------------------------------------------
            */

            $table->time('berlaku_dari')->nullable();
            $table->time('berlaku_sampai')->nullable();

            $table->boolean('is_active')->default(true);

            $table->timestamps();

            /*
            |--------------------------------------------------------------------------
            | INDEX & CONSTRAINT
            |--------------------------------------------------------------------------
            */

            $table->index('rule_type');

            $table->unique([
                'area_parkir_id',
                'jenis_kendaraan',
                'rule_type',
                'berlaku_dari',
                'berlaku_sampai'
            ], 'unique_tarif_per_time_range');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tarif');
    }
};
