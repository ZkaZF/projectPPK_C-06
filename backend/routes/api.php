<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\Route;

// ─── Authentication Routes ───────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    // public routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // protected routes requiring sanctum token
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

// ─── Facility Routes ─────────────────────────────────────────────────────────
// Public routes (no auth required)
Route::get('/facilities', [FacilityController::class, 'index']);
Route::get('/facilities/{id}', [FacilityController::class, 'show']);
Route::get('/facilities/{id}/slots', [FacilityController::class, 'slots']);

// Protected routes (admin only)
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/facilities', [FacilityController::class, 'store']);
    Route::put('/facilities/{id}', [FacilityController::class, 'update']);
});

// Protected route (petugas or admin)
Route::middleware(['auth:sanctum', 'role:petugas,admin'])->group(function () {
    Route::patch('/facilities/{id}/status', [FacilityController::class, 'updateStatus']);
});

// ─── Reservation Routes ──────────────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'active'])->group(function () {
    // pengguna routes — static paths first
    Route::get('/reservations/my', [ReservationController::class, 'myList']);
    Route::post('/reservations', [ReservationController::class, 'store']);

    // petugas / admin routes — static/prefixed paths, must come before {id}
    Route::middleware(['role:petugas,admin'])->group(function () {
        Route::get('/reservations/queue', [ReservationController::class, 'queue']);
        Route::get('/reservations/approved', [ReservationController::class, 'approved']);
        Route::patch('/reservations/{id}/approve', [ReservationController::class, 'approve']);
        Route::patch('/reservations/{id}/reject', [ReservationController::class, 'reject']);
        Route::patch('/reservations/{id}/force-cancel', [ReservationController::class, 'forceCancel']);
    });

    // wildcard routes last
    Route::get('/reservations/{id}', [ReservationController::class, 'show']);
    Route::patch('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);
});