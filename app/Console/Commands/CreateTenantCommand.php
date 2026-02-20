<?php

namespace App\Console\Commands;

use App\Models\Tenant;
use App\Models\User;
use App\Services\TenantDatabaseManager;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateTenantCommand extends Command
{
    protected $signature = 'tenant:create
                          {--slug= : Tenant slug (subdomain)}
                          {--name= : Tenant display name}
                          {--domain= : Full domain}
                          {--database= : Database name}
                          {--db-host= : Database host}
                          {--db-port= : Database port}
                          {--db-username= : Database username}
                          {--db-password= : Database password}
                          {--admin-email= : Admin email}
                          {--admin-password= : Admin password}';

    protected $description = 'Create a new tenant with database and admin user';

    public function handle(): int
    {
        $slug = $this->option('slug') ?? $this->ask('Tenant slug (e.g., tenant1)');
        $name = $this->option('name') ?? $this->ask('Tenant name (e.g., Parking Lot A)');
        $domain = $this->option('domain') ?? "{$slug}.parkify.test";
        $database = $this->option('database') ?? "t_{$slug}";
        $dbHost = $this->option('db-host') ?? env('DB_HOST', 'localhost');
        $dbPort = $this->option('db-port') ?? env('DB_PORT', 3306);
        $dbUsername = $this->option('db-username') ?? env('DB_USERNAME', 'root');
        $dbPassword = $this->option('db-password');
        $adminEmail = $this->option('admin-email') ?? $this->ask('Admin email');
        $adminPassword = $this->option('admin-password') ?? $this->secret('Admin password');

        if ($dbPassword === null) {
            $dbPassword = env('DB_PASSWORD', '');
        }

        $this->info("Creating tenant: {$name} ({$slug})...");

        // 1. Create tenant record
        $tenant = Tenant::create([
            'slug' => $slug,
            'name' => $name,
            'domain' => $domain,
            'database_name' => $database,
            'host' => $dbHost,
            'port' => $dbPort,
            'username' => $dbUsername,
            'password' => $dbPassword,
            'is_active' => true,
        ]);

        $this->info("✓ Tenant created: ID {$tenant->id}");

        // 2. Provision database
        $this->info("Provisioning database: {$database}...");
        if (!TenantDatabaseManager::provision($tenant)) {
            $this->error("✗ Failed to provision database");
            $tenant->delete();
            return 1;
        }

        $this->info("✓ Database provisioned");

        // 3. Create admin user for this tenant
        $this->info("Creating admin user...");
        
        // Check if user already exists globally
        $user = User::where('email', $adminEmail)->first();
        
        if (!$user) {
            $user = User::create([
                'name' => "Admin {$name}",
                'email' => $adminEmail,
                'password' => Hash::make($adminPassword),
            ]);
            $this->info("✓ User created: {$user->email}");
        } else {
            $this->info("✓ Using existing user: {$user->email}");
        }

        // 4. Attach user to tenant with admin role
        $tenant->users()->attach($user->id, ['role' => 'admin']);

        $this->info("✓ Admin user attached to tenant");

        $this->info("\n✨ Tenant created successfully!");
        $this->line("Subdomain: {$domain}");
        $this->line("Database: {$database}");
        $this->line("Admin: {$adminEmail}");

        return 0;
    }
}
