import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, ArrowLeft, CheckCircle } from 'lucide-react';
import { getFacilitiesApi } from '../../api/facilities';
import { createReportApi } from '../../api/reports';
import ReportForm from '../../components/reports/ReportForm';
import type { ReportPayload } from '../../components/reports/ReportForm'; // atau dari file types jika ada

interface FacilityOption { fac_id: number | string; fac_name: string; }

export default function NewReportPage() {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState<FacilityOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getFacilitiesApi().then((r: any) => setFacilities(r.data.data ?? r.data)).catch(() => {});
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError('');
    try { await createReportApi(formData); setSuccess(true); }
    catch (err: any) { setError(err.response?.data?.message ?? 'Gagal mengirim laporan. Coba lagi.'); }
    finally { setLoading(false); }
  };

  if (success) {
    return (
      <div style={{ padding: '32px', maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckCircle size={36} style={{ color: '#059669' }} />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-h)', marginBottom: '12px' }}>Laporan Terkirim!</h1>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '32px' }}>
          Laporan Anda sudah diterima dan akan ditindaklanjuti oleh petugas fasilitas. Terima kasih atas kontribusi Anda!
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={() => navigate('/reports')} style={{ padding: '10px 24px', borderRadius: 'var(--radius)', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
            Lihat Laporan Saya
          </button>
          <button onClick={() => setSuccess(false)} style={{ padding: '10px 24px', borderRadius: 'var(--radius)', background: 'var(--surface)', color: 'var(--text-h)', border: '1px solid var(--border)', fontWeight: 500, cursor: 'pointer' }}>
            Buat Laporan Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '680px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Kembali
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
        <div style={{ width: 48, height: 48, borderRadius: '10px', background: 'var(--primary-bg)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FolderKanban size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, color: 'var(--text-h)' }}>Buat Laporan</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem' }}>Laporkan kerusakan atau masalah fasilitas kampus</p>
        </div>
      </div>
      <ReportForm facilities={facilities} loading={loading} error={error} onSubmit={handleSubmit} />
    </div>
  );
}
