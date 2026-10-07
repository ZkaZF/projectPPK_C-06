import { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle, XCircle, X, Clock } from 'lucide-react';
import { adminGetPendingUsersApi, adminVerifyUserApi, adminRejectUserApi } from '../../api/admin';

interface PendingUser {
  user_id: number;
  user_name: string;
  user_email: string;
  user_nim?: string;
  user_phone?: string;
  created_at: string;
  role?: { role_name: string };
}

export default function VerifyUsersPage() {
  const [users, setUsers]       = useState<PendingUser[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [selected, setSelected] = useState<PendingUser | null>(null);
  const [mode, setMode]         = useState<'verify' | 'reject' | null>(null);
  const [reason, setReason]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');

  const load = () => {
    setLoading(true);
    adminGetPendingUsersApi()
      .then((r: any) => setUsers(r.data.data ?? r.data))
      .catch(() => setError('Gagal memuat daftar akun pending.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const closeModal = () => { setSelected(null); setMode(null); setReason(''); setActionError(''); };

  const handleVerify = async () => {
    if (!selected) return;
    setSubmitting(true); setActionError('');
    try {
      await adminVerifyUserApi(selected.user_id);
      closeModal(); load();
    } catch (err: any) {
      setActionError(err.response?.data?.message ?? 'Gagal memverifikasi akun.');
    } finally { setSubmitting(false); }
  };

  const handleReject = async () => {
    if (!selected) return;
    setSubmitting(true); setActionError('');
    try {
      await adminRejectUserApi(selected.user_id, reason);
      closeModal(); load();
    } catch (err: any) {
      setActionError(err.response?.data?.message ?? 'Gagal menolak akun.');
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
          <ShieldCheck size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, color: 'var(--text-h)' }}>Verifikasi Akun</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem' }}>Persetujuan pendaftaran akun pengguna baru</p>
        </div>
      </div>

      {/* Counter badge */}
      {!loading && users.length > 0 && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '999px', background: '#fef3c7', color: '#92400e', fontSize: '0.875rem', fontWeight: 600, marginBottom: '20px' }}>
          <Clock size={14} /> {users.length} akun menunggu verifikasi
        </div>
      )}

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
      {!loading && users.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
          <CheckCircle size={48} style={{ color: '#10b981', opacity: 0.3, marginBottom: '16px' }} />
          <p style={{ fontWeight: 600, color: 'var(--text-h)', margin: 0 }}>Semua akun sudah diverifikasi</p>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.9rem' }}>Tidak ada pendaftaran baru yang menunggu persetujuan.</p>
        </div>
      )}

      {/* Table */}
      {!loading && users.length > 0 && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                {['Nama', 'Email', 'NIM/ID', 'No. HP', 'Tanggal Daftar', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={u.user_id} style={{ borderBottom: idx < users.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-h)' }}>{u.user_name}</td>
                  <td style={{ padding: '16px', color: 'var(--text)', fontSize: '0.875rem' }}>{u.user_email}</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{u.user_nim ?? '-'}</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{u.user_phone ?? '-'}</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => { setSelected(u); setMode('verify'); setActionError(''); }}
                        style={{ padding: '6px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #6ee7b7', background: '#d1fae5', color: '#065f46', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                        ✓ Verifikasi
                      </button>
                      <button onClick={() => { setSelected(u); setMode('reject'); setActionError(''); }}
                        style={{ padding: '6px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #fca5a5', background: '#fee2e2', color: '#dc2626', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                        ✕ Tolak
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selected && mode && (
        <div style={overlayStyle}>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '32px', maxWidth: '460px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-h)' }}>
                {mode === 'verify' ? '✓ Verifikasi Akun' : '✕ Tolak Akun'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '20px', fontSize: '0.875rem' }}>
              <p style={{ margin: '0 0 4px', fontWeight: 700, color: 'var(--text-h)' }}>{selected.user_name}</p>
              <p style={{ margin: '0 0 4px', color: 'var(--text-muted)' }}>{selected.user_email}</p>
              {selected.user_nim && <p style={{ margin: 0, color: 'var(--text-muted)' }}>NIM: {selected.user_nim}</p>}
            </div>

            {mode === 'reject' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Alasan Penolakan (Opsional)</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
                  placeholder="Tuliskan alasan penolakan akun ini..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
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
              <button onClick={mode === 'verify' ? handleVerify : handleReject} disabled={submitting}
                style={{ padding: '10px 20px', borderRadius: 'var(--radius)', background: mode === 'verify' ? '#059669' : '#dc2626', color: '#fff', border: 'none', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {submitting ? 'Menyimpan...' : mode === 'verify' ? <><CheckCircle size={16} /> Verifikasi</> : <><XCircle size={16} /> Tolak</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

