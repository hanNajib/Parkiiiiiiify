<?php

namespace App\Models;

use App\Traits\HasSearchAndFilter;
use App\Traits\Loggable;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Transaksi extends Model
{
    use HasSearchAndFilter, Loggable;

    protected $table = 'transaksi';
    protected $guarded = []; 
    protected $appends = ['kode_transaksi'];
    protected $searchable = [
        'kendaraan.plat_nomor',
        'petugas.name',
        'areaParkir.nama',
    ];

    protected $filterable = [
        'status' => 'status',
        'area_parkir_id' => 'area_parkir_id',
        'petugas_id' => 'petugas_id',
        'tanggal' => 'waktu_masuk',
    ];

    public function scopeSelf($query) {
        return $query->where('petugas_id', Auth::user()->id);
    }

    public function scopeDateRange($query) {
        $dateFrom = request()->query('date_from', Carbon::now()->toDateString());
        $dateTo = request()->query('date_to', Carbon::now()->toDateString());

        if ($dateFrom) {
            $query->whereDate('waktu_masuk', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->whereDate('waktu_masuk', '<=', $dateTo);
        }

        return $query;
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

    public function getKodeTransaksiAttribute() {
        return 'TRX' . str_pad($this->id, 6, '0', STR_PAD_LEFT);
    }
}
