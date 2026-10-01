import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Plus } from 'lucide-react';
import { getMyReportsApi } from '../../api/reports';
import ReportTable, { Report } from '../../components/reports/ReportTable';

export default function MyReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyReportsApi().then((r: any) => setReports(r.data.data ?? r.data)).catch(() => setError('Gagal memuat laporan.')).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '32px', maxWidth: '1140px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: 48, height: 48, borderRadius: '10px', background: 'var(--primary-bg)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FolderKanban size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, color: 'var(--text-h)' }}>Laporan Saya</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem' }}>Riwayat pelaporan kerusakan dan masalah fasilitas</p>
          </div>
        </div>
        <button onClick={() => navigate('/reports/new')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: 'var(--radius)', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
          <Plus size={16} /> Buat Laporan
        </button>
      </div>
      <ReportTable reports={reports} loading={loading} error={error} onCreateNew={() => navigate('/reports/new')} />
    </div>
  );
}
