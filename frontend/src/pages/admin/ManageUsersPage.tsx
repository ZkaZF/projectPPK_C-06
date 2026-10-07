import { useState, useEffect } from 'react';
import { Users, Plus, X, AlertCircle } from 'lucide-react';
import { adminGetUsersApi, adminCreateUserApi } from '../../api/admin';

interface User {
  user_id: number;
  user_name: string;
  user_email: string;
  user_nim?: string;
  user_phone?: string;
  created_at: string;
  is_verified: boolean;
  role?: { role_name: string };
}

const ROLE_BADGE: Record<string, { bg: string; text: string }> = {
  admin:     { bg: '#ede9fe', text: '#7c3aed' },
  petugas:   { bg: '#dbeafe', text: '#1d4ed8' },
  pengguna:  { bg: '#d1fae5', text: '#065f46' },
};

export default function ManageUsersPage() {
  const [users, setUsers]         = useState<User[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');
  const [form, setForm]           = useState({ user_name: '', user_email: '', user_password: '', role: 'petugas' });

  const load = () => {
    setLoading(true);
    adminGetUsersApi()
      .then((r: any) => setUsers(r.data.data ?? r.data))
      .catch(() => setError('Gagal memuat daftar pengguna.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setCreateError('');
    try {
      await adminCreateUserApi(form);
      setShowCreate(false);
      setForm({ user_name: '', user_email: '', user_password: '', role: 'petugas' });
      load();
    } catch (err: any) {
      setCreateError(err.response?.data?.message ?? 'Gagal membuat akun.');
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: 48, height: 48, borderRadius: '10px', background: 'var(--primary-bg)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, color: 'var(--text-h)' }}>Kelola Pengguna</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem' }}>Manajemen akun pengguna, petugas, dan admin sistem</p>
          </div>
        </div>
        <button onClick={() => setShowCreate(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: 'var(--radius)', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={16} /> Buat Akun Baru
        </button>
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

      {/* Table */}
      {!loading && users.length > 0 && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'auto', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                {['Nama', 'Email', 'Role', 'Status', 'Tanggal Daftar'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => {
                const roleName = u.role?.role_name ?? 'pengguna';
                const roleBadge = ROLE_BADGE[roleName] ?? ROLE_BADGE.pengguna;
                return (
                  <tr key={u.user_id} style={{ borderBottom: idx < users.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-h)' }}>{u.user_name}</td>
                    <td style={{ padding: '16px', color: 'var(--text)', fontSize: '0.875rem' }}>{u.user_email}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: roleBadge.bg, color: roleBadge.text }}>
                        {roleName}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: u.is_verified ? '#d1fae5' : '#fef3c7', color: u.is_verified ? '#065f46' : '#92400e' }}>
                        {u.is_verified ? '✓ Terverifikasi' : '⏳ Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && users.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
          <Users size={48} style={{ opacity: 0.12, marginBottom: '16px', color: 'var(--text-h)' }} />
          <p style={{ fontWeight: 600, color: 'var(--text-h)', margin: 0 }}>Belum ada pengguna</p>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div style={overlayStyle}>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '32px', maxWidth: '460px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-h)' }}>Buat Akun Baru</h2>
              <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            {createError && (
              <div style={{ padding: '10px 14px', marginBottom: '16px', borderRadius: 'var(--radius-sm)', background: '#fee2e2', color: '#dc2626', fontSize: '0.875rem' }}>{createError}</div>
            )}

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Nama Lengkap</label>
                <input style={inputStyle} type="text" required placeholder="Nama lengkap" value={form.user_name} onChange={e => setForm(f => ({ ...f, user_name: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" required placeholder="email@domain.com" value={form.user_email} onChange={e => setForm(f => ({ ...f, user_email: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input style={inputStyle} type="password" required minLength={8} placeholder="Min. 8 karakter" value={form.user_password} onChange={e => setForm(f => ({ ...f, user_password: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Role</label>
                <select style={inputStyle} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="petugas">Petugas</option>
                  <option value="pengguna">Pengguna</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowCreate(false)}
                  style={{ padding: '10px 20px', borderRadius: 'var(--radius)', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', fontWeight: 600, cursor: 'pointer' }}>
                  Batal
                </button>
                <button type="submit" disabled={submitting}
                  style={{ padding: '10px 20px', borderRadius: 'var(--radius)', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                  {submitting ? 'Membuat...' : 'Buat Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

