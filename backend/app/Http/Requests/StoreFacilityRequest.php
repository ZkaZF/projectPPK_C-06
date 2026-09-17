<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFacilityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for creating/updating a facility.
     * Uses prepared-statement-safe parameter binding via Laravel validation.
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
