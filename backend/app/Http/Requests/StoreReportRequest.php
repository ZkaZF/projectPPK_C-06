<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * StoreReportRequest
 *
 * Validates the payload for POST /api/reports (ReportController@store).
 * Accepts multipart/form-data because the rep_photo field is an optional file upload.
 *
 * After validation passes, the controller uploads the photo to Supabase Storage
 * and saves only the relative path in the database — not the raw file bytes.
 */
class StoreReportRequest extends FormRequest
{
    /**
     * All authenticated users may submit a report — no extra authorisation check needed here.
     * Route-level middleware (auth:sanctum) handles authentication.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules applied to the report submission payload.
     *
     * Rules:
     *   - fac_id          : required integer, must reference an existing row in facilities
     *   - rep_cat_id      : required integer, must reference an existing row in report_categories
     *   - rep_description : required, minimum 10 characters to ensure a meaningful description
     *   - rep_photo       : optional file upload; must be an image (jpg/jpeg/png/webp), max 2 MB
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'fac_id'          => ['required', 'integer', 'exists:facilities,fac_id'],
            'rep_cat_id'      => ['required', 'integer', 'exists:report_categories,rep_cat_id'],
            'rep_description' => ['required', 'string', 'min:10'],
            'rep_photo'       => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
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
            'fac_id.required'          => 'Please select the facility you are reporting.',
            'fac_id.exists'            => 'The selected facility was not found.',
            'rep_cat_id.required'      => 'Please select a report category.',
            'rep_cat_id.exists'        => 'The selected category is not valid.',
            'rep_description.required' => 'A problem description is required.',
            'rep_description.min'      => 'Description must be at least 10 characters.',
            'rep_photo.image'          => 'The uploaded file must be an image.',
            'rep_photo.mimes'          => 'Photo must be in jpg, png, or webp format.',
            'rep_photo.max'            => 'Photo file size must not exceed 2 MB.',
        ];
    }
}