<?php

namespace App\Services;

use Illuminate\Http\Client\RequestException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * SupabaseStorageService
 *
 * Wraps all HTTP interactions with the Supabase Storage REST API so that
 * controllers stay focused on HTTP request/response handling and delegate
 * file-management concerns to this single service.
 *
 * Configuration (read from .env):
 *   SUPABASE_URL         – Project base URL, e.g. https://xyz.supabase.co
 *   SUPABASE_SERVICE_KEY – Service-role secret key (full storage access)
 *   SUPABASE_BUCKET      – Target bucket name, e.g. "images"
 */
class SupabaseStorageService
{
    private string $baseUrl;
    private string $serviceKey;
    private string $bucket;

    public function __construct()
    {
        $this->baseUrl    = rtrim(config('services.supabase.url'), '/');
        $this->serviceKey = config('services.supabase.key');
        $this->bucket     = config('services.supabase.bucket');
    }

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    /**
     * Upload a file to the Supabase bucket and return its public URL.
     *
     * The object path inside the bucket is:
     *   facilities/<uuid>.<extension>
     *
     * @param  UploadedFile  $file  The validated uploaded file from the request.
     * @return string               The full public URL of the stored object.
     *
     * @throws \RuntimeException  When the Supabase API returns a non-2xx status.
     */
    public function upload(UploadedFile $file): string
    {
        // Generate a unique, collision-resistant object path.
        $extension  = $file->getClientOriginalExtension() ?: $file->guessExtension();
        $objectPath = 'facilities/' . Str::uuid() . '.' . $extension;

        $response = Http::withHeaders($this->authHeaders())
            ->withBody($file->getContent(), $file->getMimeType())
            ->post($this->storageEndpoint($objectPath));

        if ($response->failed()) {
            Log::error('Supabase upload failed', [
                'path'   => $objectPath,
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            throw new \RuntimeException('Supabase storage upload failed: ' . $response->body());
        }

        return $this->publicUrl($objectPath);
    }

    /**
     * Delete an object from the Supabase bucket identified by its public URL.
     *
     * If the provided URL does not belong to this project's Supabase instance,
     * the call is silently skipped (returning false) so that callers do not
     * need to distinguish between Supabase and legacy local URLs.
     *
     * @param  string  $imageUrl  The full public URL previously returned by upload().
     * @return bool               True if successfully deleted, false if skipped or failed.
     */
    public function delete(string $imageUrl): bool
    {
        $objectPath = $this->extractObjectPath($imageUrl);

        // Bail out silently when the URL is not from our Supabase project.
        if ($objectPath === null) {
            return false;
        }

        $response = Http::withHeaders($this->authHeaders())
            ->delete($this->storageEndpoint($objectPath));

        if ($response->failed()) {
            Log::warning('Supabase delete failed', [
                'url'    => $imageUrl,
                'path'   => $objectPath,
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            return false;
        }

        return true;
    }

    /**
     * Returns true when the given URL was served from this Supabase project.
     *
     * Use this helper in controllers to decide whether to call delete() or
     * fall back to Storage::disk('public')->delete() for legacy local files.
     *
     * @param  string  $url
     * @return bool
     */
    public function isSupabaseUrl(string $url): bool
    {
        return str_starts_with($url, $this->baseUrl . '/storage/v1/object/public/' . $this->bucket . '/');
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /**
     * Build the REST endpoint for a specific object inside the bucket.
     *
     * Used for both upload (POST) and delete (DELETE) requests.
     */
    private function storageEndpoint(string $objectPath): string
    {
        return "{$this->baseUrl}/storage/v1/object/{$this->bucket}/{$objectPath}";
    }

    /**
     * Build the publicly accessible URL for a stored object.
     */
    private function publicUrl(string $objectPath): string
    {
        return "{$this->baseUrl}/storage/v1/object/public/{$this->bucket}/{$objectPath}";
    }

    /**
     * Extract the object path relative to the bucket from a public Supabase URL.
     *
     * Returns null when the URL does not match the expected pattern, signalling
     * that it belongs to a different storage provider (e.g. local disk).
     *
     * Example input:
     *   https://xyz.supabase.co/storage/v1/object/public/images/facilities/abc.jpg
     * Example output:
     *   facilities/abc.jpg
     */
    private function extractObjectPath(string $imageUrl): ?string
    {
        $prefix = "{$this->baseUrl}/storage/v1/object/public/{$this->bucket}/";

        if (!str_starts_with($imageUrl, $prefix)) {
            return null;
        }

        return substr($imageUrl, strlen($prefix));
    }

    /**
     * Common HTTP headers required for Supabase Storage API calls.
     */
    private function authHeaders(): array
    {
        return [
            'Authorization' => 'Bearer ' . $this->serviceKey,
            'apikey'        => $this->serviceKey,
        ];
    }
}
