<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'fac_id'      => 'required|integer',
            'res_date'    => 'required|date|after_or_equal:today',
            'res_start'   => 'required|date_format:H:i:s',
            'res_end'     => 'required|date_format:H:i:s|after:res_start',
            'res_purpose' => 'required|string|max:255',
        ];
    }
}