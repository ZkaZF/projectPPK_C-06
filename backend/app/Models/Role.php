<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Lookup: role user (pengguna, petugas, admin) */
class Role extends Model
{
    protected $primaryKey = 'role_id';
    public $timestamps = false;
    protected $fillable = ['role_name'];

    public function users()
    {
        return $this->hasMany(User::class, 'role_id', 'role_id');
    }
}
