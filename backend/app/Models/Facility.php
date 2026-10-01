<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Facility
 *
 * Represents a campus facility that can be reserved or reported.
 * Examples: ruang_kelas (classroom), aula (hall), laboratorium, alat (equipment), lapangan (field).
 */
class Facility extends Model
{
    use HasFactory;

    /** Custom primary key column name (not the default "id"). */
    protected $primaryKey = 'fac_id';

    /** Columns that may be mass-assigned. */
    protected $fillable = [
        'fac_name',
        'fac_type_id',
        'fac_location',
        'fac_capacity',
        'fac_description',
        'fac_stat_id',
        'fac_image',
    ];

    // ─── Lookup table relations ───────────────────────────────────────────────

    /**
     * The type of this facility (e.g. ruang_kelas, aula, laboratorium, alat, lapangan).
     * FK: fac_type_id → facility_types.fac_type_id
     */
    public function type()
    {
        return $this->belongsTo(FacilityType::class, 'fac_type_id', 'fac_type_id');
    }

    /**
     * The operational status of this facility (e.g. aktif, dalam_perbaikan, nonaktif).
     * FK: fac_stat_id → facility_statuses.fac_stat_id
     */
    public function status()
    {
        return $this->belongsTo(FacilityStatus::class, 'fac_stat_id', 'fac_stat_id');
    }

    // ─── Main table relations ─────────────────────────────────────────────────

    /**
     * All reservations made for this facility.
     * One facility can have many reservations over time.
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'fac_id', 'fac_id');
    }

    /**
     * All damage/issue reports filed for this facility.
     * One facility can have many reports over time.
     */
    public function reports()
    {
        return $this->hasMany(Report::class, 'fac_id', 'fac_id');
    }
}
