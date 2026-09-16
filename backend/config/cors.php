<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Konfigurasi ini mengizinkan frontend React (localhost:5173) mengakses
    | Laravel API (localhost:8000). Tanpa ini, browser akan memblokir semua
    | request dari React ke Laravel karena perbedaan port (cross-origin).
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    /*
    | Izinkan React dev server (Vite default port 5173).
    | Tambahkan URL lain di sini jika deploy ke domain/port berbeda.
    */
    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    /*
    | Harus true untuk Sanctum cookie-based auth.
    | Kita pakai token-based (localStorage), tapi tetap diset true
    | agar header Authorization diteruskan dengan benar.
    */
    'supports_credentials' => true,

];
