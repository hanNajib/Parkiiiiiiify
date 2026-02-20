<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class PetugasArea extends Pivot
{
    protected $table = 'petugas_area';
    protected $guarded = [];
    protected $connection = 'tenant';
    public $incrementing = true;
}
