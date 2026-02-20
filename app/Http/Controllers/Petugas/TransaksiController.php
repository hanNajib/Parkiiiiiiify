<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\AreaParkir;
use App\Models\Kendaraan;
use App\Models\PetugasArea;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TransaksiController extends Controller
{
    public function selectArea()
    {
        // Hanya tampil area dimana user terdaftar di petugas_area dan aktif
        $areaParkir = AreaParkir::where('is_active', true)
            ->whereHas('petugas', function ($query) {
                $query->where('user_id', Auth::id())
                    ->where('is_active', true);
            })
            ->get();

        return Inertia::render('_petugas/transaksi/SelectArea', [
            'areaParkir' => $areaParkir
        ]);
    }

    public function index(Request $request, $areaParkirId)
    {
        $areaParkir = AreaParkir::findOrFail($areaParkirId);

        // Check apakah petugas terdaftar di area ini
        $isPetugasRegistered = PetugasArea::where('area_parkir_id', $areaParkirId)
            ->where('user_id', Auth::id())
            ->where('is_active', true)
            ->exists();

        if (!$isPetugasRegistered) {
            abort(403, 'Anda tidak terdaftar sebagai petugas di area parkir ini.');
        }

        $data = Transaksi::with(['kendaraan', 'tarif', 'petugas', 'areaParkir'])
            ->where('area_parkir_id', $areaParkirId)
            ->self()
            ->search()
            ->filter()
            ->dateRange()
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $stats = [
            'total_transaksi' => Transaksi::self()->where('area_parkir_id', $areaParkirId)->count(),
            'total_ongoing' => Transaksi::self()->where('area_parkir_id', $areaParkirId)->where('status', 'ongoing')->count(),
            'total_completed' => Transaksi::self()->where('area_parkir_id', $areaParkirId)->where('status', 'completed')->count(),
            'total_revenue' => Transaksi::self()->where('area_parkir_id', $areaParkirId)->where('status', 'completed')->sum('total_biaya'),
        ];

        $kendaraanParked = Transaksi::where('status', 'ongoing')
            ->pluck('kendaraan_id')
            ->toArray();

        $kendaraanList = Kendaraan::select('id', 'plat_nomor', 'jenis_kendaraan', 'warna')
            ->whereNotIn('id', $kendaraanParked)
            ->get();

        return Inertia::render('_petugas/transaksi/Index', [
            'transaksi' => $data,
            'stats' => $stats,
            'areaParkir' => $areaParkir,
            'kendaraanList' => $kendaraanList,
            'filter' => [
                's' => $request->s,
                'status' => $request->status,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
            ]
        ]);
    }

    public function store(Request $request, $areaParkirId)
    {
        $validated = $request->validate([
            'kendaraan_id' => 'required|exists:mysql.kendaraan,id',
        ]);

        $areaParkir = AreaParkir::findOrFail($areaParkirId);

        // Check apakah petugas terdaftar di area ini
        $isPetugasRegistered = PetugasArea::where('area_parkir_id', $areaParkirId)
            ->where('user_id', Auth::id())
            ->where('is_active', true)
            ->exists();

        if (!$isPetugasRegistered) {
            abort(403, 'Anda tidak terdaftar sebagai petugas di area parkir ini.');
        }

        $kendaraan = Kendaraan::findOrFail($validated['kendaraan_id']);

        // Check for existing ongoing transaction
        $existingTransaction = Transaksi::where('kendaraan_id', $validated['kendaraan_id'])
            ->where('status', 'ongoing')
            ->first();

        if ($existingTransaction) {
            return redirect()->back()->with('error', 'Kendaraan ini sedang parkir. Tidak bisa melakukan transaksi ganda.');
        }

        // Auto-select the best matching tariff
        $tarif = Transaksi::findBestTarif($areaParkirId, $kendaraan->jenis_kendaraan);
        
        if (!$tarif) {
            $ruleTypeMsg = $areaParkir->default_rule_type !== 'choose' 
                ? " dengan tipe '{$areaParkir->default_rule_type}'" 
                : '';
            
            return redirect()->back()->with('error', 
                "Tidak ada tarif aktif yang tersedia untuk kendaraan {$kendaraan->jenis_kendaraan}{$ruleTypeMsg} di area ini. " .
                "Silakan hubungi admin untuk menambahkan tarif yang sesuai."
            );
        }

        $transaksi = Transaksi::create([
            'kendaraan_id' => $validated['kendaraan_id'],
            'tarif_id' => $tarif->id,
            'area_parkir_id' => $areaParkirId,
            'petugas_id' => Auth::id(),
            'waktu_masuk' => now(),
            'status' => 'ongoing',
            'token' => strtoupper(substr(bin2hex(random_bytes(8)), 0, 16)),
        ]);

        return redirect()->back()->with([
            'success' => 'Transaksi berhasil dibuat',
            'print_struk_masuk' => $transaksi->id,
        ]);
    }

    public function update(Request $request, $areaParkirId, $id)
    {
        return DB::transaction(function () use($areaParkirId, $id) {
            $transaksi = Transaksi::where('area_parkir_id', $areaParkirId)
                                ->lockForUpdate()
                                ->findOrFail($id);
            if($transaksi->status === 'completed') {
                return redirect()->back()->with('error', 'Transaksi sudah selesai.');
            }

            $transaksi->selesaikan();

            return redirect()->back()->with([
                'success' => 'Transaksi berhasil diselesaikan',
                'print_struk_keluar' => $transaksi->id,
            ]);
        });
    }

    public function destroy($areaParkirId, $id)
    {
        $transaksi = Transaksi::where('area_parkir_id', $areaParkirId)->findOrFail($id);
        $transaksi->delete();

        return redirect()->back()->with('success', 'Transaksi berhasil dihapus');
    }

    public function cetakStrukMasuk($areaParkirId, $id)
    {
        $transaksi = Transaksi::with(['kendaraan', 'tarif', 'petugas', 'areaParkir'])
            ->where('area_parkir_id', $areaParkirId)
            ->findOrFail($id);

        return Inertia::render('_petugas/transaksi/StrukMasuk', [
            'transaksi' => $transaksi
        ]);
    }

    public function cetakStrukKeluar($areaParkirId, $id)
    {
        $transaksi = Transaksi::with(['kendaraan', 'tarif', 'petugas', 'areaParkir'])
            ->where('area_parkir_id', $areaParkirId)
            ->findOrFail($id);

        if ($transaksi->status !== 'completed') {
            return redirect()->back()->with('error', 'Transaksi belum selesai');
        }

        return Inertia::render('_petugas/transaksi/StrukKeluar', [
            'transaksi' => $transaksi
        ]);
    }

    public function lookupByBarcode($areaParkirId, string $code)
    {
        Log::info("Lookup transaksi by barcode: $code");

        $match = [];
        if (preg_match('/^TRX0*(\d+)[\-:\s]?([A-F0-9]{16})$/i', $code, $match)) {
            $transaksiId = (int) $match[1];
            $token = strtoupper($match[2]);

            $transaksi = Transaksi::with(['kendaraan', 'tarif', 'petugas', 'areaParkir'])
                ->where('area_parkir_id', $areaParkirId)
                ->where('token', $token)
                ->find($transaksiId);

            if ($transaksi) {
                return response()->json($transaksi);
            }
        }

        return response()->json(['success' => false, 'message' => 'Transaksi tidak ditemukan'], 404);
    }
}
