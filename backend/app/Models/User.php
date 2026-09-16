<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Primary key kolom tabel users.
     */
    protected $primaryKey = 'user_id';

    /**
     * Kolom yang boleh diisi secara mass-assignment.
     */
    protected $fillable = [
        'full_name',
        'email',
        'user_password',
        'role_id',
        'nim_nip',
        'u_stat_id',
    ];

    /**
     * Kolom yang disembunyikan saat serialisasi (response JSON).
     */
    protected $hidden = [
        'user_password',
        'remember_token',
    ];

    /**
     * Nama kolom password untuk Laravel Auth.
     * (default Laravel adalah 'password', kita pakai 'user_password')
     */
    protected $authPasswordName = 'user_password';

    /**
     * Cast tipe data kolom.
     */
    protected $casts = [
        'user_password' => 'hashed',
    ];

    // ─── Relasi ke tabel lookup ───────────────────────────────────────────────

    /** Role user (pengguna, petugas, admin) */
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'role_id');
    }

    /** Status user (pending, active, rejected) */
    public function userStatus()
    {
        return $this->belongsTo(UserStatus::class, 'u_stat_id', 'u_stat_id');
    }

    // ─── Relasi ke tabel utama ────────────────────────────────────────────────

    /** Reservasi yang diajukan user ini */
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'user_id', 'user_id');
    }

    /** Laporan yang dibuat user ini */
    public function reports()
    {
        return $this->hasMany(Report::class, 'user_id', 'user_id');
    }

    /** Reservasi yang diproses user ini (sebagai petugas) */
    public function processedReservations()
    {
        return $this->hasMany(Reservation::class, 'processed_by', 'user_id');
    }

    /** Laporan yang ditangani user ini (sebagai petugas) */
    public function handledReports()
    {
        return $this->hasMany(Report::class, 'handled_by', 'user_id');
    }
}
