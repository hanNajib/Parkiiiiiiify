<?php

namespace App\Models;

use App\Traits\HasSearchAndFilter;
use App\Traits\Loggable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AreaParkir extends Model
{
    use HasSearchAndFilter, SoftDeletes, Loggable;

    protected $table = 'area_parkir';
    protected $guarded = [];
    protected $appends = ['tarif_lengkap', 'terisi'];

    public function tarif()
    {
        return $this->hasMany(Tarif::class, 'area_parkir_id');
    }

    public function transaksi()
    {
        return $this->hasMany(Transaksi::class, 'area_parkir_id');
    }

    public function getTarifLengkapAttribute()
    {
        $jenisKendaraan = ['motor', 'mobil', 'lainnya'];

        foreach ($jenisKendaraan as $jenis) {

            $exists = $this->tarif()
                ->where('jenis_kendaraan', $jenis)
                ->where('rule_type', $this->default_rule_type)
                ->where('is_active', true)
                ->exists();

            if (!$exists) {
                return false;
            }
        }

        return true;
    }

    public function getTerisiAttribute()
    {
        return $this->transaksi()->where('status', 'ongoing')->count();
    }
}
