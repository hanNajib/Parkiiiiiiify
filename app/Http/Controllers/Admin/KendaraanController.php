<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kendaraan;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class KendaraanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Kendaraan::search()->filter()->paginate(10)->withQueryString();
        $stats = [
            'total_kendaraan' => Kendaraan::count(),
            'total_mobil' => Kendaraan::where('jenis_kendaraan', 'mobil')->count(),
            'total_motor' => Kendaraan::where('jenis_kendaraan', 'motor')->count(),
            'total_lainnya' => Kendaraan::where('jenis_kendaraan', 'lainnya')->count(),
        ];

        return Inertia::render('_admin/kendaraan/Index', [
            'kendaraan' => $data,
            'filter' => request()->only(['s', 'jenis_kendaraan']),
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'plat_nomor' => 'required|string|max:20|unique:kendaraan,plat_nomor',
            'jenis_kendaraan' => 'required|in:mobil,motor,lainnya',
            'pemilik' => 'nullable|string|max:255',
            'warna' => 'nullable|string|max:50',
        ], [
            'plat_nomor.required' => 'Plat nomor wajib diisi',
            'plat_nomor.unique' => 'Plat nomor sudah terdaftar',
            'jenis_kendaraan.required' => 'Jenis kendaraan wajib dipilih',
            'jenis_kendaraan.in' => 'Jenis kendaraan tidak valid',
        ]);

        $validated['user_id'] = Auth::user()->id;

        Kendaraan::create($validated);

        return redirect()->back()->with('success', 'Kendaraan berhasil ditambahkan');
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

public function scanPlat(Request $request)
{
    try {
        $request->validate([
            'photo' => 'required|image|max:5120',
            'pre_scanned_plate' => 'nullable|string'
        ]);

        $photoFile = $request->file('photo');
        $imageInfo = getimagesize($photoFile->getRealPath());
        if ($request->has('pre_scanned_plate') && !empty($request->pre_scanned_plate)) {
            $preScannedPlate = $this->normalizePlateNumber($request->pre_scanned_plate);
            
            $existingKendaraan = Kendaraan::whereRaw(
                "REPLACE(REPLACE(plat_nomor, ' ', ''), '-', '') = ?",
                [$preScannedPlate]
            )->first();

            if ($existingKendaraan) {
                return response()->json([
                    'success' => true,
                    'exists' => true,
                    'message' => 'Kendaraan sudah terdaftar',
                    'data' => $existingKendaraan,
                    'source' => 'database'
                ]);
            }
        }

        // HIT PLATERECOGNIZER API
        $client = new Client();
        
        $response = $client->post('https://api.platerecognizer.com/v1/plate-reader/', [
            'headers' => [
                'Authorization' => 'Token ' . config('app.platerecognizer_api'),
            ],
            'multipart' => [
                [
                    'name' => 'upload',
                    'contents' => fopen($photoFile->getRealPath(), 'r'),
                    'filename' => $photoFile->getClientOriginalName()
                ],
                [
                    'name' => 'regions',
                    'contents' => 'id'
                ],
                [
                    'name' => 'mmc',
                    'contents' => 'true'
                ]
            ],
            'timeout' => 30
        ]);

        $result = json_decode($response->getBody(), true);

        if (empty($result['results'])) {
            return response()->json([
                'success' => false,
                'message' => 'Plat nomor tidak terdeteksi. Pastikan foto jelas dan plat nomor terlihat.'
            ], 422);
        }

        $firstResult = $result['results'][0];
        $platNomor = strtoupper($firstResult['plate']);
        $confidence = $firstResult['score'] ?? 0;
        
        $vehicleData = $firstResult['vehicle'] ?? null;
        $vehicleType = 'Unknown';
        
        if ($vehicleData && isset($vehicleData['type'])) {
            $vehicleType = $vehicleData['type'];
        }
        
        $jenisKendaraan = $this->mapVehicleType($vehicleType);

        $existingKendaraan = Kendaraan::where('plat_nomor', $platNomor)->first();

        if ($existingKendaraan) {
            return response()->json([
                'success' => true,
                'exists' => true,
                'message' => 'Kendaraan sudah terdaftar',
                'data' => $existingKendaraan,
                'source' => 'platerecognizer'
            ]);
        }

        return response()->json([
            'success' => true,
            'exists' => false,
            'data' => [
                'plat_nomor' => $platNomor,
                'jenis_kendaraan' => $jenisKendaraan,
                'confidence' => round($confidence * 100, 2),
                'vehicle_type_raw' => $vehicleType 
            ],
            'source' => 'platerecognizer',
            'message' => 'Plat nomor berhasil dideteksi'
        ]);

    } catch (RequestException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Gagal menghubungi layanan deteksi plat nomor. Silakan coba lagi.'
        ], 500);
        
    } catch (ConnectException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
        ], 500);
        
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Terjadi kesalahan. Silakan coba lagi.'
        ], 500);
    }
}

    /**
     * Normalize plate number untuk matching database
     */
    private function normalizePlateNumber($plate)
    {
        return strtoupper(str_replace([' ', '-'], '', $plate));
    }

    /**
     * Map vehicle type dari PlateRecognizer ke jenis kendaraan
     */
    private function mapVehicleType($type)
    {
        $mapping = [
            'Car' => 'mobil',
            'Motorcycle' => 'motor',
            'Truck' => 'mobil',
            'Bus' => 'mobil',
            'Van' => 'mobil',
        ];

        return $mapping[$type] ?? 'lainnya';
    }

}
