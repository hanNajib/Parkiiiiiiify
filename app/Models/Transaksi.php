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

    public function scopeSelf($query)
    {
        return $query->where('petugas_id', Auth::user()->id);
    }

    public function scopeDateRange($query)
    {
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

    public function getKodeTransaksiAttribute()
    {
        return 'TRX' . str_pad($this->id, 6, '0', STR_PAD_LEFT);
    }

    public function selesaikan(): void
    {
        if ($this->status === 'completed') {
            return;
        }

        $this->waktu_keluar = now();

        $durasiMenit = $this->waktu_masuk->diffInMinutes($this->waktu_keluar);
        $durasiMenit = max($durasiMenit, 1); // minimal 1 menit
        $this->durasi = $durasiMenit;

        $tarif = $this->tarif;
        $total = 0;

        switch ($tarif->rule_type) {

            /*
        |--------------------------------------------------------------------------
        | FLAT
        |--------------------------------------------------------------------------
        */
            case 'flat':
                $total = $tarif->harga_awal ?? 0;
                break;


            /*
        |--------------------------------------------------------------------------
        | INTERVAL (BLOCK BASED)
        |--------------------------------------------------------------------------
        */
            case 'interval':

                $interval = $tarif->interval_menit ?? 60;
                $unit = ceil($durasiMenit / $interval);

                if ($tarif->harga_lanjutan) {

                    if ($unit <= 1) {
                        $total = $tarif->harga_awal ?? 0;
                    } else {
                        $total = ($tarif->harga_awal ?? 0)
                            + (($unit - 1) * $tarif->harga_lanjutan);
                    }
                } else {
                    $total = $unit * ($tarif->harga_awal ?? 0);
                }

                break;


            /*
        |--------------------------------------------------------------------------
        | PROGRESSIVE (BERBASIS JAM)
        |--------------------------------------------------------------------------
        */
            case 'progressive':

                $rules = collect($tarif->progressive_rules ?? []);
                $durasiJam = ceil($durasiMenit / 60);

                if ($rules->isEmpty()) {
                    $total = $tarif->harga_awal ?? 0;
                    break;
                }

                $rules = $rules->sortBy('jam_ke');

                $matched = $rules
                    ->where('jam_ke', '<=', $durasiJam)
                    ->last();

                if ($matched) {

                    $total = $matched['harga'];

                    $maxJam = $rules->max('jam_ke');

                    if ($durasiJam > $maxJam && $tarif->harga_lanjutan) {
                        $extraJam = $durasiJam - $maxJam;
                        $total += $extraJam * $tarif->harga_lanjutan;
                    }
                } else {
                    $total = $tarif->harga_awal ?? 0;
                }

                break;
        }

        /*
    |--------------------------------------------------------------------------
    | DAILY CAP
    |--------------------------------------------------------------------------
    */
        if ($tarif->maksimal_per_hari && $total > $tarif->maksimal_per_hari) {
            $total = $tarif->maksimal_per_hari;
        }

        $this->total_biaya = max($total, 0);
        $this->status = 'completed';

        $this->save();
    }

    protected $casts = [
        'waktu_masuk' => 'datetime',
        'waktu_keluar' => 'datetime'
    ];
}
