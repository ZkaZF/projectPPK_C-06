<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * ReportCategory
 *
 * Lookup table for report categories.
 * Possible values: kerusakan_ringan (minor damage), kerusakan_berat (major damage),
 * kebersihan (cleanliness), keamanan (security), lainnya (other).
 *
 * This table has no timestamps since its values are seeded and rarely change.
 */
class ReportCategory extends Model
{
    /** Custom primary key column name. */
    protected $primaryKey = 'rep_cat_id';

    /** This lookup table does not use created_at / updated_at. */
    public $timestamps = false;

    /** Columns that may be mass-assigned. */
    protected $fillable = ['rep_cat_name'];

    /**
     * All reports classified under this category.
     * One category can apply to many reports.
     */
    public function reports()
    {
        return $this->hasMany(Report::class, 'rep_cat_id', 'rep_cat_id');
    }
}
