<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AreaParkir;
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
            'petugas_ids.*' => 'exists:users,id',
        ]);

        $currentPetugas = $areaParkir->petugas()->pluck('user_id')->toArray();
        $newPetugas = $validated['petugas_ids'];

        // Detach petugas yang tidak di-centang
        $toDetach = array_diff($currentPetugas, $newPetugas);
        if (!empty($toDetach)) {
            $areaParkir->petugas()->detach($toDetach);
        }

        // Attach petugas yang baru di-centang
        $toAttach = array_diff($newPetugas, $currentPetugas);
        foreach ($toAttach as $userId) {
            $areaParkir->petugas()->attach($userId, ['is_active' => true]);
        }

        return back()->with('success', 'Petugas berhasil diperbarui untuk area ini');
    }
}
