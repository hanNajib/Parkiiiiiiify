<?php

namespace App\Console\Commands;

use App\Models\Tenant;
use Illuminate\Console\Command;

class ListTenantsCommand extends Command
{
    protected $signature = 'tenant:list';
    protected $description = 'List all tenants';

    public function handle(): int
    {
        $tenants = Tenant::all(['id', 'slug', 'domain', 'database_name', 'is_active']);

        if ($tenants->isEmpty()) {
            $this->warn('No tenants found.');
            return 0;
        }

        $this->table(
            ['ID', 'Slug', 'Domain', 'Database', 'Active'],
            $tenants->map(fn($t) => [
                'id' => $t->id,
                'slug' => $t->slug,
                'domain' => $t->domain,
                'database' => $t->database_name,
                'is_active' => $t->is_active ? '✓' : '✗',
            ])->toArray()
        );

        return 0;
    }
}
