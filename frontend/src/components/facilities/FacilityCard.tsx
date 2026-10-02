import { Link } from 'react-router-dom';
import type { Facility } from '../../types/facility';

interface FacilityCardProps {
  facility: Facility;
}

export default function FacilityCard({ facility }: FacilityCardProps) {
  const { fac_id, fac_name, type, fac_location, fac_capacity, status, fac_image } = facility;

  const statusRaw  = status?.fac_status_name?.toLowerCase() ?? '';
  const statusLabel = status?.fac_status_name ?? '-';
  
  const typeName = type?.fac_type_name?.toLowerCase() ?? '';
  const typeLabel = {
    ruang_kelas: 'Ruang Kelas Smart',
    aula: 'Aula & Konvensi',
    laboratorium: 'Laboratorium',
    alat: 'Studio Multimedia',
    lapangan: 'Fasilitas Olahraga'
  }[typeName] || (type?.fac_type_name || '-');

  // Prefix based on type
  const prefix = {
    ruang_kelas: 'GKB',
    aula: 'GED',
    laboratorium: 'LAB',
    alat: 'STU',
    lapangan: 'LAP'
  }[typeName] || 'FAS';

  // Specific dummy tags based on type (to match design reference exactly)
  const getDummyTags = () => {
    switch(typeName) {
      case 'ruang_kelas':
        return ['Interactive Touchboard 85"', 'Auto-Tracking Camera', 'Eduroam High-Density'];
      case 'aula':
        return ['AV System 4K', 'Mic Wireless (6)', 'AC Sentral', 'Podium Digital'];
      case 'laboratorium':
        return ['Ubuntu CUDA Cluster', 'Dual 4K Display', 'LAN 10Gbps'];
      case 'alat':
        return ['Shure SM7B (4 Unit)', 'Rødecaster Pro II', 'Ruang Kedap Suara'];
      case 'lapangan':
        return ['Lampu Sorot Malam', 'Lantai Vinil Sintetis', 'Scoreboard Digital'];
      default:
        return ['Standard Spec', 'AC Sentral', 'WiFi Access'];
    }
  };

  // Determine badge styling based on status
  const isAvailable = facility.fac_stat_id === 1;
  const badgeClasses = isAvailable 
    ? "bg-white/95 text-emerald-800 border-emerald-200" 
    : facility.fac_stat_id === 2
      ? "bg-amber-50 text-amber-900 border-amber-300"
      : "bg-red-50 text-red-900 border-red-300";
      
  const dotClass = isAvailable ? "bg-emerald-600" : facility.fac_stat_id === 2 ? "bg-amber-500" : "bg-red-600";
  const displayStatus = isAvailable ? "Tersedia Hari Ini" : (statusLabel || "Pemeliharaan");

  return (
    <article className={`bg-white rounded-lg border border-institution-200 overflow-hidden hover:border-institution-400 transition-all duration-150 flex flex-col group ${!isAvailable ? 'opacity-95' : ''}`}>
      {/* Thumbnail 16:10 */}
      <div className="relative aspect-[16/10] w-full bg-institution-100 overflow-hidden border-b border-institution-100 flex items-center justify-center">
        {fac_image ? (
          <img 
            src={fac_image} 
            alt={fac_name} 
            className={`w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-200 ${!isAvailable ? 'grayscale-[25%]' : ''}`} 
          />
        ) : (
          <div className="text-institution-400 text-xs font-medium">No Image Available</div>
        )}
        
        {/* Top Metas: Room Code & Status Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="font-mono text-[10px] font-semibold tracking-wide bg-institution-900/90 text-white px-2 py-0.5 rounded border border-white/10 backdrop-blur-sm shadow-sm">
            {prefix}-{fac_id.toString().padStart(3, '0')}
          </span>
        </div>
        
        <div className="absolute top-2.5 right-2.5">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border shadow-sm backdrop-blur-sm ${badgeClasses}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></span>
            {displayStatus}
          </span>
        </div>
        
        <div className="absolute bottom-2.5 left-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/95 text-institution-700 px-2 py-0.5 rounded border border-institution-200 shadow-sm">
            {typeLabel}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h2 className="text-base font-bold text-institution-900 leading-snug tracking-tight">
              {fac_name}
            </h2>
          </div>

          {/* Structured Metadata Specs */}
          <div className="space-y-1.5 text-xs text-institution-600 mb-3.5">
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-institution-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <span className="font-medium text-institution-700">{fac_location || '-'}</span>
            </div>
            {fac_capacity != null && (
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-institution-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span>Kapasitas: <strong className="text-institution-800 font-semibold">{fac_capacity} Orang</strong></span>
              </div>
            )}
          </div>

          {/* Dummy Facilities Tags (to match design) */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {getDummyTags().map((tag, i) => (
              <span key={i} className="px-2 py-0.5 rounded text-[11px] bg-institution-50 text-institution-600 border border-institution-200 font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="pt-3 border-t border-institution-100 flex items-center justify-between gap-2 mt-auto">
          {!isAvailable ? (
            <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              Reservasi ditangguhkan
            </span>
          ) : (
            <Link to={`/facilities/${fac_id}`} className="text-xs font-semibold text-institution-600 hover:text-institution-900 transition">
              Cek Kalender
            </Link>
          )}
          
          <Link 
            to={`/facilities/${fac_id}`}
            className={
              isAvailable
                ? "inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-institution-900 hover:bg-institution-800 px-3 py-1.5 rounded transition"
                : "inline-flex items-center gap-1.5 text-xs font-semibold text-institution-700 bg-institution-100 hover:bg-institution-200 px-3 py-1.5 rounded transition"
            }
          >
            <span>{isAvailable ? 'Ajukan Reservasi' : 'Log Perbaikan'}</span>
            {isAvailable && (
              <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            )}
          </Link>
        </div>
      </div>
    </article>
  );
}