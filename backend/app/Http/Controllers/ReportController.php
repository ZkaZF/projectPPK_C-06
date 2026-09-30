<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\ReportStatus;
use App\Http\Requests\StoreReportRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
    // ─── Pengguna: kirim laporan baru ─────────────────────────────────────────
    public function store(StoreReportRequest $request)
    {
        $validated = $request->validated();
        $user      = Auth::user();

        $photoPath = null;
        if ($request->hasFile('rep_photo')) {
            $photoPath = $request->file('rep_photo')->store('reports', 'public');
            $photoPath = Storage::url($photoPath);
        }

        $newStatusId = ReportStatus::where('rep_status_name', 'baru')->value('rep_stat_id');

        $report = Report::create([
            'user_id'         => $user->user_id,
            'fac_id'          => $validated['fac_id'],
            'rep_cat_id'      => $validated['rep_cat_id'],
            'rep_description' => $validated['rep_description'],
            'rep_photo'       => $photoPath,
            'rep_stat_id'     => $newStatusId,
        ]);

        return response()->json([
            'message' => 'Laporan berhasil dikirim.',
            'data'    => $report->load(['facility', 'category', 'reportStatus']),
        ], 201);
    }

    // ─── Pengguna: daftar laporan milik sendiri ───────────────────────────────
    public function myList(Request $request)
    {
        $user = Auth::user();

        $reports = Report::with(['facility', 'category', 'reportStatus'])
            ->where('user_id', $user->user_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $reports]);
    }

    // ─── Petugas/Admin: antrian laporan (status baru/diproses) ───────────────
    public function queue(Request $request)
    {
        $statusIds = ReportStatus::whereIn('rep_status_name', ['baru', 'diproses'])
            ->pluck('rep_stat_id');

        $reports = Report::with(['facility', 'user', 'category', 'reportStatus'])
            ->whereIn('rep_stat_id', $statusIds)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['data' => $reports]);
    }

    // ─── Petugas/Admin: update status laporan ────────────────────────────────
    public function updateStatus($id, Request $request)
    {
        $request->validate([
            'rep_stat_id'         => ['required', 'integer', 'exists:report_statuses,rep_stat_id'],
            'rep_resolution_note' => ['nullable', 'string', 'max:1000'],
        ]);

        $report = Report::findOrFail($id);

        $report->update([
            'rep_stat_id'         => $request->rep_stat_id,
            'handled_by'          => Auth::user()->user_id,
            'rep_resolution_note' => $request->rep_resolution_note,
        ]);

        return response()->json([
            'message' => 'Status laporan berhasil diperbarui.',
            'data'    => $report->fresh(['facility', 'category', 'reportStatus']),
        ]);
    }
}
