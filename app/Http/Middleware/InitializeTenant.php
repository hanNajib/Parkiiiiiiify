<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use App\Services\TenantDatabaseManager;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InitializeTenant
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();

        // Resolve tenant from subdomain
        $tenant = Tenant::resolveByDomain($host);

        if (!$tenant) {
            // If on main domain (app.parkify.test), allow it for admin/auth routes
            if ($this->isMainDomain($host)) {
                app()->instance('is_main_domain', true);
                return $next($request);
            }

            return abort(404, 'Tenant not found');
        }

        // Store tenant in container
        app()->instance(Tenant::class, $tenant);
        app()->instance('is_main_domain', false);

        // Configure database connection for this tenant
        TenantDatabaseManager::configure($tenant);

        return $next($request);
    }

    /**
     * Check if this is the main domain (not a tenant subdomain)
     */
    private function isMainDomain(string $host): bool
    {
        $mainDomains = [
            'parkify.test',
            'parkify.test:8000',
            'localhost',
            'localhost:8000',
        ];

        return in_array($host, $mainDomains);
    }
}
