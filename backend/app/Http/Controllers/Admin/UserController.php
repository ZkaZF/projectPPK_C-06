<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Get all users, or filter by status=pending
     */
    public function index(Request $request)
    {
        $query = User::with('role', 'userStatus');
        
        if ($request->query('status') === 'pending') {
            $query->where('u_stat_id', 1); // 1 = pending
        }

        $users = $query->orderBy('created_at', 'desc')->get()->map(function ($user) {
            return [
                'user_id' => $user->user_id,
                'user_name' => $user->full_name,
                'user_email' => $user->email,
                'user_nim' => $user->nim_nip,
                'created_at' => $user->created_at,
                'is_verified' => $user->u_stat_id === 2, // 2 = active
                'role' => [
                    'role_name' => $user->role ? $user->role->role_name : 'pengguna',
                ],
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Admin creates a new user
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_name' => 'required|string|max:255',
            'user_email' => 'required|email|unique:users,email',
            'user_password' => 'required|string|min:8',
            'role' => 'required|in:pengguna,petugas,admin',
        ]);

        $roleId = 1;
        if ($validated['role'] === 'petugas') $roleId = 2;
        if ($validated['role'] === 'admin') $roleId = 3;

        $user = User::create([
            'full_name' => $validated['user_name'],
            'email' => $validated['user_email'],
            'user_password' => $validated['user_password'], // will be hashed by Model cast
            'role_id' => $roleId,
            'u_stat_id' => 2, // Created by admin, immediately active
        ]);

        return response()->json([
            'success' => true,
            'data' => $user
        ], 201);
    }

    /**
     * Verify a pending user
     */
    public function verify($id)
    {
        $user = User::findOrFail($id);
        $user->u_stat_id = 2; // active
        $user->save();

        return response()->json(['success' => true]);
    }

    /**
     * Reject a pending user
     */
    public function reject(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->u_stat_id = 3; // rejected
        $user->save();

        return response()->json(['success' => true]);
    }
}
