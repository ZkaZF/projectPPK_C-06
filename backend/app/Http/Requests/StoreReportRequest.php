<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fac_id'          => ['required', 'integer', 'exists:facilities,fac_id'],
            'rep_cat_id'      => ['required', 'integer', 'exists:report_categories,rep_cat_id'],
            'rep_description' => ['required', 'string', 'min:10'],
            'rep_photo'       => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'fac_id.required'          => 'Pilih fasilitas yang akan dilaporkan.',
            'fac_id.exists'            => 'Fasilitas tidak ditemukan.',
            'rep_cat_id.required'      => 'Pilih kategori laporan.',
            'rep_cat_id.exists'        => 'Kategori tidak valid.',
            'rep_description.required' => 'Deskripsi masalah wajib diisi.',
            'rep_description.min'      => 'Deskripsi minimal 10 karakter.',
            'rep_photo.image'          => 'File foto harus berupa gambar.',
            'rep_photo.mimes'          => 'Foto harus berformat jpg, png, atau webp.',
            'rep_photo.max'            => 'Ukuran foto maksimal 2MB.',
        ];
    }
}