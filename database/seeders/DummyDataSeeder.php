<?php

namespace Database\Seeders;

use App\Models\AreaParkir;
use App\Models\Kendaraan;
use App\Models\Tarif;
use App\Models\Transaksi;
use App\Models\User;
use Carbon\Carbon;
use Faker\Factory as FakerFactory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DummyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = FakerFactory::create('id_ID');

        $this->seedUsers($faker);
        $this->seedAreasAndTarifs($faker);
        $this->seedVehicles($faker, 200);
        $this->seedTransactions($faker, 1500);
    }

    private function seedUsers($faker): void
    {
        if (User::where('role', 'petugas')->count() < 5) {
            for ($i = 0; $i < 5; $i++) {
                User::factory()->create([
                    'name' => $faker->name(),
                    'email' => $faker->unique()->safeEmail(),
                    'password' => Hash::make('password'),
                    'role' => 'petugas',
                ]);
            }
        }

        if (User::where('role', 'admin')->count() < 1) {
            User::factory()->create([
                'name' => 'Admin Demo',
                'email' => 'admin.demo@example.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]);
        }

        if (User::where('role', 'owner')->count() < 1) {
            User::factory()->create([
                'name' => 'Owner Demo',
                'email' => 'owner.demo@example.com',
                'password' => Hash::make('password'),
                'role' => 'owner',
            ]);
        }

        if (User::where('role', 'user')->count() < 50) {
            $target = 50 - User::where('role', 'user')->count();
            for ($i = 0; $i < $target; $i++) {
                User::factory()->create([
                    'name' => $faker->name(),
                    'email' => $faker->unique()->safeEmail(),
                    'password' => Hash::make('password'),
                    'role' => 'user',
                ]);
            }
        }
    }

    private function seedAreasAndTarifs($faker): void
    {
        if (AreaParkir::count() < 3) {
            $areasData = [
                ['nama' => 'Area Utama', 'lokasi' => 'Gedung A', 'kapasitas' => 120, 'default_rule_type' => 'flat'],
                ['nama' => 'Area VIP', 'lokasi' => 'Gedung B', 'kapasitas' => 60, 'default_rule_type' => 'interval'],
                ['nama' => 'Area Motor', 'lokasi' => 'Basement', 'kapasitas' => 180, 'default_rule_type' => 'progressive'],
            ];

            foreach ($areasData as $area) {
                AreaParkir::create($area + ['is_active' => true]);
            }
        }

        $areas = AreaParkir::all();
        $jenisList = ['motor', 'mobil', 'lainnya'];

        foreach ($areas as $area) {
            $ruleType = $area->default_rule_type === 'choose' ? 'flat' : $area->default_rule_type;

            foreach ($jenisList as $jenis) {
                $exists = Tarif::where('area_parkir_id', $area->id)
                    ->where('jenis_kendaraan', $jenis)
                    ->where('rule_type', $ruleType)
                    ->exists();

                if ($exists) {
                    continue;
                }

                $payload = [
                    'area_parkir_id' => $area->id,
                    'rule_type' => $ruleType,
                    'jenis_kendaraan' => $jenis,
                    'is_active' => true,
                ];

                if ($ruleType === 'flat') {
                    $payload['harga_awal'] = $faker->numberBetween(3000, 12000);
                } elseif ($ruleType === 'interval') {
                    $payload['interval_menit'] = 60;
                    $payload['harga_awal'] = $faker->numberBetween(4000, 10000);
                    $payload['harga_lanjutan'] = $faker->numberBetween(2000, 7000);
                } else {
                    $payload['harga_awal'] = $faker->numberBetween(4000, 8000);
                    $payload['progressive_rules'] = [
                        ['jam_ke' => 1, 'harga' => $faker->numberBetween(4000, 7000)],
                        ['jam_ke' => 2, 'harga' => $faker->numberBetween(3000, 6000)],
                        ['jam_ke' => 3, 'harga' => $faker->numberBetween(2000, 5000)],
                    ];
                }

                Tarif::create($payload);
            }
        }
    }

    private function seedVehicles($faker, int $targetCount): void
    {
        $currentCount = Kendaraan::count();
        if ($currentCount >= $targetCount) {
            return;
        }

        $userIds = User::where('role', 'user')->pluck('id')->all();
        if (empty($userIds)) {
            return;
        }

        $existingPlates = array_flip(Kendaraan::pluck('plat_nomor')->all());
        $toCreate = $targetCount - $currentCount;
        $jenisList = ['motor', 'mobil', 'lainnya'];

        for ($i = 0; $i < $toCreate; $i++) {
            $plate = $this->generatePlate($faker, $existingPlates);

            Kendaraan::create([
                'plat_nomor' => $plate,
                'jenis_kendaraan' => $faker->randomElement($jenisList),
                'warna' => $faker->safeColorName(),
                'user_id' => $faker->randomElement($userIds),
            ]);
        }
    }

    private function seedTransactions($faker, int $count): void
    {
        $areas = AreaParkir::all();
        $kendaraanPool = Kendaraan::select('id', 'jenis_kendaraan')->get();
        $petugasIds = User::where('role', 'petugas')->pluck('id')->all();

        if ($areas->isEmpty() || $kendaraanPool->isEmpty() || empty($petugasIds)) {
            return;
        }

        $tarifMap = [];
        foreach ($areas as $area) {
            $ruleType = $area->default_rule_type === 'choose' ? 'flat' : $area->default_rule_type;
            foreach (['motor', 'mobil', 'lainnya'] as $jenis) {
                $tarifMap[$area->id][$jenis] = Tarif::where('area_parkir_id', $area->id)
                    ->where('jenis_kendaraan', $jenis)
                    ->where('rule_type', $ruleType)
                    ->where('is_active', true)
                    ->first();
            }
        }

        $rows = [];
        $batchSize = 300;

        for ($i = 0; $i < $count; $i++) {
            $area = $areas->random();
            $kendaraan = $kendaraanPool->random();
            $tarif = $tarifMap[$area->id][$kendaraan->jenis_kendaraan] ?? null;
            if (!$tarif) {
                continue;
            }

            $isCompleted = $faker->boolean(80);
            $waktuMasuk = Carbon::now()
                ->subDays($faker->numberBetween(0, 29))
                ->subMinutes($faker->numberBetween(0, 1440));

            $waktuKeluar = null;
            $durasiMenit = null;
            $totalBiaya = null;
            $status = 'ongoing';

            if ($isCompleted) {
                $durasiMenit = $faker->numberBetween(15, 600);
                $waktuKeluar = (clone $waktuMasuk)->addMinutes($durasiMenit);
                $totalBiaya = $this->calculateTotal($tarif, $durasiMenit);
                $status = 'completed';
            }

            $rows[] = [
                'kendaraan_id' => $kendaraan->id,
                'waktu_masuk' => $waktuMasuk,
                'waktu_keluar' => $waktuKeluar,
                'tarif_id' => $tarif->id,
                'durasi' => $durasiMenit,
                'total_biaya' => $totalBiaya,
                'status' => $status,
                'petugas_id' => $faker->randomElement($petugasIds),
                'area_parkir_id' => $area->id,
                'token' => strtoupper(bin2hex(random_bytes(8))),
                'created_at' => $waktuMasuk,
                'updated_at' => $waktuKeluar ?? $waktuMasuk,
            ];

            if (count($rows) >= $batchSize) {
                DB::table('transaksi')->insert($rows);
                $rows = [];
            }
        }

        if (!empty($rows)) {
            DB::table('transaksi')->insert($rows);
        }
    }

    private function calculateTotal(Tarif $tarif, int $durasiMenit): float
    {
        $total = 0;

        switch ($tarif->rule_type) {
            case 'flat':
                $total = $tarif->harga_awal ?? 0;
                break;
            case 'interval':
                $interval = $tarif->interval_menit ?? 60;
                $unit = (int) ceil($durasiMenit / $interval);

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
            case 'progressive':
                $rules = collect($tarif->progressive_rules ?? []);
                $durasiJam = (int) ceil($durasiMenit / 60);

                if ($rules->isEmpty()) {
                    return $tarif->harga_awal ?? 0;
                }

                $rules = $rules->sortBy('jam_ke');
                $total = 0;

                for ($jam = 1; $jam <= $durasiJam; $jam++) {
                    $rule = $rules
                        ->where('jam_ke', '<=', $jam)
                        ->sortByDesc('jam_ke')
                        ->first();

                    if ($rule) {
                        $total += $rule['harga'];
                    } else {
                        $total += $tarif->harga_awal ?? 0;
                    }
                }
                break;
        }

        return (float) $total;
    }

    private function generatePlate($faker, array &$existingPlates): string
    {
        do {
            $areaCode = $faker->randomElement(['B', 'D', 'F', 'L', 'N']);
            $numbers = $faker->numberBetween(1000, 9999);
            $letters = strtoupper($faker->lexify('???'));
            $plate = $areaCode . ' ' . $numbers . ' ' . $letters;
        } while (isset($existingPlates[$plate]));

        $existingPlates[$plate] = true;

        return $plate;
    }
}
