<?php

namespace Database\Seeders;

use App\Models\Kendaraan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KendaraanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kendaraanList = [
            [
                'plat_nomor' => 'B 1234 ABC',
                'jenis_kendaraan' => 'motor',
                'warna' => 'Hitam',
                'user_id' => 1,
            ],
            [
                'plat_nomor' => 'B 5678 DEF',
                'jenis_kendaraan' => 'motor',
                'warna' => 'Merah',
                'user_id' => 2,
            ],
            [
                'plat_nomor' => 'D 9012 GHI',
                'jenis_kendaraan' => 'motor',
                'warna' => 'Putih',
                'user_id' => 3,
            ],
            [
                'plat_nomor' => 'B 3456 JKL',
                'jenis_kendaraan' => 'motor',
                'warna' => 'Biru',
                'user_id' => 4,
            ],
            [
                'plat_nomor' => 'F 7890 MNO',
                'jenis_kendaraan' => 'motor',
                'warna' => 'Abu-abu',
                'user_id' => 5,
            ],
            [
                'plat_nomor' => 'B 2468 PQR',
                'jenis_kendaraan' => 'motor',
                'warna' => 'Hijau',
                'user_id' => 1,
            ],
            [
                'plat_nomor' => 'D 1357 STU',
                'jenis_kendaraan' => 'motor',
                'warna' => 'Kuning',
                'user_id' => 2,
            ],
            [
                'plat_nomor' => 'B 9753 VWX',
                'jenis_kendaraan' => 'motor',
                'warna' => 'Hitam',
                'user_id' => 3,
            ],
            // Mobil
            [
                'plat_nomor' => 'B 1111 AAA',
                'jenis_kendaraan' => 'mobil',
                'warna' => 'Silver',
                'user_id' => 4,
            ],
            [
                'plat_nomor' => 'B 2222 BBB',
                'jenis_kendaraan' => 'mobil',
                'warna' => 'Putih',
                'user_id' => 5,
            ],
            [
                'plat_nomor' => 'D 3333 CCC',
                'jenis_kendaraan' => 'mobil',
                'warna' => 'Hitam',
                'user_id' => 1,
            ],
            [
                'plat_nomor' => 'B 4444 DDD',
                'jenis_kendaraan' => 'mobil',
                'warna' => 'Merah',
                'user_id' => 2,
            ],
            [
                'plat_nomor' => 'F 5555 EEE',
                'jenis_kendaraan' => 'mobil',
                'warna' => 'Biru',
                'user_id' => 3,
            ],
            [
                'plat_nomor' => 'B 6666 FFF',
                'jenis_kendaraan' => 'mobil',
                'warna' => 'Abu-abu',
                'user_id' => 4,
            ],
            [
                'plat_nomor' => 'D 7777 GGG',
                'jenis_kendaraan' => 'mobil',
                'warna' => 'Coklat',
                'user_id' => 5,
            ],
            [
                'plat_nomor' => 'B 8888 HHH',
                'jenis_kendaraan' => 'mobil',
                'warna' => 'Putih',
                'user_id' => 1,
            ],
            // Lainnya
            [
                'plat_nomor' => 'B 9999 III',
                'jenis_kendaraan' => 'lainnya',
                'warna' => 'Kuning',
                'user_id' => 2,
            ],
            [
                'plat_nomor' => 'D 0000 JJJ',
                'jenis_kendaraan' => 'lainnya',
                'warna' => 'Hijau',
                'user_id' => 3,
            ],
            [
                'plat_nomor' => 'B 1212 KKK',
                'jenis_kendaraan' => 'lainnya',
                'warna' => 'Oranye',
                'user_id' => 4,
            ],
            [
                'plat_nomor' => 'F 3434 LLL',
                'jenis_kendaraan' => 'lainnya',
                'warna' => 'Ungu',
                'user_id' => 5,
            ],
        ];

        foreach ($kendaraanList as $kendaraan) {
            Kendaraan::create($kendaraan);
        }
    }
}
