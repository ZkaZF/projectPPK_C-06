<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Lookup: status user (pending, active, rejected) */
class UserStatus extends Model
{
    protected $primaryKey = 'u_stat_id';
    public $timestamps = false;
    protected $fillable = ['u_status_name'];

    public function users()
    {
        return $this->hasMany(User::class, 'u_stat_id', 'u_stat_id');
    }
}
