import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SlotCalendar from '../../components/facilities/SlotCalendar';
import type { Facility } from '../../types/facility';
import { MapPin, Users, Calendar, ArrowLeft, Tag } from 'lucide-react';

// @ts-ignore
import { getFacilityApi } from '../../api/facilities';

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

interface SelectedSlot {
  start: string;
  end: string;
}

const statusColor: Record<string, { bg: string; text: string }> = {
  aktif:           { bg: '#d1fae5', text: '#065f46' },
  'dalam perbaikan':{ bg: '#fef3c7', text: '#92400e' },
  nonaktif:        { bg: '#fee2e2', text: '#991b1b' },
};

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--primary)',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────
  if (!facility) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Fasilitas tidak ditemukan.</p>
        <button
          onClick={() => navigate(-1)}
          style={{ marginTop: '16px', padding: '10px 20px', borderRadius: 'var(--radius)', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Kembali
        </button>
      </div>
    );
  }

  const statusRaw = facility.status?.fac_status_name?.toLowerCase() ?? '';
  const badge = statusColor[statusRaw] ?? { bg: '#f1f5f9', text: '#64748b' };

  return (
    <div style={{ padding: '32px', maxWidth: '1140px', margin: '0 auto' }}>

      {/* ── Back button ── */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          marginBottom: '24px', background: 'none', border: 'none',
          color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem',
          padding: '6px 0', transition: 'color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
      >
        <ArrowLeft size={16} /> Kembali ke Daftar Fasilitas
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '28px', alignItems: 'start' }}>

        {/* ── Kolom kiri: info fasilitas ── */}
        <div>
          <div style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)',
          }}>
            {/* Gambar */}
            <img
              src={facility.fac_image || 'https://placehold.co/600x320?text=Fasilitas'}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = 'https://placehold.co/600x320?text=Fasilitas';
              }}
              alt={facility.fac_name}
              style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }}
            />

            {/* Detail */}
            <div style={{ padding: '24px' }}>
              {/* Badge status & tipe */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span style={{
                  padding: '4px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600,
                  background: badge.bg, color: badge.text,
                }}>
                  {facility.status?.fac_status_name ?? '-'}
                </span>
                <span style={{
                  padding: '4px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600,
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  background: 'var(--primary-bg)', color: 'var(--primary-dark)',
                }}>
                  <Tag size={11} /> {facility.type?.fac_type_name ?? '-'}
                </span>
              </div>

              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-h)', marginBottom: '12px' }}>
                {facility.fac_name}
              </h1>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'var(--text)', fontSize: '0.9rem' }}>
                  <MapPin size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  {facility.fac_location}
                </p>
                {facility.fac_capacity != null && (
                  <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'var(--text)', fontSize: '0.9rem' }}>
                    <Users size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    Kapasitas {facility.fac_capacity} orang
                  </p>
                )}
              </div>

              {facility.fac_description && (
                <p style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.7, borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                  {facility.fac_description}
                </p>
              )}

              {/* Tombol ajukan reservasi */}
              <button
                onClick={handleReserve}
                disabled={!selectedSlot}
                style={{
                  marginTop: '20px', width: '100%', padding: '12px',
                  borderRadius: 'var(--radius)', border: 'none', cursor: selectedSlot ? 'pointer' : 'not-allowed',
                  background: selectedSlot ? 'var(--primary)' : 'var(--border)',
                  color: selectedSlot ? '#fff' : 'var(--text-muted)',
                  fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.2s',
                }}
              >
                {selectedSlot
                  ? `Ajukan Reservasi (${selectedSlot.start} – ${selectedSlot.end})`
                  : 'Pilih slot waktu terlebih dahulu'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Kolom kanan: kalender slot ── */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: 'var(--text-h)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} style={{ color: 'var(--primary)' }} />
              Jadwal Ketersediaan
            </h2>
            <input
              type="date"
              value={date}
              min={todayStr()}
              onChange={(e) => { setDate(e.target.value); setSelectedSlot(null); }}
              style={{
                padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)', background: 'var(--surface-2)',
                color: 'var(--text-h)', fontSize: '0.875rem', cursor: 'pointer',
              }}
            />
          </div>

          {/* Legenda */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '0.8rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--success)', display: 'inline-block' }} />
              Tersedia
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--danger)', display: 'inline-block' }} />
              Terisi
            </span>
          </div>

          {id && (
            <SlotCalendar
              facilityId={id}
              date={date}
              onSlotSelect={(start, end) => setSelectedSlot({ start, end })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
