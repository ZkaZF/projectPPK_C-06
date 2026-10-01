<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\ReportCategory;
use App\Models\ReportStatus;
use App\Services\SupabaseStorage;
use App\Http\Requests\StoreReportRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class ReportController extends Controller
{
    // Alur status yang diperbolehkan: status sekarang => status tujuan
    private const TRANSITIONS = [
        'baru'     => ['diproses', 'selesai', 'ditolak'],
        'diproses' => ['selesai', 'ditolak'],
        'selesai'  => [],
        'ditolak'  => [],
    ];

    // ─── Pengguna: kirim laporan baru ─────────────────────────────────────────
    public function store(StoreReportRequest $request, SupabaseStorage $storage)
    {
        $validated = $request->validated();
        $user      = Auth::user();

        $photoPath = null;
        if ($request->hasFile('rep_photo')) {
            try {
                $photoPath = $storage->upload($request->file('rep_photo'), 'reports');
            } catch (\Throwable $e) {
                report($e);

                return response()->json([
                    'message' => 'Gagal mengunggah foto. Coba lagi.',
                ], 502);
            }
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

    // ─── Semua user: daftar kategori laporan ─────────────────────────────────
    public function categories()
    {
        return response()->json([
            'data' => ReportCategory::orderBy('rep_cat_id')->get(),
        ]);
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

        $report      = Report::with('reportStatus')->findOrFail($id);
        $currentName = $report->reportStatus->rep_status_name;
        $newName     = ReportStatus::where('rep_stat_id', $request->rep_stat_id)->value('rep_status_name');

        if (! in_array($newName, self::TRANSITIONS[$currentName] ?? [], true)) {
            throw ValidationException::withMessages([
                'rep_stat_id' => "Status laporan tidak bisa diubah dari '{$currentName}' ke '{$newName}'.",
            ]);
        }

        if (in_array($newName, ['selesai', 'ditolak'], true) && blank($request->rep_resolution_note)) {
            throw ValidationException::withMessages([
                'rep_resolution_note' => 'Catatan wajib diisi untuk status selesai atau ditolak.',
            ]);
        }

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