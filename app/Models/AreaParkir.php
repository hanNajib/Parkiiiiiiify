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
    protected $appends = ['tarif_lengkap'];

    public function tarif() {
        return $this->hasMany(Tarif::class, 'area_parkir_id');
    }

    public function getTarifLengkapAttribute() {
        $jenisKendaraan = ['motor', 'mobil', 'lainnya'];
        $ruleTypes = ['flat', 'per_jam'];

        foreach ($jenisKendaraan as $jenis) {
            foreach ($ruleTypes as $rule) {
                $exists = $this->tarif()->where('jenis_kendaraan', $jenis)->where('rule_type', $rule)->exists();
                if (!$exists) {
                    return false;
                }
            }
        }

        return true;
    }
}
