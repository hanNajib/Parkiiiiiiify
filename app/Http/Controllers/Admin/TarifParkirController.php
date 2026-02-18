<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tarif\StoreRequest;
use App\Http\Requests\Tarif\UpdateRequest;
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
    public function create(Request $request)
    {
        $areaParkirId = $request->query('areaParkir');

        if ($areaParkirId) {
            $areaParkir = AreaParkir::findOrFail($areaParkirId);
            return $this->createForArea($areaParkir);
        }

        return redirect()
            ->route('tarif-parkir.index')
            ->with('error', 'Pilih area parkir terlebih dahulu.');
    }

    /**
     * Show the create page for a specific area parkir.
     */
    public function createForArea(AreaParkir $areaParkir)
    {
        $existingTarif = Tarif::where('area_parkir_id', $areaParkir->id)->get();

        return Inertia::render('_admin/tarif_parkir/Create', [
            'areaParkir' => $areaParkir,
            'existingTarif' => $existingTarif,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        Tarif::create($request->validated());

        return redirect()
            ->route('tarif-parkir.area', ['areaParkir' => $request->area_parkir_id])
            ->with('success', 'Tarif Parkir Berhasil Ditambahkan');
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
        $tarif = Tarif::findOrFail($id);
        $areaParkir = AreaParkir::findOrFail($tarif->area_parkir_id);

        return Inertia::render('_admin/tarif_parkir/Edit', [
            'tarif' => $tarif,
            'areaParkir' => $areaParkir,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, string $id)
    {
        $tarif = Tarif::findOrFail($id);

        $attribute = $request->validated();

        try {
            $tarif->update($attribute);
            return redirect()->back()->with('success', 'Tarif Parkir Berhasil Diperbarui');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Tarif Parkir Gagal Diperbarui: ' . $e->getMessage())->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $tarif = Tarif::findOrFail($id);
        $areaParkirId = $tarif->area_parkir_id;

        try {
            $tarif->delete();
            return redirect()->route('tarif-parkir.area', ['areaParkir' => $areaParkirId])->with('success', 'Tarif Parkir Berhasil Dihapus');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Tarif Parkir Gagal Dihapus: ' . $e->getMessage());
        }
    }

    /**
     * 
     */
    public function area(AreaParkir $areaParkir)
    {
        $tarif = Tarif::where('area_parkir_id', $areaParkir->id)->search()->latest()->paginate(20)->withQueryString();
        $allTarif = Tarif::where('area_parkir_id', $areaParkir->id)->get();

        return Inertia::render('_admin/tarif_parkir/Tarif', [
            'areaParkir' => $areaParkir,
            'tarif' => $tarif,
            'allTarif' => $allTarif
        ]);
    }
}
