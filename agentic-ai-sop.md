# SOP Agentic AI — Berbasis implementationplan.md

> Simpan file ini di root project. Jika tool Anda mendukung file konfigurasi khusus
> (mis. `CLAUDE.md` untuk Claude Code, `AGENTS.md` untuk agent umum, `.cursorrules`
> untuk Cursor), salin/ubah nama file ini sesuai konvensi tool tersebut agar otomatis
> terbaca sebagai instruksi sistem.

## 1. Prinsip Dasar

1. **Tidak ada eksekusi otomatis.** Agent DILARANG menjalankan perintah yang mengubah
   sistem (run, build, deploy, migrate, install, git commit/push, delete file, dsb)
   tanpa persetujuan eksplisit dari user pada setiap langkah.
2. **`implementationplan.md` adalah sumber kebenaran (source of truth).** Semua
   pekerjaan agent harus mengacu pada rencana di file ini. Jika ada instruksi baru
   dari user yang menyimpang dari plan, agent wajib menandai perbedaannya dan
   meminta konfirmasi sebelum lanjut.
3. **Human-in-the-loop di setiap tahap kritis**: sebelum eksekusi, setelah eksekusi
   (review hasil), dan sebelum lanjut ke step berikutnya.

## 2. Alur Kerja Standar

1. **Baca ulang `implementationplan.md`** di awal setiap sesi kerja sebelum
   melakukan apa pun.
2. **Tentukan step yang akan dikerjakan** — sebutkan secara eksplisit nomor/nama
   step dari plan yang sedang dikerjakan.
3. **Tampilkan rencana aksi (dry-run/preview)** — jelaskan apa yang AKAN dilakukan
   (file yang diubah, command yang akan dijalankan, dependency yang akan
   ditambahkan) TANPA benar-benar mengeksekusinya.
4. **Tunggu konfirmasi user** (misal user membalas "lanjut", "ok", "approve").
5. **Eksekusi hanya step yang disetujui** — jangan mengerjakan step lain sekaligus
   meskipun terlihat "berkaitan", kecuali diminta.
6. **Laporkan hasil** — ringkas perubahan yang dibuat, file yang tersentuh, dan
   status test/verifikasi (jika ada).
7. **Update progress di `implementationplan.md`** (mis. checklist `- [x]`) hanya
   setelah user mengonfirmasi hasil step sudah benar.
8. **Ulangi dari langkah 2** untuk step berikutnya.

## 3. Rules Wajib untuk Agent

### A. Permission Tiers (bukan sekadar biner auto-run/tidak)

Gunakan 3 tingkat izin agar workflow tidak terlalu kaku tapi tetap aman:

| Tier | Contoh command | Perilaku |
|------|----------------|----------|
| **Tier 1 — Auto-allow** | `ls`, `cat`, `git status`, `git diff`, `grep`, `find`, lint (read-only) | Boleh dijalankan bebas, tidak mengubah state |
| **Tier 2 — Ask-once-per-session** | Test runner (`npm test`, `pytest`), type-check, build lokal (tanpa deploy) | Minta izin sekali di awal sesi; setelah user bilang "boleh dijalankan otomatis untuk sesi ini", agent tidak perlu tanya ulang tiap kali |
| **Tier 3 — Always-ask** | install/uninstall dependency, migrasi DB, git commit/push/reset --hard, delete file, deploy, ubah file konfigurasi env/secret | WAJIB izin eksplisit setiap kali, tanpa terkecuali |

Definisikan sendiri command mana masuk tier mana di bagian "Catatan Kustomisasi"
sesuai stack project Anda.

### B. Sandbox / Isolasi Perubahan
- Jika memungkinkan, agent bekerja di **branch terpisah** (bukan langsung di
  `main`/`master`) atau di environment terisolasi (container/worktree), sehingga
  kesalahan mudah di-rollback tanpa menyentuh kode produksi.
- Perubahan besar (>1 file inti atau menyentuh struktur project) sebaiknya
  diajukan sebagai draft/PR, bukan langsung merge, meskipun sudah "disetujui"
  di chat.

### B. Scope Control
- Agent hanya boleh mengerjakan **satu step** dari `implementationplan.md` per
  siklus konfirmasi, tidak boleh loncat step atau mengerjakan banyak step sekaligus.
- Jika step di plan ternyata ambigu/kurang detail, agent wajib bertanya dulu,
  bukan mengasumsikan dan langsung mengerjakan.
- Perubahan di luar scope plan (refactor besar, ganti struktur folder, dsb) harus
  diajukan sebagai proposal terpisah, bukan dilakukan diam-diam.

### C. Transparansi
- Setiap sebelum eksekusi, agent wajib menampilkan:
  - Command persis yang akan dijalankan (verbatim), atau
  - Diff/preview kode yang akan diubah.
- Tidak boleh ada "silent action" — semua perubahan harus terlihat sebelum terjadi.

### D. Keamanan & Reversibilitas
- Sebelum operasi destruktif (delete, overwrite, force push), agent wajib
  memperingatkan bahwa aksi ini tidak mudah dibatalkan dan meminta konfirmasi
  eksplisit ("ya, saya paham ini permanen").
- Disarankan agent membuat commit/checkpoint kecil (dengan izin user) sebelum
  perubahan besar agar mudah rollback.
- **Rollback plan wajib** untuk step berisiko tinggi (migrasi DB, ubah schema,
  deploy, refactor besar): agent harus menyebutkan secara eksplisit *cara
  membatalkan* perubahan ini sebelum eksekusi, bukan hanya peringatan umum.
  Contoh: "Jika gagal, rollback dengan `git revert <commit>` atau
  `migrate down 001`."

### E. Test-Gate (Kriteria Lulus per Step)
- Sebuah step **tidak otomatis dianggap selesai** hanya karena command berhasil
  dijalankan. Harus ada kriteria lulus yang jelas, misalnya: test terkait pass,
  type-check tanpa error, lint tanpa warning baru, atau hasil manual review user.
- Jika `implementationplan.md` tidak mencantumkan acceptance criteria untuk
  suatu step, agent wajib meminta user mendefinisikannya dulu sebelum
  menandai step selesai (lihat juga bagian 6 — Acceptance Criteria).
- Jika test/gate gagal, step tetap berstatus "belum selesai" walau kode sudah
  ditulis.

### F. Audit Log / Jejak Perubahan
- Agent mencatat ringkas setiap aksi yang dieksekusi (command, file yang
  diubah, waktu, hasil) — idealnya di changelog terpisah, misal
  `implementationplan.md` bagian "Log Eksekusi" atau file `CHANGELOG-agent.md`.
- Tujuannya agar histori keputusan & eksekusi bisa diaudit/ditelusuri, tidak
  hanya tersimpan di scroll chat yang mudah hilang konteksnya.

### G. Pelaporan & Dokumentasi
- Setiap step selesai, agent merangkum: apa yang diubah, kenapa, dan efek
  sampingnya (jika ada).
- Agent update status di `implementationplan.md` (checklist) hanya setelah
  dikonfirmasi user DAN test-gate (poin E) terpenuhi — bukan otomatis
  menandai selesai sendiri.

### H. Penanganan Error
- Jika eksekusi (yang sudah disetujui) gagal, agent berhenti, laporkan error apa
  adanya, dan tunggu arahan — tidak mencoba "memperbaiki sendiri" tanpa izin
  kecuali user sudah memberi izin untuk itu.

### I. Plan Versioning (mirip ADR — Architecture Decision Record)
- Jika `implementationplan.md` berubah di tengah pengerjaan (scope baru,
  pendekatan berubah), agent wajib mencatat: apa yang berubah, kenapa berubah,
  dan dampaknya ke step yang sudah/belum dikerjakan — bukan menimpa plan lama
  begitu saja tanpa jejak.
- Disarankan menambah bagian "Riwayat Perubahan Plan" di
  `implementationplan.md` dengan format: tanggal, perubahan, alasan.

## 4. Format Interaksi yang Diharapkan

Contoh pola respons agent per step:

```
[STEP 3/10] Setup database schema

Rencana aksi:
- Membuat file `migrations/001_create_users.sql`
- Isi: CREATE TABLE users (...)
- Tidak ada command yang dijalankan otomatis

Apakah saya lanjutkan? (ya/tidak/revisi)
```

Setelah user approve:

```
[EKSEKUSI STEP 3/10]
- File dibuat: migrations/001_create_users.sql
- Belum dijalankan (migrate) — perlu izin terpisah untuk run migration.

Lanjut ke step berikutnya atau jalankan migration dulu?
```

## 5. Contoh Format `implementationplan.md` per Step (dengan Acceptance Criteria)

Agar test-gate (poin 3E) bisa dijalankan, tiap step di `implementationplan.md`
sebaiknya punya format seperti ini, bukan cuma deskripsi tugas:

```markdown
### Step 3: Setup database schema

**Tugas:** Buat tabel `users` dengan kolom id, email, password_hash, created_at.

**Acceptance Criteria:**
- [ ] File migration `001_create_users.sql` dibuat
- [ ] Migration berhasil dijalankan di environment dev (setelah izin user)
- [ ] Test `test_users_table_exists` pass
- [ ] Tidak ada breaking change ke schema lain

**Risiko:** Sedang (mengubah struktur DB)
**Rollback:** `migrate down 001` jika gagal

**Status:** ⬜ Belum dikerjakan
```

Status step: `⬜ Belum dikerjakan` → `🔵 Sedang dikerjakan` →
`🟡 Menunggu review` → `✅ Selesai (acceptance criteria terpenuhi)`

## 6. Checklist Cepat (untuk agent, self-check sebelum bertindak)

- [ ] Sudah baca `implementationplan.md` terbaru (termasuk riwayat perubahan)?
- [ ] Sedang mengerjakan tepat satu step yang jelas & punya acceptance criteria?
- [ ] Command yang akan dijalankan sudah dicek masuk tier permission yang mana?
- [ ] Sudah tampilkan preview/rencana sebelum eksekusi?
- [ ] Sudah dapat konfirmasi eksplisit dari user (untuk Tier 2/3)?
- [ ] Command yang dijalankan sama persis dengan yang ditampilkan?
- [ ] Tidak melebihi scope step ini?
- [ ] Ada rollback plan untuk step berisiko sedang/tinggi?
- [ ] Acceptance criteria sudah terpenuhi sebelum step ditandai selesai?
- [ ] Aksi yang dieksekusi sudah dicatat di audit log/changelog?
- [ ] Sudah laporkan hasil & update status setelah dikonfirmasi?

## 7. Catatan Kustomisasi

Silakan sesuaikan bagian berikut sesuai kebutuhan project Anda:
- Isi ulang tabel Permission Tiers (poin 3A) dengan daftar command spesifik
  stack Anda (mis. `docker`, `alembic`, `terraform apply`, dsb).
- Apakah test otomatis termasuk Tier 2 (ask-once-per-session) atau tetap
  Tier 3 (always-ask) di project ini.
- Aturan commit message / branching jika agent boleh membuat commit (dengan izin).
- Lokasi audit log: apakah di `implementationplan.md` langsung atau file
  terpisah `CHANGELOG-agent.md`.
- Format acceptance criteria default jika step di plan belum mencantumkannya.
