<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * FacilityStatus
 *
 * Lookup table for facility operational statuses.
 * Possible values: aktif (active), dalam_perbaikan (under maintenance), nonaktif (inactive).
 *
 * This table has no timestamps since its values are seeded and rarely change.
 */
class FacilityStatus extends Model
{
    /** Custom primary key column name. */
    protected $primaryKey = 'fac_stat_id';

    /** This lookup table does not use created_at / updated_at. */
    public $timestamps = false;

    /** Columns that may be mass-assigned. */
    protected $fillable = ['fac_status_name'];

    /**
     * All facilities currently assigned this status.
     * One status can apply to many facilities at once.
     */
    public function facilities()
    {
        return $this->hasMany(Facility::class, 'fac_stat_id', 'fac_stat_id');
    }
}
