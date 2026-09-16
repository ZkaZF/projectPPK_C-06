# Pembagian Kerja Paralel: Fase 2 (Auth) + Fase 3 (Fasilitas)

> **Kamu (PM)** masuk setelah **Orang 1, 2, dan 3 selesai** untuk review & integrasi.
> Ketiga orang bisa langsung mulai **secara bersamaan hari ini**.

---

## 👤 Orang 1 — Backend Engineer

**Scope:** Semua Laravel backend untuk Auth + Fasilitas
**Branch Git:** `feat/backend-auth-facility`

### Fase 2 — Auth Backend
- [ ] Jalankan `php artisan install:api` → konfirmasi `yes` untuk migrasi `personal_access_tokens`
- [ ] Buat `app/Http/Requests/RegisterRequest.php`
  - Validasi: `full_name`, `email` (unique), `password` (min:8|confirmed), `nim_nip` (nullable)
- [ ] Buat `app/Http/Requests/LoginRequest.php`
  - Validasi: `email`, `password`
- [ ] Buat `app/Http/Controllers/Auth/AuthController.php` dengan 4 method:
  - `register()` → simpan user, role_id=1, u_stat_id=1 (pending), return pesan
  - `login()` → cek password + cek `u_stat_id = active`, return Sanctum token + data user
  - `logout()` → revoke current token
  - `me()` → return user dengan relasi role & status
- [ ] Buat `app/Http/Middleware/RoleMiddleware.php`
  - Cek role dari `$request->user()->role->role_name`
  - Tolak dengan 403 jika role tidak sesuai
- [ ] Buat `app/Http/Middleware/EnsureUserIsActive.php`
  - Cek `$request->user()->status->u_status_name === 'active'`
- [ ] Daftarkan middleware di `bootstrap/app.php`
- [ ] Tulis routes di `routes/api.php`:
  ```
  POST /api/auth/register
  POST /api/auth/login
  POST /api/auth/logout  [auth:sanctum]
  GET  /api/auth/me      [auth:sanctum]
  ```

### Fase 3 — Fasilitas Backend
- [ ] Buat `app/Http/Requests/StoreFacilityRequest.php`
  - Validasi: `fac_name`, `fac_type_id` (exists), `fac_location`, `fac_capacity` (nullable|integer), `fac_stat_id`, `fac_image` (nullable|image)
- [ ] Buat `app/Http/Controllers/FacilityController.php`:
  - `index()` → filter by `type`, `location`, `capacity` (query param)
  - `show($id)` → detail + relasi type & status
  - `slots($id, Request $request)` → query `reservations` approved pada tanggal `?date=`, return array slot 07:00–20:00 per 30 menit + status available/booked
  - `store()` → buat fasilitas baru (admin)
  - `update($id)` → edit fasilitas (admin)
  - `updateStatus($id)` → ubah `fac_stat_id` (petugas/admin)
- [ ] Tambahkan routes fasilitas ke `routes/api.php`:
  ```
  GET    /api/facilities           [public]
  GET    /api/facilities/{id}      [public]
  GET    /api/facilities/{id}/slots [public]
  POST   /api/facilities           [admin]
  PUT    /api/facilities/{id}      [admin]
  PATCH  /api/facilities/{id}/status [petugas|admin]
  ```

### Output yang harus siap saat Checkpoint:
- Semua endpoint bisa di-hit via Postman
- Dokumen contoh response JSON diserahkan ke Orang 2 & 3

---

## 👤 Orang 2 — Frontend Core Engineer

**Scope:** Infrastruktur React (Axios, Context, Routing, Layout, Auth Pages, Common Components)
**Branch Git:** `feat/frontend-core`

### Fase 2 — Auth Frontend
- [ ] Buat `src/api/axios.js`
  ```js
  // Instance Axios dengan baseURL http://localhost:8000
  // Interceptor request: attach 'Authorization: Bearer <token>' dari localStorage
  // Interceptor response: jika 401 → hapus token & redirect ke /login
  ```
- [ ] Buat `src/api/auth.js`
  - `loginApi(email, password)`
  - `registerApi(data)`
  - `logoutApi()`
  - `getMeApi()`
- [ ] Buat `src/contexts/AuthContext.jsx`
  - State: `user`, `token`, `loading`
  - Method: `login()`, `logout()`
  - Saat load: cek token di localStorage → panggil `getMeApi()` untuk restore session
- [ ] Buat `src/hooks/useAuth.js` → shortcut `useContext(AuthContext)`
- [ ] Buat `src/pages/public/LoginPage.jsx`
  - Form email + password
  - Panggil `auth.login()`, simpan token, redirect ke dashboard sesuai role
  - Tampilkan error jika akun pending / salah password
- [ ] Buat `src/pages/public/RegisterPage.jsx`
  - Form full_name, email, nim_nip (optional), password, password_confirmation
  - Tampilkan notif sukses "Akun menunggu verifikasi admin"
- [ ] Buat `src/components/layout/ProtectedRoute.jsx`
  - Redirect ke `/login` jika belum auth
  - Redirect ke halaman "403 Forbidden" jika role tidak sesuai

### Fase 3 — Layout + Routing + Common Components
- [ ] Buat `src/components/layout/AppLayout.jsx` → `<Navbar> + <Sidebar> + <Outlet />`
- [ ] Buat `src/components/layout/Navbar.jsx` → Logo kiri, nama user + tombol logout kanan
- [ ] Buat `src/components/layout/Sidebar.jsx`
  - Role `pengguna`: Dashboard, Reservasi Saya, Laporan Saya
  - Role `petugas`: tambah Antrian Reservasi, Antrian Laporan
  - Role `admin`: tambah kelola Fasilitas, Kelola User, Verifikasi, Rekap
- [ ] Buat semua komponen common:
  - `src/components/common/StatusBadge.jsx` → badge berwarna berdasarkan string status
  - `src/components/common/ConfirmModal.jsx` → modal dengan prop `title`, `message`, `onConfirm`, `onCancel`; opsional `textarea` untuk alasan
  - `src/components/common/Pagination.jsx`
  - `src/components/common/LoadingSpinner.jsx`
  - `src/components/common/Alert.jsx` (toast)
- [ ] Pasang routing lengkap di `src/App.jsx` sesuai peta routing di `implementation_plan.md`
- [ ] Buat `src/utils/constants.js` → jam operasional, enum status
- [ ] Buat `src/utils/formatters.js` → format tanggal, waktu

### Output yang harus siap saat Checkpoint:
- Login/logout berfungsi (bisa connect ke backend Orang 1 atau masih mock)
- Semua route navigasi berpindah halaman dengan benar
- Sidebar berubah sesuai role yang login

---

## 👤 Orang 3 — Frontend Fasilitas Engineer

**Scope:** Halaman publik + UI Fasilitas (dengan mock data dulu)
**Branch Git:** `feat/frontend-facility`

### Fase 2 — Persiapan (sejajar, tidak nunggu orang lain)
- [ ] Buat `src/utils/slotValidation.js` sesuai spec di `implementation_plan.md`
- [ ] Buat `src/api/facilities.js`
  - `getFacilitiesApi(filters)` → GET `/api/facilities`
  - `getFacilityApi(id)` → GET `/api/facilities/{id}`
  - `getSlotsApi(id, date)` → GET `/api/facilities/{id}/slots?date=`
  - `createFacilityApi(data)`, `updateFacilityApi(id, data)`, `updateFacilityStatusApi(id, status)`
- [ ] Siapkan **mock data lokal** di `src/__mocks__/facilities.js` untuk bisa develop tanpa backend

### Fase 3 — Halaman Fasilitas
- [ ] Buat `src/components/facilities/FacilityCard.jsx`
  - Tampilkan: nama, tipe (badge), lokasi, kapasitas, status
  - Tombol "Lihat Detail"
- [ ] Buat `src/components/facilities/FacilityFilter.jsx`
  - Dropdown: Tipe Fasilitas
  - Input: Lokasi (text search)
  - Input: Kapasitas minimal (number)
  - Tombol Reset Filter
- [ ] Buat `src/pages/public/HomePage.jsx`
  - Grid `FacilityCard` (gunakan mock data / connect ke API)
  - Pasang `FacilityFilter` di atas grid
  - Loading state + Empty state jika tidak ada hasil
- [ ] Buat `src/components/facilities/SlotCalendar.jsx`
  - Integrasi FullCalendar (`@fullcalendar/react`)
  - Fetch slots dari API untuk tanggal yang dipilih
  - Tampilkan slot hijau (tersedia) dan merah (terisi)
  - Klik slot tersedia → trigger prop callback `onSlotSelect(start, end)`
- [ ] Buat `src/pages/public/FacilityDetailPage.jsx`
  - Tampilkan detail fasilitas dari `/api/facilities/:id`
  - Embed `SlotCalendar`
  - Tombol "Ajukan Reservasi" → arahkan ke form reservasi (akan dikerjakan Fase 4)
- [ ] Buat `src/components/facilities/FacilityForm.jsx` (untuk admin)
  - Form tambah/edit fasilitas
  - Field: nama, tipe, lokasi, kapasitas, deskripsi, status, upload gambar

### Output yang harus siap saat Checkpoint:
- `HomePage` bisa menampilkan daftar fasilitas (minimal dengan mock data)
- `SlotCalendar` bisa render slot dan beri highlight warna
- `FacilityDetailPage` navigasi benar dari `HomePage`

---

## ⭐ Checkpoint Review — PM Masuk

Setelah ketiga orang selesai Fase 2 + 3, kamu masuk untuk:

| # | Tugas PM |
|---|----------|
| 1 | Test endpoint Auth Orang 1 via Postman (register, login, logout, me) |
| 2 | Test endpoint Fasilitas + Slots Orang 1 |
| 3 | Cek Login/Register Orang 2 bisa connect ke backend Orang 1 |
| 4 | Replace mock data Orang 3 dengan API call dari `facilities.js` Orang 2 |
| 5 | Cek `SlotCalendar` menampilkan data slot real dari backend |
| 6 | Merge ketiga branch → `main` (resolve konflik jika ada) |
| 7 | Test end-to-end: Login → Lihat fasilitas → Cek slot kalender |

---

## 🌿 Git Branching

```
main
├── feat/backend-auth-facility     ← Orang 1
├── feat/frontend-core             ← Orang 2
└── feat/frontend-facility         ← Orang 3
```

> [!IMPORTANT]
> Orang 1 harus **segera share contoh response JSON** untuk `/api/auth/login` dan `/api/facilities` ke grup, agar Orang 2 dan 3 bisa buat mock data dengan struktur yang sama.
