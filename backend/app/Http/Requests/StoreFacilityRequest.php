<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * StoreFacilityRequest
 *
 * Validates the payload for both:
 *   - POST /api/facilities        (FacilityController@store  — create a new facility)
 *   - PUT  /api/facilities/{id}   (FacilityController@update — update all fields)
 *
 * Access to these endpoints is restricted to admin only (enforced by RoleMiddleware).
 * The `exists` rules validate foreign keys against the facility_types and
 * facility_statuses lookup tables to prevent invalid FK references.
 */
class StoreFacilityRequest extends FormRequest
{
    /**
     * Admin access is enforced by the route middleware, so always return true here.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules applied to the facility create/update payload.
     *
     * Rules:
     *   - fac_name        : required, max 150 chars
     *   - fac_type_id     : required integer, must exist in facility_types table
     *   - fac_location    : required, max 200 chars (e.g. "Gedung A Lt.1")
     *   - fac_capacity    : optional integer ≥ 1 (null is valid for equipment/tools with no seat count)
     *   - fac_description : optional free-text description
     *   - fac_stat_id     : required integer, must exist in facility_statuses table
     *   - fac_image       : optional, stored as a path string (upload is handled separately), max 255 chars
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'fac_name'        => 'required|string|max:150',
            'fac_type_id'     => 'required|integer|exists:facility_types,fac_type_id',
            'fac_location'    => 'required|string|max:200',
            'fac_capacity'    => 'nullable|integer|min:1',
            'fac_description' => 'nullable|string',
            'fac_stat_id'     => 'required|integer|exists:facility_statuses,fac_stat_id',
            'fac_image'       => 'nullable|string|max:255',
        ];
    }
}
