<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    use HasFactory;

    /**
     * Primary key kolom tabel facilities.
     */
    protected $primaryKey = 'fac_id';

    /**
     * Kolom yang boleh diisi secara mass-assignment.
     */
    protected $fillable = [
        'fac_name',
        'fac_type_id',
        'fac_location',
        'fac_capacity',
        'fac_description',
        'fac_stat_id',
        'fac_image',
    ];

    // ─── Relasi ke tabel lookup ───────────────────────────────────────────────

    /** Jenis fasilitas (ruang_kelas, aula, lab, alat, lapangan) */
    public function type()
    {
        return $this->belongsTo(FacilityType::class, 'fac_type_id', 'fac_type_id');
    }

    /** Status fasilitas (aktif, dalam_perbaikan, nonaktif) */
    public function status()
    {
        return $this->belongsTo(FacilityStatus::class, 'fac_stat_id', 'fac_stat_id');
    }

    // ─── Relasi ke tabel utama ────────────────────────────────────────────────

    /** Semua reservasi untuk fasilitas ini */
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'fac_id', 'fac_id');
    }

    /** Semua laporan kerusakan untuk fasilitas ini */
    public function reports()
    {
        return $this->hasMany(Report::class, 'fac_id', 'fac_id');
    }
}
