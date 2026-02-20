<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->string('institution_name')->nullable()->after('name');
            $table->string('institution_address')->nullable()->after('institution_name');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending')->after('institution_address');
            $table->unsignedBigInteger('owner_user_id')->nullable()->after('status');
            $table->unsignedBigInteger('requested_by_user_id')->nullable()->after('owner_user_id');
            $table->unsignedBigInteger('approved_by_user_id')->nullable()->after('requested_by_user_id');
            $table->unsignedBigInteger('rejected_by_user_id')->nullable()->after('approved_by_user_id');
            $table->timestamp('requested_at')->nullable()->after('rejected_by_user_id');
            $table->timestamp('approved_at')->nullable()->after('requested_at');
            $table->timestamp('rejected_at')->nullable()->after('approved_at');

            $table->index(['status', 'is_active']);
            $table->index('owner_user_id');
        });
    }

    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropIndex(['status', 'is_active']);
            $table->dropIndex(['owner_user_id']);

            $table->dropColumn([
                'institution_name',
                'institution_address',
                'status',
                'owner_user_id',
                'requested_by_user_id',
                'approved_by_user_id',
                'rejected_by_user_id',
                'requested_at',
                'approved_at',
                'rejected_at',
            ]);
        });
    }
};
