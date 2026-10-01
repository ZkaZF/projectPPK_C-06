<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\ReservationStatus;
use App\Http\Requests\StoreReservationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * ReservationController
 *
 * Handles all facility reservation operations.
 * Endpoints are grouped by the role permitted to access them:
 *
 *   All authenticated users (pengguna):
 *     - store()       Submit a new reservation request
 *     - myList()      View the current user's own reservation history
 *     - show()        View the details of a single reservation
 *     - cancel()      Cancel one of the user's own reservations
 *
 *   Petugas / Admin (staff):
 *     - queue()       View the list of reservations awaiting approval
 *     - approve()     Approve a pending reservation (with conflict check)
 *     - reject()      Reject a pending reservation with an optional reason
 *     - forceCancel() Force-cancel an already-approved reservation with a mandatory reason
 */
class ReservationController extends Controller
{
    // ─── Private helper ───────────────────────────────────────────────────────

    /**
     * Check whether a time slot conflicts with any existing approved reservation.
     *
     * Uses the standard interval overlap condition:
     *   slot overlaps an existing booking if  slotStart < existingEnd  AND  slotEnd > existingStart
     *
     * The optional $excludeId parameter allows a reservation to be excluded from
     * the check — useful when re-validating an existing record (e.g. during approve).
     *
     * @param  int         $facilityId  The facility to check against
     * @param  string      $date        Reservation date (YYYY-MM-DD)
     * @param  string      $start       Slot start time (HH:MM)
     * @param  string      $end         Slot end time (HH:MM)
     * @param  int|null    $excludeId   A res_id to exclude from the conflict query (optional)
     * @return bool                     true if a conflict exists, false if the slot is free
     */
    private function hasConflict(int $facilityId, string $date, string $start, string $end, ?int $excludeId = null): bool
    {
        // Look up the "approved" status ID from the lookup table.
        $approvedStatusId = ReservationStatus::where('res_status_name', 'approved')->value('res_stat_id');

        $query = Reservation::where('fac_id', $facilityId)
            ->where('res_date', $date)
            ->where('res_stat_id', $approvedStatusId)
            ->where(function ($q) use ($start, $end) {
                // Overlap condition: new slot starts before an existing booking ends
                // AND new slot ends after the existing booking starts.
                $q->where('res_start', '<', $end)
                  ->where('res_end', '>', $start);
            });

        // Exclude a specific reservation from the check (used when approving an existing record).
        if ($excludeId) {
            $query->where('res_id', '!=', $excludeId);
        }

        return $query->exists();
    }

    // ─── User: submit a new reservation ──────────────────────────────────────

    /**
     * Submit a new facility reservation request.
     *
     * Steps performed:
     *   1. Run a conflict check against all existing approved reservations.
     *      Returns 422 immediately if the requested slot is already taken.
     *   2. Look up the "pending" status ID from the reservation_statuses table.
     *   3. Create the reservation record. The reservation starts as "pending"
     *      and must be approved by staff before it is confirmed.
     *
     * @param  \App\Http\Requests\StoreReservationRequest  $request  Validated payload (facility_id, reservation_date, start_time, end_time, purpose)
     * @return \Illuminate\Http\JsonResponse               201 with created reservation, or 422 if the slot conflicts
     */
    public function store(StoreReservationRequest $request)
    {
        $validated = $request->validated();
        $user      = Auth::user();

        // Reject immediately if the requested slot overlaps with an approved booking.
        if ($this->hasConflict(
            $validated['facility_id'],
            $validated['reservation_date'],
            $validated['start_time'],
            $validated['end_time']
        )) {
            return response()->json(['message' => 'The requested time slot is already taken.'], 422);
        }

        // Fetch the "pending" status ID from the lookup table.
        $pendingStatusId = ReservationStatus::where('res_status_name', 'pending')->value('res_stat_id');

        // Create the reservation with "pending" as the initial status.
        $reservation = Reservation::create([
            'user_id'     => $user->user_id,
            'fac_id'      => $validated['facility_id'],
            'res_date'    => $validated['reservation_date'],
            'res_start'   => $validated['start_time'],
            'res_end'     => $validated['end_time'],
            'res_purpose' => $validated['purpose'],
            'res_stat_id' => $pendingStatusId,
        ]);

        return response()->json([
            'message' => 'Reservation submitted and is awaiting approval.',
            'data'    => $reservation->load(['facility', 'reservationStatus']),
        ], 201);
    }

    // ─── User: list own reservations ─────────────────────────────────────────

    /**
     * Return all reservations belonging to the currently authenticated user.
     *
     * Fetches all reservations regardless of their status (pending, approved,
     * rejected, cancelled), ordered newest-first. Useful for displaying a
     * personal reservation history or dashboard.
     *
     * @param  \Illuminate\Http\Request  $request  Incoming HTTP request (requires auth:sanctum)
     * @return \Illuminate\Http\JsonResponse        200 with an array of reservations
     */
    public function myList(Request $request)
    {
        $user = Auth::user();

        $reservations = Reservation::with(['facility', 'reservationStatus'])
            ->where('user_id', $user->user_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $reservations]);
    }

    // ─── User / Staff: view a single reservation ─────────────────────────────

    /**
     * Return the full details of a single reservation.
     *
     * Access control:
     *   - Regular users (pengguna) can only view their own reservations.
     *   - Staff (petugas) and admins can view any reservation.
     *
     * Returns 403 if a regular user tries to access another user's reservation.
     *
     * @param  int|string  $id  The reservation's primary key (res_id)
     * @return \Illuminate\Http\JsonResponse  200 with reservation details, 403 if forbidden, 404 if not found
     */
    public function show($id)
    {
        // Eager-load related models so the response includes all relevant details.
        $reservation = Reservation::with(['facility', 'reservationStatus', 'user'])
            ->findOrFail($id);

        // Enforce ownership: only the owner, petugas, or admin may view this record.
        $user = Auth::user();
        if ($reservation->user_id !== $user->user_id && !in_array($user->role->role_name, ['petugas', 'admin'])) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return response()->json(['data' => $reservation]);
    }

    // ─── User: cancel own reservation ────────────────────────────────────────

    /**
     * Cancel one of the authenticated user's own reservations.
     *
     * Validation steps:
     *   1. Ownership check: only the user who created the reservation may cancel it.
     *   2. Status check: only "pending" or "approved" reservations can be cancelled.
     *      Already-rejected or cancelled reservations cannot be acted upon again.
     *
     * @param  int|string  $id  The reservation's primary key (res_id)
     * @return \Illuminate\Http\JsonResponse  200 on success, 403 if not the owner, 422 if status is not cancellable
     */
    public function cancel($id)
    {
        $reservation = Reservation::findOrFail($id);
        $user        = Auth::user();

        // Ownership check: prevent users from cancelling other users' reservations.
        if ($reservation->user_id !== $user->user_id) {
            return response()->json(['message' => 'You are not authorised to cancel this reservation.'], 403);
        }

        // Status check: only cancellable statuses are "pending" and "approved".
        $statusName = $reservation->reservationStatus?->res_status_name;
        if (!in_array($statusName, ['pending', 'approved'])) {
            return response()->json(['message' => 'Only pending or approved reservations can be cancelled.'], 422);
        }

        // Fetch the "cancelled" status ID and apply it.
        $cancelledStatusId = ReservationStatus::where('res_status_name', 'cancelled')->value('res_stat_id');
        $reservation->update(['res_stat_id' => $cancelledStatusId]);

        return response()->json(['message' => 'Reservation cancelled successfully.']);
    }

    // ─── Staff: pending reservation queue ────────────────────────────────────

    /**
     * Return the list of reservations currently awaiting staff approval.
     *
     * Fetches all reservations with "pending" status, ordered oldest-first (FIFO)
     * so that requests waiting the longest are handled first. The user and
     * facility relations are eager-loaded for display purposes.
     *
     * @param  \Illuminate\Http\Request  $request  Incoming HTTP request (requires petugas/admin role)
     * @return \Illuminate\Http\JsonResponse        200 with an array of pending reservations
     */
    public function queue(Request $request)
    {
        $pendingStatusId = ReservationStatus::where('res_status_name', 'pending')->value('res_stat_id');

        $reservations = Reservation::with(['facility', 'user', 'reservationStatus'])
            ->where('res_stat_id', $pendingStatusId)
            ->orderBy('created_at', 'asc') // FIFO: oldest request handled first
            ->get();

        return response()->json(['data' => $reservations]);
    }

    // ─── Staff: approve a reservation ────────────────────────────────────────

    /**
     * Approve a pending reservation (staff/admin only).
     *
     * Before approving, a second conflict check is performed against all currently
     * approved reservations (excluding the reservation itself). This guards against
     * race conditions where two pending reservations for the same slot both pass
     * the initial store() check before either is approved.
     *
     * The processed_by field is set to the current user (staff member) for auditing.
     *
     * @param  int|string  $id  The reservation's primary key (res_id)
     * @return \Illuminate\Http\JsonResponse  200 on success, 422 if not pending or if a conflict exists, 404 if not found
     */
    public function approve($id)
    {
        $reservation = Reservation::with('reservationStatus')->findOrFail($id);

        // Guard clause: only pending reservations can be approved.
        if ($reservation->reservationStatus?->res_status_name !== 'pending') {
            return response()->json(['message' => 'Only pending reservations can be approved.'], 422);
        }

        // Run conflict check before finalising approval to prevent double-bookings.
        if ($this->hasConflict($reservation->fac_id, $reservation->res_date, $reservation->res_start, $reservation->res_end, $reservation->res_id)) {
            return response()->json(['message' => 'This slot conflicts with an already-approved reservation.'], 422);
        }

        $approvedStatusId = ReservationStatus::where('res_status_name', 'approved')->value('res_stat_id');

        // Update status and record which staff member approved it.
        $reservation->update([
            'res_stat_id'  => $approvedStatusId,
            'processed_by' => Auth::user()->user_id,
        ]);

        return response()->json([
            'message' => 'Reservation approved successfully.',
            'data'    => $reservation->fresh(['reservationStatus']),
        ]);
    }

    // ─── Staff: reject a reservation ─────────────────────────────────────────

    /**
     * Reject a pending reservation with an optional reason (staff/admin only).
     *
     * The cancel_reason is stored in res_cancel_reason so the user can see
     * why their request was denied. The processed_by field is set to the
     * current staff member for auditing purposes.
     *
     * @param  int|string               $id      The reservation's primary key (res_id)
     * @param  \Illuminate\Http\Request $request Optionally contains cancel_reason (max 500 chars)
     * @return \Illuminate\Http\JsonResponse      200 on success, 422 if not pending, 404 if not found
     */
    public function reject($id, Request $request)
    {
        $request->validate(['cancel_reason' => 'nullable|string|max:500']);

        $reservation = Reservation::with('reservationStatus')->findOrFail($id);

        // Guard clause: only pending reservations can be rejected.
        if ($reservation->reservationStatus?->res_status_name !== 'pending') {
            return response()->json(['message' => 'Only pending reservations can be rejected.'], 422);
        }

        $rejectedStatusId = ReservationStatus::where('res_status_name', 'rejected')->value('res_stat_id');

        $reservation->update([
            'res_stat_id'       => $rejectedStatusId,
            'processed_by'      => Auth::user()->user_id,
            'res_cancel_reason' => $request->cancel_reason,
        ]);

        return response()->json(['message' => 'Reservation rejected successfully.']);
    }

    // ─── Staff: force-cancel an approved reservation ──────────────────────────

    /**
     * Force-cancel an already-approved reservation with a mandatory reason (staff/admin only).
     *
     * Used when an approved booking must be revoked — for example, due to a
     * facility emergency or an unresolvable scheduling conflict. A reason is
     * required (min 5 chars) and stored in res_cancel_reason for transparency.
     *
     * @param  int|string               $id      The reservation's primary key (res_id)
     * @param  \Illuminate\Http\Request $request Must contain cancel_reason (5–500 chars)
     * @return \Illuminate\Http\JsonResponse      200 on success, 422 if not approved, 404 if not found
     */
    public function forceCancel($id, Request $request)
    {
        $request->validate(['cancel_reason' => 'required|string|min:5|max:500']);

        $reservation = Reservation::with('reservationStatus')->findOrFail($id);

        // Guard clause: force-cancel only applies to approved reservations.
        if ($reservation->reservationStatus?->res_status_name !== 'approved') {
            return response()->json(['message' => 'Only approved reservations can be force-cancelled.'], 422);
        }

        $cancelledStatusId = ReservationStatus::where('res_status_name', 'cancelled')->value('res_stat_id');

        $reservation->update([
            'res_stat_id'       => $cancelledStatusId,
            'processed_by'      => Auth::user()->user_id,
            'res_cancel_reason' => $request->cancel_reason,
        ]);

        return response()->json(['message' => 'Reservation force-cancelled successfully.']);
    }
}