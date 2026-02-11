<?php

use App\Http\Controllers\Admin\KendaraanController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/scan-plat', [KendaraanController::class, 'scanPlat'])->name('api.scan-plat');
