<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

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

    public function messages(): array
    {
        return [
            'facility_id.required'      => 'Pilih fasilitas terlebih dahulu.',
            'facility_id.exists'        => 'Fasilitas tidak ditemukan.',
            'reservation_date.required' => 'Tanggal reservasi wajib diisi.',
            'reservation_date.after_or_equal' => 'Tanggal reservasi tidak boleh di masa lalu.',
            'start_time.required'       => 'Waktu mulai wajib diisi.',
            'end_time.required'         => 'Waktu selesai wajib diisi.',
            'end_time.after'            => 'Waktu selesai harus setelah waktu mulai.',
            'purpose.required'          => 'Tujuan peminjaman wajib diisi.',
            'purpose.min'               => 'Tujuan minimal 10 karakter.',
        ];
    }
}
