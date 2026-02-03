<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AreaParkir;
use App\Models\Tarif;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TarifParkirController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $areaParkir = AreaParkir::search()->latest()->paginate(16)->withQueryString();

        return Inertia::render('_admin/tarif_parkir/Index', [
            'areaParkir' => $areaParkir,
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
        $attribute = $request->validate([
            'area_parkir_id' => 'required|exists:area_parkir,id',
            'rule_type' => 'required|in:flat,per_jam',
            'price' => 'required',
            'jenis_kendaraan' => 'required|in:motor,mobil,lainnya'
        ]);
        
        // Validasi kombinasi unique
        $existingTarif = Tarif::where('area_parkir_id', $attribute['area_parkir_id'])
            ->where('jenis_kendaraan', $attribute['jenis_kendaraan'])
            ->where('rule_type', $attribute['rule_type'])
            ->first();
            
        if ($existingTarif) {
            return redirect()->back()->withErrors([
                'jenis_kendaraan' => 'Kombinasi jenis kendaraan dan tipe harga sudah ada untuk area parkir ini.'
            ])->withInput();
        }

        try {
            Tarif::create($attribute);
            return redirect()->route('tarif-parkir.area', ['areaParkir' => $attribute['area_parkir_id']])->with('success', 'Tarif Parkir Berhasil Ditambahkan');
        } catch (\Exception $e) {
            return redirect()->route('tarif-parkir.area', ['areaParkirx' => $attribute['area_parkir_id']])->with('error', 'Tarif Parkir Gagal Ditambahkan');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * 
     */
    public function area(AreaParkir $areaParkir)
    {
        $tarif = Tarif::where('area_parkir_id', $areaParkir->id)->search()->latest()->paginate(20);
        $allTarif = Tarif::where('area_parkir_id', $areaParkir->id)->get();
        
        return Inertia::render('_admin/tarif_parkir/Tarif', [
            'areaParkir' => $areaParkir,
            'tarif' => $tarif,
            'allTarif' => $allTarif
        ]);
    }
}
