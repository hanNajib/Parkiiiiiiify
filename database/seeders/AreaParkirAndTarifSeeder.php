<?php

namespace Database\Seeders;

use App\Models\AreaParkir;
use App\Models\Tarif;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AreaParkirAndTarifSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $areaParkir = [
            [
                'nama' => 'Parkir Mall Grand Indonesia',
                'lokasi' => 'Jl. MH Thamrin No.1, Jakarta Pusat',
                'kapasitas' => 500,
                'is_active' => true,
            ],
            [
                'nama' => 'Parkir Bandara Soekarno-Hatta',
                'lokasi' => 'Jl. Bandara Internasional, Tangerang',
                'kapasitas' => 1000,
                'is_active' => true,
            ],
            [
                'nama' => 'Parkir Universitas Indonesia',
                'lokasi' => 'Kampus UI Depok, Jawa Barat',
                'kapasitas' => 300,
                'is_active' => true,
            ],
            [
                'nama' => 'Parkir Pantai Kuta',
                'lokasi' => 'Jl. Pantai Kuta, Badung, Bali',
                'kapasitas' => 200,
                'is_active' => true,
            ],
            [
                'nama' => 'Parkir Alun-Alun Bandung',
                'lokasi' => 'Jl. Asia Afrika, Bandung',
                'kapasitas' => 150,
                'is_active' => true,
            ],
        ];

        $tarifData = [
            // Mall Grand Indonesia - Premium pricing
            [
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'flat', 'price' => 5000],
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'per_jam', 'price' => 3000],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'flat', 'price' => 10000],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'per_jam', 'price' => 5000],
                ['jenis_kendaraan' => 'lainnya', 'rule_type' => 'flat', 'price' => 15000],
                ['jenis_kendaraan' => 'lainnya', 'rule_type' => 'per_jam', 'price' => 8000],
            ],
            // Bandara Soekarno-Hatta - Airport pricing
            [
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'flat', 'price' => 8000],
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'per_jam', 'price' => 5000],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'flat', 'price' => 15000],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'per_jam', 'price' => 8000],
                ['jenis_kendaraan' => 'lainnya', 'rule_type' => 'flat', 'price' => 20000],
                ['jenis_kendaraan' => 'lainnya', 'rule_type' => 'per_jam', 'price' => 10000],
            ],
            // Universitas Indonesia - Student pricing
            [
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'flat', 'price' => 2000],
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'per_jam', 'price' => 1000],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'flat', 'price' => 5000],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'per_jam', 'price' => 2500],
                ['jenis_kendaraan' => 'lainnya', 'rule_type' => 'flat', 'price' => 7000],
                ['jenis_kendaraan' => 'lainnya', 'rule_type' => 'per_jam', 'price' => 3500],
            ],
            // Pantai Kuta - Tourist area pricing
            [
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'flat', 'price' => 5000],
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'per_jam', 'price' => 2500],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'flat', 'price' => 10000],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'per_jam', 'price' => 5000],
                ['jenis_kendaraan' => 'lainnya', 'rule_type' => 'flat', 'price' => 15000],
                ['jenis_kendaraan' => 'lainnya', 'rule_type' => 'per_jam', 'price' => 7500],
            ],
            // Alun-Alun Bandung - Regular pricing
            [
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'flat', 'price' => 3000],
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'per_jam', 'price' => 2000],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'flat', 'price' => 6000],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'per_jam', 'price' => 4000],
                ['jenis_kendaraan' => 'lainnya', 'rule_type' => 'flat', 'price' => 10000],
                ['jenis_kendaraan' => 'lainnya', 'rule_type' => 'per_jam', 'price' => 6000],
            ],
        ];

        foreach ($areaParkir as $index => $area) {
            $areaParkirModel = AreaParkir::create($area);
            
            // Create tarif untuk setiap area parkir
            foreach ($tarifData[$index] as $tarif) {
                Tarif::create([
                    'area_parkir_id' => $areaParkirModel->id,
                    'jenis_kendaraan' => $tarif['jenis_kendaraan'],
                    'rule_type' => $tarif['rule_type'],
                    'price' => $tarif['price'],
                    'is_active' => true,
                ]);
            }
        }
    }
}
