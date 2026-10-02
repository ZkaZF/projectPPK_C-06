import React from 'react';
import type { FacilityFilterState } from '../../types/facility';

export const EMPTY_FILTERS: FacilityFilterState = {
  type: '',
  location: '',
  capacity: '',
};

interface FacilityFilterProps {
  filters: FacilityFilterState;
  onFilterChange: (newFilters: FacilityFilterState) => void;
  onReset: () => void;
  resultsCount?: number;
  totalCount?: number;
}

export default function FacilityFilter({ filters, onFilterChange, onReset, resultsCount = 0, totalCount = 0 }: FacilityFilterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  const hasFilters = filters.type || filters.location || filters.capacity;

  return (
    <div className="bg-white rounded-lg border border-institution-200 p-3.5 mb-7 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="md:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-institution-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input 
            name="location"
            value={filters.location}
            onChange={handleChange}
            className="w-full text-xs font-medium text-institution-900 placeholder:text-institution-400 bg-institution-50 border border-institution-200 rounded-md pl-9 pr-14 py-2 focus:bg-white focus:ring-1 focus:ring-institution-900 focus:border-institution-900 transition-colors outline-none" 
            placeholder="Cari nama ruangan, gedung..." 
            type="text"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-institution-400 bg-white border border-institution-200 rounded shadow-sm">⌘K</kbd>
          </div>
        </div>

        {/* Filter: Tipe Fasilitas */}
        <div className="md:col-span-3">
          <div className="relative">
            <select 
              name="type"
              value={filters.type}
              onChange={handleChange}
              className="w-full text-xs font-medium text-institution-800 bg-white border border-institution-200 rounded-md px-3 py-2 pr-8 focus:ring-1 focus:ring-institution-900 focus:border-institution-900 appearance-none outline-none"
            >
              <option value="">Tipe: Semua Jenis Ruang</option>
              <option value="ruang_kelas">Ruang Kelas Smart</option>
              <option value="aula">Auditorium & Aula</option>
              <option value="laboratorium">Laboratorium Komputer/Riset</option>
              <option value="alat">Peralatan Khusus</option>
              <option value="lapangan">Olahraga & Terbuka</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-institution-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Filter: Kapasitas */}
        <div className="md:col-span-2">
          <div className="relative">
            <input 
              name="capacity"
              type="number"
              min="0"
              placeholder="Min Kapasitas"
              value={filters.capacity}
              onChange={handleChange}
              className="w-full text-xs font-medium text-institution-800 bg-white border border-institution-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-institution-900 focus:border-institution-900 appearance-none outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-institution-700">
            <input type="checkbox" className="w-3.5 h-3.5 rounded text-univ-blue focus:ring-univ-blue border-institution-300" />
            <span>Tersedia Hari Ini</span>
          </label>
          <button 
            onClick={onReset}
            className="inline-flex items-center text-xs font-medium text-institution-500 hover:text-institution-900 underline underline-offset-4 decoration-institution-300" 
            type="button"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Result Counter & Active Filter Tags */}
      <div className="mt-3 pt-3 border-t border-institution-100 flex flex-wrap items-center justify-between gap-2 text-xs text-institution-500">
        <div className="flex items-center gap-2">
          <span className="font-medium text-institution-700">Menampilkan {resultsCount} dari {totalCount} fasilitas terdaftar</span>
          <span className="text-institution-300">•</span>
          <span className="text-institution-400">Sinkronisasi terakhir: {new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} WIB</span>
        </div>
        
        {hasFilters && (
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-institution-400">Filter aktif:</span>
            {filters.type && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-institution-100 text-institution-700 border border-institution-200">
                Tipe: {filters.type}
              </span>
            )}
            {filters.location && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-institution-100 text-institution-700 border border-institution-200">
                Lokasi: {filters.location}
              </span>
            )}
            {filters.capacity && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-institution-100 text-institution-700 border border-institution-200">
                Min. {filters.capacity} kursi
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
