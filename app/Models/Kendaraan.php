<?php

namespace App\Models;

use App\Traits\HasSearchAndFilter;
use App\Traits\Loggable;
use Illuminate\Database\Eloquent\Model;

class Kendaraan extends Model
{
    use HasSearchAndFilter, Loggable;
    protected $table = 'kendaraan';
    protected $guarded = [];
    protected $searchable = [
        'plat_nomor',
        'jenis_kendaraan',
        'pemilik',
        'warna'
    ];

    protected $filterable = [
        'jenis_kendaraan' => 'jenis_kendaraan',
    ];

    public function unitKendaraan(string $jenis): int
    {
        return match ($jenis) {
            'mobil' => 4,
            'motor' => 1,
            default => null,
        };
    }
    
}
