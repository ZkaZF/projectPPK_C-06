<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
     public function handle(Request $request, Closure $next): Response
     {
         $user = $request->user();

         if (! $user || $user->userStatus?->u_status_name !== 'active') {
             return response()->json([
                 'message' => 'Your account is not yet active bruv, waiting for an approval from the admin(s).',
             ], 403);
         }

         return $next($request);
     }
}
