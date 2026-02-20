<?php

namespace App\Services;

use App\Models\Tenant;
use Illuminate\Support\Facades\DB;
use PDOException;

class TenantDatabaseManager
{
    /**
     * Create a new tenant database and run migrations
     */
    public static function provision(Tenant $tenant): bool
    {
        try {
            // 1. Create database
            self::createDatabase($tenant);

            // 2. Connect to tenant DB and run migrations
            self::runMigrations($tenant);

            return true;
        } catch (\Exception $e) {
            \Log::error("Tenant provisioning failed for {$tenant->slug}", [
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Create the tenant database
     */
    private static function createDatabase(Tenant $tenant): void
    {
        $adminConnection = DB::connection('mysql'); // Use main DB temporarily

        $databaseName = $tenant->database_name;

        // Drop if exists (optional, for fresh setup)
        // $adminConnection->statement("DROP DATABASE IF EXISTS `{$databaseName}`");

        // Create database
        $adminConnection->statement("CREATE DATABASE IF NOT EXISTS `{$databaseName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

        \Log::info("Created database: {$databaseName}");
    }

    /**
     * Run migrations on tenant database
     */
    private static function runMigrations(Tenant $tenant): void
    {
        // Temporarily switch to tenant connection
        $originalDefault = config('database.default');
        
        try {
            // Add tenant connection to config
            config([
                'database.connections.tenant' => $tenant->getDatabaseConfig(),
            ]);

            // Run migrations
            \Artisan::call('migrate', [
                '--database' => 'tenant',
                '--path' => 'database/migrations/tenant',
            ]);

            \Log::info("Migrations completed for tenant: {$tenant->slug}");
        } finally {
            // Restore original connection
            config(['database.default' => $originalDefault]);
        }
    }

    /**
     * Configure connection for current request
     */
    public static function configure(Tenant $tenant): void
    {
        config([
            'database.connections.tenant' => $tenant->getDatabaseConfig(),
        ]);
    }

    /**
     * Delete tenant database (destructive)
     */
    public static function delete(Tenant $tenant): bool
    {
        try {
            $adminConnection = DB::connection('mysql');
            $databaseName = $tenant->database_name;

            $adminConnection->statement("DROP DATABASE IF EXISTS `{$databaseName}`");

            \Log::warn("Deleted database: {$databaseName}");

            return true;
        } catch (\Exception $e) {
            \Log::error("Failed to delete database for tenant {$tenant->slug}", [
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }
}
