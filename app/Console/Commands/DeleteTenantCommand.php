<?php

namespace App\Console\Commands;

use App\Models\Tenant;
use App\Services\TenantDatabaseManager;
use Illuminate\Console\Command;

class DeleteTenantCommand extends Command
{
    protected $signature = 'tenant:delete
                          {id : Tenant ID}
                          {--force : Skip confirmation}';

    protected $description = 'Delete a tenant and its database (destructive)';

    public function handle(): int
    {
        $tenantId = $this->argument('id');
        $force = $this->option('force');

        $tenant = Tenant::findOrFail($tenantId);

        if (!$force) {
            $this->warn("About to delete tenant: {$tenant->name} ({$tenant->slug})");
            $this->warn("Database: {$tenant->database_name}");

            if (!$this->confirm('Are you sure?')) {
                $this->info('Cancelled.');
                return 1;
            }
        }

        // Delete database
        $this->info("Deleting database: {$tenant->database_name}...");
        if (!TenantDatabaseManager::delete($tenant)) {
            $this->error('Failed to delete database.');
            return 1;
        }

        // Delete tenant record
        $tenant->delete();

        $this->info("✓ Tenant deleted successfully.");

        return 0;
    }
}
