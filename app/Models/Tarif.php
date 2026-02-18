<?php

namespace App\Models;

use App\Traits\HasSearchAndFilter;
use App\Traits\Loggable;
use Illuminate\Database\Eloquent\Model;

class Tarif extends Model
{
    use HasSearchAndFilter, Loggable;
    
    protected $table = 'tarif';
    protected $guarded = [];

    protected $casts = [
        'progressive_rules' => 'array',
        'berlaku_dari' => 'date',
        'berlaku_sampai' => 'date',
    ];
}
