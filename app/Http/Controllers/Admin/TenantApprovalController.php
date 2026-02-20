<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Services\TenantDatabaseManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TenantApprovalController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->get('status', 'all');
        
        $query = Tenant::with('owner')
            ->orderByDesc('created_at');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $tenants = $query->get();

        return Inertia::render('_admin/tenants/Index', [
            'tenants' => $tenants,
            'filters' => [
                'status' => $status,
            ],
        ]);
    }

    public function approve(Tenant $tenant)
    {
        if ($tenant->status !== 'pending') {
            return redirect()->back()->with('error', 'Tenant sudah diproses.');
        }

        $tenant->update([
            'status' => 'approved',
            'is_active' => true,
            'approved_by_user_id' => Auth::id(),
            'approved_at' => now(),
        ]);

        TenantDatabaseManager::provision($tenant);

        if ($tenant->owner_user_id) {
            $tenant->users()->syncWithoutDetaching([
                $tenant->owner_user_id => ['role' => 'owner']
            ]);
        }

        return redirect()->back()->with('success', 'Tenant berhasil disetujui.');
    }

    public function reject(Request $request, Tenant $tenant)
    {
        if ($tenant->status !== 'pending') {
            return redirect()->back()->with('error', 'Tenant sudah diproses.');
        }

        $tenant->update([
            'status' => 'rejected',
            'is_active' => false,
            'rejected_by_user_id' => Auth::id(),
            'rejected_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Tenant ditolak.');
    }

    public function toggleActive(Tenant $tenant)
    {
        if ($tenant->status !== 'approved') {
            return redirect()->back()->with('error', 'Hanya tenant approved yang bisa diaktifkan/nonaktifkan.');
        }

        $tenant->update([
            'is_active' => !$tenant->is_active,
        ]);

        $status = $tenant->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return redirect()->back()->with('success', "Tenant berhasil {$status}.");
    }
}
