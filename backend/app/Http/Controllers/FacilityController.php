<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFacilityRequest;
use App\Services\SupabaseStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * FacilityController
 *
 * Manages all CRUD operations and availability queries for facilities.
 * Accessible endpoints depend on the user's role:
 *   - Public / pengguna : index, show, slots
 *   - Admin only        : store, update
 *   - Petugas / admin   : updateStatus
 *
 * All database queries use raw prepared statements with parameter binding
 * to prevent SQL injection.
 */
class FacilityController extends Controller
{
    public function __construct(
        private readonly SupabaseStorageService $storage
    ) {}
    /**
     * List all facilities with optional query-string filters.
     *
     * Fetches every facility from the database, joining the `facility_types`
     * and `facility_statuses` tables so that human-readable names are included.
     * The result set can be narrowed down with the following optional filters:
     *   - ?type=<name>       Filter by facility type name (exact match)
     *   - ?location=<text>   Filter by location (case-insensitive partial match)
     *   - ?capacity=<int>    Filter by minimum capacity (>=)
     *
     * Results are always ordered alphabetically by facility name.
     *
     * @param  \Illuminate\Http\Request  $request  The incoming HTTP request with optional query params
     * @return \Illuminate\Http\JsonResponse        200 with paginated facility list
     */
    public function index(Request $request): JsonResponse
    {
        // Start with a base query that joins type and status tables.
        // WHERE 1=1 is used so conditional filters can be appended uniformly with AND.
        $query = 'SELECT f.fac_id, f.fac_name, f.fac_location, f.fac_capacity,
                         f.fac_description, f.fac_image, f.created_at, f.updated_at,
                         f.fac_type_id, t.fac_type_name,
                         f.fac_stat_id, s.fac_status_name
                  FROM facilities f
                  INNER JOIN facility_types t ON f.fac_type_id = t.fac_type_id
                  INNER JOIN facility_statuses s ON f.fac_stat_id = s.fac_stat_id
                  WHERE 1=1';

        // Array to hold bound parameters in the same order they are appended to $query.
        $bindings = [];

        // Optional filter: narrow results to a specific facility type (e.g. "lab", "aula").
        if ($request->has('type') && $request->type !== '') {
            $query .= ' AND t.fac_type_name = ?';
            $bindings[] = $request->type;
        }

        // Optional filter: search by location keyword (case-insensitive substring match).
        if ($request->has('location') && $request->location !== '') {
            $query .= ' AND LOWER(f.fac_location) LIKE LOWER(?)';
            $bindings[] = '%' . $request->location . '%';
        }

        // Optional filter: only return facilities whose capacity meets or exceeds the given number.
        if ($request->has('capacity') && $request->capacity !== '') {
            $query .= ' AND f.fac_capacity >= ?';
            $bindings[] = (int) $request->capacity;
        }

        // Append ordering — alphabetical by facility name for consistent display.
        $query .= ' ORDER BY f.fac_name ASC';

        $facilities = DB::select($query, $bindings);

        // Transform the flat query result into a nested structure so that
        // type and status information appear as nested objects in the JSON output.
        $result = array_map(function ($row) {
            return [
                'fac_id'          => $row->fac_id,
                'fac_name'        => $row->fac_name,
                'fac_location'    => $row->fac_location,
                'fac_capacity'    => $row->fac_capacity,
                'fac_description' => $row->fac_description,
                'fac_image'       => $this->imageUrl($row->fac_image),
                'created_at'      => $row->created_at,
                'updated_at'      => $row->updated_at,
                'type' => [
                    'fac_type_id'   => $row->fac_type_id,
                    'fac_type_name' => $row->fac_type_name,
                ],
                'status' => [
                    'fac_stat_id'     => $row->fac_stat_id,
                    'fac_status_name' => $row->fac_status_name,
                ],
            ];
        }, $facilities);

        return response()->json([
            'data' => $result,
        ], 200);
    }

    /**
     * Show the details of a single facility.
     *
     * Looks up one facility by its primary key, joining type and status tables
     * for a complete response. Returns 404 if no matching record is found.
     *
     * @param  int|string  $id  The facility's primary key (fac_id)
     * @return \Illuminate\Http\JsonResponse  200 with facility data, or 404 if not found
     */
    public function show($id): JsonResponse
    {
        // Fetch the single facility row, including joined type and status names.
        $results = DB::select(
            'SELECT f.fac_id, f.fac_name, f.fac_location, f.fac_capacity,
                    f.fac_description, f.fac_image, f.created_at, f.updated_at,
                    f.fac_type_id, t.fac_type_name,
                    f.fac_stat_id, s.fac_status_name
             FROM facilities f
             INNER JOIN facility_types t ON f.fac_type_id = t.fac_type_id
             INNER JOIN facility_statuses s ON f.fac_stat_id = s.fac_stat_id
             WHERE f.fac_id = ?',
            [$id]
        );

        // Guard clause: return 404 when no facility matches the given ID.
        if (empty($results)) {
            return response()->json([
                'message' => 'Facility not found.',
            ], 404);
        }

        $row = $results[0];

        // Return the facility data nested consistently with the index() response shape.
        return response()->json([
            'data' => [
                'fac_id'          => $row->fac_id,
                'fac_name'        => $row->fac_name,
                'fac_location'    => $row->fac_location,
                'fac_capacity'    => $row->fac_capacity,
                'fac_description' => $row->fac_description,
                'fac_image'       => $this->imageUrl($row->fac_image),
                'created_at'      => $row->created_at,
                'updated_at'      => $row->updated_at,
                'type' => [
                    'fac_type_id'   => $row->fac_type_id,
                    'fac_type_name' => $row->fac_type_name,
                ],
                'status' => [
                    'fac_stat_id'     => $row->fac_stat_id,
                    'fac_status_name' => $row->fac_status_name,
                ],
            ],
        ], 200);
    }

    /**
     * Get available and booked time slots for a facility on a given date.
     *
     * Generates a list of 30-minute intervals between 07:00 and 20:00 and
     * marks each slot as "available" or "booked" based on existing approved
     * reservations (res_stat_id = 2) for the specified facility and date.
     *
     * A slot is considered booked if it overlaps with any approved reservation.
     * Overlap is detected using the condition:
     *   slotStart < res_end  AND  slotEnd > res_start
     *
     * Query param: ?date=YYYY-MM-DD  (defaults to today if omitted)
     *
     * @param  int|string              $id       The facility's primary key (fac_id)
     * @param  \Illuminate\Http\Request $request  The incoming HTTP request (optional ?date param)
     * @return \Illuminate\Http\JsonResponse      200 with slot list, or 404 if facility not found
     */
    public function slots($id, Request $request): JsonResponse
    {
        // Use the date query parameter if provided, otherwise default to today.
        $date = $request->query('date', now()->toDateString());

        // Verify the facility exists before proceeding.
        $facility = DB::select('SELECT fac_id FROM facilities WHERE fac_id = ?', [$id]);
        if (empty($facility)) {
            return response()->json(['message' => 'Facility not found.'], 404);
        }

        // Retrieve all approved reservations for this facility on the target date.
        // Only res_stat_id = 2 (approved) reservations block availability.
        $reservations = DB::select(
            'SELECT res_start, res_end
             FROM reservations
             WHERE fac_id = ? AND res_date = ? AND res_stat_id = 2',
            [$id, $date]
        );

        // Generate every 30-minute time slot from 07:00 to 20:00.
        $slots = [];
        $startHour = 7;  // Earliest bookable hour (07:00)
        $endHour = 20;   // Latest start hour (last slot is 19:30–20:00)

        for ($hour = $startHour; $hour < $endHour; $hour++) {
            for ($minute = 0; $minute < 60; $minute += 30) {
                // Format the slot's start time as HH:MM.
                $slotStart = sprintf('%02d:%02d', $hour, $minute);

                // Calculate the slot end time: add 30 minutes, rolling over to the next hour at :30.
                $slotEnd = ($minute === 30)
                    ? sprintf('%02d:%02d', $hour + 1, 0)
                    : sprintf('%02d:%02d', $hour, 30);

                // Check whether this slot overlaps with any approved reservation.
                // Overlap condition: slot starts before reservation ends AND slot ends after reservation starts.
                $isBooked = false;
                foreach ($reservations as $res) {
                    if ($slotStart < $res->res_end && $slotEnd > $res->res_start) {
                        $isBooked = true;
                        break; // No need to check further — this slot is already blocked.
                    }
                }

                $slots[] = [
                    'start'  => $slotStart,
                    'end'    => $slotEnd,
                    'status' => $isBooked ? 'booked' : 'available',
                ];
            }
        }

        return response()->json([
            'fac_id' => (int) $id,
            'date'   => $date,
            'slots'  => $slots,
        ], 200);
    }

    /**
     * Create and store a new facility (admin only).
     *
     * Inserts a new row into the `facilities` table using a raw prepared
     * statement with all provided field values bound as positional parameters.
     * After insertion, the newly created record is fetched by selecting the
     * row with the highest fac_id and returned in the response (201 Created).
     *
     * @param  \App\Http\Requests\StoreFacilityRequest  $request  Validated facility creation payload
     * @return \Illuminate\Http\JsonResponse                       201 with created facility data
     */
    public function store(StoreFacilityRequest $request): JsonResponse
    {
        // Resolve the image value: upload to Supabase if a file was sent,
        // otherwise fall back to the raw URL/string passed in the request.
        $imageValue = null;
        if ($request->hasFile('fac_image')) {
            try {
                $imageValue = $this->storage->upload($request->file('fac_image'));
            } catch (\RuntimeException $e) {
                Log::error('Facility image upload failed on store', ['error' => $e->getMessage()]);
                return response()->json(['message' => 'Image upload failed. Please try again.'], 500);
            }
        } else {
            $imageValue = $request->fac_image; // plain URL string (optional)
        }

        // Insert the new facility record using a prepared statement.
        // All values are bound positionally to prevent SQL injection.
        DB::insert(
            'INSERT INTO facilities (fac_name, fac_type_id, fac_location, fac_capacity, fac_description, fac_stat_id, fac_image, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
            [
                $request->fac_name,
                $request->fac_type_id,
                $request->fac_location,
                $request->fac_capacity,
                $request->fac_description,
                $request->fac_stat_id,
                $imageValue,
            ]
        );

        // Fetch the row that was just inserted by selecting the one with the highest fac_id.
        // This approach is used because DB::insert() does not return the new ID directly.
        $facility = DB::select(
            'SELECT fac_id, fac_name, fac_type_id, fac_location, fac_capacity, fac_description, fac_stat_id, fac_image
             FROM facilities ORDER BY fac_id DESC LIMIT 1'
        );
        if (!empty($facility)) {
            $facility[0]->fac_image = $this->imageUrl($facility[0]->fac_image);
        }

        return response()->json([
            'message' => 'Facility created successfully.',
            'data'    => $facility[0] ?? null,
        ], 201);
    }

    /**
     * Update all fields of an existing facility (admin only).
     *
     * First checks that the target facility exists (404 if not), then issues a
     * raw prepared UPDATE statement that replaces every editable column.
     * Only the `updated_at` timestamp is set automatically via NOW().
     *
     * @param  \App\Http\Requests\StoreFacilityRequest  $request  Validated facility update payload
     * @param  int|string                               $id       The facility's primary key (fac_id)
     * @return \Illuminate\Http\JsonResponse                       200 on success, 404 if not found
     */
    public function update(StoreFacilityRequest $request, $id): JsonResponse
    {
        // Guard clause: verify the facility exists before attempting an update.
        $existing = DB::select('SELECT fac_id, fac_image FROM facilities WHERE fac_id = ?', [$id]);
        if (empty($existing)) {
            return response()->json(['message' => 'Facility not found.'], 404);
        }

        $oldImage   = $existing[0]->fac_image ?? null;
        $imageValue = $oldImage; // Default: keep the current image unchanged.

        // When a new file is uploaded, delete the old one first then upload the replacement.
        if ($request->hasFile('fac_image')) {
            // Delete old image from the appropriate storage backend.
            if ($oldImage) {
                if ($this->storage->isSupabaseUrl($oldImage)) {
                    // Old image lives in Supabase Storage — remove via API.
                    $this->storage->delete($oldImage);
                } else {
                    // Old image is a legacy local file — remove from the public disk.
                    $localPath = ltrim(parse_url($oldImage, PHP_URL_PATH), '/');
                    if (Storage::disk('public')->exists($localPath)) {
                        Storage::disk('public')->delete($localPath);
                    }
                }
            }

            // Upload the new image to Supabase and store the public URL.
            try {
                $imageValue = $this->storage->upload($request->file('fac_image'));
            } catch (\RuntimeException $e) {
                Log::error('Facility image upload failed on update', ['fac_id' => $id, 'error' => $e->getMessage()]);
                return response()->json(['message' => 'Image upload failed. Please try again.'], 500);
            }
        }

        // Update all editable fields for the given facility ID.
        DB::update(
            'UPDATE facilities
             SET fac_name = ?, fac_type_id = ?, fac_location = ?, fac_capacity = ?,
                 fac_description = ?, fac_stat_id = ?, fac_image = ?, updated_at = NOW()
             WHERE fac_id = ?',
            [
                $request->fac_name,
                $request->fac_type_id,
                $request->fac_location,
                $request->fac_capacity,
                $request->fac_description,
                $request->fac_stat_id,
                $imageValue,
                $id, // The WHERE clause parameter — must be last in the binding array.
            ]
        );

        return response()->json([
            'message' => 'Facility updated successfully.',
        ], 200);
    }

    /**
     * Update only the status of a facility (petugas or admin).
     *
     * A lightweight endpoint that allows authorised staff to change a
     * facility's operational status (e.g. available → under maintenance)
     * without touching any other fields.
     *
     * Validates that `fac_stat_id` exists in the `facility_statuses` table
     * before applying the change.
     *
     * @param  \Illuminate\Http\Request  $request  Must contain a valid `fac_stat_id`
     * @param  int|string               $id       The facility's primary key (fac_id)
     * @return \Illuminate\Http\JsonResponse        200 on success, 404 if facility not found, 422 on validation failure
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        // Validate that the provided status ID references a real row in facility_statuses.
        $request->validate([
            'fac_stat_id' => 'required|integer|exists:facility_statuses,fac_stat_id',
        ]);

        // Guard clause: confirm the facility exists before attempting the update.
        $existing = DB::select('SELECT fac_id FROM facilities WHERE fac_id = ?', [$id]);
        if (empty($existing)) {
            return response()->json(['message' => 'Facility not found.'], 404);
        }

        // Apply the status change — only fac_stat_id and updated_at are modified.
        DB::update(
            'UPDATE facilities SET fac_stat_id = ?, updated_at = NOW() WHERE fac_id = ?',
            [$request->fac_stat_id, $id]
        );

        return response()->json([
            'message' => 'Facility status updated successfully.',
        ], 200);
    }

    private function imageUrl(?string $image): ?string
    {
        if (!$image || filter_var($image, FILTER_VALIDATE_URL)) {
            return $image;
        }

        return Storage::disk('public')->url($image);
    }
}
