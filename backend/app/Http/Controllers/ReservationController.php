<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReservationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    // pengguna methods

    // submit new reservation request
    public function store(StoreReservationRequest $request)
    {
        // validate request data
        $validated = $request->validated();

        // check if approved reservation status exists
        $approvedstatus = DB::select('select res_stat_id from reservation_statuses where res_status_name = ? limit 1', ['approved']);

        if (empty($approvedstatus)) {
            return response()->json(['message' => 'status not found'], 500);
        }

        $approvedstatid = $approvedstatus[0]->res_stat_id;

        // conflict check using prepared statement
        $hasconflict = DB::select('
            select 1 from reservations 
            where fac_id = ? 
              and res_date = ? 
              and res_stat_id = ? 
              and res_start < ? 
              and res_end > ? 
            limit 1', 
            [
                $validated['fac_id'],
                $validated['res_date'],
                $approvedstatid,
                $validated['res_end'],
                $validated['res_start']
            ]
        );

        if (! empty($hasconflict)) {
            return response()->json([
                'message' => 'slot is already booked for this time period.'
            ], 422);
        }

        // get pending status id
        $pendingstatus = DB::select('select res_stat_id from reservation_statuses where res_status_name = ? limit 1', ['pending']);
        $pendingstatid = $pendingstatus[0]->res_stat_id;

        // insert new reservation record using prepared statement
        DB::insert('
            insert into reservations (user_id, fac_id, res_date, res_start, res_end, res_purpose, res_stat_id, created_at, updated_at)
            values (?, ?, ?, ?, ?, ?, ?, now(), now())',
            [
                $request->user()->user_id,
                $validated['fac_id'],
                $validated['res_date'],
                $validated['res_start'],
                $validated['res_end'],
                $validated['res_purpose'],
                $pendingstatid
            ]
        );

        return response()->json([
            'message' => 'reservation requested successfully'
        ], 201);
    }

    // get list of logged in user's reservations
    public function myList(Request $request)
    {
        // query user's reservations with status and facility details via prepared statement
        $reservations = DB::select('
            select r.*, f.fac_name, s.res_status_name 
            from reservations r
            join facilities f on r.fac_id = f.fac_id
            join reservation_statuses s on r.res_stat_id = s.res_stat_id
            where r.user_id = ?
            order by r.created_at desc',
            [$request->user()->user_id]
        );

        return response()->json([
            'data' => $reservations
        ], 200);
    }

    // get detail of a specific reservation
    public function show(Request $request, $id)
    {
        // query reservation record
        $reservations = DB::select('
            select r.*, f.fac_name, s.res_status_name, u.full_name 
            from reservations r
            join facilities f on r.fac_id = f.fac_id
            join reservation_statuses s on r.res_stat_id = s.res_stat_id
            join users u on r.user_id = u.user_id
            where r.res_id = ? 
            limit 1',
            [$id]
        );

        if (empty($reservations)) {
            return response()->json(['message' => 'reservation not found'], 404);
        }

        $reservation = $reservations[0];

        // verify ownership if user is not officer/admin
        $isstaff = in_array($request->user()->role->role_name, ['petugas', 'admin']);
        if (! $isstaff && $reservation->user_id !== $request->user()->user_id) {
            return response()->json(['message' => 'unauthorized access'], 403);
        }

        return response()->json([
            'data' => $reservation
        ], 200);
    }

    // cancel user's own pending/approved reservation
    public function cancel(Request $request, $id)
    {
        // verify reservation ownership
        $reservation = DB::select('select res_id from reservations where res_id = ? and user_id = ? limit 1', [
            $id, 
            $request->user()->user_id
        ]);

        if (empty($reservation)) {
            return response()->json(['message' => 'reservation not found'], 404);
        }

        // lookup cancelled status
        $cancelledstatus = DB::select('select res_stat_id from reservation_statuses where res_status_name = ? limit 1', ['cancelled']);

        // update status using prepared statement
        DB::update('
            update reservations 
            set res_stat_id = ?, updated_at = now() 
            where res_id = ?',
            [$cancelledstatus[0]->res_stat_id, $id]
        );

        return response()->json([
            'message' => 'reservation cancelled successfully'
        ], 200);
    }

    // petugas / admin methods

    // get list of pending reservation queue
    public function queue(Request $request)
    {
        // fetch pending reservations using raw query with prepared statement
        $queue = DB::select('
            select r.*, f.fac_name, u.full_name, s.res_status_name
            from reservations r
            join facilities f on r.fac_id = f.fac_id
            join users u on r.user_id = u.user_id
            join reservation_statuses s on r.res_stat_id = s.res_stat_id
            where s.res_status_name = ?
            order by r.created_at asc',
            ['pending']
        );

        return response()->json([
            'data' => $queue
        ], 200);
    }

    // get list of approved reservations (for force-cancel management)
    public function approved(Request $request)
    {
        $approved = DB::select('
            select r.*, f.fac_name, u.full_name, s.res_status_name
            from reservations r
            join facilities f on r.fac_id = f.fac_id
            join users u on r.user_id = u.user_id
            join reservation_statuses s on r.res_stat_id = s.res_stat_id
            where s.res_status_name = ?
            order by r.res_date asc, r.res_start asc',
            ['approved']
        );

        return response()->json([
            'data' => $approved
        ], 200);
    }

    // approve a pending reservation
    public function approve(Request $request, $id)
    {
        // fetch target reservation
        $reservations = DB::select('select * from reservations where res_id = ? limit 1', [$id]);

        if (empty($reservations)) {
            return response()->json(['message' => 'reservation not found'], 404);
        }

        $reservation = $reservations[0];

        // lookup approved status id
        $approvedstatus = DB::select('select res_stat_id from reservation_statuses where res_status_name = ? limit 1', ['approved']);
        $approvedstatid = $approvedstatus[0]->res_stat_id;

        // re-check double booking before approving
        $hasconflict = DB::select('
            select 1 from reservations 
            where fac_id = ? 
              and res_date = ? 
              and res_stat_id = ? 
              and res_id != ? 
              and res_start < ? 
              and res_end > ? 
            limit 1', 
            [
                $reservation->fac_id,
                $reservation->res_date,
                $approvedstatid,
                $reservation->res_id,
                $reservation->res_end,
                $reservation->res_start
            ]
        );

        if (! empty($hasconflict)) {
            return response()->json([
                'message' => 'cannot approve: slot is already taken by another approved reservation'
            ], 422);
        }

        // update record using prepared statement
        DB::update('
            update reservations 
            set res_stat_id = ?, processed_by = ?, updated_at = now() 
            where res_id = ?',
            [$approvedstatid, $request->user()->user_id, $id]
        );

        return response()->json([
            'message' => 'reservation approved successfully'
        ], 200);
    }

    // reject a pending reservation
    public function reject(Request $request, $id)
    {
        $reservations = DB::select('select res_id from reservations where res_id = ? limit 1', [$id]);

        if (empty($reservations)) {
            return response()->json(['message' => 'reservation not found'], 404);
        }

        // lookup rejected status id
        $rejectedstatus = DB::select('select res_stat_id from reservation_statuses where res_status_name = ? limit 1', ['rejected']);

        // update status via prepared statement
        DB::update('
            update reservations 
            set res_stat_id = ?, processed_by = ?, updated_at = now() 
            where res_id = ?',
            [$rejectedstatus[0]->res_stat_id, $request->user()->user_id, $id]
        );

        return response()->json([
            'message' => 'reservation rejected'
        ], 200);
    }

    // force cancel an approved reservation with a reason
    public function forceCancel(Request $request, $id)
    {
        $request->validate([
            'cancel_reason' => 'required|string|min:5'
        ]);

        $reservations = DB::select('select res_id from reservations where res_id = ? limit 1', [$id]);

        if (empty($reservations)) {
            return response()->json(['message' => 'reservation not found'], 404);
        }

        // lookup cancelled status id
        $cancelledstatus = DB::select('select res_stat_id from reservation_statuses where res_status_name = ? limit 1', ['cancelled']);

        // update record with cancel reason via prepared statement
        DB::update('
            update reservations 
            set res_stat_id = ?, res_cancel_reason = ?, processed_by = ?, updated_at = now() 
            where res_id = ?',
            [
                $cancelledstatus[0]->res_stat_id, 
                $request->cancel_reason, 
                $request->user()->user_id, 
                $id
            ]
        );

        return response()->json([
            'message' => 'reservation force-cancelled successfully'
        ], 200);
    }
}