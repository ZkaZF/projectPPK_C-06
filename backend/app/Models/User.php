<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * User
 *
 * Represents a registered user of the application.
 * Users can have one of three roles: pengguna (regular user), petugas (staff), or admin.
 * New users start with a "pending" status and must be verified by an admin before they can log in.
 *
 * Authentication is handled by Laravel Sanctum (token-based).
 * The custom password column name ("user_password") is declared via $authPasswordName.
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /** Custom primary key column name (not the default "id"). */
    protected $primaryKey = 'user_id';

    /** Columns that may be mass-assigned. */
    protected $fillable = [
        'full_name',
        'email',
        'user_password',
        'role_id',
        'nim_nip',
        'u_stat_id',
    ];

    /**
     * Columns hidden from JSON serialisation (API responses).
     * Passwords and remember tokens must never be exposed to clients.
     */
    protected $hidden = [
        'user_password',
        'remember_token',
    ];

    /**
     * Tells Laravel Auth which column holds the password hash.
     * The default is "password"; we override it to "user_password".
     */
    protected $authPasswordName = 'user_password';

    /**
     * Column type casts.
     * "hashed" automatically bcrypt-hashes the value when it is set via mass-assignment.
     */
    protected $casts = [
        'user_password' => 'hashed',
    ];

    // ─── Lookup table relations ───────────────────────────────────────────────

    /**
     * The role assigned to this user (pengguna, petugas, or admin).
     * FK: role_id → roles.role_id
     */
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'role_id');
    }

    /**
     * The account status of this user (pending, active, or rejected).
     * FK: u_stat_id → user_statuses.u_stat_id
     */
    public function userStatus()
    {
        return $this->belongsTo(UserStatus::class, 'u_stat_id', 'u_stat_id');
    }

    // ─── Main table relations ─────────────────────────────────────────────────

    /**
     * All facility reservations submitted by this user.
     * One user can have many reservations over time.
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'user_id', 'user_id');
    }

    /**
     * All damage/issue reports filed by this user.
     * One user can file many reports over time.
     */
    public function reports()
    {
        return $this->hasMany(Report::class, 'user_id', 'user_id');
    }

    /**
     * All reservations processed (approved/rejected) by this user in their staff role.
     * FK: processed_by → reservations.user_id
     */
    public function processedReservations()
    {
        return $this->hasMany(Reservation::class, 'processed_by', 'user_id');
    }

    /**
     * All reports handled by this user in their staff role.
     * FK: handled_by → reports.user_id
     */
    public function handledReports()
    {
        return $this->hasMany(Report::class, 'handled_by', 'user_id');
    }
}
