<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * UserStatus
 *
 * Lookup table for user account statuses.
 * Possible values: pending (awaiting admin verification), active, rejected.
 *
 * New registrations start as "pending". The EnsureUserIsActive middleware
 * blocks login for users who are not "active". This table has no timestamps.
 */
class UserStatus extends Model
{
    /** Custom primary key column name. */
    protected $primaryKey = 'u_stat_id';

    /** This lookup table does not use created_at / updated_at. */
    public $timestamps = false;

    /** Columns that may be mass-assigned. */
    protected $fillable = ['u_status_name'];

    /**
     * All users currently assigned this status.
     * One status can apply to many users at the same time.
     */
    public function users()
    {
        return $this->hasMany(User::class, 'u_stat_id', 'u_stat_id');
    }
}
