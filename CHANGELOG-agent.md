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

## 2026-09-11
- **[Fase 1] Lanjutan Setup (Database — PostgreSQL Aiven Cloud)**
  - **Status:** ✅ Selesai
  - **Detail:**
    - Review & merge branch `feature/db-setup-custom` (Orang 1 / Akka) ke `main`.
    - 11 tabel migration berhasil dijalankan ke PostgreSQL Aiven Cloud.
    - Seeder berhasil: 3 user dummy (admin, petugas, mahasiswa) + data master (roles, statuses, facility_types, dll).
    - Konfigurasi `.env` diperbarui: `DB_HOST=pg-142719bd-ppk-4datab4se.g.aivencloud.com`, `DB_PORT=16399`.
    - Koneksi ke database diverifikasi via `php artisan db:show` — 12 tabel, 472 KB.
    - Session/Cache/Queue diubah ke `file`/`sync` karena tabel bawaan Laravel dihapus di migration custom.

## 2026-09-17
- **[Fase 1] Lanjutan Setup (Eloquent Models & CORS)**
  - **Status:** ✅ Selesai
  - **Detail:**
    - Dibuat 9 Eloquent Model baru: `Facility`, `Reservation`, `Report` (model utama) + `Role`, `UserStatus`, `FacilityType`, `FacilityStatus`, `ReservationStatus`, `ReportCategory`, `ReportStatus` (model lookup).
    - Diperbarui `User.php`: tambah trait `HasApiTokens` (Sanctum), custom primary key `user_id`, custom password column `user_password`, dan semua relasi ke model lain.
    - Dibuat `config/cors.php`: izinkan `localhost:5173` (React) akses ke API Laravel.
    - `routes/api.php` sudah ada (dibuat oleh `php artisan install:api`).
    - **Pending:** Tabel `personal_access_tokens` belum dibuat — perlu jalankan SQL via Beekeeper Studio.

- **[Fase 2 & 3] Merge PR #3 — Backend Auth & Fasilitas (Orang 1 / Akka)**
  - **Status:** ✅ Selesai (Backend)
  - **Detail:**
    - PR `feat/backend-auth-facility` di-review oleh PM dan di-merge ke `main`.
    - File yang masuk: `AuthController`, `FacilityController`, `ReservationController` (stub/kosong), `RoleMiddleware`, `EnsureUserIsActive`, `RegisterRequest`, `LoginRequest`, `StoreFacilityRequest`, update `routes/api.php` dan `bootstrap/app.php`.
    - File HTML test (`login.html`, `register.html`, `dashboard.html`, `test-auth.html`) dihapus dari `main` setelah merge.
    - **Catatan review:** password `min` tidak konsisten di `LoginRequest` (seharusnya min:8), pesan error middleware masih casual ("bruv").

## 2026-09-23
- **[Fase 2 & 3] Merge PR #5 — Frontend Core (Orang 2)**
  - **Status:** ✅ Selesai
  - **Detail:**
    - PR `feat/frontend-core` di-review oleh PM secara lokal (run `npm run dev` + `php artisan serve`, test login/UI) dan di-merge ke `main`.
    - File yang masuk:
      - **API Layer:** `api/axios.ts`, `api/auth.ts`
      - **Auth:** `contexts/AuthContext.tsx`, `hooks/useAuth.ts`
      - **Layout:** `components/layout/AppLayout.tsx`, `Navbar.tsx`, `Sidebar.tsx`, `ProtectedRoute.tsx`
      - **Pages:** `pages/public/LoginPage.tsx`, `RegisterPage.tsx`, `ForbiddenPage.tsx`
      - **Common Components:** `StatusBadge.tsx`, `ConfirmModal.tsx`, `Pagination.tsx`, `LoadingSpinner.tsx`, `Alert.tsx`, `UniversityLogo.tsx`
      - **Routing:** `App.tsx` dengan React Router lengkap (public, user, officer, admin routes)
      - **Utils:** `constants.ts`, `formatters.ts`
      - **Styling:** `style.css` (21KB — custom CSS lengkap)
    - **Catatan:** Perlu unregister Service Worker dari proyek lain (Monochrome) yang menyangkut di `localhost:5173` sebelum bisa testing.
    - Login berhasil ditest dengan akun `admin@kampus.ac.id` / `password123`.

- **[Fase 3] PR Pending — Frontend Fasilitas (Orang 3)**
  - **Status:** 🟡 Menunggu Review & Merge
  - **Detail:**
    - Branch `feat/frontend-facility` sudah ada di remote dengan 10 commit.
    - File yang ada di branch:
      - `api/facilities.js`, `__mocks__/facilities.js`
      - `components/facilities/FacilityCard.jsx`, `FacilityFilter.jsx`, `SlotCalendar.jsx`, `FacilityForm.jsx`
      - `pages/public/HomePage.jsx`, `FacilityDetailPage.jsx`
      - `utils/slotValidation.js`
    - **⚠️ PERINGATAN:** Branch ini di-fork dari `main` sebelum merge PR #3 dan PR #5, sehingga **TIDAK berisi** kodingan backend auth, frontend core (AuthContext, layout, dll). Merge ke `main` kemungkinan akan ada konflik yang perlu di-resolve.

---

## Ringkasan Status Per Fase (23 Sep 2026)

| Fase | Backend | Frontend | Status Keseluruhan |
|------|---------|----------|--------------------|
| **1. Setup** | ✅ Laravel, DB, Models, CORS | ✅ React+Vite, Axios, folder structure | ✅ **Selesai** |
| **2. Auth** | ✅ AuthController, Sanctum, Middleware | ✅ LoginPage, RegisterPage, AuthContext, ProtectedRoute | ✅ **Selesai** |
| **3. Fasilitas** | ✅ FacilityController (CRUD + slots) | 🟡 FacilityCard, SlotCalendar, HomePage (di branch, belum merge) | 🟡 **Backend selesai, Frontend perlu merge** |
| **4. Reservasi** | 🔄 ReservationController (stub kosong) | ❌ Belum ada | 🔴 **Belum dikerjakan** |
| **5. Laporan** | ❌ ReportController belum ada | ❌ Belum ada | 🔴 **Belum dikerjakan** |
| **6. Admin** | ❌ Admin controllers belum ada | ❌ Belum ada | 🔴 **Belum dikerjakan** |
| **7. Polish** | — | — | ⬜ Nanti |

### Blocking Issues
- **Tabel `personal_access_tokens`** — Belum dibuat. Auth Sanctum tidak bisa berjalan di production tanpa tabel ini.
- **Branch `feat/frontend-facility`** — Perlu di-merge ke `main` dengan resolusi konflik.
