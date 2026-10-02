# Pembagian Kerja Paralel — Update 2 Oktober 2026

> **Deadline Proyek: 11 Oktober 2026** (tersisa ±9 hari)
> Dokumen ini sudah diperbarui dengan progress terkini. Bagian yang sudah selesai ditandai ✅.

---

## PM (Project Manager) —

Kamu bertanggung jawab di **seluruh fase** dengan tugas yang berbeda-beda:

### Fase 1–3 (Selesai ✅)
- [x] Setup awal proyek (Laravel + React + PostgreSQL)
- [x] Review & merge PR Orang 1 (`feat/backend-auth-facility`)
- [x] Review & merge PR Orang 2 (`feat/frontend-core`)
- [x] Review & merge PR Orang 3 (`feat/frontend-facility`) — **resolve konflik** ✅ (29 Sep)
- [x] Update dokumentasi (CHANGELOG, README, parallel_work_plan) ✅ (29 Sep)

### PM — Pekerjaan UI & Branding (29 Sep)
- [x] Membuat branch `feat/ui-redesign` — redesign auth pages dan app layout dengan tema bunny.net
- [x] Integrasi komponen `CursorGrid` sebagai animasi interaktif di halaman login/register
- [x] Integrasi `lucide-react` sebagai icon library menggantikan emoji
- [x] Re-branding nama proyek dari "UniSpace" → **"Uni-FaRe"** (University Facility Reservations)
- [x] Menambahkan animasi "Pop & Hover Highlight" pada tombol show/hide password
- [x] Menambahkan `.archify/` ke `.gitignore`
- [x] Membuat dokumentasi arsitektur teknis (prompt Archify) untuk visualisasi tim
- [x] Review PR #7 dari Orang 3 — memberikan feedback 6 poin (3 bug kritis + 3 minor)

### Fase 4–6 (Checkpoint Review)
- [ ] Review & test setiap PR sebelum merge ke `main`
- [ ] Test end-to-end setelah merge (Login → Fasilitas → Reservasi → Laporan → Admin)
- [ ] Koordinasi antar anggota jika ada bottleneck / dependency
- [x] Pastikan semua blocking issue terselesaikan (misal tabel `personal_access_tokens`) ✅

### Fase 7 — UI Finishing & Polish (Ini bagianmu!)
- [x] Review seluruh tampilan UI secara menyeluruh
- [x] Perbaiki konsistensi warna, spacing, font, dan layout antar halaman
- [ ] Pastikan responsiveness di mobile (375px) dan desktop (1440px)
- [x] Polish micro-interactions: hover effects, transisi halaman, loading states ✅ (2 Okt - Fix loading spinner setelah login)
- [ ] Pastikan error states ditampilkan dengan baik
- [ ] Review dan rapikan CSS/styling secara keseluruhan
- [x] Tambah `FacilitySeeder` — 10 data fasilitas dummy (semua tipe) ✅ (1 Okt)
- [x] Perbaikan Sidebar UX untuk Admin/Petugas (Reorder menu & ubah label) ✅ (2 Okt)
- [x] Integrasi UI `FileUploadCard` dengan setup Tailwind CSS v3 untuk form laporan ✅ (2 Okt)
- [x] Fix blank page issue (missing imports) di `NewReportPage` ✅ (2 Okt)
- [ ] Finalisasi seed data untuk demo presentasi
- [ ] Persiapan slide / alur demo presentasi
- [ ] Testing end-to-end final: Register → Verify → Login → Reservasi → Laporan → Admin Export

### PM mengambil alih Fase 4 & 5 (PM, 1 Okt)
- [x] Implementasi `StoreReservationRequest` (validasi lengkap) ✅
- [x] Implementasi `ReservationController` penuh (store, myList, show, cancel, queue, approve, reject, forceCancel + conflict detection) ✅
- [x] Implementasi `StoreReportRequest` ✅
- [x] Buat `ReportController` baru (store + foto upload, myList, queue, updateStatus) ✅
- [x] Update `routes/api.php` dengan semua route reservasi & laporan ✅
- [x] Jalankan `php artisan storage:link` untuk akses foto ✅
- [x] Buat `src/api/reservations.ts` (API layer) ✅
- [x] Buat `src/api/reports.ts` (API layer) ✅
- [x] Buat `NewReservationPage.tsx` (form + fasilitas picker + slot waktu) ✅
- [x] Buat `MyReservationsPage.tsx` (list + badge status + batalkan) ✅
- [x] Buat `NewReportPage.tsx` (form + upload foto + preview) ✅
- [x] Buat `MyReportsPage.tsx` (list + thumbnail foto + badge) ✅
- [x] Update Sidebar: tambahkan link Ajukan Reservasi & Buat Laporan ✅
- [x] Ganti `SlotCalendar` dari FullCalendar (crash) ke custom slot grid dengan error boundary ✅
- [x] Buat `PublicLayout` (Navbar tanpa sidebar untuk halaman publik) ✅
- [x] Update Navbar: tampilkan Masuk/Daftar saat belum login ✅

## 📊 Rekap Progress Fase 1–3

### ✅ Orang 1 (Backend Engineer / Akka) — SELESAI Fase 2 & 3
- **Branch:** `feat/backend-auth-facility` → **Sudah di-merge ke `main`** (PR #3)
- Semua endpoint Auth (register, login, logout, me) ✅
- FacilityController (index, show, slots, store, update, updateStatus) ✅
- ReservationController (stub kosong, method signatures saja) ✅
- Middleware (RoleMiddleware, EnsureUserIsActive) ✅

### ✅ Orang 2 (Frontend Core Engineer) — SELESAI Fase 2 & 3
- **Branch:** `feat/frontend-core` → **Sudah di-merge ke `main`** (PR #5)
- Axios instance + interceptor ✅
- AuthContext + useAuth ✅
- LoginPage, RegisterPage, ForbiddenPage ✅
- AppLayout, Navbar, Sidebar (role-based), ProtectedRoute ✅
- Common components (StatusBadge, ConfirmModal, Pagination, LoadingSpinner, Alert) ✅
- App.tsx routing lengkap (public, user, officer, admin) ✅

### ✅ Orang 3 (Frontend Fasilitas Engineer) — MERGED (29 Sep)
- **Branch:** `feat/frontend-facility` → **Di-merge ke `main`** (29 Sep, conflict resolved oleh PM)
- FacilityCard, FacilityFilter, SlotCalendar, FacilityForm ✅
- HomePage, FacilityDetailPage ✅
- Mock data + API layer facilities ✅
- slotValidation.js ✅
- Migrasi semua komponen dari .jsx ke .tsx ✅ (commit terbaru)
- Type definitions (`types/facility.ts`) ✅
- **Catatan:** PM sudah review PR #7 dan memberikan 6 poin feedback (3 bug kritis, 3 minor). Orang 3 sudah fix dan push ulang.

---

## ✅ Blocking Issue — Sudah Diselesaikan

| # | Issue | Status | Diselesaikan |
|---|-------|--------|------|
| 1 | Tabel `personal_access_tokens` belum ada | ✅ Selesai | Sudah dibuat di database Aiven Cloud |
| 2 | Branch `feat/frontend-facility` belum di-merge | ✅ Selesai (29 Sep) | PM resolve konflik di `App.tsx` dan `package-lock.json`, lalu merge ke `main` |

---

## 🔥 Fase 4: Reservasi (Target: 23–27 Sep)

### 👤 Orang 1 — Backend Reservasi
**Branch Git:** `feat/backend-reservation`

- [x] Buat `app/Http/Requests/StoreReservationRequest.php` ✅ (dikerjakan PM, 1 Okt)
- [x] Isi `ReservationController` yang sudah ada:
  - [x] `store()` → validasi + cek conflict → simpan dengan status `pending` ✅
  - [x] `myList()` → reservasi milik user yang login ✅
  - [x] `show($id)` → detail + relasi facility, user ✅
  - [x] `cancel($id)` → batalkan milik sendiri ✅
  - [x] `queue()` → daftar antrian status `pending` (untuk petugas) ✅
  - [x] `approve($id)` → cek conflict lagi → ubah status ke `approved` ✅
  - [x] `reject($id)` → ubah status ke `rejected` + `cancel_reason` ✅
  - [x] `forceCancel($id)` → ubah status `approved` → `cancelled` + alasan ✅
- [x] Tambahkan routes reservasi ke `routes/api.php` ✅

**Output:** Semua endpoint reservasi bisa di-hit via Postman dengan response JSON yang benar.

---

### 👤 Orang 2 — Frontend Reservasi
**Branch Git:** `feat/frontend-reservation`

- [x] Buat `src/api/reservations.ts` ✅ (dikerjakan PM, 1 Okt)
- [x] Buat `src/pages/user/NewReservationPage.tsx` ✅
- [x] Buat `src/pages/user/MyReservationsPage.tsx` ✅
- [x] Buat `src/pages/user/DashboardPage.tsx` ✅ (sudah ada sebelumnya)
- [x] Buat `src/pages/officer/ReservationQueuePage.tsx` — Antrian petugas ✅ (2 Okt - PM)

**Output:** User bisa ajukan reservasi, lihat riwayat, batalkan. Petugas bisa approve/reject dari antrian.

---

### 👤 Orang 3 — Ekstraksi Komponen Reservasi & Fasilitas
**Branch Git:** Buat branch `feat/frontend-refactor-components` dari `main`

- [x] **PRIORITAS:** Resolve konflik merge `feat/frontend-facility` → `main` bersama PM ✅ (Diselesaikan PM)
- [x] Ganti mock data di `HomePage.tsx` dengan API call real dari backend ✅ (Diselesaikan PM)
- [x] Pastikan `SlotCalendar` bisa fetch slot dari backend ✅ (Diselesaikan PM)
- [ ] **TUGAS UTAMA:** Ekstrak UI form reservasi dari `src/pages/user/NewReservationPage.tsx` menjadi komponen reusable `src/components/reservations/ReservationForm.tsx`.
- [ ] **TUGAS UTAMA:** Ekstrak UI list riwayat reservasi dari `src/pages/user/MyReservationsPage.tsx` menjadi komponen reusable `src/components/reservations/ReservationTable.tsx`.

**Output:** Halaman fasilitas menampilkan data real. Komponen reservasi siap dipakai oleh Orang 2.

---

## 📋 Fase 5: Laporan Kerusakan (Target: 27–30 Sep)

### 👤 Orang 1 — Backend Laporan
**Branch Git:** `feat/backend-report`

- [x] Buat `app/Http/Controllers/ReportController.php` ✅ (dikerjakan PM, 1 Okt)
  - [x] `store()` → simpan laporan + upload foto ke `storage/app/public/reports/` ✅
  - [x] `myList()` → laporan milik user login ✅
  - [x] `queue()` → antrian laporan untuk petugas (status `baru`/`diproses`) ✅
  - [x] `updateStatus($id)` → ubah status + catatan resolusi + catat `handled_by` ✅
- [x] Buat `app/Http/Requests/StoreReportRequest.php` ✅
- [x] Jalankan `php artisan storage:link` untuk akses foto via URL publik ✅
- [x] Tambahkan routes laporan ke `routes/api.php` ✅

### 👤 Orang 2 — Frontend Laporan
**Branch Git:** `feat/frontend-report`

- [x] Buat `src/api/reports.ts` ✅ (dikerjakan PM, 1 Okt)
- [x] Buat `src/pages/user/NewReportPage.tsx` — form laporan + upload foto + preview ✅
- [x] Buat `src/pages/user/MyReportsPage.tsx` — riwayat laporan + StatusBadge ✅
- [x] Buat `src/pages/officer/ReportQueuePage.tsx` — antrian laporan, ubah status ✅ (2 Okt - PM)
- [ ] Buat `src/pages/officer/OfficerDashboardPage.tsx` *(target Fase 6)*

### 👤 Orang 3 — Ekstraksi Komponen Laporan
- [x] **TUGAS UTAMA:** Ekstrak UI form laporan dari `src/pages/user/NewReportPage.tsx` menjadi komponen reusable `src/components/reports/ReportForm.tsx` ✅ (2 Okt - PM)
- [x] **TUGAS UTAMA:** Ekstrak UI list riwayat laporan dari `src/pages/user/MyReportsPage.tsx` menjadi komponen reusable `src/components/reports/ReportTable.tsx` ✅ (2 Okt - PM)
- [ ] Buat `src/components/reports/ReportQueue.tsx` — tabel antrian laporan untuk petugas.

---

## 📋 Fase 6: Admin (Target: 1–5 Okt)

### 👤 Orang 1 — Backend Admin
**Branch Git:** `feat/backend-admin`

- [ ] Buat `app/Http/Controllers/Admin/UserController.php`
  - `index()` → daftar semua user (paginasi)
  - `store()` → buat akun petugas/pengguna langsung (tanpa pending)
  - `verify($id)` → verifikasi/tolak akun pending
- [ ] Buat `app/Http/Controllers/Admin/RecapController.php`
  - `index()` → data rekap (jumlah reservasi per fasilitas, laporan per kategori, dll)
  - `export($format)` → export CSV / Excel / PDF
- [ ] Buat `app/Exports/RecapExport.php` (menggunakan `maatwebsite/excel`)

### 👤 Orang 2 — Frontend Admin
**Branch Git:** `feat/frontend-admin`

- [x] Buat `src/api/admin.ts` ✅ (2 Okt - PM)
- [x] Buat `src/pages/admin/AdminDashboardPage.tsx` — statistik keseluruhan ✅ (2 Okt - PM)
- [ ] Buat `src/pages/admin/ManageFacilitiesPage.tsx` — CRUD fasilitas (integrasi FacilityForm)
- [x] Buat `src/pages/admin/ManageUsersPage.tsx` — buat akun petugas/pengguna ✅ (2 Okt - PM)
- [x] Buat `src/pages/admin/VerifyUsersPage.tsx` — verifikasi akun pending ✅ (2 Okt - PM)
- [x] Buat `src/pages/admin/RecapPage.tsx` — tabel rekap + tombol export CSV/Excel ✅ (2 Okt - PM)/PDF

---

## 📋 Fase 7: Polish (Target: 6–10 Okt)

**Semua anggota:**
- [ ] Bug fixing
- [ ] UI Polish & responsiveness (mobile 375px ↔ desktop 1440px)
- [ ] Seed data final untuk demo presentasi
- [ ] Testing end-to-end: Register → Verify → Login → Reservasi → Laporan → Admin Export
- [ ] Persiapan presentasi

---

## ⭐ Checkpoint Review — PM

### Checkpoint 1: Setelah Fase 4 (±27 Sep)
| # | Tugas PM |
|---|----------|
| 1 | Merge branch `feat/frontend-facility` → `main` (resolve konflik) |
| 2 | Review & merge `feat/backend-reservation` |
| 3 | Review & merge `feat/frontend-reservation` |
| 4 | Test end-to-end: Login → Lihat fasilitas → Pilih slot → Ajukan reservasi → Approve/Reject |
| 5 | Pastikan SlotCalendar menampilkan data slot real dari backend |
| 6 | Update CHANGELOG & README |

### Checkpoint 2: Setelah Fase 5 (±30 Sep)
| # | Tugas PM |
|---|----------|
| 1 | Review & merge `feat/backend-report` dan `feat/frontend-report` |
| 2 | Test: Buat laporan + foto → Petugas update status → Fasilitas ditandai "dalam perbaikan" |
| 3 | Update CHANGELOG & README |

### Checkpoint 3: Setelah Fase 6 (±5 Okt)
| # | Tugas PM |
|---|----------|
| 1 | Review & merge `feat/backend-admin` dan `feat/frontend-admin` |
| 2 | Test: Admin buat akun → verifikasi → CRUD fasilitas → export rekap |
| 3 | Final update semua dokumentasi |

---

## 🌿 Git Branching (Updated)

```
main
├── feat/backend-auth-facility     ← Orang 1 (✅ Merged PR #3)
├── feat/frontend-core             ← Orang 2 (✅ Merged PR #5)
├── feat/frontend-facility         ← Orang 3 (✅ Merged 29 Sep, conflict resolved)
├── feat/ui-redesign               ← PM (✅ Merged — UI redesign + rebranding Uni-FaRe)
│
├── feat/backend-reservation       ← Orang 1 (🔴 Fase 4 — MULAI SEKARANG)
├── feat/frontend-reservation      ← Orang 2 (🔴 Fase 4 — MULAI SEKARANG)
│
├── feat/backend-report            ← Orang 1 (⬜ Fase 5)
├── feat/frontend-report           ← Orang 2 (⬜ Fase 5)
│
├── feat/backend-admin             ← Orang 1 (⬜ Fase 6)
└── feat/frontend-admin            ← Orang 2 (⬜ Fase 6)
```

> [!IMPORTANT]
> **Sebelum mulai Fase 4**, pastikan:
> 1. Branch `feat/frontend-facility` sudah di-merge ke `main`
> 2. Tabel `personal_access_tokens` sudah dibuat di database
> 3. Semua anggota `git pull origin main` agar sinkron
> 4. Buat branch baru dari `main` terbaru untuk Fase 4
