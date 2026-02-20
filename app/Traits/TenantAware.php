<?php

namespace App\Traits;

use App\Models\Tenant;
use App\Services\TenantDatabaseManager;

trait TenantAware
{
    /**
     * Boot the TenantAware trait
     */
    protected static function bootTenantAware(): void
    {
    }

    /**
     * Get the connection name for the model.
     */
    public function getConnectionName(): ?string
    {
        $tenantConnection = $this->resolveTenantConnectionName();
        if ($tenantConnection !== null) {
            return $tenantConnection;
        }

        return parent::getConnectionName();
    }

    /**
     * Helper to switch to main connection when needed
     */
    public function onMainConnection(): static
    {
        return $this->setConnection('mysql');
    }

    /**
     * Retrieve the model for a bound value - used by route model binding
     * This is called automatically by Laravel during implicit route model binding
     * It ensures we use the correct tenant connection
     */
    public function resolveRouteBinding($value, $field = null)
    {
        $field = $field ?? $this->getRouteKeyName();

        $connection = $this->resolveTenantConnectionName() ?? 'mysql';

        // For models with soft deletes, exclude deleted records
        $query = $this->on($connection)->where($field, $value);
        
        if (in_array('Illuminate\Database\Eloquent\SoftDeletes', class_uses($this))) {
            $query = $query->where('deleted_at', null);
        }
        
        return $query->firstOrFail();
    }

    /**
     * Get the active database connection name for this request
     * Use this helper in controllers when you need explicit control over connection
     */
    public static function getActiveDatabaseConnection(): string
    {
        $instance = new static();
        return $instance->resolveTenantConnectionName() ?? 'mysql';
    }

    /**
     * Resolve tenant connection name for the current request, if any.
     */
    protected function resolveTenantConnectionName(): ?string
    {
        // If tenant already in container, use it
        if (app()->has(Tenant::class)) {
            return 'tenant';
        }

        // Check if tenant connection has been configured (by middleware)
        $tenantDb = config('database.connections.tenant.database');
        $centralDb = config('database.connections.mysql.database');
        
        if ($tenantDb && $tenantDb !== $centralDb) {
            return 'tenant';
        }

        return null;
    }
}



