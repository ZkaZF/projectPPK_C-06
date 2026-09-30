<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\ReservationStatus;
use App\Http\Requests\StoreReservationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    // ─── Helper: cek bentrok slot ─────────────────────────────────────────────
    private function hasConflict(int $facilityId, string $date, string $start, string $end, ?int $excludeId = null): bool
    {
        $approvedStatusId = ReservationStatus::where('res_status_name', 'approved')->value('res_stat_id');

        $query = Reservation::where('fac_id', $facilityId)
            ->where('res_date', $date)
            ->where('res_stat_id', $approvedStatusId)
            ->where(function ($q) use ($start, $end) {
                // Cek tumpang tindih: start < end_existing AND end > start_existing
                $q->where('res_start', '<', $end)
                  ->where('res_end', '>', $start);
            });

        if ($excludeId) {
            $query->where('res_id', '!=', $excludeId);
        }

        return $query->exists();
    }

    // ─── Pengguna: ajukan reservasi baru ─────────────────────────────────────
    public function store(StoreReservationRequest $request)
    {
        $validated = $request->validated();
        $user      = Auth::user();

        if ($this->hasConflict(
            $validated['facility_id'],
            $validated['reservation_date'],
            $validated['start_time'],
            $validated['end_time']
        )) {
            return response()->json(['message' => 'Slot waktu sudah terisi oleh reservasi lain.'], 422);
        }

        $pendingStatusId = ReservationStatus::where('res_status_name', 'pending')->value('res_stat_id');

        $reservation = Reservation::create([
            'user_id'    => $user->user_id,
            'fac_id'     => $validated['facility_id'],
            'res_date'   => $validated['reservation_date'],
            'res_start'  => $validated['start_time'],
            'res_end'    => $validated['end_time'],
            'res_purpose'=> $validated['purpose'],
            'res_stat_id'=> $pendingStatusId,
        ]);

        return response()->json([
            'message' => 'Reservasi berhasil diajukan dan menunggu persetujuan.',
            'data'    => $reservation->load(['facility', 'reservationStatus']),
        ], 201);
    }

    // ─── Pengguna: daftar reservasi milik sendiri ─────────────────────────────
    public function myList(Request $request)
    {
        $user = Auth::user();

        $reservations = Reservation::with(['facility', 'reservationStatus'])
            ->where('user_id', $user->user_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $reservations]);
    }

    // ─── Pengguna: detail satu reservasi ─────────────────────────────────────
    public function show($id)
    {
        $reservation = Reservation::with(['facility', 'reservationStatus', 'user'])
            ->findOrFail($id);

        // Hanya pemilik, petugas, atau admin yang boleh lihat
        $user = Auth::user();
        if ($reservation->user_id !== $user->user_id && !in_array($user->role->role_name, ['petugas', 'admin'])) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return response()->json(['data' => $reservation]);
    }

    // ─── Pengguna: batalkan reservasi sendiri ─────────────────────────────────
    public function cancel($id)
    {
        $reservation = Reservation::findOrFail($id);
        $user        = Auth::user();

        if ($reservation->user_id !== $user->user_id) {
            return response()->json(['message' => 'Anda tidak berhak membatalkan reservasi ini.'], 403);
        }

        $statusName = $reservation->reservationStatus?->res_status_name;
        if (!in_array($statusName, ['pending', 'approved'])) {
            return response()->json(['message' => 'Hanya reservasi berstatus pending atau approved yang bisa dibatalkan.'], 422);
        }

        $cancelledStatusId = ReservationStatus::where('res_status_name', 'cancelled')->value('res_stat_id');
        $reservation->update(['res_stat_id' => $cancelledStatusId]);

        return response()->json(['message' => 'Reservasi berhasil dibatalkan.']);
    }

    // ─── Petugas/Admin: antrian reservasi pending ─────────────────────────────
    public function queue(Request $request)
    {
        $pendingStatusId = ReservationStatus::where('res_status_name', 'pending')->value('res_stat_id');

        $reservations = Reservation::with(['facility', 'user', 'reservationStatus'])
            ->where('res_stat_id', $pendingStatusId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['data' => $reservations]);
    }

    // ─── Petugas/Admin: setujui reservasi ─────────────────────────────────────
    public function approve($id)
    {
        $reservation = Reservation::with('reservationStatus')->findOrFail($id);

        if ($reservation->reservationStatus?->res_status_name !== 'pending') {
            return response()->json(['message' => 'Hanya reservasi berstatus pending yang bisa disetujui.'], 422);
        }

        // Cek konflik sebelum approve
        if ($this->hasConflict($reservation->fac_id, $reservation->res_date, $reservation->res_start, $reservation->res_end, $reservation->res_id)) {
            return response()->json(['message' => 'Terdapat bentrok dengan reservasi lain yang sudah disetujui.'], 422);
        }

        $approvedStatusId = ReservationStatus::where('res_status_name', 'approved')->value('res_stat_id');
        $reservation->update([
            'res_stat_id'  => $approvedStatusId,
            'processed_by' => Auth::user()->user_id,
        ]);

        return response()->json(['message' => 'Reservasi berhasil disetujui.', 'data' => $reservation->fresh(['reservationStatus'])]);
    }

    // ─── Petugas/Admin: tolak reservasi ──────────────────────────────────────
    public function reject($id, Request $request)
    {
        $request->validate(['cancel_reason' => 'nullable|string|max:500']);

        $reservation = Reservation::with('reservationStatus')->findOrFail($id);

        if ($reservation->reservationStatus?->res_status_name !== 'pending') {
            return response()->json(['message' => 'Hanya reservasi berstatus pending yang bisa ditolak.'], 422);
        }

        $rejectedStatusId = ReservationStatus::where('res_status_name', 'rejected')->value('res_stat_id');
        $reservation->update([
            'res_stat_id'       => $rejectedStatusId,
            'processed_by'      => Auth::user()->user_id,
            'res_cancel_reason' => $request->cancel_reason,
        ]);

        return response()->json(['message' => 'Reservasi berhasil ditolak.']);
    }

    // ─── Petugas/Admin: batalkan paksa reservasi approved ─────────────────────
    public function forceCancel($id, Request $request)
    {
        $request->validate(['cancel_reason' => 'required|string|min:5|max:500']);

        $reservation = Reservation::with('reservationStatus')->findOrFail($id);

        if ($reservation->reservationStatus?->res_status_name !== 'approved') {
            return response()->json(['message' => 'Hanya reservasi berstatus approved yang bisa dibatalkan paksa.'], 422);
        }

        $cancelledStatusId = ReservationStatus::where('res_status_name', 'cancelled')->value('res_stat_id');
        $reservation->update([
            'res_stat_id'       => $cancelledStatusId,
            'processed_by'      => Auth::user()->user_id,
            'res_cancel_reason' => $request->cancel_reason,
        ]);

        return response()->json(['message' => 'Reservasi berhasil dibatalkan paksa.']);
    }
}