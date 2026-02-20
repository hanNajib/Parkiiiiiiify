<?php

use App\Models\Tenant;
use App\Services\TenantDatabaseManager;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule::call(function () {
//     Tenant::query()
//         ->where('status', 'approved')
//         ->where('is_active', true)
//         ->orderBy('id')
//         ->chunkById(50, function ($tenants) {
//             foreach ($tenants as $tenant) {
//                 app()->instance(Tenant::class, $tenant);
//                 TenantDatabaseManager::configure($tenant);

//                 Artisan::call('log:archive-aktivitas', [
//                     '--days' => 90,
//                 ]);

//                 DB::purge('tenant');
//                 app()->forgetInstance(Tenant::class);
//             }
//         });
// })
//     ->weeklyOn(0, '1:00')
//     ->withoutOverlapping();
