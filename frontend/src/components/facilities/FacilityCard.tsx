import { Link } from 'react-router-dom';
import { MapPin, Users } from 'lucide-react';
import type { Facility } from '../../types/facility';

interface FacilityCardProps {
  facility: Facility;
}

const statusStyle: Record<string, { bg: string; text: string }> = {
  aktif:            { bg: '#d1fae5', text: '#065f46' },
  'dalam perbaikan':{ bg: '#fef3c7', text: '#92400e' },
  nonaktif:         { bg: '#fee2e2', text: '#991b1b' },
};

export default function FacilityCard({ facility }: FacilityCardProps) {
  const { fac_id, fac_name, type, fac_location, fac_capacity, status, fac_image } = facility;

  const statusRaw  = status?.fac_status_name?.toLowerCase() ?? '';
  const badge      = statusStyle[statusRaw] ?? { bg: '#f1f5f9', text: '#64748b' };
  const statusLabel = status?.fac_status_name ?? '-';
  
  const typeName = type?.fac_type_name ?? '';
  const typeLabel = {
    ruang_kelas: 'Ruang Kelas',
    aula: 'Aula',
    laboratorium: 'Laboratorium',
    alat: 'Alat',
    lapangan: 'Lapangan'
  }[typeName] || (typeName || '-');

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-sm)',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Gambar */}
      <img
        src={fac_image || 'https://placehold.co/400x220?text=Fasilitas'}
        alt={fac_name}
        style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
        onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x220?text=Fasilitas'; }}
      />

      {/* Body */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Baris atas: nama + badge status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-h)', margin: 0, lineHeight: 1.3 }}>
            {fac_name}
          </h3>
          <span style={{
            flexShrink: 0, padding: '3px 10px', borderRadius: '999px',
            fontSize: '0.72rem', fontWeight: 600,
            background: badge.bg, color: badge.text,
          }}>
            {statusLabel}
          </span>
        </div>

        {/* Badge tipe */}
        <span style={{
          alignSelf: 'flex-start', marginBottom: '12px',
          padding: '3px 10px', borderRadius: '999px',
          background: 'var(--primary-bg)', color: 'var(--primary-dark)',
          fontSize: '0.75rem', fontWeight: 600,
        }}>
          {typeLabel}
        </span>

        {/* Info lokasi & kapasitas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
          <p style={{ display: 'flex', alignItems: 'center', gap: '7px', margin: 0, fontSize: '0.85rem', color: 'var(--text)' }}>
            <MapPin size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            {fac_location}
          </p>
          {fac_capacity != null && (
            <p style={{ display: 'flex', alignItems: 'center', gap: '7px', margin: 0, fontSize: '0.85rem', color: 'var(--text)' }}>
              <Users size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              Kapasitas {fac_capacity} orang
            </p>
          )}
        </div>

        {/* Tombol */}
        <Link
          to={`/facilities/${fac_id}`}
          style={{
            display: 'block', marginTop: '16px', padding: '10px',
            borderRadius: 'var(--radius)', textAlign: 'center',
            background: 'var(--primary)', color: '#fff',
            fontWeight: 600, fontSize: '0.875rem',
            transition: 'background 0.2s',
            textDecoration: 'none',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--primary-dark)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--primary)')}
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}
