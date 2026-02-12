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
    public function index() {
        $user = Auth::user();
        $role = $user->role;

        // Common stats for all roles
        $commonStats = [
            'total_areas' => AreaParkir::count(),
            'total_vehicles' => Kendaraan::count(),
        ];

        // Role-specific data
        $data = match($role) {
            'superadmin', 'admin' => $this->getAdminDashboard($commonStats),
            'petugas' => $this->getPetugasDashboard($commonStats, $user),
            'owner' => $this->getOwnerDashboard($commonStats),
            default => $commonStats,
        };

        return Inertia::render('Dashboard', array_merge($data, ['userRole' => $role]));
    }

    private function getAdminDashboard($commonStats) {
        // Total transactions
        $totalTransactions = Transaksi::count();
        $ongoingTransactions = Transaksi::where('status', 'ongoing')->count();
        $completedTransactions = Transaksi::where('status', 'completed')->count();
        
        // Revenue stats
        $totalRevenue = Transaksi::where('status', 'completed')->sum('total_biaya');
        $todayRevenue = Transaksi::where('status', 'completed')
            ->whereDate('waktu_keluar', today())
            ->sum('total_biaya');
        $monthRevenue = Transaksi::where('status', 'completed')
            ->whereMonth('waktu_keluar', now()->month)
            ->whereYear('waktu_keluar', now()->year)
            ->sum('total_biaya');

        // User stats
        $totalUsers = User::count();
        $petugasCount = User::where('role', 'petugas')->count();

        // Revenue chart data (last 7 days)
        $revenueChart = Transaksi::where('status', 'completed')
            ->whereDate('waktu_keluar', '>=', now()->subDays(6))
            ->select(
                DB::raw('DATE(waktu_keluar) as date'),
                DB::raw('SUM(total_biaya) as total')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function($item) {
                return [
                    'date' => $item->date,
                    'revenue' => $item->total ?? 0
                ];
            });

        // Area performance
        $areaPerformance = AreaParkir::withCount([
            'transaksi as total_transactions',
            'transaksi as ongoing_transactions' => function($q) {
                $q->where('status', 'ongoing');
            }
        ])
        ->with(['transaksi' => function($q) {
            $q->where('status', 'completed');
        }])
        ->get()
        ->map(function($area) {
            $revenue = $area->transaksi->sum('total_biaya');
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
                'revenue' => $revenue,
            ];
        });

        // Recent transactions
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

    private function getPetugasDashboard($commonStats, $user) {
        // Today's stats for this petugas
        $todayTransactions = Transaksi::where('petugas_id', $user->id)
            ->whereDate('created_at', today())
            ->count();
        
        $todayRevenue = Transaksi::where('petugas_id', $user->id)
            ->where('status', 'completed')
            ->whereDate('waktu_keluar', today())
            ->sum('total_biaya');

        $ongoingNow = Transaksi::where('status', 'ongoing')->count();

        // My recent transactions
        $myTransactions = Transaksi::with(['kendaraan', 'areaParkir'])
            ->where('petugas_id', $user->id)
            ->latest('created_at')
            ->take(10)
            ->get();

        // Hourly activity (today)
        $hourlyActivity = Transaksi::where('petugas_id', $user->id)
            ->whereDate('created_at', today())
            ->select(
                DB::raw('HOUR(created_at) as hour'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('hour')
            ->orderBy('hour')
            ->get()
            ->map(function($item) {
                return [
                    'hour' => str_pad($item->hour, 2, '0', STR_PAD_LEFT) . ':00',
                    'transactions' => $item->count
                ];
            });

        // Areas with available space
        $availableAreas = AreaParkir::withCount([
            'transaksi as ongoing_count' => function($q) {
                $q->where('status', 'ongoing');
            }
        ])
        ->get()
        ->map(function($area) {
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

    private function getOwnerDashboard($commonStats) {
        // Revenue trends (last 30 days)
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

        // Monthly comparison
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

        // Area profitability
        $areaProfitability = AreaParkir::with(['transaksi' => function($q) {
            $q->where('status', 'completed')
                ->whereMonth('waktu_keluar', now()->month);
        }])
        ->get()
        ->map(function($area) {
            $revenue = $area->transaksi->sum('total_biaya');
            $transactions = $area->transaksi->count();
            $avgTransaction = $transactions > 0 ? $revenue / $transactions : 0;

            return [
                'nama' => $area->nama,
                'revenue' => $revenue,
                'transactions' => $transactions,
                'avgTransaction' => $avgTransaction,
            ];
        })
        ->sortByDesc('revenue')
        ->values();

        // Vehicle type distribution
        $vehicleDistribution = Transaksi::where('status', 'completed')
            ->whereMonth('created_at', now()->month)
            ->with('kendaraan')
            ->get()
            ->groupBy('kendaraan.jenis_kendaraan')
            ->map(function($transactions, $type) {
                return [
                    'type' => $type ?: 'Unknown',
                    'count' => $transactions->count(),
                    'revenue' => $transactions->sum('total_biaya'),
                ];
            })
            ->values();

        // Peak hours analysis
        $peakHours = Transaksi::whereMonth('created_at', now()->month)
            ->select(
                DB::raw('HOUR(created_at) as hour'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('hour')
            ->orderBy('count', 'desc')
            ->take(5)
            ->get()
            ->map(function($item) {
                return [
                    'hour' => str_pad($item->hour, 2, '0', STR_PAD_LEFT) . ':00',
                    'transactions' => $item->count
                ];
            });

        // Overall stats
        $totalRevenue = Transaksi::where('status', 'completed')->sum('total_biaya');
        $totalTransactions = Transaksi::count();
        $avgRevPerTransaction = $totalTransactions > 0 
            ? $totalRevenue / $totalTransactions 
            : 0;

        // Get all areas for filter
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

    public function downloadRekapPDF(Request $request) {
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
            $byArea = $transaksi->groupBy('area_parkir_id')->map(function($items) {
                return [
                    'nama' => $items->first()->areaParkir->nama ?? 'Unknown',
                    'count' => $items->count(),
                    'revenue' => $items->sum('total_biaya'),
                ];
            });

            // Group by vehicle type
            $byVehicleType = $transaksi->groupBy('kendaraan.jenis_kendaraan')->map(function($items, $type) {
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
