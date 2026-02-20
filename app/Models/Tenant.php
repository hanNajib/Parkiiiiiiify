<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tenant extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'domain',
        'name',
        'institution_name',
        'institution_address',
        'status',
        'database_name',
        'host',
        'port',
        'username',
        'password',
        'is_active',
        'owner_user_id',
        'requested_by_user_id',
        'approved_by_user_id',
        'rejected_by_user_id',
        'requested_at',
        'approved_at',
        'rejected_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'port' => 'integer',
        'password' => 'encrypted', 
        'requested_at' => 'datetime',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    /**
     * Get all users that belong to this tenant
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'tenant_user')
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }

    /**
     * Owner user of this tenant request
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }

    /**
     * Get database config for this tenant
     */
    public function getDatabaseConfig(): array
    {
        $tenantPassword = $this->password;
        if ($tenantPassword === null || $tenantPassword === '') {
            $tenantPassword = config('database.connections.mysql.password', env('DB_PASSWORD', ''));
        }

        return [
            'driver' => 'mysql',
            'host' => $this->host,
            'port' => $this->port,
            'database' => $this->database_name,
            'username' => $this->username,
            'password' => $tenantPassword,
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'prefix_indexes' => true,
            'strict' => true,
            'engine' => 'InnoDB',
        ];
    }

    /**
     * Resolve tenant by subdomain
     */
    public static function resolveByDomain(string $domain): ?self
    {
        // Extract subdomain: tenant1.parkify.test -> tenant1
        $parts = explode('.', $domain);
        $slug = $parts[0];

        return self::where('slug', $slug)
            ->where('status', 'approved')
            ->where('is_active', true)
            ->first();
    }
}
