import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SlotCalendar from '../../components/facilities/SlotCalendar';
import type { Facility } from '../../types/facility';
import { isAvailable, getFacilityTypeLabel, getFacilityPrefix } from '../../utils/facility';
// @ts-ignore
import { getFacilityApi } from '../../api/facilities';

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

interface SelectedSlot {
  start: string;
  end: string;
}

export default function FacilityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [date, setDate] = useState<string>(todayStr());
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getFacilityApi(id)
      .then((res: any) => setFacility(res.data.data ?? res.data))
      .catch((err: any) => { console.error(err); setFacility(null); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleReserve = () => {
    if (!selectedSlot || !id) return;
    navigate('/reservations/new', {
      state: { facilityId: id, date, ...selectedSlot },
    });
  };

  // ── Loading state ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full border-4 border-institution-200 border-t-institution-900 animate-spin" />
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────
  if (!facility) {
    return (
      <div className="text-center py-20 px-4">
        <svg className="w-12 h-12 mx-auto text-institution-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p className="font-semibold text-institution-900 m-0">Fasilitas tidak ditemukan</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 text-sm font-semibold rounded-md bg-institution-900 text-white hover:bg-institution-800 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-institution-900"
        >
          Kembali
        </button>
      </div>
    );
  }

  const typeName = facility.type?.fac_type_name?.toLowerCase() ?? '';
  const typeLabel = getFacilityTypeLabel(typeName, facility.type?.fac_type_name);
  const available = isAvailable(facility);
  const statusLabel = facility.status?.fac_status_name ?? (available ? 'Tersedia' : 'Pemeliharaan');
  
  const badgeClasses = available 
    ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
    : facility.fac_stat_id === 2
      ? "bg-amber-50 text-amber-900 border-amber-300"
      : "bg-red-50 text-red-900 border-red-300";
  const dotClass = available ? "bg-emerald-600" : facility.fac_stat_id === 2 ? "bg-amber-500" : "bg-red-600";

  return (
    <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 pt-7 pb-16 flex-1 animate-fade-in">
      
      {/* ── Breadcrumb & Back ── */}
      <nav className="flex items-center gap-2 text-xs font-mono text-institution-500 mb-6" aria-label="Breadcrumb">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 hover:text-institution-900 transition-colors group">
          <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Kembali
        </button>
        <span>/</span>
        <span className="text-institution-800 font-semibold truncate max-w-[200px] sm:max-w-xs">{facility.fac_name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── Kolom Kiri: Info Fasilitas (5/12) ── */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-institution-200 overflow-hidden shadow-sm flex flex-col">
          {/* Gambar */}
          <div className="relative aspect-[16/10] w-full bg-institution-50 overflow-hidden border-b border-institution-100 flex items-center justify-center">
            {facility.fac_image ? (
              <img
                src={facility.fac_image}
                alt={`Foto ${facility.fac_name}`}
                className={`w-full h-full object-cover ${!available ? 'grayscale-[25%]' : ''}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement?.classList.add('fallback-bg');
                }}
              />
            ) : (
              <svg className="w-12 h-12 text-institution-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            )}
            
            <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border shadow-sm backdrop-blur-sm ${badgeClasses}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></span>
                {statusLabel}
              </span>
            </div>
            
            <div className="absolute bottom-3 left-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-white/95 text-institution-700 px-2.5 py-1 rounded border border-institution-200 shadow-sm">
                {typeLabel}
              </span>
            </div>
          </div>

          {/* Detail */}
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-semibold tracking-wide text-institution-500">
                {getFacilityPrefix(typeName)}-{facility.fac_id.toString().padStart(3, '0')}
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-bold text-institution-900 leading-tight mb-4">
              {facility.fac_name}
            </h1>

            <div className="space-y-2.5 text-sm text-institution-600 mb-5">
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-institution-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span className="font-medium text-institution-700">{facility.fac_location || 'Lokasi tidak ditentukan'}</span>
              </div>
              {facility.fac_capacity != null && (
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-institution-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <span>Kapasitas: <strong className="text-institution-800 font-semibold">{facility.fac_capacity} Orang</strong></span>
                </div>
              )}
            </div>

            {facility.fac_description ? (
              <p className="text-xs text-institution-500 leading-relaxed border-t border-institution-100 pt-4 mb-5">
                {facility.fac_description}
              </p>
            ) : (
              <div className="text-xs text-institution-400 italic border-t border-institution-100 pt-4 mb-5">
                Tidak ada deskripsi tersedia.
              </div>
            )}

            {/* Tombol Ajukan */}
            <div className="mt-auto pt-2">
              <button
                onClick={handleReserve}
                disabled={!selectedSlot || !available}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  !available
                    ? 'bg-institution-100 text-institution-400 cursor-not-allowed'
                    : selectedSlot
                      ? 'bg-institution-900 text-white hover:bg-institution-800 focus-visible:outline-institution-900 shadow-sm'
                      : 'bg-white border border-institution-200 text-institution-600 cursor-not-allowed'
                }`}
              >
                {!available 
                  ? 'Fasilitas Tidak Tersedia'
                  : selectedSlot
                    ? `Ajukan Reservasi (${selectedSlot.start} – ${selectedSlot.end})`
                    : 'Pilih slot waktu di kalender'}
                {available && selectedSlot && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Kolom Kanan: Kalender (7/12) ── */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-institution-200 shadow-sm p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-institution-100">
            <div className="w-8 h-8 rounded bg-institution-50 border border-institution-200 flex items-center justify-center text-institution-700 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-institution-900">Jadwal Ketersediaan</h2>
              <p className="text-[11px] text-institution-500">Pilih tanggal dan rentang waktu yang tersedia</p>
            </div>
          </div>

          {id && (
            <SlotCalendar
              facilityId={id}
              date={date}
              onDateChange={(d) => { setDate(d); setSelectedSlot(null); }}
              onSlotSelect={(start, end) => setSelectedSlot({ start, end })}
            />
          )}
        </div>
      </div>
    </div>
  );
}