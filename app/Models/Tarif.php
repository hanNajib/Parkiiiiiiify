<?php

namespace App\Models;

use App\Traits\HasSearchAndFilter;
use Illuminate\Database\Eloquent\Model;

class Tarif extends Model
{
    use HasSearchAndFilter;
    
    protected $table = 'tarif';
    protected $guarded = [];
}
