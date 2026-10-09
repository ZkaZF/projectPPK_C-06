<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rule;

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
            'fac_image'       => Rule::when(
                $this->hasFile('fac_image'),
                ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
                ['nullable', 'string', 'max:255']
            ),
        ];
    }

    public function messages(): array
    {
        return [
            'fac_image.uploaded' => $this->uploadFailureMessage(),
            'fac_image.image' => 'File yang dipilih bukan foto yang valid.',
            'fac_image.mimes' => 'Jenis foto ini belum didukung. Pilih foto JPG, PNG, atau WebP.',
            'fac_image.max' => 'Ukuran foto maksimal 5 MB. Silakan pilih foto yang lebih kecil.',
        ];
    }

    private function uploadFailureMessage(): string
    {
        $file = $this->file('fac_image');
        if (!$file instanceof UploadedFile) {
            return 'Foto tidak berhasil dikirim. Periksa koneksi internet lalu coba lagi.';
        }

        return match ($file->getError()) {
            UPLOAD_ERR_INI_SIZE => $this->fileTooLargeMessage(),
            UPLOAD_ERR_FORM_SIZE => 'Foto terlalu besar untuk diunggah. Silakan pilih foto yang lebih kecil.',
            UPLOAD_ERR_PARTIAL => 'Foto belum terkirim sepenuhnya. Periksa koneksi internet lalu coba lagi.',
            UPLOAD_ERR_NO_TMP_DIR,
            UPLOAD_ERR_CANT_WRITE,
            UPLOAD_ERR_EXTENSION => 'Foto belum dapat diunggah saat ini. Coba lagi nanti, atau hubungi pengelola sistem jika masalah berlanjut.',
            default => 'Foto tidak berhasil diunggah. Periksa koneksi internet lalu coba lagi.',
        };
    }

    private function fileTooLargeMessage(): string
    {
        $setting = trim((string) ini_get('upload_max_filesize'));
        if (preg_match('/^(\d+(?:\.\d+)?)\s*([KMG])?B?$/i', $setting, $matches) !== 1) {
            return 'Foto terlalu besar untuk diunggah. Silakan pilih foto yang lebih kecil.';
        }

        $multiplier = match (strtoupper($matches[2] ?? '')) {
            'G' => 1024 ** 3,
            'M' => 1024 ** 2,
            'K' => 1024,
            default => 1,
        };
        $bytes = (float) $matches[1] * $multiplier;
        $readableLimit = match (true) {
            $bytes >= 1024 ** 3 => round($bytes / (1024 ** 3), 1) . ' GB',
            $bytes >= 1024 ** 2 => round($bytes / (1024 ** 2), 1) . ' MB',
            $bytes >= 1024 => round($bytes / 1024) . ' KB',
            default => null,
        };

        if ($readableLimit === null) {
            return 'Foto terlalu besar untuk diunggah. Silakan pilih foto yang lebih kecil.';
        }

        return "Foto terlalu besar untuk diunggah. Ukuran maksimal saat ini sekitar {$readableLimit}. Silakan pilih foto yang lebih kecil.";
    }
}
