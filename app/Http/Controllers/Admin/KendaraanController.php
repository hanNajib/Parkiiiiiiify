<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kendaraan;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Http\Request;
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
                'pre_scanned_plate' => 'nullable|string' // Hasil OCR dari Tesseract.js
            ]);

            // STEP 1: Jika ada hasil pre-scan dari Tesseract.js, cek database dulu
            if ($request->has('pre_scanned_plate') && !empty($request->pre_scanned_plate)) {
                $preScannedPlate = $this->normalizePlateNumber($request->pre_scanned_plate);
                
                // Cek database dengan plat nomor dari pre-scan
                $existingKendaraan = Kendaraan::whereRaw(
                    "REPLACE(REPLACE(plat_nomor, ' ', ''), '-', '') = ?",
                    [$preScannedPlate]
                )->first();

                if ($existingKendaraan) {
                    // PLAT SUDAH ADA - Skip PlateRecognizer API (hemat quota!)
                    return response()->json([
                        'success' => true,
                        'exists' => true,
                        'message' => 'Kendaraan sudah terdaftar',
                        'data' => $existingKendaraan,
                        'source' => 'database' // Indicator bahwa dari database
                    ]);
                }
            }

            // STEP 2: Plat belum ada di database, hit PlateRecognizer API untuk hasil akurat
            $client = new Client();
            $response = $client->post('https://api.platerecognizer.com/v1/plate-reader/', [
                'headers' => [
                    'Authorization' => 'Token ' . config('app.platerecognizer_api'),
                ],
                'multipart' => [
                    [
                        'name' => 'upload',
                        'contents' => fopen($request->file('photo')->getRealPath(), 'r'),
                        'filename' => 'vehicle.jpg'
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

            // Parse hasil dari PlateRecognizer
            $platNomor = strtoupper($result['results'][0]['plate']);
            $confidence = $result['results'][0]['score'] ?? 0;
            $vehicleType = $result['results'][0]['vehicle']['type'] ?? 'Unknown';
            
            // Map vehicle type ke jenis kendaraan
            $jenisKendaraan = $this->mapVehicleType($vehicleType);
            
            // Log full response untuk debugging
            Log::info("PlateRecognizer Response", [
                'plate' => $platNomor,
                'confidence' => $confidence,
                'vehicle_type_raw' => $vehicleType,
                'jenis_kendaraan_mapped' => $jenisKendaraan,
                'full_vehicle_data' => $result['results'][0]['vehicle'] ?? null
            ]);

            // Double check database dengan hasil akurat dari PlateRecognizer
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

            // PLAT BARU - Return untuk auto-fill form
            return response()->json([
                'success' => true,
                'exists' => false,
                'data' => [
                    'plat_nomor' => $platNomor,
                    'jenis_kendaraan' => $jenisKendaraan,
                    'confidence' => round($confidence * 100, 2) // Confidence score dalam persen
                ],
                'source' => 'platerecognizer',
                'message' => 'Plat nomor berhasil dideteksi'
            ]);

        } catch (RequestException $e) {
            Log::error('PlateRecognizer API Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghubungi layanan deteksi plat nomor. Silakan coba lagi.'
            ], 500);
        } catch (ConnectException $e) {
            Log::error('PlateRecognizer Connection Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
            ], 500);
        } catch (\Exception $e) {
            Log::error('Scan Plat Error: ' . $e->getMessage());
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
        // Hapus spasi, strip, dan uppercase
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
