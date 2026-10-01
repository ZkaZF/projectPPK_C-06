<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Reservation
 *
 * Represents a facility booking request made by a user.
 * A reservation starts as "pending", is then approved or rejected by staff,
 * and may later be cancelled by the user or force-cancelled by staff.
 */
class Reservation extends Model
{
    use HasFactory;

    /** Custom primary key column name (not the default "id"). */
    protected $primaryKey = 'res_id';

    /** Columns that may be mass-assigned. */
    protected $fillable = [
        'user_id',
        'fac_id',
        'res_date',
        'res_start',
        'res_end',
        'res_purpose',
        'res_stat_id',
        'processed_by',      // nullable — set when a staff member approves/rejects
        'res_cancel_reason', // nullable — reason stored when rejected or force-cancelled
    ];

    /** Automatically cast res_date to a Carbon date instance. */
    protected $casts = [
        'res_date' => 'date',
    ];

    // ─── Main table relations ─────────────────────────────────────────────────

    /**
     * The user who submitted this reservation request.
     * FK: user_id → users.user_id
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * The facility being reserved.
     * FK: fac_id → facilities.fac_id
     */
    public function facility()
    {
        return $this->belongsTo(Facility::class, 'fac_id', 'fac_id');
    }

    /**
     * The staff member (petugas/admin) who approved or rejected this reservation.
     * FK: processed_by → users.user_id — nullable until a staff member acts on it.
     */
    public function processor()
    {
        return $this->belongsTo(User::class, 'processed_by', 'user_id');
    }

    // ─── Lookup table relations ───────────────────────────────────────────────

    /**
     * The current lifecycle status of this reservation (pending, approved, rejected, cancelled).
     * FK: res_stat_id → reservation_statuses.res_stat_id
     */
    public function reservationStatus()
    {
        return $this->belongsTo(ReservationStatus::class, 'res_stat_id', 'res_stat_id');
    }
}
