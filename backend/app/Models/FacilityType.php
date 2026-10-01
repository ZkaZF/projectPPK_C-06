<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * FacilityType
 *
 * Lookup table for facility types.
 * Possible values: ruang_kelas (classroom), aula (hall), laboratorium, alat (equipment), lapangan (field).
 *
 * This table has no timestamps since its values are seeded and rarely change.
 */
class FacilityType extends Model
{
    /** Custom primary key column name. */
    protected $primaryKey = 'fac_type_id';

    /** This lookup table does not use created_at / updated_at. */
    public $timestamps = false;

    /** Columns that may be mass-assigned. */
    protected $fillable = ['fac_type_name'];

    /**
     * All facilities classified under this type.
     * One type can apply to many facilities.
     */
    public function facilities()
    {
        return $this->hasMany(Facility::class, 'fac_type_id', 'fac_type_id');
    }
}
