<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * ReservationStatus
 *
 * Lookup table for reservation lifecycle statuses.
 * Possible values: pending, approved, rejected, cancelled.
 *
 * This table has no timestamps since its values are seeded and rarely change.
 */
class ReservationStatus extends Model
{
    /** Custom primary key column name. */
    protected $primaryKey = 'res_stat_id';

    /** This lookup table does not use created_at / updated_at. */
    public $timestamps = false;

    /** Columns that may be mass-assigned. */
    protected $fillable = ['res_status_name'];
}
