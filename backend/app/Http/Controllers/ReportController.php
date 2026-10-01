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

/**
 * ReportController
 *
 * Handles all damage/issue report operations.
 * Endpoints are grouped by the role permitted to access them:
 *
 *   All authenticated users (pengguna):
 *     - store()        Submit a new report (with optional photo upload to Supabase)
 *     - myList()       View the current user's own report history
 *     - categories()   Retrieve the list of report categories (for dropdowns)
 *
 *   Petugas / Admin (staff):
 *     - queue()        View the queue of reports with status "baru" or "diproses"
 *     - updateStatus() Update a report's status and add a resolution note
 *
 * Report status follows a one-way transition flow enforced server-side:
 *   baru (new) → diproses (in progress) → selesai (done) / ditolak (rejected)
 */
class ReportController extends Controller
{
    /**
     * Allowed status transition map.
     *
     * Key   = current status name
     * Value = array of status names that are valid next states
     *
     * "selesai" and "ditolak" are terminal states — they cannot be changed further.
     */
    private const TRANSITIONS = [
        'baru'     => ['diproses', 'selesai', 'ditolak'],
        'diproses' => ['selesai', 'ditolak'],
        'selesai'  => [], // terminal state
        'ditolak'  => [], // terminal state
    ];

    // ─── User: submit a new report ────────────────────────────────────────────

    /**
     * Submit a new facility damage/issue report.
     *
     * Processes the payload already validated by StoreReportRequest:
     *   1. If a photo file is present, it is uploaded to the Supabase Storage
     *      "reports/" folder. Only the relative path (e.g. "reports/uuid.jpg")
     *      is stored in the database column — not the full URL.
     *   2. Looks up the rep_stat_id for the "baru" status from report_statuses.
     *   3. Creates a new row in the reports table.
     *
     * If the photo upload fails, the controller returns 502 so the frontend
     * can show an error without saving an incomplete report record.
     *
     * @param  \App\Http\Requests\StoreReportRequest  $request  Validated payload (fac_id, rep_cat_id, rep_description, rep_photo?)
     * @param  \App\Services\SupabaseStorage          $storage  Photo upload service (auto-injected by Laravel's IoC container)
     * @return \Illuminate\Http\JsonResponse          201 with report data, or 502 if upload fails
     */
    public function store(StoreReportRequest $request, SupabaseStorage $storage)
    {
        $validated = $request->validated();
        $user      = Auth::user();

        // Upload the photo to Supabase if one was attached.
        // If no photo was provided, $photoPath stays null (the column is NULLABLE in the DB).
        $photoPath = null;
        if ($request->hasFile('rep_photo')) {
            try {
                $photoPath = $storage->upload($request->file('rep_photo'), 'reports');
            } catch (\Throwable $e) {
                // Log the error to Laravel's log system, then return 502 to the client.
                report($e);

                return response()->json([
                    'message' => 'Failed to upload photo. Please try again.',
                ], 502);
            }
        }

        // Fetch the "baru" status ID from the report_statuses lookup table.
        $newStatusId = ReportStatus::where('rep_status_name', 'baru')->value('rep_stat_id');

        // Persist the new report. rep_photo stores the relative path, not the full URL.
        $report = Report::create([
            'user_id'         => $user->user_id,
            'fac_id'          => $validated['fac_id'],
            'rep_cat_id'      => $validated['rep_cat_id'],
            'rep_description' => $validated['rep_description'],
            'rep_photo'       => $photoPath,
            'rep_stat_id'     => $newStatusId,
        ]);

        return response()->json([
            'message' => 'Report submitted successfully.',
            'data'    => $report->load(['facility', 'category', 'reportStatus']),
        ], 201);
    }

    // ─── User: list own reports ───────────────────────────────────────────────

    /**
     * Return all reports belonging to the currently authenticated user.
     *
     * Fetches reports filtered by user_id from the Sanctum token, ordered
     * newest-first. The facility, category, and reportStatus relationships
     * are eager-loaded to avoid N+1 queries.
     *
     * @param  \Illuminate\Http\Request  $request  Incoming HTTP request (requires auth:sanctum)
     * @return \Illuminate\Http\JsonResponse        200 with an array of reports
     */
    public function myList(Request $request)
    {
        $user = Auth::user();

        // Eager-load relations needed by the frontend to display
        // the facility name, category label, and status badge.
        $reports = Report::with(['facility', 'category', 'reportStatus'])
            ->where('user_id', $user->user_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $reports]);
    }

    // ─── All users: list report categories ───────────────────────────────────

    /**
     * Return all report categories to populate a frontend dropdown.
     *
     * No filtering or pagination is needed here because the category list
     * is fixed and small (kerusakan_ringan, kerusakan_berat, kebersihan,
     * keamanan, lainnya). Results are ordered by primary key.
     *
     * @return \Illuminate\Http\JsonResponse  200 with an array of categories
     */
    public function categories()
    {
        return response()->json([
            'data' => ReportCategory::orderBy('rep_cat_id')->get(),
        ]);
    }

    // ─── Staff: pending report queue ──────────────────────────────────────────

    /**
     * Return the queue of reports that still need staff attention.
     *
     * Fetches all reports with status "baru" (new) or "diproses" (in progress),
     * ordered oldest-first (FIFO) so that reports waiting the longest are
     * prioritised. The user relationship is eager-loaded so staff can see
     * who filed each report.
     *
     * @param  \Illuminate\Http\Request  $request  Incoming HTTP request (requires petugas/admin role)
     * @return \Illuminate\Http\JsonResponse        200 with an array of queued reports
     */
    public function queue(Request $request)
    {
        // Retrieve IDs for both active statuses in a single query.
        $statusIds = ReportStatus::whereIn('rep_status_name', ['baru', 'diproses'])
            ->pluck('rep_stat_id');

        $reports = Report::with(['facility', 'user', 'category', 'reportStatus'])
            ->whereIn('rep_stat_id', $statusIds)
            ->orderBy('created_at', 'asc') // FIFO: oldest report handled first
            ->get();

        return response()->json(['data' => $reports]);
    }

    // ─── Staff: update report status ─────────────────────────────────────────

    /**
     * Update the status and resolution note of a report (staff/admin only).
     *
     * Three validation layers are enforced before the update is applied:
     *   1. Input validation: rep_stat_id must reference a real row in report_statuses.
     *   2. Transition validation: the new status must be listed in TRANSITIONS[current_status].
     *      This prevents arbitrary status jumps (e.g. "selesai" → "baru").
     *   3. Resolution note: required when the target status is "selesai" or "ditolak"
     *      to ensure an audit trail and transparency for the reporter.
     *
     * After the update, the controller refreshes the model's relations so the
     * JSON response reflects the latest data from the database.
     *
     * @param  int|string               $id       Primary key of the report (rep_id)
     * @param  \Illuminate\Http\Request $request  Must contain rep_stat_id; rep_resolution_note is conditionally required
     * @return \Illuminate\Http\JsonResponse       200 with updated report data, or 422 if the transition is invalid
     *
     * @throws \Illuminate\Validation\ValidationException  If the status transition is not allowed,
     *                                                     or if the resolution note is missing when required
     */
    public function updateStatus($id, Request $request)
    {
        // Basic input validation: ensure rep_stat_id points to a real status row.
        $request->validate([
            'rep_stat_id'         => ['required', 'integer', 'exists:report_statuses,rep_stat_id'],
            'rep_resolution_note' => ['nullable', 'string', 'max:1000'],
        ]);

        // Load the reportStatus relation so we can read the current status name.
        $report      = Report::with('reportStatus')->findOrFail($id);
        $currentName = $report->reportStatus->rep_status_name;
        $newName     = ReportStatus::where('rep_stat_id', $request->rep_stat_id)->value('rep_status_name');

        // Transition validation: reject if the move is not in the allowed map.
        if (! in_array($newName, self::TRANSITIONS[$currentName] ?? [], true)) {
            throw ValidationException::withMessages([
                'rep_stat_id' => "Report status cannot be changed from '{$currentName}' to '{$newName}'.",
            ]);
        }

        // For terminal statuses (done/rejected), a resolution note is mandatory
        // to maintain accountability and give the reporter a clear explanation.
        if (in_array($newName, ['selesai', 'ditolak'], true) && blank($request->rep_resolution_note)) {
            throw ValidationException::withMessages([
                'rep_resolution_note' => 'A resolution note is required when marking a report as done or rejected.',
            ]);
        }

        // Save changes and record which staff member handled the report.
        $report->update([
            'rep_stat_id'         => $request->rep_stat_id,
            'handled_by'          => Auth::user()->user_id,
            'rep_resolution_note' => $request->rep_resolution_note,
        ]);

        return response()->json([
            'message' => 'Report status updated successfully.',
            'data'    => $report->fresh(['facility', 'category', 'reportStatus']),
        ]);
    }
}