<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AreaParkir;
use App\Models\Tenant;
use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AreaParkirController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = AreaParkir::search()->latest()->paginate(10)->withQueryString();
        $stats = [
            'total_area_parkir' => AreaParkir::count(),
            'total_kapasitas' => AreaParkir::sum('kapasitas'),
            'total_terisi' => Transaksi::where('status', 'ongoing')->count(),
            'total_kosong' => AreaParkir::sum('kapasitas') - Transaksi::where('status', 'ongoing')->count(),
        ];

        return Inertia::render('_admin/area_parkir/Index', [
            'areaParkir' => $data,
            'stats' => $stats,
            'filter' => request()->only(['s'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $attributes = $request->validate([
            'nama' => 'required',
            'lokasi' => 'required',
            'kapasitas' => 'required|integer',
            'default_rule_type' => 'required|in:choose,flat,interval,progressive',
            'is_active' => 'required|boolean',
        ]);

        AreaParkir::create($attributes);

        return redirect()->route('area-parkir.index')->with('success', 'Area Parkir berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $area = AreaParkir::findOrFail($id);
        
        $query = User::where('role', 'petugas');

        if (app()->has(Tenant::class)) {
            $tenant = app(Tenant::class);
            $query->whereHas('tenants', function ($q) use ($tenant) {
                $q->where('tenant_id', $tenant->id);
            });
        }

        $allPetugas = $query->get();
        
        $assignedPetugasIds = $area->petugas()->pluck('user_id')->toArray();
        
        $petugasWithStatus = $allPetugas->map(function ($p) use ($assignedPetugasIds) {
            return [
                'id' => $p->id,
                'name' => $p->name,
                'email' => $p->email,
                'is_assigned' => in_array($p->id, $assignedPetugasIds),
            ];
        });

        return Inertia::render('_admin/area_parkir/Show', [
            'area' => $area,
            'allPetugas' => $petugasWithStatus,
            'assignedPetugasIds' => $assignedPetugasIds,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $attributes = $request->validate([
            'nama' => 'required',
            'lokasi' => 'required',
            'kapasitas' => 'required|integer',
            'default_rule_type' => 'required|in:choose,flat,interval,progressive',
            'is_active' => 'required|boolean',
        ]);

        $areaParkir = AreaParkir::findOrFail($id);
        $areaParkir->update($attributes);

        return redirect()->route('area-parkir.index')->with('success', 'Area Parkir berhasil diupdate.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $areaParkir = AreaParkir::findOrFail($id);
        $areaParkir->delete();

        return redirect()->route('area-parkir.index')->with('success', 'Area Parkir berhasil dihapus.');
    }
}
