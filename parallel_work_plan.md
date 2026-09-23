# Pembagian Kerja Paralel — Update 23 September 2026

> **Deadline Proyek: 11 Oktober 2026** (tersisa ±18 hari)
> Dokumen ini sudah diperbarui dengan progress terkini. Bagian yang sudah selesai ditandai ✅.

---

## 👑 PM (Project Manager) — Peran Kamu

Kamu bertanggung jawab di **seluruh fase** dengan tugas yang berbeda-beda:

### Fase 1–3 (Ongoing)
- [x] Setup awal proyek (Laravel + React + PostgreSQL)
- [x] Review & merge PR Orang 1 (`feat/backend-auth-facility`)
- [x] Review & merge PR Orang 2 (`feat/frontend-core`)
- [ ] Review & merge PR Orang 3 (`feat/frontend-facility`) — **resolve konflik**
- [ ] Update dokumentasi (CHANGELOG, README, parallel_work_plan)

### Fase 4–6 (Checkpoint Review)
- [ ] Review & test setiap PR sebelum merge ke `main`
- [ ] Test end-to-end setelah merge (Login → Fasilitas → Reservasi → Laporan → Admin)
- [ ] Koordinasi antar anggota jika ada bottleneck / dependency
- [ ] Pastikan semua blocking issue terselesaikan (misal tabel `personal_access_tokens`)

### Fase 7 — UI Finishing & Polish (Ini bagianmu!)
- [ ] Review seluruh tampilan UI secara menyeluruh
- [ ] Perbaiki konsistensi warna, spacing, font, dan layout antar halaman
- [ ] Pastikan responsiveness di mobile (375px) dan desktop (1440px)
- [ ] Polish micro-interactions: hover effects, transisi halaman, loading states
- [ ] Pastikan error states ditampilkan dengan baik (form validation, 404, 403, network error)
- [ ] Review dan rapikan CSS/styling secara keseluruhan
- [ ] Finalisasi seed data untuk demo presentasi
- [ ] Persiapan slide / alur demo presentasi
- [ ] Testing end-to-end final: Register → Verify → Login → Reservasi → Laporan → Admin Export

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

### 🟡 Orang 3 (Frontend Fasilitas Engineer) — PERLU MERGE
- **Branch:** `feat/frontend-facility` → **Sudah push, belum di-merge**
- FacilityCard, FacilityFilter, SlotCalendar, FacilityForm ✅
- HomePage, FacilityDetailPage ✅
- Mock data + API layer facilities ✅
- slotValidation.js ✅
- **⚠️ Branch ini fork dari `main` sebelum PR #3 dan #5 masuk. Saat merge kemungkinan ada konflik yang perlu di-resolve.**

---

## 🚨 Blocking Issue — Harus Segera Diselesaikan

| # | Issue | Siapa | Cara |
|---|-------|-------|------|
| 1 | Tabel `personal_access_tokens` belum ada | **Orang 1** | Jalankan `php artisan install:api` lalu `php artisan migrate`, atau buat manual via Beekeeper |
| 2 | Branch `feat/frontend-facility` belum di-merge | **PM** | Review → resolve konflik → merge ke `main` |

---

## 🔥 Fase 4: Reservasi (Target: 23–27 Sep)

### 👤 Orang 1 — Backend Reservasi
**Branch Git:** `feat/backend-reservation`

- [ ] Buat `app/Services/ReservationService.php`
  - Method `hasConflict($facilityId, $date, $start, $end, $excludeId)` — cek bentrok slot approved
- [ ] Buat `app/Http/Requests/StoreReservationRequest.php`
  - Validasi: `facility_id` (exists), `reservation_date` (date, after_or_equal:today), `start_time` & `end_time` (format H:i, kelipatan 30 menit, jam 07:00–20:00), `purpose` (min:10)
- [ ] Isi `ReservationController` yang sudah ada (saat ini stub kosong):
  - `store()` → validasi + cek conflict → simpan dengan status `pending`
  - `myList()` → reservasi milik user yang login, urutkan terbaru
  - `show($id)` → detail + relasi facility, user
  - `cancel($id)` → batalkan milik sendiri (hanya jika status pending/approved)
  - `queue()` → daftar antrian status `pending` (untuk petugas)
  - `approve($id)` → cek conflict lagi → ubah status ke `approved`, catat `processed_by`
  - `reject($id)` → ubah status ke `rejected` + `cancel_reason`
  - `forceCancel($id)` → ubah status `approved` → `cancelled` + alasan
- [ ] Tambahkan routes reservasi ke `routes/api.php` (sesuai yang ada di `implementation_plan.md`)

**Output:** Semua endpoint reservasi bisa di-hit via Postman dengan response JSON yang benar.

---

### 👤 Orang 2 — Frontend Reservasi
**Branch Git:** `feat/frontend-reservation`

- [ ] Buat `src/api/reservations.ts`
  - `createReservation(data)`, `getMyReservations()`, `getReservation(id)`, `cancelReservation(id)`, `getReservationQueue()`, `approveReservation(id)`, `rejectReservation(id, reason)`
- [ ] Buat `src/pages/user/NewReservationPage.tsx`
  - Pilih fasilitas → lihat SlotCalendar → klik slot → isi form tujuan → submit
  - Integrasi dengan `SlotCalendar` dari Orang 3
- [ ] Buat `src/pages/user/MyReservationsPage.tsx`
  - Tabel riwayat reservasi sendiri + StatusBadge
  - Tombol "Batalkan" pada reservasi pending/approved → ConfirmModal
- [ ] Buat `src/pages/user/DashboardPage.tsx`
  - Ringkasan: jumlah reservasi aktif, laporan pending
- [ ] Buat `src/pages/officer/ReservationQueuePage.tsx`
  - Tabel antrian reservasi pending
  - Tombol Approve / Reject per baris → ConfirmModal

**Output:** User bisa ajukan reservasi, lihat riwayat, batalkan. Petugas bisa approve/reject dari antrian.

---

### 👤 Orang 3 — Integrasi Fasilitas + Bantu Reservasi UI
**Branch Git:** Lanjutkan di `feat/frontend-facility` atau buat `feat/frontend-facility-integration`

- [ ] **PRIORITAS:** Resolve konflik merge `feat/frontend-facility` → `main` bersama PM
- [ ] Ganti mock data di `HomePage.jsx` dengan API call real dari backend
- [ ] Pastikan `SlotCalendar` bisa fetch slot dari backend (`/api/facilities/{id}/slots?date=`)
- [ ] Buat `src/components/reservations/ReservationForm.tsx` — form dengan field: tanggal, waktu mulai/selesai, tujuan
- [ ] Buat `src/components/reservations/ReservationTable.tsx` — tabel riwayat dengan kolom: fasilitas, tanggal, waktu, status, aksi

**Output:** Halaman fasilitas menampilkan data real. Komponen reservasi siap dipakai oleh Orang 2.

---

## 📋 Fase 5: Laporan Kerusakan (Target: 27–30 Sep)

### 👤 Orang 1 — Backend Laporan
**Branch Git:** `feat/backend-report`

- [ ] Buat `app/Http/Controllers/ReportController.php`
  - `store()` → simpan laporan + upload foto ke `storage/app/public/reports/`
  - `myList()` → laporan milik user login
  - `queue()` → antrian laporan untuk petugas (status `baru`/`diproses`)
  - `updateStatus($id)` → ubah status + catatan resolusi + catat `handled_by`
- [ ] Buat `app/Http/Requests/StoreReportRequest.php`
  - Validasi: `fac_id` (exists), `rep_cat_id` (exists), `rep_description` (min:10), `rep_photo` (nullable|image|max:2048)
- [ ] Jalankan `php artisan storage:link` untuk akses foto via URL publik
- [ ] Tambahkan routes laporan ke `routes/api.php`

### 👤 Orang 2 — Frontend Laporan
**Branch Git:** `feat/frontend-report`

- [ ] Buat `src/api/reports.ts`
- [ ] Buat `src/pages/user/NewReportPage.tsx` — form laporan + upload foto + preview
- [ ] Buat `src/pages/user/MyReportsPage.tsx` — riwayat laporan + StatusBadge
- [ ] Buat `src/pages/officer/ReportQueuePage.tsx` — antrian laporan, ubah status + catatan resolusi
- [ ] Buat `src/pages/officer/OfficerDashboardPage.tsx` — ringkasan antrian reservasi & laporan

### 👤 Orang 3 — Komponen Laporan
- [ ] Buat `src/components/reports/ReportForm.tsx` — form + upload foto + preview
- [ ] Buat `src/components/reports/ReportTable.tsx` — tabel riwayat dengan filter status
- [ ] Buat `src/components/reports/ReportQueue.tsx` — tabel antrian petugas

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

- [ ] Buat `src/api/admin.ts`
- [ ] Buat `src/pages/admin/AdminDashboardPage.tsx` — statistik keseluruhan
- [ ] Buat `src/pages/admin/ManageFacilitiesPage.tsx` — CRUD fasilitas (integrasi FacilityForm)
- [ ] Buat `src/pages/admin/ManageUsersPage.tsx` — buat akun petugas/pengguna
- [ ] Buat `src/pages/admin/VerifyUsersPage.tsx` — verifikasi akun pending
- [ ] Buat `src/pages/admin/RecapPage.tsx` — tabel rekap + tombol export CSV/Excel/PDF

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
├── feat/frontend-facility         ← Orang 3 (🟡 Perlu merge + resolve konflik)
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
