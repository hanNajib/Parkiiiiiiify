<?php

namespace App\Models;

use App\Traits\HasSearchAndFilter;
use App\Traits\Loggable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kendaraan extends Model
{
    use HasSearchAndFilter, Loggable, SoftDeletes;
    
    protected $connection = 'mysql';
    protected $table = 'kendaraan';
    protected $guarded = [];
    
    protected $searchable = [
        'plat_nomor',
        'jenis_kendaraan',
        'warna'
    ];

    protected $filterable = [
        'jenis_kendaraan' => 'jenis_kendaraan',
    ];

    /**
     * Get the user (owner) of the vehicle
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function unitKendaraan(string $jenis): int
    {
        return match ($jenis) {
            'mobil' => 4,
            'motor' => 1,
            default => null,
        };
    }
}
