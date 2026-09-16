<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Lookup: status fasilitas (aktif, dalam_perbaikan, nonaktif) */
class FacilityStatus extends Model
{
    protected $primaryKey = 'fac_stat_id';
    public $timestamps = false;
    protected $fillable = ['fac_status_name'];

    public function facilities()
    {
        return $this->hasMany(Facility::class, 'fac_stat_id', 'fac_stat_id');
    }
}
