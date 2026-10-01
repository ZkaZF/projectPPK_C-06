import { Ticket, CheckCircle, Clock, XCircle, X } from 'lucide-react';
import { formatDate } from '../../utils/date';

export interface Reservation {
  res_id: number;
  res_date: string;
  res_start: string;
  res_end: string;
  res_purpose: string;
  facility?: { fac_name: string; fac_location?: string };
  // PERBAIKAN: Diubah dari object reservation_status ke property flat res_status_name
  res_status_name?: string;
  created_at: string;
}

const STATUS_STYLE: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  pending:   { bg: '#fef3c7', text: '#92400e', icon: <Clock size={12} /> },
  approved:  { bg: '#d1fae5', text: '#065f46', icon: <CheckCircle size={12} /> },
  rejected:  { bg: '#fee2e2', text: '#991b1b', icon: <XCircle size={12} /> },
  cancelled: { bg: '#f1f5f9', text: '#64748b', icon: <X size={12} /> },
};

export default function ReservationTable({
  reservations,
  loading,
  error,
  cancellingId,
  onCancel,
  onCreateNew,
}: {
  reservations: Reservation[];
  loading: boolean;
  error: string;
  cancellingId: number | null;
  onCancel: (id: number) => void;
  onCreateNew: () => void;
}) {
  if (error) {
    return <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: '#fee2e2', color: '#dc2626', marginBottom: '20px', fontSize: '0.875rem' }}>⚠️ {error}</div>;
  }
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }
  if (reservations.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
        <Ticket size={48} style={{ opacity: 0.12, marginBottom: '16px', color: 'var(--text-h)' }} />
        <p style={{ fontWeight: 600, color: 'var(--text-h)', margin: 0 }}>Belum ada reservasi</p>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.9rem' }}>Ajukan peminjaman fasilitas kampus pertama Anda.</p>
        <button onClick={onCreateNew} style={{ marginTop: '20px', padding: '10px 24px', borderRadius: 'var(--radius)', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
          + Ajukan Reservasi
        </button>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {reservations.map((r) => {
        // PERBAIKAN: Akses langsung property res_status_name
        const statusName = r.res_status_name ?? '';
        const statusKey = statusName.toLowerCase();
        const badge = STATUS_STYLE[statusKey] ?? STATUS_STYLE.pending;
        const canCancel = statusKey === 'pending' || statusKey === 'approved';
        return (
          <div key={r.res_id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-h)', fontSize: '1rem' }}>{r.facility?.fac_name ?? 'Fasilitas'}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: badge.bg, color: badge.text }}>
                  {badge.icon} {statusName || '-'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                📅 {formatDate(r.res_date)} &nbsp;|&nbsp; ⏰ {r.res_start} – {r.res_end}
              </p>
              {r.facility?.fac_location && (
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>📍 {r.facility.fac_location}</p>
              )}
              <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: 'var(--text)', fontStyle: 'italic' }}>"{r.res_purpose}"</p>
            </div>
            {canCancel && (
              <button onClick={() => onCancel(r.res_id)} disabled={cancellingId === r.res_id}
                style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid #fca5a5', background: '#fee2e2', color: '#dc2626', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                {cancellingId === r.res_id ? 'Membatalkan...' : 'Batalkan'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
