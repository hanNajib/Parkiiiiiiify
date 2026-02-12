<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\AreaParkir;
use App\Models\Kendaraan;
use App\Models\Tarif;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransaksiController extends Controller
{
    public function selectArea() {
        $areaParkir = AreaParkir::where('is_active', true)->get();
        return Inertia::render('_petugas/transaksi/SelectArea', [
            'areaParkir' => $areaParkir
        ]);
    }

    public function index(Request $request, $areaParkirId) {
        $areaParkir = AreaParkir::findOrFail($areaParkirId);
        
        $data = Transaksi::with(['kendaraan', 'tarif', 'petugas', 'areaParkir'])
            ->where('area_parkir_id', $areaParkirId)
            ->self()
            ->search()
            ->filter()
            ->latest()
            ->paginate(10)
            ->withQueryString();
        
        $stats = [
            'total_transaksi' => Transaksi::self()->where('area_parkir_id', $areaParkirId)->count(),
            'total_ongoing' => Transaksi::self()->where('area_parkir_id', $areaParkirId)->where('status', 'ongoing')->count(),
            'total_completed' => Transaksi::self()->where('area_parkir_id', $areaParkirId)->where('status', 'completed')->count(),
            'total_revenue' => Transaksi::self()->where('area_parkir_id', $areaParkirId)->where('status', 'completed')->sum('total_biaya'),
        ];

        // Get all kendaraan for create modal (exclude vehicles currently parked)
        $kendaraanParked = Transaksi::where('status', 'ongoing')
            ->pluck('kendaraan_id')
            ->toArray();
        
        $kendaraanList = Kendaraan::select('id', 'plat_nomor', 'jenis_kendaraan', 'pemilik', 'warna')
            ->whereNotIn('id', $kendaraanParked)
            ->get();
        
        // Get tarif for this area
        $tarifList = Tarif::where('area_parkir_id', $areaParkirId)
            ->where('is_active', true)
            ->get();

        return Inertia::render('_petugas/transaksi/Index', [
            'transaksi' => $data,
            'stats' => $stats,
            'areaParkir' => $areaParkir,
            'kendaraanList' => $kendaraanList,
            'tarifList' => $tarifList,
            'filter' => [
                's' => $request->s,
                'status' => $request->status,
            ]
        ]);
    }

    public function store(Request $request, $areaParkirId) {
        $validated = $request->validate([
            'kendaraan_id' => 'required|exists:kendaraan,id',
            'tarif_id' => 'required|exists:tarif,id',
        ]);

        // Check if vehicle is already parked (ongoing transaction)
        $existingTransaction = Transaksi::where('kendaraan_id', $validated['kendaraan_id'])
            ->where('status', 'ongoing')
            ->first();

        if ($existingTransaction) {
            return redirect()->back()->with('error', 'Kendaraan ini sedang parkir. Tidak bisa melakukan transaksi ganda.');
        }

        $transaksi = Transaksi::create([
            'kendaraan_id' => $validated['kendaraan_id'],
            'tarif_id' => $validated['tarif_id'],
            'area_parkir_id' => $areaParkirId,
            'petugas_id' => Auth::id(),
            'waktu_masuk' => now(),
            'status' => 'ongoing',
        ]);

        return redirect()->back()->with([
            'success' => 'Transaksi berhasil dibuat',
            'print_struk_masuk' => $transaksi->id,
        ]);
    }

    public function update(Request $request, $areaParkirId, $id) {
        $transaksi = Transaksi::where('area_parkir_id', $areaParkirId)->findOrFail($id);
        
        if ($transaksi->status === 'completed') {
            return redirect()->back()->with('error', 'Transaksi sudah selesai');
        }

        $transaksi->waktu_keluar = now();
        $transaksi->status = 'completed';
        
        // Calculate duration in hours (rounded up)
        $waktuMasuk = \Carbon\Carbon::parse($transaksi->waktu_masuk);
        $waktuKeluar = \Carbon\Carbon::parse($transaksi->waktu_keluar);
        $durasi = $waktuMasuk->diffInMinutes($waktuKeluar);
        $transaksi->durasi = $durasi;
        
        // Calculate total cost
        $tarif = Tarif::find($transaksi->tarif_id);
        if ($tarif->rule_type === 'flat') {
            $transaksi->total_biaya = $tarif->price;
        } else {
            // per_jam - round up to nearest hour
            $hours = ceil($durasi / 60);
            $transaksi->total_biaya = $tarif->price * $hours;
        }
        
        $transaksi->save();

        return redirect()->back()->with([
            'success' => 'Transaksi berhasil diselesaikan',
            'print_struk_keluar' => $transaksi->id,
        ]);
    }

    public function destroy($areaParkirId, $id) {
        $transaksi = Transaksi::where('area_parkir_id', $areaParkirId)->findOrFail($id);
        $transaksi->delete();
        
        return redirect()->back()->with('success', 'Transaksi berhasil dihapus');
    }

    public function cetakStrukMasuk($areaParkirId, $id) {
        $transaksi = Transaksi::with(['kendaraan', 'tarif', 'petugas', 'areaParkir'])
            ->where('area_parkir_id', $areaParkirId)
            ->findOrFail($id);
        
        return Inertia::render('_petugas/transaksi/StrukMasuk', [
            'transaksi' => $transaksi
        ]);
    }

    public function cetakStrukKeluar($areaParkirId, $id) {
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
}
