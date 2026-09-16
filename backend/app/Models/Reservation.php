<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    /**
     * Primary key kolom tabel reservations.
     */
    protected $primaryKey = 'res_id';

    /**
     * Kolom yang boleh diisi secara mass-assignment.
     */
    protected $fillable = [
        'user_id',
        'fac_id',
        'res_date',
        'res_start',
        'res_end',
        'res_purpose',
        'res_stat_id',
        'processed_by',
        'res_cancel_reason',
    ];

    /**
     * Cast tipe data kolom.
     */
    protected $casts = [
        'res_date' => 'date',
    ];

    // ─── Relasi ke tabel utama ────────────────────────────────────────────────

    /** Pengguna yang mengajukan reservasi ini */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /** Fasilitas yang direservasi */
    public function facility()
    {
        return $this->belongsTo(Facility::class, 'fac_id', 'fac_id');
    }

    /** Petugas yang memproses (approve/reject) reservasi ini */
    public function processor()
    {
        return $this->belongsTo(User::class, 'processed_by', 'user_id');
    }

    // ─── Relasi ke tabel lookup ───────────────────────────────────────────────

    /** Status reservasi (pending, approved, rejected, cancelled) */
    public function reservationStatus()
    {
        return $this->belongsTo(ReservationStatus::class, 'res_stat_id', 'res_stat_id');
    }
}
