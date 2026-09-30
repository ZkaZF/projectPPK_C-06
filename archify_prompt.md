# Prompt Lengkap untuk Archify — Uni-FaRe Architecture Diagram

Salin salah satu (atau semua) prompt di bawah ini ke Archify untuk membuat diagram arsitektur project **Uni-FaRe (University Facility Reservations)**.

---

## 🔹 Prompt 1: High-Level System Architecture (Overview Keseluruhan)

```
Buatkan diagram arsitektur sistem web application bernama "Uni-FaRe" (University Facility Reservations) dengan tech stack berikut:

FRONTEND (Client):
- Framework: React 18 + TypeScript (Vite sebagai build tool)
- Routing: React Router DOM v6
- HTTP Client: Axios (baseURL: http://localhost:8000)
- State Management: React Context API (AuthContext)
- Styling: Vanilla CSS (custom design system) + Lucide React Icons
- Authentication: Bearer Token (disimpan di localStorage)

BACKEND (Server):
- Framework: Laravel 11 (PHP 8.x)
- Authentication: Laravel Sanctum (token-based API auth)
- Database Driver: PostgreSQL
- Middleware: EnsureUserIsActive, RoleMiddleware

DATABASE (PostgreSQL):
- Tabel utama: users, facilities, reservations, reports
- Tabel lookup/referensi: roles, user_statuses, facility_types, facility_statuses, reservation_statuses, report_categories, report_statuses
- Tabel auth: personal_access_tokens (Sanctum)

KOMUNIKASI:
- Frontend berkomunikasi dengan Backend melalui REST API (JSON) via Axios
- Axios Interceptor otomatis menyisipkan Bearer Token di setiap request
- Axios Interceptor otomatis redirect ke /login jika menerima HTTP 401
- Backend merespons dalam format JSON

Tampilkan sebagai 3-tier architecture: Client (Browser) → API Server (Laravel) → Database (PostgreSQL).
Tampilkan juga alur autentikasi: Login → Token diterima → Token disimpan di localStorage → Token dikirim di setiap request header.
```

---

## 🔹 Prompt 2: Frontend Page Flow & Routing (Alur Navigasi Halaman)

```
Buatkan diagram alur navigasi halaman (page flow) untuk aplikasi React bernama "Uni-FaRe" dengan 3 level akses (role-based routing):

HALAMAN PUBLIK (tanpa login):
- "/" → Redirect otomatis ke "/login"
- "/login" (LoginPage) → Form email + password → Jika berhasil, redirect berdasarkan role:
  - role "admin" → redirect ke "/admin"
  - role "petugas" → redirect ke "/officer"
  - role "pengguna" → redirect ke "/dashboard"
- "/register" (RegisterPage) → Form registrasi (full_name, email, nim_nip, password) → Setelah sukses, tampilkan halaman konfirmasi "menunggu verifikasi admin"
- "/403" (ForbiddenPage) → Halaman akses ditolak

HALAMAN PENGGUNA (role: pengguna, petugas, admin):
Dibungkus oleh ProtectedRoute + AppLayout (Navbar + Sidebar + Main Content)
- "/dashboard" → Dashboard (ringkasan aktivitas)
- "/facilities/:id" → Detail Fasilitas (info + jadwal ketersediaan)
- "/reservations" → Daftar Reservasi Saya
- "/reservations/new" → Form Ajukan Reservasi Baru
- "/reports" → Daftar Laporan Saya
- "/reports/new" → Form Buat Laporan Kerusakan

HALAMAN PETUGAS (role: petugas, admin):
- "/officer" → Dashboard Petugas
- "/officer/reservations" → Antrian Reservasi (review & approval)
- "/officer/reports" → Antrian Laporan (tindak lanjut)

HALAMAN ADMIN (role: admin only):
- "/admin" → Dashboard Admin
- "/admin/facilities" → Kelola Fasilitas (CRUD)
- "/admin/users" → Kelola User
- "/admin/verify" → Verifikasi Akun Baru
- "/admin/recap" → Rekap & Export Data

LAYOUT:
- Semua halaman terautentikasi dibungkus AppLayout yang terdiri dari:
  - Navbar (atas): Logo Uni-FaRe, nama user, avatar, tombol logout
  - Sidebar (kiri): Menu navigasi dinamis berdasarkan role user
  - Main Content (tengah): Konten halaman aktif

Tampilkan sebagai flowchart/sitemap tree yang menunjukkan hubungan antar halaman dan kondisi redirect.
Beri warna berbeda untuk setiap level akses (Publik, Pengguna, Petugas, Admin).
```

---

## 🔹 Prompt 3: Backend API & Data Flow (Alur Komunikasi Backend)

```
Buatkan diagram alur komunikasi backend REST API untuk aplikasi Laravel "Uni-FaRe":

API ENDPOINTS:

1. AUTH ROUTES (prefix: /api/auth):
   [PUBLIC]
   - POST /api/auth/register → AuthController@register → Membuat user baru (status: pending/menunggu verifikasi)
   - POST /api/auth/login → AuthController@login → Validasi kredensial → Generate Sanctum token → Return user data + token

   [PROTECTED - auth:sanctum]
   - POST /api/auth/logout → AuthController@logout → Revoke token
   - GET /api/auth/me → AuthController@me → Return data user yang sedang login

2. FACILITY ROUTES (prefix: /api):
   [PUBLIC]
   - GET /api/facilities → FacilityController@index → List semua fasilitas
   - GET /api/facilities/{id} → FacilityController@show → Detail satu fasilitas
   - GET /api/facilities/{id}/slots → FacilityController@slots → Jadwal slot ketersediaan

   [PROTECTED - auth:sanctum + role:admin]
   - POST /api/facilities → FacilityController@store → Tambah fasilitas baru
   - PUT /api/facilities/{id} → FacilityController@update → Edit fasilitas

   [PROTECTED - auth:sanctum + role:petugas,admin]
   - PATCH /api/facilities/{id}/status → FacilityController@updateStatus → Ubah status fasilitas

MIDDLEWARE PIPELINE:
Request masuk → CORS → auth:sanctum (cek token) → EnsureUserIsActive (cek user aktif) → RoleMiddleware (cek role) → Controller

ELOQUENT MODELS & RELASI:
- User → belongsTo Role, belongsTo UserStatus, hasMany Reservation, hasMany Report
- Facility → belongsTo FacilityType, belongsTo FacilityStatus, hasMany Reservation, hasMany Report
- Reservation → belongsTo User, belongsTo Facility, belongsTo ReservationStatus
- Report → belongsTo User, belongsTo Facility, belongsTo ReportCategory, belongsTo ReportStatus

DATABASE TABLES (PostgreSQL):
Lookup tables: roles, user_statuses, facility_types, facility_statuses, reservation_statuses, report_categories, report_statuses
Main tables: users, facilities, reservations, reports
Auth table: personal_access_tokens

Tampilkan sebagai LAYERED BLOCK DIAGRAM (kotak berlapis dari atas ke bawah) dengan susunan:

LAYER 1 (paling atas) — CLIENT:
Kotak "React Frontend (Axios)" dengan panah keluar bertuliskan "HTTP Request + Bearer Token"

LAYER 2 — MIDDLEWARE PIPELINE:
3 kotak berurutan horizontal: [CORS] → [auth:sanctum] → [EnsureUserIsActive] → [RoleMiddleware]
Tandai mana yang dilewati (skip) untuk public routes vs protected routes

LAYER 3 — CONTROLLERS:
2 kotak: [AuthController] dan [FacilityController]
Di dalam masing-masing kotak, tampilkan method-methodnya (register, login, logout, me / index, show, slots, store, update, updateStatus)

LAYER 4 — MODELS (Eloquent ORM):
Kotak-kotak model: User, Facility, Reservation, Report
Hubungkan dengan garis relasi (belongsTo, hasMany)

LAYER 5 (paling bawah) — DATABASE:
Kotak "PostgreSQL" berisi daftar tabel:
- Main: users, facilities, reservations, reports
- Lookup: roles, user_statuses, facility_types, facility_statuses, reservation_statuses, report_categories, report_statuses
- Auth: personal_access_tokens

Gunakan panah dua arah antara setiap layer untuk menunjukkan alur Request (turun) dan Response (naik).
Beri warna berbeda untuk setiap layer agar mudah dibedakan.
Sertakan juga ERD sederhana di samping atau di bawah diagram utama yang menunjukkan relasi antar tabel.
```

---

## 🔹 Prompt 4: Komponen Frontend Architecture (Struktur Internal React)

```
Buatkan diagram arsitektur internal frontend React untuk aplikasi "Uni-FaRe":

ENTRY POINT:
index.html → Main.tsx → App.tsx (BrowserRouter + AuthProvider + Routes)

STATE MANAGEMENT:
- AuthContext.tsx → Menyimpan data user yang login, token, dan fungsi login/logout
- useAuth.ts (custom hook) → Shortcut untuk mengakses AuthContext

API LAYER:
- axios.ts → Axios instance dengan:
  - baseURL: http://localhost:8000
  - Request interceptor: auto-inject Bearer token dari localStorage
  - Response interceptor: auto-redirect ke /login jika 401
- auth.ts → API functions:
  - loginApi(email, password) → POST /api/auth/login
  - registerApi(data) → POST /api/auth/register
  - logoutApi() → POST /api/auth/logout
  - getMeApi() → GET /api/auth/me

LAYOUT COMPONENTS:
- AppLayout.tsx → Wrapper (Navbar + Sidebar + <Outlet/>)
- Navbar.tsx → Logo Uni-FaRe, user info, logout button
- Sidebar.tsx → Menu navigasi dinamis per role
- ProtectedRoute.tsx → Route guard: cek auth + role → redirect /login atau /403

COMMON COMPONENTS:
- Alert.tsx → Notifikasi banner (error/success)
- ConfirmModal.tsx → Dialog konfirmasi
- CursorGrid.tsx → Animasi grid interaktif di halaman auth
- LoadingSpinner.tsx → Indikator loading
- Pagination.tsx → Navigasi halaman data
- StatusBadge.tsx → Badge status berwarna
- UniversityLogo.tsx → Logo universitas (SVG)

PAGE COMPONENTS:
- LoginPage.tsx → Form login dengan animasi CursorGrid
- RegisterPage.tsx → Form registrasi multi-step
- ForbiddenPage.tsx → Halaman 403
- (Dummy pages untuk Dashboard, Reservasi, Laporan, dll. — masih placeholder)

Tampilkan sebagai component tree/dependency diagram yang menunjukkan hierarki dan ketergantungan antar komponen.
```
