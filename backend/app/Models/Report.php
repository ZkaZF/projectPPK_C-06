<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    /**
     * Primary key kolom tabel reports.
     */
    protected $primaryKey = 'rep_id';

    /**
     * Kolom yang boleh diisi secara mass-assignment.
     */
    protected $fillable = [
        'user_id',
        'fac_id',
        'rep_cat_id',
        'rep_description',
        'rep_photo',
        'rep_stat_id',
        'handled_by',
        'rep_resolution_note',
    ];

    // ─── Relasi ke tabel utama ────────────────────────────────────────────────

    /** Pengguna yang membuat laporan ini */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /** Fasilitas yang dilaporkan */
    public function facility()
    {
        return $this->belongsTo(Facility::class, 'fac_id', 'fac_id');
    }

    /** Petugas yang menangani laporan ini */
    public function handler()
    {
        return $this->belongsTo(User::class, 'handled_by', 'user_id');
    }

    // ─── Relasi ke tabel lookup ───────────────────────────────────────────────

    /** Kategori laporan (kerusakan_ringan, kerusakan_berat, dll.) */
    public function category()
    {
        return $this->belongsTo(ReportCategory::class, 'rep_cat_id', 'rep_cat_id');
    }

    /** Status laporan (baru, diproses, selesai, ditolak) */
    public function reportStatus()
    {
        return $this->belongsTo(ReportStatus::class, 'rep_stat_id', 'rep_stat_id');
    }
}
