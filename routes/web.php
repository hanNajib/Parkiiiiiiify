<?php

use App\Http\Controllers\Admin\AreaParkirController;
use App\Http\Controllers\Admin\KendaraanController;
use App\Http\Controllers\Admin\TarifParkirController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::resource('users', UserController::class);
        Route::resource('kendaraan', KendaraanController::class);
        Route::resource('area-parkir', AreaParkirController::class)->except(['create', 'edit', 'show']);
        Route::resource('tarif-parkir', TarifParkirController::class);
        Route::prefix('tarif-parkir')->name('tarif-parkir.')->group(function() {
            Route::get('area/{areaParkir}', [TarifParkirController::class, 'area'])->name('area');
        });
    });
});
