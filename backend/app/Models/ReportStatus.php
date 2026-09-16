<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Lookup: status laporan (baru, diproses, selesai, ditolak) */
class ReportStatus extends Model
{
    protected $primaryKey = 'rep_stat_id';
    public $timestamps = false;
    protected $fillable = ['rep_status_name'];

    public function reports()
    {
        return $this->hasMany(Report::class, 'rep_stat_id', 'rep_stat_id');
    }
}
