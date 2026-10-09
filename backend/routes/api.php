<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

// ─── Authentication Routes ───────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me',      [AuthController::class, 'me']);
    });
});

// ─── Facility Routes ─────────────────────────────────────────────────────────
// Public
Route::get('/facilities',             [FacilityController::class, 'index']);
Route::get('/facilities/{id}',        [FacilityController::class, 'show']);
Route::get('/facilities/{id}/slots',  [FacilityController::class, 'slots']);

// Admin only
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/facilities',            [FacilityController::class, 'store']);
    Route::put('/facilities/{id}',        [FacilityController::class, 'update']);
    
    // Admin User Management
    Route::get('/admin/users',            [\App\Http\Controllers\Admin\UserController::class, 'index']);
    Route::post('/admin/users',           [\App\Http\Controllers\Admin\UserController::class, 'store']);
    Route::patch('/admin/users/{id}/verify', [\App\Http\Controllers\Admin\UserController::class, 'verify']);
    Route::patch('/admin/users/{id}/reject', [\App\Http\Controllers\Admin\UserController::class, 'reject']);
    
    // Admin Recap
    Route::get('/admin/recap',            [\App\Http\Controllers\Admin\RecapController::class, 'index']);
    Route::get('/admin/recap/export',     [\App\Http\Controllers\Admin\RecapController::class, 'export']);
});

// Petugas or Admin
Route::middleware(['auth:sanctum', 'role:petugas,admin'])->group(function () {
    Route::patch('/facilities/{id}/status', [FacilityController::class, 'updateStatus']);
});

// ─── Reservation Routes ──────────────────────────────────────────────────────
// Semua user terautentikasi
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post  ('/reservations',            [ReservationController::class, 'store']);
    Route::get   ('/reservations/my',         [ReservationController::class, 'myList']);
    Route::get   ('/reservations/{id}',       [ReservationController::class, 'show'])->whereNumber('id');
    Route::patch ('/reservations/{id}/cancel',[ReservationController::class, 'cancel']);
});

// Petugas or Admin
Route::middleware(['auth:sanctum', 'role:petugas,admin'])->group(function () {
    Route::get   ('/reservations/queue',                [ReservationController::class, 'queue']);
    Route::patch ('/reservations/{id}/approve',         [ReservationController::class, 'approve']);
    Route::patch ('/reservations/{id}/reject',          [ReservationController::class, 'reject']);
    Route::patch ('/reservations/{id}/force-cancel',    [ReservationController::class, 'forceCancel']);
});

// ─── Report Routes ───────────────────────────────────────────────────────────
// Semua user terautentikasi
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get ('/report-categories', [ReportController::class, 'categories']);
    Route::post('/reports',           [ReportController::class, 'store']);
    Route::get ('/reports/my',        [ReportController::class, 'myList']);
});

// Petugas or Admin
Route::middleware(['auth:sanctum', 'role:petugas,admin'])->group(function () {
    Route::get   ('/reports/queue',          [ReportController::class, 'queue']);
    Route::patch ('/reports/{id}/status',    [ReportController::class, 'updateStatus']);
});