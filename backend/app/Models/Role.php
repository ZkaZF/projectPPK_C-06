<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Role
 *
 * Lookup table for user roles.
 * Possible values: pengguna (regular user), petugas (staff), admin.
 *
 * Roles determine which API endpoints and actions a user may access,
 * enforced by RoleMiddleware. This table has no timestamps.
 */
class Role extends Model
{
    /** Custom primary key column name. */
    protected $primaryKey = 'role_id';

    /** This lookup table does not use created_at / updated_at. */
    public $timestamps = false;

    /** Columns that may be mass-assigned. */
    protected $fillable = ['role_name'];

    /**
     * All users assigned this role.
     * One role can be assigned to many users.
     */
    public function users()
    {
        return $this->hasMany(User::class, 'role_id', 'role_id');
    }
}
