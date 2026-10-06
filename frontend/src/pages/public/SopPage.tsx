import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// ─── Section ID for IntersectionObserver ─────────────────────────────────────
const SECTIONS = [
  { id: 'bab-1', label: 'Bab I: Ketentuan & Prioritas', sub: 'Pasal 1 — 3' },
  { id: 'bab-2', label: 'Bab II: Matriks Batasan Ruang', sub: 'Pasal 4 — 7' },
  { id: 'bab-3', label: 'Bab III: Alur Perizinan Digital', sub: 'Pasal 8 — 11' },
  { id: 'bab-4', label: 'Bab IV: Tata Tertib & Fasilitas Khusus', sub: 'Pasal 12 — 14' },
  { id: 'bab-5', label: 'Bab V & VI: Sanksi & Ganti Rugi', sub: 'Pasal 15 — 21' },
];

export default function SopPage() {
  const [activeSection, setActiveSection] = useState('bab-1');
  const [search, setSearch] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('clauseSearch')?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 pt-7 pb-16 flex-1">
      {/* Document Header */}
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-xs font-mono text-institution-500 mb-3" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-institution-900 transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-institution-500">Regulasi & Tata Tertib</span>
          <span>/</span>
          <span className="text-institution-800 font-semibold">SOP Peminjaman Fasilitas</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 pb-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-50 text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Berlaku Aktif
              </span>
              <span className="text-xs font-mono text-institution-400">Ditetapkan: 15 Januari 2026</span>
              <span className="text-xs text-institution-300">•</span>
              <span className="text-xs font-mono text-institution-500">Revisi Terakhir: 1 Oktober 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-institution-900 leading-snug">
              Standar Operasional Prosedur (SOP) & Regulasi Peminjaman Fasilitas Kampus
            </h1>
            <p className="mt-2 text-sm text-institution-600 leading-relaxed">
              Ketentuan tata tertib pemanfaatan aset fisik, ruang perkuliahan, laboratorium terpadu, dan fasilitas publik di lingkungan universitas berbasis otentikasi identitas digital terpusat (SSO).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button 
              type="button" 
              disabled
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md bg-institution-100 text-institution-400 cursor-not-allowed transition"
              title="Salinan SK sedang disiapkan"
            >
              <svg className="w-4 h-4 text-institution-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Salinan SK Rektor (Segera)
            </button>
          </div>
        </div>

        {/* Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-white rounded-lg shadow-sm border border-institution-200">
          {[
            { label: 'Nomor Registrasi', value: 'SK-REK/412/UN.01/OT/2026', mono: true },
            { label: 'Biro Pengampu', value: 'Biro Sarana, Prasarana & Aset' },
            { label: 'Validasi Legal', value: 'Bagian Hukum & Tata Laksana' },
            { label: 'Target Sivitas', value: 'Dosen, Mahasiswa, Tendik, Mitra' },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-institution-400">{label}</span>
              <span className={`text-xs font-medium text-institution-800 mt-0.5 ${mono ? 'font-mono' : ''}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Sticky Sidebar */}
        <aside className="lg:col-span-3 lg:sticky lg:top-20 space-y-4">
          <div className="bg-white p-3 rounded-lg shadow-sm border border-institution-200">
            <div className="relative">
              <svg className="absolute left-2.5 top-2 w-4 h-4 text-institution-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="clauseSearch"
                type="text"
                placeholder="Cari pasal, kata kunci..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-10 py-1.5 text-xs bg-institution-50 rounded border border-institution-200 text-institution-900 placeholder:text-institution-400 focus:bg-white focus:ring-1 focus:ring-institution-900 focus:border-institution-900 transition outline-none"
              />
              <kbd className="absolute right-2 top-2 font-mono text-[9px] px-1 py-0.5 rounded bg-institution-200 text-institution-600">Ctrl+K</kbd>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-institution-200 p-4">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-institution-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-institution-400">Daftar Isi</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-institution-100 text-institution-600">5 Bab / 21 Pasal</span>
            </div>
            <nav className="space-y-1 text-xs">
              {SECTIONS.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`group flex items-start gap-2.5 p-2 rounded transition ${
                    activeSection === s.id
                      ? 'bg-institution-900 text-white'
                      : 'text-institution-600 hover:bg-institution-50 hover:text-institution-900'
                  }`}
                >
                  <span className={`font-mono text-[11px] shrink-0 ${activeSection === s.id ? 'text-slate-300' : 'text-institution-400'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex flex-col">
                    <span>{s.label}</span>
                    <span className={`text-[10px] font-normal ${activeSection === s.id ? 'text-slate-400' : 'text-institution-400'}`}>{s.sub}</span>
                  </div>
                </a>
              ))}
            </nav>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-institution-200 text-xs space-y-3">
            <div className="flex items-center gap-2 text-institution-900 font-semibold">
              <svg className="w-4 h-4 text-institution-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Bantuan & Helpdesk Aset
            </div>
            <p className="text-institution-500 text-[11px] leading-relaxed">Kendala operasional atau eskalasi izin khusus?</p>
            <div className="space-y-1.5 font-mono text-[11px] text-institution-700 bg-institution-50 p-2.5 rounded border border-institution-200">
              {[
                ['Lokasi', 'Rektorat Lt. 1 Sayap Barat'],
                ['Ext. Telp', '8821 / 8824 (ULT)'],
                ['E-mail', 'aset-helpdesk@kampus.ac.id'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-2">
                  <span className="text-institution-400">{label}:</span>
                  <span className="text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-7 min-w-0">

          {/* Official Callout */}
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center shrink-0 text-blue-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-xs space-y-1">
              <h4 className="font-bold text-blue-950">Integrasi Sistem Akses Berbasis Single Sign-On (SSO)</h4>
              <p className="text-blue-900 leading-relaxed">Terhitung sejak revisi SK Rektor per 1 Oktober 2026, seluruh permohonan peminjaman ruang wajib menggunakan akun SSO Universitas resmi. Pintu akses fisik Smart Classroom, Laboratorium Terpadu, dan Studio hanya dapat dibuka menggunakan QR Code dinamis pada portal Uni-FaRe atau scan smart card KTM yang telah terverifikasi.</p>
            </div>
          </div>

          {/* BAB I */}
          <section id="bab-1" className="bg-white rounded-lg p-6 sm:p-7 shadow-sm border border-institution-200 space-y-5 scroll-mt-20">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-institution-500 uppercase tracking-widest">BAB I — KETENTUAN UMUM</span>
                <h2 className="text-lg font-bold text-institution-900 mt-1">Hierarki Prioritas & Hak Akses Civitas Akademika</h2>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-institution-100 text-institution-600">Pasal 1 — 3</span>
            </div>
            <p className="text-xs text-institution-600 leading-relaxed">Seluruh sarana dan prasarana kampus dipelihara untuk mendukung Tridharma Perguruan Tinggi. Dalam hal terjadi benturan jadwal peminjaman, sistem Uni-FaRe akan menetapkan prioritas pemakaian secara otomatis berdasarkan hierarki berikut:</p>
            <div className="overflow-x-auto rounded border border-institution-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-institution-50 text-[11px] font-mono uppercase text-institution-500">
                  <tr>
                    <th className="py-2.5 px-3 w-20">Prioritas</th>
                    <th className="py-2.5 px-3">Kategori Pemakaian</th>
                    <th className="py-2.5 px-3">Contoh Kegiatan</th>
                    <th className="py-2.5 px-3 w-28">Status Prioritas</th>
                  </tr>
                </thead>
                <tbody className="text-institution-700 divide-y divide-institution-100">
                  {[
                    { level: 'Tingkat 1', name: 'Akademik Formal & Ujian Resmi', desc: 'Perkuliahan terjadwal di SIAKAD, UAS/UTS, Sidang Skripsi, Ujian Masuk Mandiri, Yudisium.', badge: 'bg-red-50 text-red-700', badgeLabel: 'Prioritas Mutlak' },
                    { level: 'Tingkat 2', name: 'Riset Terakreditasi & Hibah Dikti', desc: 'Eksperimen laboratorium berjangka, pengujian sampel pascasarjana, pengujian AI cluster compute.', badge: 'bg-amber-50 text-amber-700', badgeLabel: 'Prioritas Tinggi' },
                    { level: 'Tingkat 3', name: 'Ormawa / BEM / UKM Terdaftar', desc: 'Seminar nasional mahasiswa, latihan rutin seni/olahraga, rapat kerja, pembekalan kader.', badge: 'bg-blue-50 text-blue-700', badgeLabel: 'Prioritas Reguler' },
                    { level: 'Tingkat 4', name: 'Mitra Eksternal & Kedinasan', desc: 'Kerja sama BUMN/Kementerian, sertifikasi profesi independen, expo karir non-civitas.', badge: 'bg-slate-100 text-slate-700', badgeLabel: 'Prioritas Rendah' },
                  ].map((row, i) => (
                    <tr key={row.level} className={`hover:bg-institution-50/50 transition ${i % 2 === 1 ? 'bg-institution-50/30' : 'bg-white'}`}>
                      <td className="py-3 px-3 font-mono font-bold text-institution-900">{row.level}</td>
                      <td className="py-3 px-3 font-semibold text-institution-900">{row.name}</td>
                      <td className="py-3 px-3 text-institution-600">{row.desc}</td>
                      <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${row.badge}`}>{row.badgeLabel}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-[11px] font-mono text-institution-600 bg-institution-50 p-3 rounded border border-institution-200 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-institution-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pasal 3 Ayat (2): Pembatalan otomatis (override) berhak dilakukan Biro Akademik paling lambat 24 jam sebelum kegiatan Ormawa jika terdapat penugasan negara mendadak.
            </div>
          </section>

          {/* BAB II */}
          <section id="bab-2" className="bg-white rounded-lg p-6 sm:p-7 shadow-sm border border-institution-200 space-y-5 scroll-mt-20">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-institution-500 uppercase tracking-widest">BAB II — MATRIKS FASILITAS</span>
                <h2 className="text-lg font-bold text-institution-900 mt-1">Batasan Durasi, Waktu Pengajuan & Otoritas Approval</h2>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-institution-100 text-institution-600">Pasal 4 — 7</span>
            </div>
            <p className="text-xs text-institution-600 leading-relaxed">Jam operasional reservasi: <strong>07.00–20.00</strong> dengan slot tetap berdurasi 30 menit. Validasi jadwal bentrok dilakukan otomatis oleh sistem — tidak ada proses unggah dokumen. Semua peminjaman cukup dilakukan melalui akun SSO yang telah terverifikasi.</p>
            <div className="overflow-x-auto rounded border border-institution-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-institution-50 text-[11px] font-mono uppercase text-institution-500">
                  <tr>
                    <th className="py-2.5 px-3">Kategori Fasilitas</th>
                    <th className="py-2.5 px-3">Maks. Durasi per Sesi</th>
                    <th className="py-2.5 px-3">Syarat Pengajuan</th>
                    <th className="py-2.5 px-3">Proses Validasi</th>
                  </tr>
                </thead>
                <tbody className="text-institution-700 divide-y divide-institution-100">
                  {[
                    { name: 'Auditorium & Aula', sub: 'Kapasitas besar', duration: 'Fleksibel (slot 30 menit)', req: 'Login SSO + isi tujuan penggunaan', process: 'Review manual Petugas' },
                    { name: 'Ruang Kelas / Smart Classroom', sub: 'Interaktif Display', duration: 'Fleksibel (slot 30 menit)', req: 'Login SSO + isi tujuan penggunaan', process: 'Review manual Petugas' },
                    { name: 'Laboratorium Komputer', sub: 'Workstation & Komputer', duration: 'Fleksibel (slot 30 menit)', req: 'Login SSO + isi tujuan penggunaan', process: 'Review manual Petugas' },
                    { name: 'Sarana Olahraga & Lapangan', sub: 'Indoor & Lapangan Luar', duration: 'Fleksibel (slot 30 menit)', req: 'Login SSO + isi tujuan penggunaan', process: 'Review manual Petugas' },
                  ].map((row, i) => (
                    <tr key={row.name} className={`hover:bg-institution-50/50 transition ${i % 2 === 1 ? 'bg-institution-50/30' : 'bg-white'}`}>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-institution-900">{row.name}</div>
                        <div className="text-[10px] font-mono text-institution-400">{row.sub}</div>
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-institution-800 whitespace-nowrap">{row.duration}</td>
                      <td className="py-3 px-3 text-[11px] text-emerald-700 font-medium">{row.req}</td>
                      <td className="py-3 px-3 font-medium text-institution-900 text-[11px]">{row.process}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-[11px] font-mono text-institution-600 bg-emerald-50 p-3 rounded border border-emerald-200 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tidak ada persyaratan unggah dokumen. Sistem Uni-FaRe dirancang <strong>paperless</strong> — cukup login SSO dan isi tujuan penggunaan. Petugas memvalidasi dan menyetujui secara manual.
            </div>
          </section>

          {/* BAB III */}
          <section id="bab-3" className="bg-white rounded-lg p-6 sm:p-7 shadow-sm border border-institution-200 space-y-6 scroll-mt-20">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-institution-500 uppercase tracking-widest">BAB III — PROSEDUR SISTEM</span>
                <h2 className="text-lg font-bold text-institution-900 mt-1">Alur Perizinan Peminjaman Terintegrasi</h2>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-institution-100 text-institution-600">Pasal 8 — 11</span>
            </div>
            <p className="text-xs text-institution-600 leading-relaxed">Semua tahapan dilakukan secara <em>paperless</em> via portal Uni-FaRe. Tidak ada persyaratan dokumen fisik. Slot reservasi berdurasi tetap 30 menit dalam rentang jam operasional 07.00–20.00. Sistem akan <strong>menolak otomatis</strong> jika slot bentrok dengan reservasi yang sudah disetujui pada fasilitas yang sama.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { step: '01', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', title: 'Login & Cek Ketersediaan', desc: 'Login dengan akun SSO kampus. Buka halaman fasilitas dan lihat slot waktu yang tersedia (tersedia/tidak tersedia) secara realtime.', time: 'Instan, tanpa dokumen' },
                { step: '02', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', title: 'Ajukan Reservasi', desc: 'Pilih fasilitas, tentukan tanggal & rentang slot waktu (kelipatan 30 menit, 07.00–20.00), dan isi tujuan penggunaan. Tidak perlu unggah dokumen.', time: 'Waktu: < 2 menit' },
                { step: '03', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', title: 'Review oleh Petugas', desc: 'Petugas memverifikasi dan menyetujui/menolak reservasi secara manual. Sistem mencegah persetujuan yang bentrok jadwal secara otomatis.', time: 'Diproses oleh Petugas' },
                { step: '04', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Reservasi Dikonfirmasi', desc: 'Pengguna mendapat notifikasi status reservasi. Jika disetujui, fasilitas dapat digunakan sesuai jadwal. Pengguna bertanggung jawab atas kondisi ruangan.', time: 'Status realtime di akun' },
              ].map((s) => (
                <div key={s.step} className="p-4 rounded-lg bg-institution-50 border border-institution-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold text-institution-400">{s.step}</span>
                      <svg className="w-5 h-5 text-institution-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={s.icon} />
                      </svg>
                    </div>
                    <h3 className="font-bold text-xs text-institution-900 mb-1.5">{s.title}</h3>
                    <p className="text-[11px] text-institution-500 leading-normal">{s.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-institution-200 text-[10px] font-mono text-institution-400">{s.time}</div>
                </div>
              ))}
            </div>
          </section>

          {/* BAB IV */}
          <section id="bab-4" className="bg-white rounded-lg p-6 sm:p-7 shadow-sm border border-institution-200 space-y-5 scroll-mt-20">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-institution-500 uppercase tracking-widest">BAB IV — PELAPORAN KERUSAKAN</span>
                <h2 className="text-lg font-bold text-institution-900 mt-1">Mekanisme Pelaporan Kerusakan Fasilitas</h2>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-institution-100 text-institution-600">Pasal 12 — 14</span>
            </div>
            <p className="text-xs text-institution-600 leading-relaxed">Civitas akademika yang menemukan kerusakan pada fasilitas kampus wajib melaporkan melalui portal Uni-FaRe (login SSO). Petugas berwenang mengubah status fasilitas menjadi "Dalam Perbaikan" saat menangani laporan.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Kategori Laporan', items: ['Kerusakan Perangkat Keras (hardware)', 'Kerusakan Infrastruktur (listrik, AC, plafon)', 'Kebersihan & Fasilitas Umum', 'Keamanan & Aksesibilitas', 'Laporan Lainnya'] },
                { title: 'Informasi Wajib Dilaporkan', items: ['Nama & kode fasilitas yang bermasalah', 'Deskripsi detail kerusakan/masalah', 'Foto dokumentasi (maks. 5 MB)', 'Kategori laporan yang sesuai'] },
                { title: 'Alur Penanganan Laporan', items: ['Laporan masuk ke antrian Petugas', 'Petugas mengubah status: Diproses', 'Fasilitas ditandai "Dalam Perbaikan"', 'Setelah selesai: Status kembali Aktif', 'Pelapor mendapat notifikasi resolusi'] },
              ].map((box) => (
                <div key={box.title} className="p-4 rounded-lg bg-institution-50 border border-institution-200 space-y-2.5">
                  <h3 className="font-bold text-xs text-institution-900">{box.title}</h3>
                  <ul className="space-y-1.5">
                    {box.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[11px] text-institution-600">
                        <span className="w-1 h-1 rounded-full bg-institution-400 mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* BAB V & VI */}
          <section id="bab-5" className="bg-white rounded-lg p-6 sm:p-7 shadow-sm border border-institution-200 space-y-5 scroll-mt-20">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-amber-700 uppercase tracking-widest">BAB V & VI — TATA TERTIB & SANKSI</span>
                <h2 className="text-lg font-bold text-institution-900 mt-1">Larangan Keras, Ganti Rugi & Pembekuan Akun SSO</h2>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold">Pasal 15 — 21</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { color: 'amber', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636', title: 'Konsumsi & Kebersihan Ruang', desc: 'Dilarang keras membawa makanan berkuah, minuman berwarna, dan merokok/vape di dalam Smart Classroom, Lab Komputer, dan Auditorium berkarpet. Pelanggaran dikenakan biaya general cleaning sebesar Rp 350.000,- per insiden.' },
                { color: 'amber', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4', title: 'Modifikasi Jaringan & Infrastruktur', desc: 'Dilarang mencabut kabel patch panel LAN, mengubah konfigurasi IP access point, atau membongkar perangkat proyektor/audio interface tanpa pendampingan teknisi UPT TIK.' },
                { color: 'rose', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', title: 'Aktivitas Ilegal Server / Compute', desc: 'Pemanfaatan workstation dan GPU cluster kampus untuk cryptocurrency mining, DDoS, atau crawling ilegal berakibat pada pelaporan pidana UU ITE dan sanksi akademik.' },
                { color: 'rose', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636', title: 'Sanksi Blacklist Akun SSO Kampus', desc: 'Keterlambatan check-out melebihi 45 menit tanpa konfirmasi menyebabkan pemblokiran hak reservasi fasilitas bagi organisasi dan penanggungjawab selama 1 semester penuh.' },
              ].map((box) => (
                <div key={box.title} className={`p-4 rounded-lg space-y-2 border ${box.color === 'amber' ? 'bg-amber-50/60 border-amber-200' : 'bg-rose-50/60 border-rose-200'}`}>
                  <div className={`flex items-center gap-2 text-xs font-bold ${box.color === 'amber' ? 'text-amber-900' : 'text-rose-900'}`}>
                    <svg className={`w-4 h-4 ${box.color === 'amber' ? 'text-amber-700' : 'text-rose-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={box.icon} />
                    </svg>
                    {box.title}
                  </div>
                  <p className={`text-xs leading-relaxed ${box.color === 'amber' ? 'text-amber-950/80' : 'text-rose-950/80'}`}>{box.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Sign-off */}
          <div className="bg-white rounded-lg p-6 sm:p-7 shadow-sm border border-institution-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-5 border-b border-institution-100">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-institution-400">Pengesahan Dokumen Elektronik</span>
                <h3 className="text-sm font-bold text-institution-900">Ditetapkan oleh Rektor Universitas</h3>
                <p className="text-xs text-institution-500">Dokumen ini telah ditandatangani secara digital menggunakan sertifikat elektronik resmi BSrE (Badan Siber dan Sandi Negara).</p>
              </div>
              <div className="flex items-center gap-3.5 p-3 rounded-lg bg-institution-50 border border-institution-200 shrink-0">
                <div className="w-14 h-14 bg-white p-1.5 rounded border border-institution-200 flex items-center justify-center shadow-sm shrink-0">
                  <svg className="w-full h-full text-institution-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm8-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm11-2h2v2h-2v-2zm-3 0h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4-4h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm-5 0h2v2h-2v-2zM5 5h2v2H5V5zm12 0h2v2h-2V5zM5 17h2v2H5v-2z" />
                  </svg>
                </div>
                <div className="flex flex-col font-mono text-[10px]">
                  <span className="font-bold text-institution-900">ID: BSRE-UN-412-2026</span>
                  <span className="text-institution-500">Timestamp: 2026-10-01 09:14 WIB</span>
                  <span className="text-emerald-700 font-semibold mt-0.5">Status: Terverifikasi Sah</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-institution-500 pt-4 gap-2 flex-wrap">
              <span>Salinan resmi disimpan di Repositori Regulasi Kampus (Perpustakaan Pusat & Biro Hukum).</span>
              <a href="#" className="inline-flex items-center gap-1 text-institution-700 hover:text-institution-950 font-medium" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <span>Kembali ke Atas</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
