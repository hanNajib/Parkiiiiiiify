<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique()->comment('Tenant identifier (subdomain)');
            $table->string('domain')->unique()->comment('Full domain (tenant.parkify.test)');
            $table->string('name')->comment('Display name');
            $table->string('database_name')->unique()->comment('Database name (t1, t2, etc)');
            $table->string('host')->default('localhost');
            $table->integer('port')->default(3306);
            $table->string('username')->default('root');
            $table->string('password'); // Will be stored encrypted by PHP
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('slug');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
