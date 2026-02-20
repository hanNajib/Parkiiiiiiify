<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Traits\HasSearchAndFilter;
use App\Traits\Loggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasSearchAndFilter, SoftDeletes, Loggable;

    protected $connection = 'mysql';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role'
    ];

    protected $searchable = [
        'name',
        'email',
        'role'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get all tenants this user belongs to
     */
    public function tenants(): BelongsToMany
    {
        return $this->belongsToMany(Tenant::class, 'tenant_user')
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }

    /**
     * Get current active tenant for this user
     */
    public function getCurrentTenant(): ?Tenant
    {
        if (!app()->has(Tenant::class)) {
            return null;
        }

        $tenant = app(Tenant::class);

        // Verify user has access to this tenant
        if ($this->tenants()->where('tenant_id', $tenant->id)->exists()) {
            return $tenant;
        }

        return null;
    }

    /**
     * Get user's role in a specific tenant
     */
    public function getRoleInTenant(Tenant $tenant): ?string
    {
        return $this->tenants()
            ->where('tenant_id', $tenant->id)
            ->first()
            ?->pivot
            ?->role;
    }

    /**
     * Check if user is admin in a tenant
     */
    public function isAdminInTenant(Tenant $tenant): bool
    {
        return $this->getRoleInTenant($tenant) === 'admin';
    }

    public function scopeRole($query) {
        $role = Auth::user()->role;
        switch ($role) {
            case 'superadmin':
                return $query;
            case 'owner':
                return $query->whereIn('role', ['owner', 'admin', 'petugas']);
            case 'admin':
                return $query->whereIn('role', ['petugas']);
            case 'petugas':
                return $query->where('id', Auth::id());
            default:
                return $query->where('id', Auth::id());
        }
    }

    public function assignedAreas()
    {
        return $this->belongsToMany(AreaParkir::class, 'petugas_area', 'user_id', 'area_parkir_id')->withPivot('is_active')->withTimestamps();
    }

    public function canAccessArea(AreaParkir $areaParkir)
    {
        if ($this->role === 'superadmin') {
            return true;
        }

        if ($this->role === 'owner') {
            return true;
        }

        if ($this->role === 'admin') {
            return true;
        }

        if ($this->role === 'petugas') {
            return $this->assignedAreas()->where('area_parkir_id', $areaParkir->id)->wherePivot('is_active', true)->exists();
        }

        return false;
    }

    public function getAccessibleAreas()
    {
        if (in_array($this->role, ['superadmin', 'owner', 'admin'], true)) {
            return AreaParkir::all();
        }

        if ($this->role === 'petugas') {
            return $this->assignedAreas()->wherePivot('is_active', true)->get();
        }

        return collect();
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
