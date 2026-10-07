import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import FacilityCard from '../../components/facilities/FacilityCard';
import FacilityCardSkeleton from '../../components/facilities/FacilityCardSkeleton';
import FacilityFilter, { EMPTY_FILTERS } from '../../components/facilities/FacilityFilter';
import type { Facility, FacilityFilterState } from '../../types/facility';
import { Pagination } from '../../components/common/Pagination';
import { isAvailable } from '../../utils/facility';

// @ts-ignore
import { getFacilitiesApi } from '../../api/facilities';

export default function HomePage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FacilityFilterState>(EMPTY_FILTERS);
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
      if (filters.capacity && (f.fac_capacity ?? 0) < Number(filters.capacity)) return false;
      if (filters.availableOnly && !isAvailable(f)) return false;
      return true;
    });
  }, [facilities, filters]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedFacilities = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 pt-7 pb-16 flex-1 animate-fade-in">
      
      {/* Header Section: Clean Editorial Hierarchy */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-6 border-b border-institution-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-institution-500 uppercase tracking-wider mb-1">
            <span>Katalog Aset Kampus</span>
            <span className="text-institution-300">/</span>
            <span className="text-institution-700">Reservasi & Peminjaman</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-institution-900">
            Katalog & Reservasi Fasilitas
          </h1>
          <p className="text-sm text-institution-600 mt-1 max-w-2xl">
            Peminjaman ruang kuliah bersama, auditorium, laboratorium riset, dan inventaris akademik dengan verifikasi jadwal langsung terhubung ke SI-Akademik.
          </p>
        </div>
        
        {/* Action & View Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex p-1 bg-institution-100 rounded-md border border-institution-200">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition ${viewMode === 'grid' ? 'bg-white text-institution-900 shadow-sm' : 'text-institution-500 hover:text-institution-900'}`}
              title="Tampilan Grid"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition ${viewMode === 'table' ? 'bg-white text-institution-900 shadow-sm' : 'text-institution-500 hover:text-institution-900'}`}
              title="Tampilan Tabel"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
              <span className="hidden sm:inline">Tabel</span>
            </button>
          </div>
          <Link to="/sop" className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-institution-200 bg-white hover:bg-institution-50 text-institution-700 text-xs font-semibold rounded-md transition shadow-sm">
            <svg className="w-3.5 h-3.5 text-institution-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            SOP & Regulasi
          </Link>
        </div>
      </div>

      {/* Quick Location Segment Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-4 text-xs font-medium border-b border-institution-200">
        <button 
          onClick={() => setFilters(prev => ({...prev, location: ''}))} 
          className={`px-3 py-2 whitespace-nowrap transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-institution-900 rounded-sm ${!filters.location ? 'text-institution-900 font-semibold border-b-2 border-institution-900' : 'text-institution-500 hover:text-institution-900 border-b-2 border-transparent hover:border-institution-300'}`}
        >
          Semua Fasilitas <span className="ml-1.5 py-0.5 px-1.5 rounded text-[11px] bg-institution-100 text-institution-700 font-mono">{facilities.length}</span>
        </button>
        {uniqueLocations.map(loc => (
          <button 
            key={loc}
            onClick={() => setFilters(prev => ({...prev, location: loc}))} 
            className={`px-3 py-2 whitespace-nowrap transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-institution-900 rounded-sm ${filters.location === loc ? 'text-institution-900 font-semibold border-b-2 border-institution-900' : 'text-institution-500 hover:text-institution-900 border-b-2 border-transparent hover:border-institution-300'}`}
          >
            {loc}
          </button>
        ))}
      </div>

      {/* Filter Component */}
      <FacilityFilter
        filters={filters}
        onFilterChange={setFilters}
        onReset={() => setFilters(EMPTY_FILTERS)}
        resultsCount={filtered.length}
        totalCount={facilities.length}
      />

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" data-purpose="facility-card-grid">
              {paginatedFacilities.map((f) => (
                <FacilityCard key={f.fac_id} facility={f} />
              ))}
            </div>
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
    </div>
  );
}