<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AreaParkir;
use App\Models\PetugasArea;
use App\Models\User;
use Illuminate\Http\Request;

class PetugasAreaController extends Controller
{
    /**
     * Store bulk assignment of petugas to area
     */
    public function store(Request $request, AreaParkir $areaParkir)
    {
        $validated = $request->validate([
            'petugas_ids' => 'required|array',
            'petugas_ids.*' => 'exists:mysql.users,id',
        ]);

        $currentPetugas = $areaParkir->petugas()->pluck('user_id')->toArray();
        $newPetugas = $validated['petugas_ids'];

        // Detach petugas yang tidak di-centang
        $toDetach = array_diff($currentPetugas, $newPetugas);
        if (!empty($toDetach)) {
            PetugasArea::where('area_parkir_id', $areaParkir->id)
                ->whereIn('user_id', $toDetach)
                ->delete();
        }

        // Attach petugas yang baru di-centang
        $toAttach = array_diff($newPetugas, $currentPetugas);
        if (!empty($toAttach)) {
            $now = now();
            $rows = array_map(function ($userId) use ($areaParkir, $now) {
                return [
                    'area_parkir_id' => $areaParkir->id,
                    'user_id' => $userId,
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }, $toAttach);

            PetugasArea::insert($rows);
        }

        return back()->with('success', 'Petugas berhasil diperbarui untuk area ini');
    }
}
