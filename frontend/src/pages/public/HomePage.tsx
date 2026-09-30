import { useEffect, useMemo, useState } from 'react';
import FacilityCard from '../../components/facilities/FacilityCard';
import FacilityFilter, { EMPTY_FILTERS } from '../../components/facilities/FacilityFilter';
import type { Facility, FacilityFilterState } from '../../types/facility';
import { Building2 } from 'lucide-react';

// @ts-ignore
import { getFacilitiesApi } from '../../api/facilities';

export default function HomePage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FacilityFilterState>(EMPTY_FILTERS);

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
      return true;
    });
  }, [facilities, filters]);

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '10px',
          background: 'var(--primary-bg)', color: 'var(--primary-dark)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Building2 size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'var(--text-h)' }}>
            Fasilitas Kampus
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Temukan dan pesan fasilitas kampus yang Anda butuhkan
          </p>
        </div>
      </div>

      {/* ── Filter ── */}
      <FacilityFilter
        filters={filters}
        onFilterChange={setFilters}
        onReset={() => setFilters(EMPTY_FILTERS)}
      />

      {/* ── Error ── */}
      {error && (
        <div style={{
          padding: '14px 18px', borderRadius: 'var(--radius)',
          background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5',
          marginBottom: '20px', fontSize: '0.9rem',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Loading spinner ── */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            border: '3px solid var(--border)', borderTopColor: 'var(--primary)',
            animation: 'spin 0.8s linear infinite',
          }} />
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && filtered.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '80px 20px',
          background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border)',
        }}>
          <Building2 size={48} style={{ opacity: 0.12, marginBottom: '16px', color: 'var(--text-h)' }} />
          <p style={{ fontWeight: 600, color: 'var(--text-h)', margin: 0 }}>Tidak ada fasilitas ditemukan</p>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.9rem' }}>
            Coba ubah filter pencarian Anda
          </p>
        </div>
      )}

      {/* ── Grid kartu fasilitas ── */}
      {!loading && filtered.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {filtered.map((f) => (
            <FacilityCard key={f.fac_id} facility={f} />
          ))}
        </div>
      )}

    </div>
  );
}
