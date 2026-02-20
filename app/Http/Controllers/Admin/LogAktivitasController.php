<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogAktivitasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = LogAktivitas::with(['user'])->latest()->search()->filter()->paginate(10)->withQueryString();
        
        $stats = [
            'total_logs' => LogAktivitas::count(),
            'total_today' => LogAktivitas::whereDate('created_at', today())->count(),
            'total_admin' => LogAktivitas::where('role', 'admin')->count(),
            'total_user' => LogAktivitas::where('role', 'user')->count(),
        ];
        
        return Inertia::render('_admin/log_aktivitas/Index', [
            'logAktivitas' => $data,
            'filter' => request()->only(['s', 'role', 'action']),
            'stats' => $stats,
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
        //
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
}
