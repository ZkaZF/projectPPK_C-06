import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FacilityCard from '../../components/facilities/FacilityCard';
import FacilityCardSkeleton from '../../components/facilities/FacilityCardSkeleton';
import { EMPTY_FILTERS } from '../../components/facilities/FacilityFilter';
import type { Facility, FacilityFilterState } from '../../types/facility';
import { Pagination } from '../../components/common/Pagination';
import { isAvailable } from '../../utils/facility';
import { HeroSection } from '../../components/home/HeroSection';

// @ts-ignore
import { getFacilitiesApi } from '../../api/facilities';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export default function HomePage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FacilityFilterState>(EMPTY_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const itemsPerPage = 9; // 9 items = 3 rows × 3 cols di grid

  // Ekstrak list lokasi unik dari data
  const uniqueLocations = useMemo(() => {
    const locs = new Set<string>();
    facilities.forEach(f => {
      if (f.fac_location) {
        // Ambil kata pertama/gedung utama sebagai kategori jika terlalu panjang
        const mainLoc = f.fac_location.split(',')[0].trim();
        locs.add(mainLoc);
      }
    });
    return Array.from(locs).slice(0, 4); // Ambil max 4 tab
  }, [facilities]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getFacilitiesApi()
      .then((res: any) => setFacilities(res.data.data ?? res.data))
      .catch((err: any) => {
        console.error(err);
        setError('Gagal memuat daftar fasilitas. Coba lagi nanti.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return facilities.filter((f) => {
      if (filters.type && f.type?.fac_type_name !== filters.type) return false;
      if (filters.location && !f.fac_location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchName = f.fac_name.toLowerCase().includes(query);
        const matchLoc = f.fac_location?.toLowerCase().includes(query) ?? false;
        if (!matchName && !matchLoc) return false;
      }
      return true;
    });
  }, [facilities, filters, searchQuery]);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedFacilities = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Hero Section — full width */}
      <HeroSection
        totalFacilities={facilities.length}
        totalLocations={uniqueLocations.length}
      />

      {/* Catalog Section */}
      <motion.div 
        id="catalog-section" 
        className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 pt-24 pb-16 flex-1"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
      
      {/* Option B: Header Section - Google-style Unified Search */}
      <motion.div variants={itemVariants} className="mb-10">
        
        {/* Top Header Line: Title & Stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-institution-500 uppercase tracking-widest mb-2">
              <span>Katalog Aset Kampus</span>
              <span className="text-institution-300">/</span>
              <span className="text-institution-900">Reservasi & Peminjaman</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-institution-900">
              Katalog & Reservasi Fasilitas
            </h1>
          </div>
          
          {/* Stat Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {facilities.length} Fasilitas
            </div>
            <div className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 flex items-center gap-1.5 text-xs font-semibold text-blue-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              {facilities.filter(isAvailable).length} Tersedia Hari Ini
            </div>
          </div>
        </div>

        {/* Unified Search & Action Bar */}
        <div className="flex flex-col lg:flex-row items-center gap-3 w-full bg-white p-2 rounded-2xl border border-institution-200 shadow-sm">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full lg:min-w-[280px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-institution-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm font-medium text-institution-900 placeholder:text-institution-400 bg-transparent border-none rounded-xl pl-10 pr-4 py-3 focus:ring-0 focus:outline-none" 
              placeholder="Cari nama ruang, gedung..." 
              type="text"
            />
          </div>

          <div className="hidden lg:block w-[1px] h-8 bg-institution-200"></div>

          {/* Pill Tabs for Locations */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto px-2 lg:px-0 pb-2 pt-1 scrollbar-hide">
            <button 
              onClick={() => setFilters(prev => ({...prev, location: ''}))} 
              className={`px-4 py-2 whitespace-nowrap rounded-full text-xs font-semibold transition-all ${!filters.location ? 'bg-institution-900 text-white shadow-md' : 'bg-institution-50 text-institution-600 hover:bg-institution-100'}`}
            >
              Semua
            </button>
            {uniqueLocations.map(loc => (
              <button 
                key={loc}
                onClick={() => setFilters(prev => ({...prev, location: loc}))} 
                className={`px-4 py-2 whitespace-nowrap rounded-full text-xs font-semibold transition-all ${filters.location === loc ? 'bg-institution-900 text-white shadow-md' : 'bg-institution-50 text-institution-600 hover:bg-institution-100'}`}
              >
                {loc}
              </button>
            ))}
          </div>

          {/* Type Dropdown Pill */}
          <div className="relative shrink-0 w-full lg:w-auto">
            <select 
              value={filters.type}
              onChange={(e) => setFilters(prev => ({...prev, type: e.target.value}))}
              className="w-full lg:w-auto appearance-none bg-institution-50 hover:bg-institution-100 text-institution-700 text-xs font-semibold rounded-full px-4 py-2 pr-8 border-none cursor-pointer outline-none transition-colors"
            >
              <option value="">Semua Tipe</option>
              <option value="ruang_kelas">Ruang Kelas</option>
              <option value="aula">Auditorium</option>
              <option value="laboratorium">Laboratorium</option>
              <option value="alat">Peralatan</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-institution-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <div className="hidden lg:block w-[1px] h-8 bg-institution-200"></div>

          {/* View Toggles & SOP */}
          <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto justify-between lg:justify-end px-2 lg:px-0">
            <div className="flex items-center bg-institution-50 rounded-full p-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-white text-institution-900 shadow-sm' : 'text-institution-400 hover:text-institution-700'}`}
                title="Grid View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-full flex items-center justify-center transition-all ${viewMode === 'table' ? 'bg-white text-institution-900 shadow-sm' : 'text-institution-400 hover:text-institution-700'}`}
                title="Table View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
              </button>
            </div>
            <Link to="/sop" className="inline-flex items-center gap-1.5 px-4 py-2 bg-institution-900 hover:bg-institution-800 text-white text-xs font-semibold rounded-full transition-colors shadow-md">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              SOP & Regulasi
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 p-3.5 mb-5 rounded-md bg-red-50 text-red-700 border border-red-200 text-sm font-medium">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <FacilityCardSkeleton key={i} />
          ))}
        </div>
      )}
      {loading && viewMode === 'table' && (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-institution-200 border-t-institution-900 animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 px-4 bg-white rounded-lg border border-dashed border-institution-300">
          <svg className="w-12 h-12 mx-auto text-institution-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          <p className="font-semibold text-institution-900 m-0">Tidak ada fasilitas yang cocok</p>
          <p className="text-institution-500 text-sm mt-1">Coba ubah kata kunci atau hapus filter untuk melihat hasil.</p>
        </div>
      )}

      {/* Facility Grid / Table */}
      {!loading && filtered.length > 0 && (
        <>
          {viewMode === 'grid' ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" 
              data-purpose="facility-card-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <AnimatePresence>
                {paginatedFacilities.map((f) => (
                  <motion.div key={f.fac_id} variants={itemVariants} layout>
                    <FacilityCard facility={f} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* ── Table View ─────────────────────────────────────────── */
            <div className="bg-white rounded-lg border border-institution-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-institution-50 border-b border-institution-200">
                    <tr>
                      <th className="py-2.5 px-4 text-[11px] font-mono uppercase tracking-wider text-institution-500 w-24">Kode</th>
                      <th className="py-2.5 px-4 text-[11px] font-mono uppercase tracking-wider text-institution-500">Nama Fasilitas</th>
                      <th className="py-2.5 px-4 text-[11px] font-mono uppercase tracking-wider text-institution-500">Tipe</th>
                      <th className="py-2.5 px-4 text-[11px] font-mono uppercase tracking-wider text-institution-500">Lokasi</th>
                      <th className="py-2.5 px-4 text-[11px] font-mono uppercase tracking-wider text-institution-500 w-24 text-center">Kapasitas</th>
                      <th className="py-2.5 px-4 text-[11px] font-mono uppercase tracking-wider text-institution-500 w-28">Status</th>
                      <th className="py-2.5 px-4 text-[11px] font-mono uppercase tracking-wider text-institution-500 w-28">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-institution-100">
                    {paginatedFacilities.map((f, i) => {
                      const isAvail = f.status?.fac_status_name?.toLowerCase() === 'aktif';
                      return (
                        <tr key={f.fac_id} className={`hover:bg-institution-50 transition ${i % 2 === 1 ? 'bg-institution-50/30' : 'bg-white'}`}>
                          <td className="py-3 px-4 font-mono text-[11px] font-semibold text-institution-500">
                            FAC-{String(f.fac_id).padStart(3, '0')}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-institution-900">{f.fac_name}</div>
                            {f.fac_description && (
                              <div className="text-[10px] text-institution-400 mt-0.5 line-clamp-1">{f.fac_description}</div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-institution-100 text-institution-700 whitespace-nowrap">
                              {f.type?.fac_type_name || '-'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-institution-600">{f.fac_location || '-'}</td>
                          <td className="py-3 px-4 text-center font-mono text-institution-800 font-medium">
                            {f.fac_capacity != null ? `${f.fac_capacity}` : '-'}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium ${isAvail ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isAvail ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                              {isAvail ? 'Tersedia' : 'Pemeliharaan'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Link
                              to={`/facilities/${f.fac_id}`}
                              className="text-xs font-semibold text-institution-900 hover:underline transition"
                            >
                              Lihat Detail →
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filtered.length}
          />
        </>
      )}
      </motion.div>
    </>
  );
}