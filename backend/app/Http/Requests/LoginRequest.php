<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * LoginRequest
 *
 * Validates the payload for the POST /api/auth/login endpoint.
 * Only basic format validation is performed here — credential verification
 * (password hash check, account status) is handled inside AuthController@login.
 */
class LoginRequest extends FormRequest
{
    /**
     * All users may attempt to log in — no prior authorisation needed.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules applied to the login payload.
     *
     * Rules:
     *   - email    : required, must be a valid email format, max 255 chars
     *   - password : required, minimum 8 characters
     *
     * Note: intentionally no "exists:users,email" check here to avoid
     * leaking whether an email address is registered in the system.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email'    => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
        ];
    }
}
