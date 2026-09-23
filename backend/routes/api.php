<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\FacilityController;
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
