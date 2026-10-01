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

/**
 * AuthController
 *
 * Handles all authentication-related operations for the API:
 *   - User registration (with default role and pending status)
 *   - User login (returns a Sanctum personal access token)
 *   - User logout (revokes the current token)
 *   - Fetching the authenticated user's own profile
 *
 * All database queries use raw prepared statements (DB::select / DB::insert)
 * with parameter binding to prevent SQL injection. Sanctum is used only where
 * Eloquent model access is strictly required (e.g. token generation).
 */
class AuthController extends Controller
{
    /**
     * Handle user registration.
     *
     * Inserts a new user record into the `users` table using a raw prepared
     * statement. The password is hashed with bcrypt via Laravel's Hash facade.
     * New users are automatically assigned:
     *   - role_id = 1  → "pengguna" (regular user)
     *   - u_stat_id = 1 → "pending" (awaiting admin verification)
     *
     * After insertion, the newly created user is fetched and returned
     * in the response body (201 Created).
     *
     * @param  \App\Http\Requests\RegisterRequest  $request  Validated registration payload
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        // Insert user using prepared statement with parameter binding.
        // All values are bound as positional parameters (?) to prevent SQL injection.
        DB::insert(
            'INSERT INTO "users" ("full_name", "email", "user_password", "nim_nip", "role_id", "u_stat_id", "created_at", "updated_at")
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
            [
                $request->full_name,
                $request->email,
                Hash::make($request->password), // bcrypt hash — plain-text password is never stored
                $request->nim_nip,
                1, // role_id = 1 → "pengguna" (regular user)
                1, // u_stat_id = 1 → "pending" (waiting for admin approval)
            ]
        );

        // Fetch the newly created user record to return in the response.
        // We look it up by email since no auto-increment ID is returned by DB::insert.
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
     * Handle user login.
     *
     * Looks up the user by email using a raw prepared statement that JOINs
     * the `roles` and `user_statuses` tables so role and status info are
     * retrieved in a single query.
     *
     * Validation steps (in order):
     *   1. Check that a user with the given email exists.
     *   2. Verify the submitted password against the stored bcrypt hash.
     *   3. Confirm the account status is "active" (not pending/suspended).
     *
     * On success, a Sanctum personal access token is generated and returned
     * alongside the user's profile data. Returns 401 on wrong credentials
     * or 403 if the account is not yet active.
     *
     * @param  \App\Http\Requests\LoginRequest  $request  Validated login payload (email + password)
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        // Find user by email using a prepared statement.
        // JOIN roles and user_statuses so we get all needed data in one query.
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

        // Step 1: Check if a user with the provided email actually exists.
        if (empty($results)) {
            return response()->json([
                'message' => 'Wrong credentials.',
            ], 401);
        }

        $row = $results[0];

        // Step 2: Verify the submitted password against the bcrypt hash stored in the database.
        if (! Hash::check($request->password, $row->user_password)) {
            return response()->json([
                'message' => 'Wrong credentials.',
            ], 401);
        }

        // Step 3: Ensure the account has been approved and is currently active.
        // Accounts start as "pending" and must be activated by an admin.
        if ($row->u_status_name !== 'active') {
            return response()->json([
                'message' => 'Your account is not yet active or waiting for admin verification.',
            ], 403);
        }

        // Generate a Sanctum personal access token for this session.
        // Eloquent is used here because Sanctum's createToken() is tied to the HasApiTokens trait.
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
     * Handle user logout.
     *
     * Revokes only the token that was used to authenticate the current request
     * (i.e. the bearer token supplied in the Authorization header). Other
     * active tokens for the same user (e.g. from other devices) remain valid.
     *
     * @param  \Illuminate\Http\Request  $request  The incoming HTTP request (requires auth:sanctum middleware)
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        // Delete only the current token — other sessions are unaffected.
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful.',
        ], 200);
    }

    /**
     * Return the authenticated user's own profile.
     *
     * Extracts the user_id from the Sanctum-authenticated request, then
     * fetches the full user row (including joined role and status data)
     * using a raw prepared statement. Returns 404 if the record is somehow
     * missing (e.g. deleted after the token was issued).
     *
     * @param  \Illuminate\Http\Request  $request  The incoming HTTP request (requires auth:sanctum middleware)
     * @return \Illuminate\Http\JsonResponse
     */
    public function me(Request $request): JsonResponse
    {
        // Retrieve the authenticated user's primary key (user_id) from the Sanctum guard.
        $userId = $request->user()->getKey();

        // Fetch the full user profile with role and status using a prepared statement.
        // JOIN is used to include human-readable role and status names in one query.
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

        // Guard clause: return 404 if the user record no longer exists.
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