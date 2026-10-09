# Uni-FaRe — University Facility Reservations

Aplikasi web **Uni-FaRe** untuk mengelola penggunaan fasilitas kampus (ruang kelas, aula, laboratorium, alat, lapangan). Pengguna dapat mengecek ketersediaan, mengajukan reservasi, dan melaporkan kerusakan. Petugas dan admin memproses kedua alur secara terpusat.

---

## Status Proyek

✅ **Selesai (100%)** — Semua fitur sesuai dokumen spesifikasi telah diimplementasikan, termasuk fitur ekspor rekapitulasi fasilitas dalam format CSV, Excel, dan PDF. Proses QA Testing dan perbaikan bug akhir diselesaikan oleh **PM**.

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | React 18 (Vite) + TypeScript + React Router v6 + Vanilla CSS + Tailwind CSS v3 + Axios + Lucide React |
| **Backend** | Laravel (REST API mode) |
| **Auth** | Laravel Sanctum (token-based) |
| **Database** | PostgreSQL 16 |
| **Dev Environment** | XAMPP (PHP 8.5+), PostgreSQL, Composer, Node.js |
| **Export** | maatwebsite/excel (v4) + barryvdh/laravel-dompdf |
| **Kalender** | FullCalendar React |

---

## Struktur Folder

```
code/
├── backend/                 # Laravel REST API
├── frontend/                # React 18 SPA (Vite)
├── CHANGELOG-agent.md       # Log eksekusi agent AI
├── implementation_plan.md   # Panduan implementasi lengkap
├── agentic-ai-sop.md        # SOP workflow AI agent
└── README.md
```

---

## Prasyarat

Pastikan software berikut sudah terinstall di komputer kamu:

- **PHP 8.5+** via XAMPP (bukan Herd Lite, karena butuh ekstensi lengkap)
- **Composer 2.x**
- **Node.js v18+** dan **npm 9+**
- **PostgreSQL 16**
- **Git**

### Versi yang digunakan tim ini:
```bash
php --version      # PHP 8.5.10 (XAMPP)
composer --version # Composer 2.x
node --version     # v22.x
npm --version      # 10.x
```

> PENTING: Pastikan PATH terminal mengarah ke PHP XAMPP, bukan XAMPP lama atau Herd Lite.
> Cek dengan: `where.exe php` -> harus menampilkan `C:\xampp\php\php.exe`

---

## Cara Setup Lokal (Untuk Anggota Baru)

### 1. Clone Repository

```bash
git clone <URL_REPO_GITHUB_KALIAN>
cd code
```

### 2. Setup Backend (Laravel)

```bash
cd backend

# Install dependencies
composer install

# Salin file environment
cp .env.example .env

# Generate application key
php artisan key:generate
```

#### Konfigurasi .env

Buka file `backend/.env` dan sesuaikan konfigurasi database:

```env
APP_NAME="Uni-FaRe"
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=pg-142719bd-ppk-4datab4se.g.aivencloud.com
DB_PORT=16399
DB_DATABASE=fasilitas_kampus
DB_USERNAME=avnadmin
DB_PASSWORD=the_password_that_is_sent_in_group
DB_SSLMODE=require

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
CACHE_STORE=file
```

#### Buat Database PostgreSQL

Database dan semua tabel dikelola oleh **DBA tim** (teman yang memegang akses Aiven Cloud). Beritahu DBA untuk membuat tabel berikut jika belum ada:

> **Tabel yang dibuat oleh Laravel migrations** (sudah ada, Batch 1):
> `roles`, `user_statuses`, `facility_types`, `facility_statuses`, `reservation_statuses`, `report_categories`, `report_statuses`, `users`, `facilities`, `reservations`, `reports`

> **Tabel tambahan untuk Laravel Sanctum** — minta DBA jalankan SQL ini:
> ```sql
> -- Tabel untuk menyimpan token autentikasi (Laravel Sanctum)
> CREATE TABLE personal_access_tokens (
>     id BIGSERIAL PRIMARY KEY,
>     tokenable_type VARCHAR(255) NOT NULL,
>     tokenable_id BIGINT NOT NULL,
>     name VARCHAR(255) NOT NULL,
>     token VARCHAR(64) NOT NULL UNIQUE,
>     abilities TEXT NULL,
>     last_used_at TIMESTAMP WITH TIME ZONE NULL,
>     expires_at TIMESTAMP WITH TIME ZONE NULL,
>     created_at TIMESTAMP WITH TIME ZONE NULL,
>     updated_at TIMESTAMP WITH TIME ZONE NULL
> );
> CREATE INDEX personal_access_tokens_tokenable_idx
>     ON personal_access_tokens (tokenable_type, tokenable_id);
> ```

#### Jalankan Seeder

```bash
# Tabel sudah dibuat oleh DBA — langsung jalankan seeder saja
php artisan db:seed
```

> **Catatan:** Jangan jalankan `php artisan migrate` karena semua tabel sudah dibuat manual oleh DBA di Aiven Cloud. Jalankan migrate hanya jika setup di database lokal sendiri.

#### Jalankan Backend Server

```bash
php artisan serve
# Backend berjalan di: http://localhost:8000
```

---

### 3. Setup Frontend (React)

```bash
cd ../frontend

# Install dependencies
npm install

# Jalankan dev server
npm run dev
# Frontend berjalan di: http://localhost:5173
```

---

## Akun Demo (Setelah Seeder Dijalankan)

| Role | Email | Password | Status |
|------|-------|----------|--------|
| Admin | admin@kampus.ac.id | password123 | active |
| Petugas | petugas@kampus.ac.id | password123 | active |
| Pengguna | user@kampus.ac.id | password123 | active |

---

## Package Yang Sudah Terinstall

### Backend (backend/composer.json)
- `laravel/sanctum` - Autentikasi token
- `maatwebsite/excel:^4.0` - Export Excel
- `barryvdh/laravel-dompdf` - Export PDF

### Frontend (frontend/package.json)
- `react-router-dom` - Routing SPA
- `axios` - HTTP client
- `lucide-react` - Icon library
- `@fullcalendar/react@^6.1.15` + plugins - Kalender slot (**pastikan versi 6.x, bukan 7.x**)

> ⚠️ **Penting:** Setelah `npm install`, pastikan versi `@fullcalendar/react` adalah **6.x** (bukan 7.x).
> Jika salah versi, jalankan: `npm install @fullcalendar/react@6.1.15`

### Storage Symlink (wajib dijalankan sekali)
Agar foto laporan bisa diakses via URL publik:
```bash
# Di folder backend/
php artisan storage:link
```

---

## Status Kode Saat Ini (Update: 1 Okt 2026)

### Backend (`backend/`)
| Komponen | Status | Keterangan |
|----------|--------|------------|
| Project Laravel | ✅ Ada | `composer install` cukup |
| Database migrations | ✅ Ran (Batch 1) | 11 tabel di Aiven Cloud |
| Seeder (DatabaseSeeder) | ✅ Ran | 3 user dummy + data master |
| Seeder (FacilitySeeder) | ✅ Ran | 10 fasilitas dummy (semua tipe) |
| `routes/api.php` | ✅ Ada | Auth + Facility + Reservation + Report routes |
| `config/cors.php` | ✅ Ada | Dikonfigurasi untuk `localhost:5173` |
| Eloquent Models | ✅ Ada | `User`, `Facility`, `Reservation`, `Report` + 7 model lookup |
| `personal_access_tokens` | ✅ Selesai | Tabel sudah dibuat di Aiven Cloud |
| `AuthController` + Middleware | ✅ Ada | register, login, logout, me — `RoleMiddleware`, `EnsureUserIsActive` |
| `FacilityController` | ✅ Ada | index, show, slots, store, update, updateStatus |
| `ReservationController` | ✅ Selesai | store, myList, show, cancel, queue, approve, reject, forceCancel + conflict detection |
| `StoreReservationRequest` | ✅ Selesai | Validasi lengkap pengajuan reservasi |
| `ReportController` | ✅ Selesai | store (+ foto upload), myList, queue, updateStatus |
| `StoreReportRequest` | ✅ Selesai | Validasi laporan + foto |
| Storage symlink | ✅ Selesai | `php artisan storage:link` sudah dijalankan |
| Admin Controllers | ❌ Belum | Target Fase 6 |

### Frontend (`frontend/`)
| Komponen | Status | Keterangan |
|----------|--------|------------|
| Project React + Vite | ✅ Ada | `npm install` cukup |
| API Layer | ✅ Ada | `api/axios.ts`, `api/auth.ts`, `api/facilities.js`, `api/reservations.ts`, `api/reports.ts` |
| AuthContext + useAuth | ✅ Ada | Login/logout state global |
| Layout (AppLayout, Navbar, Sidebar, PublicLayout) | ✅ Ada | Sidebar role-based, redesign tema Uni-FaRe |
| ProtectedRoute | ✅ Ada | Guard auth + role check |
| LoginPage, RegisterPage | ✅ Ada | + Link kembali ke beranda |
| Common Components | ✅ Ada | StatusBadge, ConfirmModal, Pagination, LoadingSpinner, Alert, CursorGrid, UniversityLogo |
| Routing (App.tsx) | ✅ Ada | Public, user, officer, admin routes |
| Fasilitas UI | ✅ Ada | HomePage, FacilityDetailPage, FacilityCard, FacilityFilter, SlotCalendar (custom grid) |
| UI Redesign + Branding | ✅ Ada | Tema bunny.net, rebranding Uni-FaRe, Navbar publik dengan Masuk/Daftar |
| DashboardPage | ✅ Ada | Info user, ringkasan statistik fasilitas kampus |
| NewReservationPage | ✅ Ada | Form ajukan reservasi + fasilitas picker + waktu mulai/selesai |
| MyReservationsPage | ✅ Ada | List reservasi + badge status + tombol batalkan |
| NewReportPage | ✅ Ada | Form laporan + upload foto + preview |
| MyReportsPage | ✅ Ada | List laporan + thumbnail foto + badge status/kategori |
| Officer / Admin UI | ❌ Belum | Target Fase 6 |

---

## Roadmap Implementasi (7 Fase)

Lihat detail lengkap di `implementation_plan.md` dan `parallel_work_plan.md`.

| Fase | Minggu | Deskripsi | Status |
|------|--------|-----------|--------|
| **1. Setup** | M1 (4-6 Sep) | Init Laravel + React + PostgreSQL, migrasi, seeder | ✅ Selesai |
| **2. Auth** | M1 (7-17 Sep) | AuthController, Sanctum, LoginPage, RegisterPage, AuthContext | ✅ Selesai (BE + FE) |
| **3. Fasilitas** | M2 (11-23 Sep) | CRUD fasilitas, slot API, FacilityCard, SlotCalendar | ✅ **Selesai** (BE + FE merged 29 Sep) |
| **4. Reservasi** | M3 (23-27 Sep) | Reservasi + conflict detection, form + antrian | ✅ **Selesai** (Backend + Frontend, 1 Okt) |
| **5. Laporan** | M3-M4 (27-30 Sep) | Laporan kerusakan + foto, riwayat + antrian | ✅ **Selesai** (Backend + Frontend, 1 Okt) |
| **6. Admin** | M4 (1-5 Okt) | User management, rekap, export CSV/Excel/PDF | 🔴 Harus dimulai sekarang |
| **7. Polish** | M5 (6-10 Okt) | Bug fix, UI polish, persiapan presentasi | ⬜ Belum |

---

## Pembagian Kerja Tim

| Anggota | Fokus | Tanggung Jawab |
|---------|-------|----------------|
| **A** | Backend Core | Setup Laravel, migrations, Sanctum auth, middleware, CORS, seeder |
| **B** | Backend Fitur | ReservationController, ReportController, FacilityController, validasi slot, conflict detection, upload foto |
| **C** | Frontend Core | Setup React+Vite, React Router, AuthContext, AppLayout (Navbar, Sidebar), ProtectedRoute, halaman auth |
| **D** | Frontend Fitur | Halaman reservasi, laporan, SlotCalendar (FullCalendar), form validasi client-side, komponen common |
| **E** (jika 5) | Admin + Officer | Backend: Admin controllers, RecapController, export. Frontend: semua halaman admin + officer |

---

## API Endpoints Ringkasan

| Grup | Base Path | Keterangan |
|------|-----------|------------|
| Auth | /api/auth/... | Register, Login, Logout, Me |
| Fasilitas | /api/facilities/... | CRUD + slots |
| Reservasi | /api/reservations/... | Ajukan, riwayat, antrian, approve/reject |
| Laporan | /api/reports/... | Buat laporan, riwayat, antrian, update status |
| Admin | /api/admin/... | User management, rekap, export |

Detail lengkap ada di `implementation_plan.md` bagian API Endpoints.

---

## Troubleshooting Umum

### PHP tidak terdeteksi / versi salah
```powershell
# Pastikan PATH mengarah ke XAMPP
where.exe php
# Jika salah, jalankan:
$env:PATH = "C:\xampp\php;" + $env:PATH
```

### Error extension=gd tidak aktif
Buka `C:\xampp\php\php.ini`, pastikan baris ini TIDAK diawali titik koma (;):
```ini
extension=gd
extension=pdo_pgsql
extension=pgsql
```

### Error koneksi PostgreSQL
- Pastikan PostgreSQL service sedang berjalan
- Cek konfigurasi DB_USERNAME, DB_PASSWORD, dan DB_DATABASE di backend/.env

### CORS error saat frontend request ke backend
`config/cors.php` sudah dikonfigurasi untuk `localhost:5173`.
Jika masih error, cek dua hal:
1. `SANCTUM_STATEFUL_DOMAINS=localhost:5173` ada di `backend/.env`
2. Backend dijalankan via `php artisan serve` (bukan langsung via Apache/Nginx)

---

## Catatan Pengembangan

- Gunakan `CHANGELOG-agent.md` untuk mencatat setiap perubahan besar
- Panduan implementasi lengkap ada di `implementation_plan.md`
- Workflow penggunaan AI agent ada di `agentic-ai-sop.md`
- **Deadline: 11 Oktober 2026**

---

Dibuat untuk mata kuliah PPK - Universitas Diponegoro
