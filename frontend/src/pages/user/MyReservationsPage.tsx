import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Plus, X, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { getMyReservationsApi, cancelReservationApi } from '../../api/reservations';

interface Reservation {
  res_id: number;
  res_date: string;
  res_start: string;
  res_end: string;
  res_purpose: string;
  facility?: { fac_name: string; fac_location?: string };
  reservation_status?: { res_status_name: string };
  created_at: string;
}

const STATUS_STYLE: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  pending:   { bg: '#fef3c7', text: '#92400e', icon: <Clock size={12} /> },
  approved:  { bg: '#d1fae5', text: '#065f46', icon: <CheckCircle size={12} /> },
  rejected:  { bg: '#fee2e2', text: '#991b1b', icon: <XCircle size={12} /> },
  cancelled: { bg: '#f1f5f9', text: '#64748b', icon: <X size={12} /> },
};

// Format "2026-09-18T00:00:00.000000Z" → "18 September 2026"
function formatDate(raw: string) {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw; // fallback jika bukan ISO
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Format "08:00:00" atau "08:00:00.000000" → "08:00"
function formatTime(raw: string) {
  if (!raw) return raw;
  return raw.slice(0, 5);
}

export default function MyReservationsPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [cancelling, setCancelling]     = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    getMyReservationsApi()
      .then((r: any) => setReservations(r.data.data ?? r.data))
      .catch(() => setError('Gagal memuat data reservasi.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id: number) => {
    if (!confirm('Yakin ingin membatalkan reservasi ini?')) return;
    setCancelling(id);
    try {
      await cancelReservationApi(id);
      load();
    } catch {
      alert('Gagal membatalkan reservasi.');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1140px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: 48, height: 48, borderRadius: '10px', background: 'var(--primary-bg)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ticket size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, color: 'var(--text-h)' }}>Reservasi Saya</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem' }}>Riwayat dan status pengajuan peminjaman fasilitas</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/reservations/new')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: 'var(--radius)', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
        >
          <Plus size={16} /> Ajukan Baru
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: '#fee2e2', color: '#dc2626', marginBottom: '20px', fontSize: '0.875rem' }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite' }} />
        </div>
      )}

      {/* Empty */}
      {!loading && reservations.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
          <Ticket size={48} style={{ opacity: 0.12, marginBottom: '16px', color: 'var(--text-h)' }} />
          <p style={{ fontWeight: 600, color: 'var(--text-h)', margin: 0 }}>Belum ada reservasi</p>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.9rem' }}>Ajukan peminjaman fasilitas kampus pertama Anda.</p>
          <button
            onClick={() => navigate('/reservations/new')}
            style={{ marginTop: '20px', padding: '10px 24px', borderRadius: 'var(--radius)', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
          >
            + Ajukan Reservasi
          </button>
        </div>
      )}

      {/* List */}
      {!loading && reservations.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reservations.map((r) => {
            const rawStatus = r.reservation_status?.res_status_name || '';
            const statusKey = rawStatus.toLowerCase();
            const badge = STATUS_STYLE[statusKey] ?? STATUS_STYLE.pending;
            const statusDisplay = rawStatus ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1) : 'Menunggu';
            const canCancel = statusKey === 'pending' || statusKey === 'approved';

            return (
              <div key={r.res_id} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '20px 24px',
                boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', flexWrap: 'wrap', gap: '12px',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-h)', fontSize: '1rem' }}>
                      {r.facility?.fac_name ?? 'Fasilitas'}
                    </span>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                      background: badge.bg, color: badge.text,
                    }}>
                      {badge.icon} {statusDisplay}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    📅 {formatDate(r.res_date)} &nbsp;|&nbsp; ⏰ {formatTime(r.res_start)} – {formatTime(r.res_end)}
                  </p>
                  {r.facility?.fac_location && (
                    <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      📍 {r.facility.fac_location}
                    </p>
                  )}
                  <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: 'var(--text)', fontStyle: 'italic' }}>
                    "{r.res_purpose}"
                  </p>
                </div>

                {canCancel && (
                  <button
                    onClick={() => handleCancel(r.res_id)}
                    disabled={cancelling === r.res_id}
                    style={{
                      padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                      border: '1px solid #fca5a5', background: '#fee2e2', color: '#dc2626',
                      fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                    }}
                  >
                    {cancelling === r.res_id ? 'Membatalkan...' : 'Batalkan'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

