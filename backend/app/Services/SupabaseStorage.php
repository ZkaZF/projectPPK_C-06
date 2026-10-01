<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;


class SupabaseStorage
{
    public function upload(UploadedFile $file, string $folder): string
    {
        $path = $folder . '/' . Str::uuid() . '.' . $file->extension();

        $response = Http::withHeaders($this->headers())
            ->withBody($file->get(), $file->getMimeType())
            ->post($this->objectUrl($path));

        if ($response->failed()) {
            throw new \RuntimeException('Supabase upload failed: ' . $response->body());
        }

        return $path;
    }

    public function delete(?string $path): void
    {
        if ($path) {
            Http::withHeaders($this->headers())->delete($this->objectUrl($path));
        }
    }

    public function publicUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        return config('services.supabase.url') . '/storage/v1/object/public/'
            . config('services.supabase.bucket') . '/' . $path;
    }

    private function objectUrl(string $path): string
    {
        return config('services.supabase.url') . '/storage/v1/object/'
            . config('services.supabase.bucket') . '/' . $path;
    }

    private function headers(): array
    {
        $key = config('services.supabase.key');
        $headers = ['apikey' => $key];

        // Only legacy JWT-style keys (eyJ...) go in the Authorization header
        if (str_starts_with($key, 'eyJ')) {
            $headers['Authorization'] = 'Bearer ' . $key;
        }

        return $headers;
    }
}