<?php

namespace App\Models;

use App\Traits\HasSearchAndFilter;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AreaParkir extends Model
{
    use HasSearchAndFilter, SoftDeletes;

    protected $table = 'area_parkir';
    protected $guarded = [];

    public function tarif() {
        return $this->hasMany(Tarif::class, 'area_parkir_id');
    }
}
