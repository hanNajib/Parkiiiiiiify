<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use App\Exports\UsersExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class UserController extends Controller
{
    public function index()
    {
        $query = User::role()->where('id', '!=', Auth::id())->search()->latest();

        if (app()->has(Tenant::class)) {
            $tenant = app(Tenant::class);
            $query->whereHas('tenants', function ($q) use ($tenant) {
                $q->where('tenant_id', $tenant->id);
            });
        }

        $user = $query->paginate(10)->withQueryString();

        return Inertia::render('_admin/users/Index', [
            'users' => $user,
            'filter' => request()->only(['s', 'role'])
        ]);
    }

    public function create()
    {
        return Inertia::render('_admin/users/Create');
    }

    public function store(Request $request)
    {
        $allowedRoles = $this->allowedRolesFor(Auth::user());

        $attributes = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:mysql.users,email',
            'password' => 'required|min:8',
            'role' => ['required', Rule::in($allowedRoles)],
        ]);

        $attributes['password'] = Hash::make($attributes['password']);

        $user = User::create($attributes);

        if (app()->has(Tenant::class)) {
            $tenant = app(Tenant::class);
            $tenant->users()->syncWithoutDetaching([
                $user->id => ['role' => $attributes['role']]
            ]);
        }

        return redirect()->route('users.index')->with('success', 'User berhasil ditambahkan.');
    }

    public function edit(User $user)
    {
        return Inertia::render('_admin/users/Edit', [
            'user' => $user
        ]);
    }

    public function update(Request $request, User $user)
    {
        $allowedRoles = $this->allowedRolesFor(Auth::user());

        $attributes = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:mysql.users,email,' . $user->id,
            'role' => ['required', Rule::in($allowedRoles)],
            'password' => 'nullable|min:8'
        ]);

        if (empty($attributes['password'])) {
            unset($attributes['password']);
        } else {
            $attributes['password'] = Hash::make($attributes['password']);
        }

        $user->update($attributes);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }

    public function exportExcel(Request $request)
    {
        $filters = $request->only(['role', 'search']);
        
        $filename = 'users-' . date('Y-m-d-His') . '.xlsx';
        
        return Excel::download(new UsersExport($filters), $filename);
    }

    private function allowedRolesFor(User $user): array
    {
        return match ($user->role) {
            'superadmin' => ['owner', 'admin', 'petugas'],
            'owner' => ['admin', 'petugas'],
            'admin' => ['petugas'],
            default => [],
        };
    }
}
