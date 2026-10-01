import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Plus } from 'lucide-react';
import { getMyReservationsApi, cancelReservationApi } from '../../api/reservations';
import ReservationTable, { Reservation } from '../../components/reservations/ReservationTable';

export default function MyReservationsPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState<number | null>(null);

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
    try { await cancelReservationApi(id); load(); }
    catch { alert('Gagal membatalkan reservasi.'); }
    finally { setCancelling(null); }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1140px', margin: '0 auto' }}>
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
        <button onClick={() => navigate('/reservations/new')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: 'var(--radius)', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
          <Plus size={16} /> Ajukan Baru
        </button>
      </div>
      <ReservationTable reservations={reservations} loading={loading} error={error} cancellingId={cancelling} onCancel={handleCancel} onCreateNew={() => navigate('/reservations/new')} />
    </div>
  );
}
