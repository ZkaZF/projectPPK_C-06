<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * RoleMiddleware
 *
 * Guards routes by checking whether the authenticated user holds one of
 * the required roles. Roles are passed as variadic arguments in api.php:
 *
 *   Route::middleware(['auth:sanctum', 'role:admin'])          // admin only
 *   Route::middleware(['auth:sanctum', 'role:petugas,admin'])  // petugas OR admin
 *
 * If the user has no role or their role is not in the allowed list,
 * the middleware short-circuits with a 403 Forbidden response.
 * This middleware should always run AFTER auth:sanctum so that
 * $request->user() is already resolved.
 */
class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * Reads the authenticated user's role name (via the role relationship on
     * the User model) and compares it against the list of allowed roles
     * passed as variadic $roles arguments. Returns 403 if no match is found.
     *
     * @param  \Illuminate\Http\Request                          $request  The incoming HTTP request
     * @param  \Closure(\Illuminate\Http\Request): (Response)   $next     The next middleware or route handler
     * @param  string                                            ...$roles One or more allowed role names (e.g. "admin", "petugas")
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        // Deny access if the user is unauthenticated or their role is not in the allowed list.
        if (! $user || ! in_array($user->role?->role_name, $roles, true)) {
            return response()->json([
                'message' => 'Access denied: you do not have the required role for this action.',
            ], 403);
        }

        return $next($request);
    }
}
