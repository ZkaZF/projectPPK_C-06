<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Lookup: kategori laporan (kerusakan_ringan, kerusakan_berat, kebersihan, keamanan, lainnya) */
class ReportCategory extends Model
{
    protected $primaryKey = 'rep_cat_id';
    public $timestamps = false;
    protected $fillable = ['rep_cat_name'];

    public function reports()
    {
        return $this->hasMany(Report::class, 'rep_cat_id', 'rep_cat_id');
    }
}
