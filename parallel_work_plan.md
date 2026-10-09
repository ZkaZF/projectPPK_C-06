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
- [x] Review & test setiap PR sebelum merge ke `main` ✅
- [x] Test end-to-end setelah merge (Login → Fasilitas → Reservasi → Laporan → Admin) ✅
- [x] Koordinasi antar anggota jika ada bottleneck / dependency ✅
- [x] Pastikan semua blocking issue terselesaikan (misal tabel `personal_access_tokens`) ✅

### Fase 7 — UI Finishing & Polish (Ini bagianmu!)
- [x] Review seluruh tampilan UI secara menyeluruh
- [x] Perbaiki konsistensi warna, spacing, font, dan layout antar halaman
- [x] Pastikan responsiveness di mobile (375px) dan desktop (1440px) ✅ (9 Okt - Hero Section & Search Bar)
- [x] Polish micro-interactions: hover effects, transisi halaman, loading states ✅ (2 Okt & 9 Okt - Floating Cards)
- [x] Pastikan error states ditampilkan dengan baik ✅ (9 Okt)
- [x] Review dan rapikan CSS/styling secara keseluruhan ✅ (9 Okt - Redesign Hero & Catalog)
- [x] Tambah `FacilitySeeder` — 10 data fasilitas dummy (semua tipe) ✅ (1 Okt)
- [x] Perbaikan Sidebar UX untuk Admin/Petugas (Reorder menu & ubah label) ✅ (2 Okt)
- [x] Integrasi UI `FileUploadCard` dengan setup Tailwind CSS v3 untuk form laporan ✅ (2 Okt)
- [x] Fix blank page issue (missing imports) di `NewReportPage` ✅ (2 Okt)
- [x] Samakan styling form admin (Kelola Fasilitas & Kelola User) dengan form Reservasi ✅ (9 Okt)
- [x] Finalisasi seed data untuk demo presentasi ✅ (9 Okt)
- [x] Persiapan slide / alur demo presentasi ✅ (9 Okt)
- [x] Testing end-to-end final: Register → Verify → Login → Reservasi → Laporan → Admin Export ✅ (9 Okt)

### PM & AI — Penyelesaian Fase 6 (Backend Admin) (9 Okt)
- [x] Buat `UserController.php` (CRUD Admin/User, Verifikasi) ✅
- [x] Buat `RecapController.php` (Statistik, Rekapitulasi) ✅
- [x] Daftarkan route `/admin/users` dan `/admin/recap` di `routes/api.php` ✅

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
**Branch Git:** `feat/backend-reservation       → Orang 1 (✅ Selesai)\n├── feat/frontend-reservation      → Orang 2 (✅ Selesai)\n│\n├── feat/backend-report            → Orang 1 (✅ Selesai)\n├── feat/frontend-report           → Orang 2 (✅ Selesai)\n│\n├── feat/backend-admin             → Orang 1 (✅ Selesai)\n├── feat/frontend-admin            → Orang 2 (✅ Selesai)\n└── feat/kelola-fasilitas_2        → PM (✅ Selesai - QA Fixes & PDF Export)\n`