<?php

namespace App\Http\Middleware;

use App\Enum\ResponseEnum;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class Role
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$role): Response
    {
        $user = Auth::user();

        if (!in_array($user->role, $role)) {
            return redirect()->route('dashboard')->with('error', ResponseEnum::FORBIDDEN);
        }

        return $next($request);
    }
}
