<?php

use App\Http\Controllers\Admin\AreaParkirController;
use App\Http\Controllers\Admin\KendaraanController;
use App\Http\Controllers\Admin\LogAktivitasController;
use App\Http\Controllers\Admin\PetugasAreaController;
use App\Http\Controllers\Admin\TarifParkirController;
use App\Http\Controllers\Admin\TenantApprovalController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Petugas\KendaraanController as PetugasKendaraanController;
use App\Http\Controllers\Petugas\TransaksiController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::middleware('tenant')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register') && Features::enabled(Features::registration()),
            'laravelVersion' => app()->version(),
            'phpVersion' => PHP_VERSION,
        ]);
    });
});

Route::middleware(['tenant'])->group(function () {
    Route::middleware(['auth'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::middleware('role:owner,superadmin')->group(function () {
            Route::post('/download-rekap-pdf', [DashboardController::class, 'downloadRekapPDF'])->name('download-rekap-pdf');
            Route::post('/download-rekap', [DashboardController::class, 'downloadRekap'])->name('download-rekap');
            Route::get('/api/preview-rekap', [DashboardController::class, 'previewRekap'])->name('preview-rekap');
        });

        Route::middleware('role:owner,admin,superadmin')->prefix('admin')->group(function () {
            Route::middleware('role:superadmin')->group(function () {
                Route::get('tenants/approvals', [TenantApprovalController::class, 'index'])->name('tenants.approvals.index');
                Route::post('tenants/{tenant}/approve', [TenantApprovalController::class, 'approve'])->name('tenants.approvals.approve');
                Route::post('tenants/{tenant}/reject', [TenantApprovalController::class, 'reject'])->name('tenants.approvals.reject');
                Route::post('tenants/{tenant}/toggle-active', [TenantApprovalController::class, 'toggleActive'])->name('tenants.approvals.toggle-active');
            });

            Route::resource('users', UserController::class);
            Route::get('users/export/excel', [UserController::class, 'exportExcel'])->name('users.export');
            Route::resource('kendaraan', KendaraanController::class);
            Route::resource('area-parkir', AreaParkirController::class)->except(['create', 'edit']);
            Route::post('area-parkir/{areaParkir}/petugas', [PetugasAreaController::class, 'store'])->name('area-parkir.petugas.store');
            Route::resource('tarif-parkir', TarifParkirController::class);
            Route::resource('log-aktivitas', LogAktivitasController::class)->only(['index', 'show', 'destroy']);
            Route::prefix('tarif-parkir')->name('tarif-parkir.')->group(function () {
                Route::get('area/{areaParkir}', [TarifParkirController::class, 'area'])->name('area');
                Route::get('area/{areaParkir}/create', [TarifParkirController::class, 'createForArea'])->name('area-create');
            });
        });

        Route::middleware('role:petugas')->prefix('petugas')->group(function () {
            Route::post('/kendaraan', [PetugasKendaraanController::class, 'store'])->name('petugas.kendaraan.store');
            Route::get('/transaksi/select-area', [TransaksiController::class, 'selectArea'])->name('transaksi.select-area');
            Route::prefix('transaksi/area/{areaParkir}')->name('transaksi.')->group(function () {
                Route::get('/', [TransaksiController::class, 'index'])->name('index');
                Route::post('/', [TransaksiController::class, 'store'])->name('store');
                Route::put('/{transaksi}', [TransaksiController::class, 'update'])->name('update');
                Route::delete('/{transaksi}', [TransaksiController::class, 'destroy'])->name('destroy');
                Route::get('/{transaksi}/cetak-struk-masuk', [TransaksiController::class, 'cetakStrukMasuk'])->name('cetak-struk-masuk');
                Route::get('/{transaksi}/cetak-struk-keluar', [TransaksiController::class, 'cetakStrukKeluar'])->name('cetak-struk-keluar');
                Route::get('/lookup-barcode/{code}', [TransaksiController::class, 'lookupByBarcode'])->name('lookup-barcode');
            });
        });
    });
});
