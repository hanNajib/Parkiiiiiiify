<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\Kendaraan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KendaraanController extends Controller
{
    /**
     * Quick registration for new vehicle by petugas
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'plat_nomor' => 'required|string|max:20|unique:mysql.kendaraan,plat_nomor',
                'jenis_kendaraan' => 'required|in:mobil,motor,lainnya',
                'warna' => 'required|string|max:50',
            ], [
                'plat_nomor.required' => 'Plat nomor wajib diisi',
                'plat_nomor.unique' => 'Plat nomor sudah terdaftar di sistem',
                'jenis_kendaraan.required' => 'Jenis kendaraan wajib dipilih',
                'jenis_kendaraan.in' => 'Jenis kendaraan tidak valid',
                'warna.required' => 'Warna kendaraan wajib diisi',
            ]);

            $validated['user_id'] = Auth::id();

            $kendaraan = Kendaraan::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Kendaraan berhasil didaftarkan',
                'data' => $kendaraan
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mendaftarkan kendaraan'
            ], 500);
        }
    }
}
