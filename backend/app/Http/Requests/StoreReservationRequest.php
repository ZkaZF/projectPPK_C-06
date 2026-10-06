<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * StoreReservationRequest
 *
 * Validates the payload for POST /api/reservations (ReservationController@store).
 * This is the server-side layer of a two-layer slot validation strategy:
 *   - Layer 1 (client): React validates slot format and operating hours for fast UX feedback.
 *   - Layer 2 (server): This request ensures the data is valid even if the client is bypassed.
 *
 * Note: conflict detection (checking for overlapping approved reservations) is NOT
 * handled here — it runs inside ReservationController@store using hasConflict().
 */
class StoreReservationRequest extends FormRequest
{
    /**
     * All authenticated users may submit a reservation — no extra authorisation check needed here.
     * Route-level middleware (auth:sanctum) handles authentication.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules applied to the reservation submission payload.
     *
     * Rules:
     *   - facility_id      : required integer, must reference an existing row in facilities
     *   - reservation_date : required, valid date, must not be in the past
     *   - start_time       : required, must match HH:MM 24-hour format
     *   - end_time         : required, must match HH:MM 24-hour format, must be after start_time
     *   - purpose          : required, minimum 10 characters to ensure a meaningful description
     *
     * Additional constraints (operating hours 07:00–20:00, 30-minute intervals) are
     * enforced at the controller level or via a custom validation Rule class.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'facility_id'      => ['required', 'integer', 'exists:facilities,fac_id'],
            'reservation_date' => ['required', 'date', 'after_or_equal:today'],
            'start_time'       => ['required', 'date_format:H:i'],
            'end_time'         => ['required', 'date_format:H:i', 'after:start_time'],
            'purpose'          => ['required', 'string', 'min:10'],
        ];
    }

    /**
     * Custom human-readable error messages returned in the JSON validation response.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'facility_id.required'            => 'Please select a facility.',
            'facility_id.exists'              => 'The selected facility was not found.',
            'reservation_date.required'       => 'Reservation date is required.',
            'reservation_date.after_or_equal' => 'Reservation date cannot be in the past.',
            'start_time.required'             => 'Start time is required.',
            'end_time.required'               => 'End time is required.',
            'end_time.after'                  => 'End time must be after the start time.',
            'purpose.required'                => 'Please provide a purpose for this reservation.',
            'purpose.min'                     => 'Purpose must be at least 10 characters.',
        ];
    }
}
