<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Lookup: jenis fasilitas (ruang_kelas, aula, laboratorium, alat, lapangan) */
class FacilityType extends Model
{
    protected $primaryKey = 'fac_type_id';
    public $timestamps = false;
    protected $fillable = ['fac_type_name'];

    public function facilities()
    {
        return $this->hasMany(Facility::class, 'fac_type_id', 'fac_type_id');
    }
}
