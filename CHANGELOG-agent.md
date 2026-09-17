# Log Eksekusi Agent

## 2026-09-05
- **[Fase 1] Setup Awal (Init Laravel + React)** 
  - **Status:** ✅ Selesai
  - **Detail Eksekusi:**
    - Membuat project backend dengan `composer create-project laravel/laravel backend`
    - Instalasi package backend: `laravel/sanctum`, `maatwebsite/excel:^4.0`, `barryvdh/laravel-dompdf`
    - Resolusi isu: Update PATH PHP ke versi 8.5.10 (via XAMPP) dan aktivasi ekstensi `gd`, `pdo_pgsql`, dll untuk mendukung `maatwebsite/excel`.
    - Membuat project frontend dengan `npm create vite@latest frontend -- --template react`
    - Instalasi package frontend: `react-router-dom`, `axios`, `@fullcalendar/react` dkk, `bootstrap`
    - User memutuskan untuk pause pekerjaan (stop di setup awal) untuk melakukan commit dan push ke GitHub.

## 2026-09-17
- **[Fase 2 & 3] Merge PR #3 — Backend Auth & Fasilitas (Orang 1 / Akka)**
  - **Status:** ✅ Selesai (Backend)
  - **Detail:**
    - PR `feat/backend-auth-facility` di-review oleh PM dan di-merge ke `main`.
    - File yang masuk: `AuthController`, `FacilityController`, `ReservationController` (sebagian), `RoleMiddleware`, `EnsureUserIsActive`, `RegisterRequest`, `LoginRequest`, `StoreFacilityRequest`, update `routes/api.php` dan `bootstrap/app.php`.
    - File HTML test (`login.html`, `register.html`, `dashboard.html`, `test-auth.html`) dihapus dari `main` setelah merge.
    - **Catatan review yang ditemukan:** password `min` tidak konsisten di `LoginRequest` (seharusnya min:8), pesan error middleware masih casual ("bruv").
    - **Frontend Fase 2 & 3** belum dikerjakan — menunggu Orang 2 & 3 push branch mereka.

- **[Fase 1] Lanjutan Setup (Database, Migrations & Seeders)**
  - **Status:** ✅ Selesai
  - **Detail Eksekusi:**
    - Teman user telah membuat database PostgreSQL di Aiven Cloud.
    - Konfigurasi `.env` telah disesuaikan oleh user.
    - File migrations (`backend/database/migrations/*`) dan seeder (`DatabaseSeeder.php`) telah berjalan sukses.
    - Telah diverifikasi bahwa terdapat data dummy (misal `Users` = 3 data) hasil eksekusi dari seeder.

- **[Fase 1] Lanjutan Setup (Eloquent Models & CORS)**
  - **Status:** ✅ Selesai
  - **Detail Eksekusi:**
    - Dibuat 9 Eloquent Model baru: `Facility`, `Reservation`, `Report` (model utama) + `Role`, `UserStatus`, `FacilityType`, `FacilityStatus`, `ReservationStatus`, `ReportCategory`, `ReportStatus` (model lookup).
    - Diperbarui `User.php`: tambah trait `HasApiTokens` (Sanctum), custom primary key `user_id`, custom password column `user_password`, dan semua relasi ke model lain.
    - Dibuat `config/cors.php`: izinkan `localhost:5173` (React) akses ke API Laravel.
    - `routes/api.php` sudah ada (dibuat oleh `php artisan install:api`).
    - **Pending:** Tabel `personal_access_tokens` belum dibuat — user perlu jalankan SQL via Beekeeper Studio (lihat README).

