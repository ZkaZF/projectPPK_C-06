<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Lookup: status reservasi (pending, approved, rejected, cancelled) */
class ReservationStatus extends Model
{
    protected $primaryKey = 'res_stat_id';
    public $timestamps = false;
    protected $fillable = ['res_status_name'];
}
