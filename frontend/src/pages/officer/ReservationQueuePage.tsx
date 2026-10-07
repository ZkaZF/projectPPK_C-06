import { useState, useEffect } from 'react';
import { Ticket, Clock, CheckCircle, XCircle, X, AlertCircle } from 'lucide-react';
import {
  getReservationQueueApi,
  approveReservationApi,
  rejectReservationApi,
} from '../../api/reservations';

interface Reservation {
  res_id: number;
  res_date: string;
  res_start: string;
  res_end: string;
  res_purpose: string;
  facility?: { fac_name: string; fac_location?: string };
  user?: { user_name: string; user_email: string };
  reservation_status?: { res_status_name: string };
  created_at: string;
}

const STATUS_STYLE: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  pending:   { bg: '#fef3c7', text: '#92400e', icon: <Clock size={12} /> },
  approved:  { bg: '#d1fae5', text: '#065f46', icon: <CheckCircle size={12} /> },
  rejected:  { bg: '#fee2e2', text: '#991b1b', icon: <XCircle size={12} /> },
  cancelled: { bg: '#f1f5f9', text: '#64748b', icon: <X size={12} /> },
};

function formatDate(raw: string) {
  const d = new Date(raw);
  return isNaN(d.getTime()) ? raw : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
function formatTime(raw: string) { return raw?.slice(0, 5) ?? raw; }

export default function ReservationQueuePage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [selected, setSelected]         = useState<Reservation | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [mode, setMode]                 = useState<'approve' | 'reject' | null>(null);
  const [submitting, setSubmitting]     = useState(false);
  const [actionError, setActionError]   = useState('');

  const load = () => {
    setLoading(true);
    getReservationQueueApi()
      .then((r: any) => setReservations(r.data.data ?? r.data))
      .catch(() => setError('Gagal memuat antrian reservasi.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const closeModal = () => { setSelected(null); setMode(null); setRejectReason(''); setActionError(''); };

  const handleApprove = async () => {
    if (!selected) return;
    setSubmitting(true); setActionError('');
    try {
      await approveReservationApi(selected.res_id);
      closeModal(); load();
    } catch (err: any) {
      setActionError(err.response?.data?.message ?? 'Gagal menyetujui reservasi.');
    } finally { setSubmitting(false); }
  };

  const handleReject = async () => {
    if (!selected || !rejectReason.trim()) { setActionError('Alasan penolakan harus diisi.'); return; }
    setSubmitting(true); setActionError('');
    try {
      await rejectReservationApi(selected.res_id, rejectReason);
      closeModal(); load();
    } catch (err: any) {
      setActionError(err.response?.data?.message ?? 'Gagal menolak reservasi.');
    } finally { setSubmitting(false); }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)', background: 'var(--surface-2)',
    color: 'var(--text-h)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '6px', fontSize: '0.78rem',
    fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em',
  };
  const overlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px',
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1140px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
        <div style={{ width: 48, height: 48, borderRadius: '10px', background: 'var(--primary-bg)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Ticket size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, color: 'var(--text-h)' }}>Antrian Reservasi</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem' }}>Review dan persetujuan pengajuan peminjaman fasilitas</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: '#fee2e2', color: '#dc2626', marginBottom: '20px', fontSize: '0.875rem' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite' }} />
        </div>
      )}

      {/* Empty State */}
      {!loading && reservations.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
          <Ticket size={48} style={{ opacity: 0.12, marginBottom: '16px', color: 'var(--text-h)' }} />
          <p style={{ fontWeight: 600, color: 'var(--text-h)', margin: 0 }}>Tidak ada reservasi pending</p>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.9rem' }}>Semua reservasi sudah ditangani atau belum ada pengajuan baru.</p>
        </div>
      )}

      {/* List */}
      {!loading && reservations.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reservations.map((r) => {
            const rawStatus = r.reservation_status?.res_status_name || '';
            const statusKey = rawStatus.toLowerCase();
            const badge = STATUS_STYLE[statusKey] ?? STATUS_STYLE.pending;
            const statusDisplay = rawStatus ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1) : 'Pending';

            return (
              <div key={r.res_id} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '20px 24px',
                boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', flexWrap: 'wrap', gap: '16px',
              }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-h)', fontSize: '1rem' }}>
                      {r.facility?.fac_name ?? 'Fasilitas'}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: badge.bg, color: badge.text }}>
                      {badge.icon} {statusDisplay}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    📅 {formatDate(r.res_date)} &nbsp;|&nbsp; ⏰ {formatTime(r.res_start)} – {formatTime(r.res_end)}
                  </p>
                  {r.user && (
                    <p style={{ margin: '0 0 4px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      👤 {r.user.user_name} &lt;{r.user.user_email}&gt;
                    </p>
                  )}
                  <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--text)', fontStyle: 'italic' }}>
                    "{r.res_purpose}"
                  </p>
                </div>

                {/* Actions — only for pending */}
                {statusKey === 'pending' && (
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button onClick={() => { setSelected(r); setMode('approve'); setActionError(''); }}
                      style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid #6ee7b7', background: '#d1fae5', color: '#065f46', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
                      ✓ Setujui
                    </button>
                    <button onClick={() => { setSelected(r); setMode('reject'); setActionError(''); }}
                      style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid #fca5a5', background: '#fee2e2', color: '#dc2626', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
                      ✕ Tolak
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal Konfirmasi ── */}
      {selected && mode && (
        <div style={overlayStyle}>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '32px', maxWidth: '480px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0, color: 'var(--text-h)' }}>
                {mode === 'approve' ? '✓ Setujui Reservasi' : '✕ Tolak Reservasi'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            {/* Summary */}
            <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-h)' }}>{selected.facility?.fac_name}</p>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>📅 {formatDate(selected.res_date)} · ⏰ {formatTime(selected.res_start)} – {formatTime(selected.res_end)}</p>
              {selected.user && <p style={{ margin: 0, color: 'var(--text-muted)' }}>👤 {selected.user.user_name}</p>}
              <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text)' }}>"{selected.res_purpose}"</p>
            </div>

            {/* Reject Reason (only when rejecting) */}
            {mode === 'reject' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Alasan Penolakan *</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
                  placeholder="Tuliskan alasan mengapa reservasi ini ditolak..."
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                />
              </div>
            )}

            {actionError && (
              <div style={{ padding: '10px 14px', marginBottom: '16px', borderRadius: 'var(--radius-sm)', background: '#fee2e2', color: '#dc2626', fontSize: '0.875rem' }}>
                {actionError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={closeModal} disabled={submitting}
                style={{ padding: '10px 20px', borderRadius: 'var(--radius)', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', fontWeight: 600, cursor: 'pointer' }}>
                Batal
              </button>
              <button
                onClick={mode === 'approve' ? handleApprove : handleReject}
                disabled={submitting}
                style={{ padding: '10px 20px', borderRadius: 'var(--radius)', background: mode === 'approve' ? '#059669' : '#dc2626', color: '#fff', border: 'none', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {submitting ? 'Menyimpan...' : mode === 'approve' ? <><CheckCircle size={16} /> Konfirmasi Setujui</> : <><XCircle size={16} /> Konfirmasi Tolak</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

