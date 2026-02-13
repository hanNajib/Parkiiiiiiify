<?php

namespace App\Models;

use App\Traits\HasSearchAndFilter;
use App\Traits\Loggable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Transaksi extends Model
{
    use HasSearchAndFilter, Loggable;

    protected $table = 'transaksi';
    protected $guarded = []; 
    protected $searchable = [
        'kendaraan.nomor_plat',
        'tarif.nama',
        'petugas.name',
        'areaParkir.nama',
    ];

    protected $filterable = [
        'status' => 'status',
        'area_parkir_id' => 'area_parkir_id',
        'petugas_id' => 'petugas_id',
    ];

    public function scopeSelf($query) {
        return $query->where('petugas_id', Auth::user()->id);
    }


    public function kendaraan()
    {
        return $this->belongsTo(Kendaraan::class);
    }

    public function tarif()
    {
        return $this->belongsTo(Tarif::class);
    }

    public function petugas()
    {
        return $this->belongsTo(User::class, 'petugas_id');
    }

    public function areaParkir()
    {
        return $this->belongsTo(AreaParkir::class);
    }
}
