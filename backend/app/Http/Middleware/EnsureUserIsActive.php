<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * EnsureUserIsActive
 *
 * Verifies that the authenticated user's account status is "active"
 * before allowing the request to proceed.
 *
 * New registrations start as "pending" and must be verified by an admin
 * before they can access protected routes. Rejected accounts are also blocked.
 *
 * This middleware should run AFTER auth:sanctum so that $request->user()
 * is already resolved and the userStatus relationship can be accessed.
 */
class EnsureUserIsActive
{
    /**
     * Handle an incoming request.
     *
     * Reads the authenticated user's account status via the userStatus
     * relationship on the User model. If the status name is not "active",
     * the middleware short-circuits with a 403 Forbidden response.
     *
     * @param  \Illuminate\Http\Request                        $request  The incoming HTTP request
     * @param  \Closure(\Illuminate\Http\Request): (Response) $next     The next middleware or route handler
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Block the request if there is no authenticated user or their account is not active.
        // "pending" accounts are waiting for admin verification; "rejected" accounts are permanently denied.
        if (! $user || $user->userStatus?->u_status_name !== 'active') {
            return response()->json([
                'message' => 'Your account is not yet active. Please wait for admin verification.',
            ], 403);
        }

        return $next($request);
    }
}
