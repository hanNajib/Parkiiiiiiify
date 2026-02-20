<?php

namespace App\Models;

use App\Traits\HasSearchAndFilter;
use App\Traits\TenantAware;
use Illuminate\Database\Eloquent\Model;

class LogAktivitas extends Model
{
    use HasSearchAndFilter, TenantAware;

    protected $table = 'log_aktivitas';
    protected $guarded = [];

    protected $searchable = [
        'role',
        'action',
        'description',
        'ip_address',
    ];

    protected $filterable = [
        'user_id' => 'user_id',
        'role' => 'role',
        'action' => 'action',
        'created_at' => 'created_at',
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function target() {
        return $this->morphTo();
    }
}
