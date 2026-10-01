<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * RegisterRequest
 *
 * Validates the payload for the POST /api/auth/register endpoint.
 * On success, AuthController@register inserts the user with:
 *   - role_id   = 1 (pengguna)
 *   - u_stat_id = 1 (pending — awaiting admin verification)
 */
class RegisterRequest extends FormRequest
{
    /**
     * Anyone may attempt to register — no prior authorisation needed.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules applied to the registration payload.
     *
     * Rules:
     *   - full_name : required, max 100 chars
     *   - email     : required, valid email format, must be unique in users table, max 150 chars
     *   - password  : required, min 8 chars, must match password_confirmation field
     *   - nim_nip   : optional — student ID (NIM) or staff ID (NIP), max 30 chars
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'full_name' => 'required|string|max:100',
            'email'     => 'required|string|email|unique:users,email|max:150',
            'password'  => 'required|string|min:8|confirmed',
            'nim_nip'   => 'nullable|string|max:30',
        ];
    }
}
