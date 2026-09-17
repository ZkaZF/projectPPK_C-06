<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFacilityRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class FacilityController extends Controller
{
    /**
     * List all facilities with optional filters.
     * Filters: ?type=, ?location=, ?capacity=
     */
    public function index(Request $request): JsonResponse
    {
        // Build query with prepared statement approach
        $query = 'SELECT f.fac_id, f.fac_name, f.fac_location, f.fac_capacity,
                         f.fac_description, f.fac_image, f.created_at, f.updated_at,
                         f.fac_type_id, t.fac_type_name,
                         f.fac_stat_id, s.fac_status_name
                  FROM facilities f
                  INNER JOIN facility_types t ON f.fac_type_id = t.fac_type_id
                  INNER JOIN facility_statuses s ON f.fac_stat_id = s.fac_stat_id
                  WHERE 1=1';

        $bindings = [];

        // Filter by facility type
        if ($request->has('type') && $request->type !== '') {
            $query .= ' AND t.fac_type_name = ?';
            $bindings[] = $request->type;
        }

        // Filter by location (partial match)
        if ($request->has('location') && $request->location !== '') {
            $query .= ' AND LOWER(f.fac_location) LIKE LOWER(?)';
            $bindings[] = '%' . $request->location . '%';
        }

        // Filter by minimum capacity
        if ($request->has('capacity') && $request->capacity !== '') {
            $query .= ' AND f.fac_capacity >= ?';
            $bindings[] = (int) $request->capacity;
        }

        $query .= ' ORDER BY f.fac_name ASC';

        $facilities = DB::select($query, $bindings);

        // Format the response to nest type and status
        $result = array_map(function ($row) {
            return [
                'fac_id'          => $row->fac_id,
                'fac_name'        => $row->fac_name,
                'fac_location'    => $row->fac_location,
                'fac_capacity'    => $row->fac_capacity,
                'fac_description' => $row->fac_description,
                'fac_image'       => $row->fac_image,
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
     * Show a single facility detail.
     */
    public function show($id): JsonResponse
    {
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

        if (empty($results)) {
            return response()->json([
                'message' => 'Facility not found.',
            ], 404);
        }

        $row = $results[0];

        return response()->json([
            'data' => [
                'fac_id'          => $row->fac_id,
                'fac_name'        => $row->fac_name,
                'fac_location'    => $row->fac_location,
                'fac_capacity'    => $row->fac_capacity,
                'fac_description' => $row->fac_description,
                'fac_image'       => $row->fac_image,
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
     * Get available/booked time slots for a facility on a given date.
     * Generates 30-minute intervals from 07:00 to 20:00.
     * Query param: ?date=YYYY-MM-DD
     */
    public function slots($id, Request $request): JsonResponse
    {
        $date = $request->query('date', now()->toDateString());

        // Check facility exists
        $facility = DB::select('SELECT fac_id FROM facilities WHERE fac_id = ?', [$id]);
        if (empty($facility)) {
            return response()->json(['message' => 'Facility not found.'], 404);
        }

        // Get approved reservations for this facility on the given date
        $reservations = DB::select(
            'SELECT res_start, res_end
             FROM reservations
             WHERE fac_id = ? AND res_date = ? AND res_stat_id = 2',
            [$id, $date]
        );

        // Generate all 30-minute slots from 07:00 to 20:00
        $slots = [];
        $startHour = 7;
        $endHour = 20;

        for ($hour = $startHour; $hour < $endHour; $hour++) {
            for ($minute = 0; $minute < 60; $minute += 30) {
                $slotStart = sprintf('%02d:%02d', $hour, $minute);
                $slotEnd = ($minute === 30)
                    ? sprintf('%02d:%02d', $hour + 1, 0)
                    : sprintf('%02d:%02d', $hour, 30);

                // Check if this slot overlaps with any approved reservation
                $isBooked = false;
                foreach ($reservations as $res) {
                    // A slot is booked if it overlaps: slotStart < res_end AND slotEnd > res_start
                    if ($slotStart < $res->res_end && $slotEnd > $res->res_start) {
                        $isBooked = true;
                        break;
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
     * Store a new facility (admin only).
     */
    public function store(StoreFacilityRequest $request): JsonResponse
    {
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
                $request->fac_image,
            ]
        );

        // Fetch the newly created facility
        $facility = DB::select(
            'SELECT fac_id, fac_name, fac_type_id, fac_location, fac_capacity, fac_description, fac_stat_id, fac_image
             FROM facilities ORDER BY fac_id DESC LIMIT 1'
        );

        return response()->json([
            'message' => 'Facility created successfully.',
            'data'    => $facility[0] ?? null,
        ], 201);
    }

    /**
     * Update an existing facility (admin only).
     */
    public function update(StoreFacilityRequest $request, $id): JsonResponse
    {
        // Check facility exists
        $existing = DB::select('SELECT fac_id FROM facilities WHERE fac_id = ?', [$id]);
        if (empty($existing)) {
            return response()->json(['message' => 'Facility not found.'], 404);
        }

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
                $request->fac_image,
                $id,
            ]
        );

        return response()->json([
            'message' => 'Facility updated successfully.',
        ], 200);
    }

    /**
     * Update only the status of a facility (petugas or admin).
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $request->validate([
            'fac_stat_id' => 'required|integer|exists:facility_statuses,fac_stat_id',
        ]);

        // Check facility exists
        $existing = DB::select('SELECT fac_id FROM facilities WHERE fac_id = ?', [$id]);
        if (empty($existing)) {
            return response()->json(['message' => 'Facility not found.'], 404);
        }

        DB::update(
            'UPDATE facilities SET fac_stat_id = ?, updated_at = NOW() WHERE fac_id = ?',
            [$request->fac_stat_id, $id]
        );

        return response()->json([
            'message' => 'Facility status updated successfully.',
        ], 200);
    }
}
