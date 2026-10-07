import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, Users, Building2, ShieldCheck, TrendingUp, Ticket, FolderKanban, AlertCircle } from 'lucide-react';
import { getFacilitiesApi } from '../../api/facilities';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  
  onClick?: () => void;
}

const StatCard = ({ icon: Icon, label, value, onClick }: StatCardProps) => (
  <div
    onClick={onClick}
    style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '24px',
      display: 'flex', alignItems: 'center', gap: '16px',
      boxShadow: 'var(--shadow-sm)', cursor: onClick ? 'pointer' : 'default',
      transition: 'box-shadow 0.2s, transform 0.15s',
    }}
    onMouseEnter={e => { if (onClick) { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; } }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
  >
    <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'var(--primary-bg)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={22} />
    </div>
    <div>
      <p style={{ margin: '0 0 4px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-h)', lineHeight: 1 }}>{value}</p>
    </div>
  </div>
);

const QuickLink = ({ icon: Icon, label, desc, to }: { icon: React.ElementType; label: string; desc: string; to: string; }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(to)}
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.2s, transform 0.15s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
    >
      <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'var(--primary-bg)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} />
      </div>
      <div>
        <p style={{ margin: '0 0 2px', fontWeight: 700, color: 'var(--text-h)', fontSize: '0.95rem' }}>{label}</p>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{desc}</p>
      </div>
    </div>
  );
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [facilityCount, setFacilityCount] = useState<number | '-'>('-');
  const [error, setError] = useState('');

  useEffect(() => {
    getFacilitiesApi()
      .then((r: any) => {
        const data = r.data.data ?? r.data;
        setFacilityCount(Array.isArray(data) ? data.length : '-');
      })
      .catch(() => setError('Gagal memuat statistik.'));
  }, []);

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
        <div style={{ width: 52, height: 52, borderRadius: '12px', background: 'var(--primary-bg)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LayoutDashboard size={26} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-h)' }}>Dashboard Admin</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Selamat datang, <strong style={{ color: 'var(--primary-dark)' }}>{(user as any)?.user_name ?? (user as any)?.user_email ?? 'Admin'}</strong> — kendali pusat sistem Uni-FaRe
          </p>
        </div>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: '#fee2e2', color: '#dc2626', marginBottom: '24px', fontSize: '0.875rem' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '36px' }}>
        <StatCard icon={Building2}    label="Total Fasilitas"  value={facilityCount} onClick={() => navigate('/admin/facilities')} />
        <StatCard icon={Users}        label="Kelola Pengguna"  value="→"             onClick={() => navigate('/admin/users')} />
        <StatCard icon={ShieldCheck}  label="Verifikasi Akun"  value="→"             onClick={() => navigate('/admin/verify')} />
        <StatCard icon={TrendingUp}   label="Rekap & Export"   value="→"             onClick={() => navigate('/admin/recap')} />
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-h)', marginBottom: '16px' }}>Akses Cepat</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
        <QuickLink icon={Building2}   label="Kelola Fasilitas"   desc="Tambah, edit, dan atur status fasilitas"     to="/admin/facilities" />
        <QuickLink icon={Users}       label="Manajemen Pengguna"  desc="Daftar semua akun dan pembuatan akun baru"   to="/admin/users"      />
        <QuickLink icon={ShieldCheck} label="Verifikasi Akun"     desc="Setujui atau tolak pendaftaran akun baru"    to="/admin/verify"     />
        <QuickLink icon={Ticket}      label="Antrian Reservasi"   desc="Review pengajuan peminjaman fasilitas"       to="/officer/reservations" />
        <QuickLink icon={FolderKanban} label="Antrian Laporan"    desc="Tindak lanjuti laporan kerusakan masuk"      to="/officer/reports"  />
        <QuickLink icon={TrendingUp}  label="Rekap & Export"      desc="Data rekapitulasi dan export CSV/Excel"      to="/admin/recap"      />
      </div>
    </div>
  );
}




