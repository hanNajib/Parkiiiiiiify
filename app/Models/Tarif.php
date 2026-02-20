<?php

namespace App\Models;

use App\Traits\HasSearchAndFilter;
use App\Traits\Loggable;
use App\Traits\TenantAware;
use Illuminate\Database\Eloquent\Model;

class Tarif extends Model
{
    use HasSearchAndFilter, Loggable, TenantAware;
    
    protected $table = 'tarif';
    protected $guarded = [];

    protected $casts = [
        'progressive_rules' => 'array',
        'berlaku_dari' => 'date',
        'berlaku_sampai' => 'date',
    ];
}
