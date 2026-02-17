<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaksi;
use App\Models\AreaParkir;
use App\Models\Kendaraan;
use App\Models\User;
use App\Models\Tarif;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $role = $user->role;

        $commonStats = [
            'total_areas' => AreaParkir::count(),
            'total_vehicles' => Kendaraan::count(),
        ];

        $data = match ($role) {
            'superadmin', 'admin' => $this->getAdminDashboard($commonStats),
            'petugas' => $this->getPetugasDashboard($commonStats, $user),
            'owner' => $this->getOwnerDashboard($commonStats),
            default => $commonStats,
        };

        return Inertia::render('Dashboard', array_merge($data, ['userRole' => $role]));
    }

    private function getAdminDashboard($commonStats)
    {
        $totalTransactions = Transaksi::count();
        $ongoingTransactions = Transaksi::where('status', 'ongoing')->count();
        $completedTransactions = Transaksi::where('status', 'completed')->count();

        $totalRevenue = Transaksi::where('status', 'completed')->sum('total_biaya');
        $todayRevenue = Transaksi::where('status', 'completed')
            ->whereDate('waktu_keluar', today())
            ->sum('total_biaya');
        $monthRevenue = Transaksi::where('status', 'completed')
            ->whereMonth('waktu_keluar', now()->month)
            ->whereYear('waktu_keluar', now()->year)
            ->sum('total_biaya');

        $totalUsers = User::count();
        $petugasCount = User::where('role', 'petugas')->count();

        $revenueChart = Transaksi::where('status', 'completed')
            ->whereDate('waktu_keluar', '>=', now()->subDays(6))
            ->select(
                DB::raw('DATE(waktu_keluar) as date'),
                DB::raw('SUM(total_biaya) as total')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'revenue' => $item->total ?? 0
                ];
            });

        // ✅ BISMILLAH, INI YANG BENER!
        $areaPerformance = AreaParkir::select('area_parkir.*')
            ->withCount('transaksi as total_transactions')
            ->withCount([
                'transaksi as ongoing_transactions' => function ($q) {
                    $q->where('status', 'ongoing');
                }
            ])
            ->addSelect([
                'revenue' => Transaksi::selectRaw('COALESCE(SUM(total_biaya), 0)')
                    ->whereColumn('area_parkir_id', 'area_parkir.id')
                    ->where('status', 'completed')
            ])
            ->get()
            ->map(function ($area) {
                $occupancyRate = $area->kapasitas > 0
                    ? round(($area->ongoing_transactions / $area->kapasitas) * 100, 1)
                    : 0;

                return [
                    'id' => $area->id,
                    'nama' => $area->nama,
                    'lokasi' => $area->lokasi,
                    'kapasitas' => $area->kapasitas,
                    'ongoing' => $area->ongoing_transactions,
                    'occupancy' => $occupancyRate,
                    'revenue' => $area->revenue ?? 0,
                ];
            });

        $recentTransactions = Transaksi::with(['kendaraan', 'areaParkir', 'petugas'])
            ->latest('created_at')
            ->take(10)
            ->get();

        return array_merge($commonStats, [
            'totalTransactions' => $totalTransactions,
            'ongoingTransactions' => $ongoingTransactions,
            'completedTransactions' => $completedTransactions,
            'totalRevenue' => $totalRevenue,
            'todayRevenue' => $todayRevenue,
            'monthRevenue' => $monthRevenue,
            'totalUsers' => $totalUsers,
            'petugasCount' => $petugasCount,
            'revenueChart' => $revenueChart,
            'areaPerformance' => $areaPerformance,
            'recentTransactions' => $recentTransactions,
        ]);
    }

    private function getPetugasDashboard($commonStats, $user)
    {
        $todayTransactions = Transaksi::where('petugas_id', $user->id)
            ->whereDate('created_at', today())
            ->count();

        $todayRevenue = Transaksi::where('petugas_id', $user->id)
            ->where('status', 'completed')
            ->whereDate('waktu_keluar', today())
            ->sum('total_biaya');

        $ongoingNow = Transaksi::where('status', 'ongoing')->count();

        $myTransactions = Transaksi::with(['kendaraan', 'areaParkir'])
            ->where('petugas_id', $user->id)
            ->latest('created_at')
            ->take(10)
            ->get();

        $hourlyActivity = Transaksi::where('petugas_id', $user->id)
            ->whereDate('created_at', today())
            ->select(
                DB::raw('HOUR(created_at) as hour'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('hour')
            ->orderBy('hour')
            ->get()
            ->map(function ($item) {
                return [
                    'hour' => str_pad($item->hour, 2, '0', STR_PAD_LEFT) . ':00',
                    'transactions' => $item->count
                ];
            });

        $availableAreas = AreaParkir::withCount([
            'transaksi as ongoing_count' => function ($q) {
                $q->where('status', 'ongoing');
            }
        ])
            ->get()
            ->map(function ($area) {
                return [
                    'id' => $area->id,
                    'nama' => $area->nama,
                    'lokasi' => $area->lokasi,
                    'kapasitas' => $area->kapasitas,
                    'terisi' => $area->ongoing_count,
                    'available' => $area->kapasitas - $area->ongoing_count,
                ];
            });

        return array_merge($commonStats, [
            'todayTransactions' => $todayTransactions,
            'todayRevenue' => $todayRevenue,
            'ongoingNow' => $ongoingNow,
            'myTransactions' => $myTransactions,
            'hourlyActivity' => $hourlyActivity,
            'availableAreas' => $availableAreas,
        ]);
    }

    private function getOwnerDashboard($commonStats)
    {
        $revenueData = Transaksi::where('status', 'completed')
            ->whereDate('waktu_keluar', '>=', now()->subDays(29))
            ->select(
                DB::raw('DATE(waktu_keluar) as date'),
                DB::raw('SUM(total_biaya) as revenue'),
                DB::raw('COUNT(*) as transactions')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $thisMonth = Transaksi::where('status', 'completed')
            ->whereMonth('waktu_keluar', now()->month)
            ->whereYear('waktu_keluar', now()->year)
            ->sum('total_biaya');

        $lastMonth = Transaksi::where('status', 'completed')
            ->whereMonth('waktu_keluar', now()->subMonth()->month)
            ->whereYear('waktu_keluar', now()->subMonth()->year)
            ->sum('total_biaya');

        $growthRate = $lastMonth > 0
            ? round((($thisMonth - $lastMonth) / $lastMonth) * 100, 1)
            : 0;

        // ✅ MASYA ALLAH, INI VERSI OPTIMIZED-NYA!
        $areaProfitability = AreaParkir::select('area_parkir.id', 'area_parkir.nama')
            ->addSelect([
                'revenue' => Transaksi::selectRaw('COALESCE(SUM(total_biaya), 0)')
                    ->whereColumn('area_parkir_id', 'area_parkir.id')
                    ->where('status', 'completed')
                    ->whereMonth('waktu_keluar', now()->month)
                    ->whereYear('waktu_keluar', now()->year),
                'transactions' => Transaksi::selectRaw('COUNT(*)')
                    ->whereColumn('area_parkir_id', 'area_parkir.id')
                    ->where('status', 'completed')
                    ->whereMonth('waktu_keluar', now()->month)
                    ->whereYear('waktu_keluar', now()->year)
            ])
            ->get()
            ->map(function ($area) {
                $avgTransaction = $area->transactions > 0
                    ? $area->revenue / $area->transactions
                    : 0;

                return [
                    'nama' => $area->nama,
                    'revenue' => $area->revenue ?? 0,
                    'transactions' => $area->transactions ?? 0,
                    'avgTransaction' => round($avgTransaction, 2),
                ];
            })
            ->sortByDesc('revenue')
            ->values();

        // Vehicle type distribution - INI UDAH BAGUS, tapi bisa lebih optimal
        $vehicleDistribution = DB::table('transaksi')
            ->join('kendaraan', 'transaksi.kendaraan_id', '=', 'kendaraan.id')
            ->where('transaksi.status', 'completed')
            ->whereMonth('transaksi.created_at', now()->month)
            ->whereYear('transaksi.created_at', now()->year)
            ->select(
                'kendaraan.jenis_kendaraan as type',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(transaksi.total_biaya) as revenue')
            )
            ->groupBy('kendaraan.jenis_kendaraan')
            ->get()
            ->map(function ($item) {
                return [
                    'type' => $item->type ?: 'Unknown',
                    'count' => $item->count,
                    'revenue' => $item->revenue,
                ];
            });

        $peakHours = Transaksi::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->select(
                DB::raw('HOUR(created_at) as hour'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('hour')
            ->orderBy('count', 'desc')
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'hour' => str_pad($item->hour, 2, '0', STR_PAD_LEFT) . ':00',
                    'transactions' => $item->count
                ];
            });

        $totalRevenue = Transaksi::where('status', 'completed')->sum('total_biaya');
        $totalTransactions = Transaksi::count();
        $avgRevPerTransaction = $totalTransactions > 0
            ? round($totalRevenue / $totalTransactions, 2)
            : 0;

        $areaList = AreaParkir::select('id', 'nama', 'lokasi')->get();

        return array_merge($commonStats, [
            'revenueData' => $revenueData,
            'thisMonthRevenue' => $thisMonth,
            'lastMonthRevenue' => $lastMonth,
            'growthRate' => $growthRate,
            'areaProfitability' => $areaProfitability,
            'vehicleDistribution' => $vehicleDistribution,
            'peakHours' => $peakHours,
            'totalRevenue' => $totalRevenue,
            'totalTransactions' => $totalTransactions,
            'avgRevPerTransaction' => $avgRevPerTransaction,
            'areaList' => $areaList,
        ]);
    }

    public function downloadRekapPDF(Request $request)
    {
        try {
            // Validate request
            $validated = $request->validate([
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'area_id' => 'nullable|exists:area_parkir,id',
            ], [
                'start_date.required' => 'Tanggal mulai harus diisi',
                'end_date.required' => 'Tanggal selesai harus diisi',
                'end_date.after_or_equal' => 'Tanggal selesai tidak boleh lebih kecil dari tanggal mulai',
                'area_id.exists' => 'Area parkir tidak ditemukan',
            ]);

            $startDate = $validated['start_date'];
            $endDate = $validated['end_date'];
            $areaId = $validated['area_id'] ?? null;

            // Get transactions
            $query = Transaksi::with(['kendaraan', 'areaParkir', 'tarif', 'petugas'])
                ->where('status', 'completed')
                ->whereBetween('waktu_keluar', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);

            if ($areaId) {
                $query->where('area_parkir_id', $areaId);
            }

            $transaksi = $query->orderBy('waktu_keluar', 'desc')->get();

            // Check if there are transactions
            if ($transaksi->isEmpty()) {
                return redirect()->back()->with('error', 'Tidak ada transaksi pada periode yang dipilih');
            }

            // Calculate summary
            $totalRevenue = $transaksi->sum('total_biaya');
            $totalTransactions = $transaksi->count();
            $avgDurasi = $transaksi->avg('durasi');

            // Group by area
            $byArea = $transaksi->groupBy('area_parkir_id')->map(function ($items) {
                return [
                    'nama' => $items->first()->areaParkir->nama ?? 'Unknown',
                    'count' => $items->count(),
                    'revenue' => $items->sum('total_biaya'),
                ];
            });

            // Group by vehicle type
            $byVehicleType = $transaksi->groupBy('kendaraan.jenis_kendaraan')->map(function ($items, $type) {
                return [
                    'type' => $type ?: 'Unknown',
                    'count' => $items->count(),
                    'revenue' => $items->sum('total_biaya'),
                ];
            });

            $area = $areaId ? AreaParkir::find($areaId) : null;

            $data = [
                'transaksi' => $transaksi,
                'startDate' => $startDate,
                'endDate' => $endDate,
                'area' => $area,
                'totalRevenue' => $totalRevenue,
                'totalTransactions' => $totalTransactions,
                'avgDurasi' => $avgDurasi,
                'byArea' => $byArea,
                'byVehicleType' => $byVehicleType,
                'generatedAt' => now(),
            ];

            $pdf = PDF::loadView('reports.rekap-transaksi', $data)
                ->setPaper('a4', 'portrait');

            $filename = 'Rekap-Transaksi-' . date('Y-m-d-His') . '.pdf';

            return $pdf->download($filename);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            logger()->error('Error generating PDF: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
        }
    }
}
