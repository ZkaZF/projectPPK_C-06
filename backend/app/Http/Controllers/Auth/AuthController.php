<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Handle user registration.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'full_name'     => $request->full_name,
            'email'         => $request->email,
            'user_password' => Hash::make($request->password),
            'nim_nip'       => $request->nim_nip,
            'role_id'       => 1, // pengguna
            'u_stat_id'     => 1, // pending
        ]);

        return response()->json([
            'message' => 'Registration succesful. Awaiting verification from admin.',
            'user'    => $user,
        ], 201);
    }

    /**
     * Handle user login.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::with(['role', 'userStatus'])
            ->where('email', $request->email)
            ->first();

        // 1. Verify user existence and password
        if (! $user || ! Hash::check($request->password, $user->user_password)) {
            return response()->json([
                'message' => 'Wrong credentials.',
            ], 401);
        }

        // 2. Check if account is active
        if ($user->userStatus?->u_status_name !== 'active') {
            return response()->json([
                'message' => 'Your account is not yet active or waiting for admin verification.',
            ], 403);
        }

        // 3. Create Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'token'   => $token,
            'user'    => $user,
        ], 200);
    }

    /**
     * Handle user logout (revoke current token).
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful.',
        ], 200);
    }

    /**
     * Return authenticated user with relations.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()->load(['role', 'userStatus']),
        ], 200);
    }
}
