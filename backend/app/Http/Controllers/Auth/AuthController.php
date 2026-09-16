<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Handle user registration using prepared statements.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        // insert user using prepared statement with parameter binding
        DB::insert(
            'INSERT INTO "users" ("full_name", "email", "user_password", "nim_nip", "role_id", "u_stat_id", "created_at", "updated_at")
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
            [
                $request->full_name,
                $request->email,
                Hash::make($request->password),
                $request->nim_nip,
                1, // role_id = pengguna
                1, // u_stat_id = pending
            ]
        );

        // fetch the newly created user using prepared statement
        $user = DB::select(
            'SELECT "user_id", "full_name", "email", "nim_nip", "role_id", "u_stat_id", "created_at"
             FROM "users" WHERE "email" = ?',
            [$request->email]
        );

        return response()->json([
            'message' => 'Registration successful. Awaiting verification from admin.',
            'user'    => $user[0] ?? null,
        ], 201);
    }

    /**
     * Handle user login using prepared statements.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        // find user by email using prepared statement with JOIN to get role and status
        $results = DB::select(
            'SELECT u.user_id, u.full_name, u.email, u.user_password, u.nim_nip,
                    u.role_id, r.role_name,
                    u.u_stat_id, s.u_status_name
             FROM "users" u
             INNER JOIN "roles" r ON u.role_id = r.role_id
             INNER JOIN "user_statuses" s ON u.u_stat_id = s.u_stat_id
             WHERE u.email = ?',
            [$request->email]
        );

        // check if user exists
        if (empty($results)) {
            return response()->json([
                'message' => 'Wrong credentials.',
            ], 401);
        }

        $row = $results[0];

        // verify password hash
        if (! Hash::check($request->password, $row->user_password)) {
            return response()->json([
                'message' => 'Wrong credentials.',
            ], 401);
        }

        // check if account is active
        if ($row->u_status_name !== 'active') {
            return response()->json([
                'message' => 'Your account is not yet active or waiting for admin verification.',
            ], 403);
        }

        // create Sanctum token (requires Eloquent User model for token generation)
        $user = User::find($row->user_id);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'token'   => $token,
            'user'    => [
                'user_id'   => $row->user_id,
                'full_name' => $row->full_name,
                'email'     => $row->email,
                'nim_nip'   => $row->nim_nip,
                'role'      => [
                    'role_id'   => $row->role_id,
                    'role_name' => $row->role_name,
                ],
                'user_status' => [
                    'u_stat_id'     => $row->u_stat_id,
                    'u_status_name' => $row->u_status_name,
                ],
            ],
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
     * Return authenticated user profile using prepared statement.
     */
    public function me(Request $request): JsonResponse
    {
        $userId = $request->user()->getKey();

        // fetch user with role and status using prepared statement
        $results = DB::select(
            'SELECT u.user_id, u.full_name, u.email, u.nim_nip,
                    u.role_id, r.role_name,
                    u.u_stat_id, s.u_status_name,
                    u.created_at, u.updated_at
             FROM "users" u
             INNER JOIN "roles" r ON u.role_id = r.role_id
             INNER JOIN "user_statuses" s ON u.u_stat_id = s.u_stat_id
             WHERE u.user_id = ?',
            [$userId]
        );

        if (empty($results)) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        $row = $results[0];

        return response()->json([
            'user' => [
                'user_id'   => $row->user_id,
                'full_name' => $row->full_name,
                'email'     => $row->email,
                'nim_nip'   => $row->nim_nip,
                'role'      => [
                    'role_id'   => $row->role_id,
                    'role_name' => $row->role_name,
                ],
                'user_status' => [
                    'u_stat_id'     => $row->u_stat_id,
                    'u_status_name' => $row->u_status_name,
                ],
                'created_at' => $row->created_at,
                'updated_at' => $row->updated_at,
            ],
        ], 200);
    }
}