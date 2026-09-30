import React from 'react';
import type { FacilityFilterState, FacilityType } from '../../types/facility';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

// @ts-ignore
import { mockFacilityTypes } from '../../__mocks__/facilities';

const EMPTY_FILTERS: FacilityFilterState = { type: '', location: '', capacity: '' };

interface FacilityFilterProps {
  filters: FacilityFilterState;
  onFilterChange: (filters: FacilityFilterState) => void;
  onReset?: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  background: 'var(--surface-2)',
  color: 'var(--text-h)',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.15s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

export default function FacilityFilter({ filters, onFilterChange, onReset }: FacilityFilterProps) {
  const handleChange = (field: keyof FacilityFilterState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onFilterChange({ ...filters, [field]: e.target.value });
  };

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      marginBottom: '24px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Header filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <SlidersHorizontal size={16} style={{ color: 'var(--primary)' }} />
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-h)' }}>
          Filter Fasilitas
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        alignItems: 'end',
      }}>
        {/* Tipe */}
        <div>
          <label style={labelStyle}>Tipe Fasilitas</label>
          <select
            style={inputStyle}
            value={filters.type}
            onChange={handleChange('type')}
          >
            <option value="">Semua Tipe</option>
            {mockFacilityTypes.map((t: FacilityType) => {
              const label = {
                ruang_kelas: 'Ruang Kelas',
                aula: 'Aula',
                laboratorium: 'Laboratorium',
                alat: 'Alat',
                lapangan: 'Lapangan'
              }[t.fac_type_name] || t.fac_type_name;
              
              return (
                <option key={t.fac_type_id} value={t.fac_type_name}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        {/* Lokasi */}
        <div>
          <label style={labelStyle}>Lokasi</label>
          <input
            type="text"
            style={inputStyle}
            placeholder="Cari lokasi..."
            value={filters.location}
            onChange={handleChange('location')}
          />
        </div>

        {/* Kapasitas */}
        <div>
          <label style={labelStyle}>Kapasitas Minimal</label>
          <input
            type="number"
            min="0"
            style={inputStyle}
            placeholder="cth. 20"
            value={filters.capacity}
            onChange={handleChange('capacity')}
          />
        </div>

        {/* Reset */}
        <div>
          <button
            type="button"
            onClick={() => { onFilterChange(EMPTY_FILTERS); onReset?.(); }}
            style={{
              width: '100%', padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              background: 'var(--surface-2)', color: 'var(--text-muted)',
              fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget).style.background = 'var(--border)';
              (e.currentTarget).style.color = 'var(--text-h)';
            }}
            onMouseLeave={e => {
              (e.currentTarget).style.background = 'var(--surface-2)';
              (e.currentTarget).style.color = 'var(--text-muted)';
            }}
          >
            <RotateCcw size={14} /> Reset Filter
          </button>
        </div>
      </div>
    </div>
  );
}

export { EMPTY_FILTERS };
