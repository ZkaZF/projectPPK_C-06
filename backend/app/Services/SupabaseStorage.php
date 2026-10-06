<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

/**
 * SupabaseStorage
 *
 * A thin wrapper around the Supabase Storage REST API.
 * Provides upload, delete, and public URL generation for files stored
 * in a configured Supabase Storage bucket.
 *
 * Configuration keys (set in config/services.php and .env):
 *   - SUPABASE_URL           → Base URL of the Supabase project (e.g. https://xyz.supabase.co)
 *   - SUPABASE_SERVICE_KEY   → Service role key used for authenticated API calls
 *   - SUPABASE_BUCKET        → Target bucket name (default: "images")
 */
class SupabaseStorage
{
    /**
     * Upload a file to Supabase Storage.
     *
     * Generates a unique filename using UUID to prevent collisions, then
     * sends the raw file bytes via HTTP PUT to the Supabase Storage object API.
     * Only the relative path (e.g. "reports/uuid.jpg") is returned — NOT a full URL.
     * Store this path in the database and use publicUrl() to resolve it when needed.
     *
     * @param  \Illuminate\Http\UploadedFile  $file    The validated uploaded file
     * @param  string                         $folder  Sub-folder inside the bucket (e.g. "reports")
     * @return string                                  Relative path to the stored file (e.g. "reports/uuid.jpg")
     *
     * @throws \RuntimeException  If the Supabase API returns a failure response
     */
    public function upload(UploadedFile $file, string $folder): string
    {
        // Build the storage path: folder/uuid.extension (e.g. reports/abc-123.jpg)
        $path = $folder . '/' . Str::uuid() . '.' . $file->extension();

        // Send the raw file bytes to the Supabase Storage object endpoint.
        $response = Http::withHeaders($this->headers())
            ->withBody($file->get(), $file->getMimeType())
            ->post($this->objectUrl($path));

        if ($response->failed()) {
            throw new \RuntimeException('Supabase upload failed: ' . $response->body());
        }

        // Return the relative path so the caller can store it in the database.
        return $path;
    }

    /**
     * Delete a file from Supabase Storage.
     *
     * Silently does nothing if $path is null or empty (handles the case where
     * a record has no associated file). Errors from the Supabase API are not
     * thrown to keep deletion non-blocking.
     *
     * @param  string|null  $path  Relative path of the file to delete (e.g. "reports/uuid.jpg")
     * @return void
     */
    public function delete(?string $path): void
    {
        if ($path) {
            Http::withHeaders($this->headers())->delete($this->objectUrl($path));
        }
    }

    /**
     * Resolve a relative file path into its full public URL.
     *
     * Constructs the Supabase public access URL for a file stored in the
     * configured bucket. Returns null if $path is null/empty (no photo uploaded).
     *
     * Example output:
     *   https://xyz.supabase.co/storage/v1/object/public/images/reports/uuid.jpg
     *
     * @param  string|null  $path  Relative path stored in the database (e.g. "reports/uuid.jpg")
     * @return string|null         Full public URL, or null if no path is given
     */
    public function publicUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        return config('services.supabase.url') . '/storage/v1/object/public/'
            . config('services.supabase.bucket') . '/' . $path;
    }

    /**
     * Build the full Supabase Storage object endpoint URL for a given path.
     *
     * Used internally for upload and delete operations (authenticated endpoints).
     * This differs from publicUrl() which targets the public access endpoint.
     *
     * @param  string  $path  Relative file path inside the bucket
     * @return string         Full API URL for the object
     */
    private function objectUrl(string $path): string
    {
        return config('services.supabase.url') . '/storage/v1/object/'
            . config('services.supabase.bucket') . '/' . $path;
    }

    /**
     * Build the HTTP headers required for authenticated Supabase Storage requests.
     *
     * The "apikey" header is always sent. The "Authorization: Bearer" header is
     * added only for JWT-style keys (those starting with "eyJ"), which is the
     * format used by Supabase service role keys.
     *
     * @return array<string, string>  Associative array of HTTP headers
     */
    private function headers(): array
    {
        $key     = config('services.supabase.key');
        $headers = ['apikey' => $key];

        // Only JWT-style keys (eyJ...) go in the Authorization header.
        if (str_starts_with($key, 'eyJ')) {
            $headers['Authorization'] = 'Bearer ' . $key;
        }

        return $headers;
    }
}