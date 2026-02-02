<?php

namespace App\Models;

use App\Traits\HasSearchAndFilter;
use Illuminate\Database\Eloquent\Model;

class Kendaraan extends Model
{
    use HasSearchAndFilter;
    protected $table = 'kendaraan';
    protected $guarded = [];
    protected $searchable = [
        
    ];
    
}
