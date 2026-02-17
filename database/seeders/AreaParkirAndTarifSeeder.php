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
                // Regular rates
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'flat', 'harga_awal' => 5000, 'maksimal_per_hari' => 50000],
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'interval', 'interval_menit' => 60, 'harga_awal' => 3000, 'harga_lanjutan' => 2500, 'maksimal_per_hari' => 50000],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'flat', 'harga_awal' => 10000, 'maksimal_per_hari' => 100000],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'interval', 'interval_menit' => 60, 'harga_awal' => 5000, 'harga_lanjutan' => 4500, 'maksimal_per_hari' => 100000],
                ['jenis_kendaraan' => 'lainnya', 'rule_type' => 'flat', 'harga_awal' => 15000, 'maksimal_per_hari' => 150000],
                ['jenis_kendaraan' => 'lainnya', 'rule_type' => 'interval', 'interval_menit' => 60, 'harga_awal' => 8000, 'harga_lanjutan' => 7000, 'maksimal_per_hari' => 150000],
                // Peak hours (morning rush 06:00-09:00)
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'flat', 'harga_awal' => 7000, 'maksimal_per_hari' => 50000, 'berlaku_dari' => '06:00:00', 'berlaku_sampai' => '09:00:00'],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'flat', 'harga_awal' => 15000, 'maksimal_per_hari' => 100000, 'berlaku_dari' => '06:00:00', 'berlaku_sampai' => '09:00:00'],
                // Night rate (21:00-06:00)
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'flat', 'harga_awal' => 3000, 'maksimal_per_hari' => 50000, 'berlaku_dari' => '21:00:00', 'berlaku_sampai' => '06:00:00'],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'flat', 'harga_awal' => 6000, 'maksimal_per_hari' => 100000, 'berlaku_dari' => '21:00:00', 'berlaku_sampai' => '06:00:00'],
            ],
            // Bandara Soekarno-Hatta - Airport pricing
            [
                // Regular rates
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'flat', 'harga_awal' => 8000, 'maksimal_per_hari' => 80000],
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'interval', 'interval_menit' => 60, 'harga_awal' => 5000, 'harga_lanjutan' => 4500, 'maksimal_per_hari' => 80000],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'flat', 'harga_awal' => 15000, 'maksimal_per_hari' => 150000],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'interval', 'interval_menit' => 60, 'harga_awal' => 8000, 'harga_lanjutan' => 7500, 'maksimal_per_hari' => 150000],
                ['jenis_kendaraan' => 'lainnya', 'rule_type' => 'flat', 'harga_awal' => 20000, 'maksimal_per_hari' => 200000],
                ['jenis_kendaraan' => 'lainnya', 'rule_type' => 'interval', 'interval_menit' => 60, 'harga_awal' => 10000, 'harga_lanjutan' => 9000, 'maksimal_per_hari' => 200000],
                // Peak hours (morning 06:00-12:00)
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'flat', 'harga_awal' => 10000, 'maksimal_per_hari' => 80000, 'berlaku_dari' => '06:00:00', 'berlaku_sampai' => '12:00:00'],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'flat', 'harga_awal' => 20000, 'maksimal_per_hari' => 150000, 'berlaku_dari' => '06:00:00', 'berlaku_sampai' => '12:00:00'],
                // Evening peak (17:00-20:00)
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'flat', 'harga_awal' => 9000, 'maksimal_per_hari' => 80000, 'berlaku_dari' => '17:00:00', 'berlaku_sampai' => '20:00:00'],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'flat', 'harga_awal' => 18000, 'maksimal_per_hari' => 150000, 'berlaku_dari' => '17:00:00', 'berlaku_sampai' => '20:00:00'],
            ],
            // Universitas Indonesia - Student pricing
            [
                // Regular rates
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'flat', 'harga_awal' => 2000, 'maksimal_per_hari' => 20000],
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'interval', 'interval_menit' => 60, 'harga_awal' => 1000, 'harga_lanjutan' => 800, 'maksimal_per_hari' => 20000],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'flat', 'harga_awal' => 5000, 'maksimal_per_hari' => 50000],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'interval', 'interval_menit' => 60, 'harga_awal' => 2500, 'harga_lanjutan' => 2000, 'maksimal_per_hari' => 50000],
                ['jenis_kendaraan' => 'lainnya', 'rule_type' => 'flat', 'harga_awal' => 7000, 'maksimal_per_hari' => 70000],
                ['jenis_kendaraan' => 'lainnya', 'rule_type' => 'interval', 'interval_menit' => 60, 'harga_awal' => 3500, 'harga_lanjutan' => 3000, 'maksimal_per_hari' => 70000],
                // Class hours (08:00-16:00) - High demand
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'flat', 'harga_awal' => 3000, 'maksimal_per_hari' => 20000, 'berlaku_dari' => '08:00:00', 'berlaku_sampai' => '16:00:00'],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'flat', 'harga_awal' => 7000, 'maksimal_per_hari' => 50000, 'berlaku_dari' => '08:00:00', 'berlaku_sampai' => '16:00:00'],
                // Off-peak discount (19:00-08:00)
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'flat', 'harga_awal' => 1000, 'maksimal_per_hari' => 20000, 'berlaku_dari' => '19:00:00', 'berlaku_sampai' => '08:00:00'],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'flat', 'harga_awal' => 3000, 'maksimal_per_hari' => 50000, 'berlaku_dari' => '19:00:00', 'berlaku_sampai' => '08:00:00'],
            ],
            // Pantai Kuta - Tourist area pricing
            [
                // Regular rates
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'flat', 'harga_awal' => 5000, 'maksimal_per_hari' => 50000],
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'interval', 'interval_menit' => 60, 'harga_awal' => 2500, 'harga_lanjutan' => 2000, 'maksimal_per_hari' => 50000],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'flat', 'harga_awal' => 10000, 'maksimal_per_hari' => 100000],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'interval', 'interval_menit' => 60, 'harga_awal' => 5000, 'harga_lanjutan' => 4000, 'maksimal_per_hari' => 100000],
                ['jenis_kendaraan' => 'lainnya', 'rule_type' => 'flat', 'harga_awal' => 15000, 'maksimal_per_hari' => 150000],
                ['jenis_kendaraan' => 'lainnya', 'rule_type' => 'interval', 'interval_menit' => 60, 'harga_awal' => 7500, 'harga_lanjutan' => 6500, 'maksimal_per_hari' => 150000],
                // Weekend & holiday peak (10:00-22:00)
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'flat', 'harga_awal' => 7000, 'maksimal_per_hari' => 50000, 'berlaku_dari' => '10:00:00', 'berlaku_sampai' => '22:00:00'],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'flat', 'harga_awal' => 14000, 'maksimal_per_hari' => 100000, 'berlaku_dari' => '10:00:00', 'berlaku_sampai' => '22:00:00'],
                // Sunset time premium (17:00-19:00)
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'flat', 'harga_awal' => 18000, 'maksimal_per_hari' => 100000, 'berlaku_dari' => '17:00:00', 'berlaku_sampai' => '19:00:00'],
            ],
            // Alun-Alun Bandung - Regular pricing
            [
                // Regular rates
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'flat', 'harga_awal' => 3000, 'maksimal_per_hari' => 30000],
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'interval', 'interval_menit' => 60, 'harga_awal' => 2000, 'harga_lanjutan' => 1500, 'maksimal_per_hari' => 30000],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'flat', 'harga_awal' => 6000, 'maksimal_per_hari' => 60000],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'interval', 'interval_menit' => 60, 'harga_awal' => 4000, 'harga_lanjutan' => 3500, 'maksimal_per_hari' => 60000],
                ['jenis_kendaraan' => 'lainnya', 'rule_type' => 'flat', 'harga_awal' => 10000, 'maksimal_per_hari' => 100000],
                ['jenis_kendaraan' => 'lainnya', 'rule_type' => 'interval', 'interval_menit' => 60, 'harga_awal' => 6000, 'harga_lanjutan' => 5000, 'maksimal_per_hari' => 100000],
                // Morning rush (07:00-09:00)
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'flat', 'harga_awal' => 4000, 'maksimal_per_hari' => 30000, 'berlaku_dari' => '07:00:00', 'berlaku_sampai' => '09:00:00'],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'flat', 'harga_awal' => 8000, 'maksimal_per_hari' => 60000, 'berlaku_dari' => '07:00:00', 'berlaku_sampai' => '09:00:00'],
                // Evening crowd (17:00-21:00)
                ['jenis_kendaraan' => 'motor', 'rule_type' => 'flat', 'harga_awal' => 4000, 'maksimal_per_hari' => 30000, 'berlaku_dari' => '17:00:00', 'berlaku_sampai' => '21:00:00'],
                ['jenis_kendaraan' => 'mobil', 'rule_type' => 'flat', 'harga_awal' => 8000, 'maksimal_per_hari' => 60000, 'berlaku_dari' => '17:00:00', 'berlaku_sampai' => '21:00:00'],
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
                    'interval_menit' => $tarif['interval_menit'] ?? null,
                    'harga_awal' => $tarif['harga_awal'] ?? null,
                    'harga_lanjutan' => $tarif['harga_lanjutan'] ?? null,
                    'maksimal_per_hari' => $tarif['maksimal_per_hari'] ?? null,
                    'berlaku_dari' => $tarif['berlaku_dari'] ?? null,
                    'berlaku_sampai' => $tarif['berlaku_sampai'] ?? null,
                    'is_active' => true,
                ]);
            }
        }
    }
}
