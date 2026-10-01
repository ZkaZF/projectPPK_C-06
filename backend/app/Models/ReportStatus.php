<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * ReportStatus
 *
 * Lookup table for report lifecycle statuses.
 * Possible values: baru (new), diproses (in progress), selesai (done), ditolak (rejected).
 *
 * Status transitions are enforced by ReportController::TRANSITIONS — not by the DB.
 * This table has no timestamps since its values are seeded and rarely change.
 */
class ReportStatus extends Model
{
    /** Custom primary key column name. */
    protected $primaryKey = 'rep_stat_id';

    /** This lookup table does not use created_at / updated_at. */
    public $timestamps = false;

    /** Columns that may be mass-assigned. */
    protected $fillable = ['rep_status_name'];

    /**
     * All reports currently assigned this status.
     * One status can apply to many reports at the same time.
     */
    public function reports()
    {
        return $this->hasMany(Report::class, 'rep_stat_id', 'rep_stat_id');
    }
}
