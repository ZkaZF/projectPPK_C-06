import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, CheckCircle } from 'lucide-react';
import { getFacilitiesApi } from '../../api/facilities';
import { createReservationApi } from '../../api/reservations';
import ReservationForm, { ReservationPayload, FacilityOption } from '../../components/reservations/ReservationForm';

export default function NewReservationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { facilityId?: string; date?: string; start?: string; end?: string } | null;

  const [facilities, setFacilities] = useState<FacilityOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getFacilitiesApi().then((r: any) => setFacilities(r.data.data ?? r.data)).catch(() => {});
  }, []);

  const handleSubmit = async (payload: ReservationPayload) => {
    setLoading(true);
    setError('');
    try {
      await createReservationApi(payload);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Gagal mengajukan reservasi. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ padding: '32px', maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckCircle size={36} style={{ color: '#059669' }} />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-h)', marginBottom: '12px' }}>Reservasi Diajukan!</h1>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '32px' }}>
          Pengajuan reservasi Anda sedang menunggu persetujuan dari petugas. Anda akan mendapat notifikasi setelah diproses.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={() => navigate('/reservations')} style={{ padding: '10px 24px', borderRadius: 'var(--radius)', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
            Lihat Reservasi Saya
          </button>
          <button onClick={() => setSuccess(false)} style={{ padding: '10px 24px', borderRadius: 'var(--radius)', background: 'var(--surface)', color: 'var(--text-h)', border: '1px solid var(--border)', fontWeight: 500, cursor: 'pointer' }}>
            Ajukan Lagi
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
          <Calendar size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, color: 'var(--text-h)' }}>Ajukan Reservasi</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem' }}>Isi detail peminjaman fasilitas yang Anda butuhkan</p>
        </div>
      </div>
      <ReservationForm
        facilities={facilities}
        initialFacilityId={state?.facilityId}
        initialDate={state?.date}
        initialStartTime={state?.start}
        initialEndTime={state?.end}
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
