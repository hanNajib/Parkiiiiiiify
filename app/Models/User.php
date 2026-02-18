<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Traits\HasSearchAndFilter;
use App\Traits\Loggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasSearchAndFilter, SoftDeletes, Loggable;

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

    public function scopeRole($query) {
        $role = Auth::user()->role;
        switch ($role) {
            case 'superadmin':
                return $query;
            case 'admin':
                return $query->where('role', '!=', 'superadmin');
            case 'petugas':
                return $query->whereIn('role', ['owner', 'user', 'admin']);
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
        if ($this->role === 'superadmin' || $this->role === 'admin') {
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
