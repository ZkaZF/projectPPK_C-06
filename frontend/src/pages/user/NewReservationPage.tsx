import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Building2, FileText, ArrowLeft, CheckCircle } from 'lucide-react';
import { getFacilitiesApi } from '../../api/facilities';
import { createReservationApi } from '../../api/reservations';

interface FacilityOption { fac_id: number | string; fac_name: string; }

function todayStr() { return new Date().toISOString().slice(0, 10); }

const TIME_SLOTS = Array.from({ length: 26 }, (_, i) => {
  const h = Math.floor(i / 2) + 7;
  const m = i % 2 === 0 ? '00' : '30';
  return `${String(h).padStart(2, '0')}:${m}`;
}).filter(t => t <= '20:00');

export default function NewReservationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { facilityId?: string; date?: string; start?: string; end?: string } | null;

  const [facilities, setFacilities] = useState<FacilityOption[]>([]);
  const [facilityId, setFacilityId] = useState(state?.facilityId ?? '');
  const [date, setDate]             = useState(state?.date ?? todayStr());
  const [startTime, setStartTime]   = useState(state?.start ?? '08:00');
  const [endTime, setEndTime]       = useState(state?.end ?? '09:00');
  const [purpose, setPurpose]       = useState('');
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => {
    getFacilitiesApi()
      .then((r: any) => setFacilities(r.data.data ?? r.data))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityId) { setError('Pilih fasilitas terlebih dahulu.'); return; }
    if (startTime >= endTime) { setError('Waktu selesai harus setelah waktu mulai.'); return; }
    if (purpose.length < 10) { setError('Tujuan minimal 10 karakter.'); return; }

    setLoading(true);
    setError('');
    try {
      await createReservationApi({
        facility_id: facilityId,
        reservation_date: date,
        start_time: startTime,
        end_time: endTime,
        purpose,
      });
      setSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Gagal mengajukan reservasi. Coba lagi.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)', background: 'var(--surface-2)',
    color: 'var(--text-h)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '6px', fontSize: '0.8rem',
    fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em',
  };

  if (success) {
    return (
      <div style={{ padding: '32px', maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckCircle size={36} style={{ color: '#059669' }} />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-h)', marginBottom: '12px' }}>
          Reservasi Diajukan!
        </h1>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '32px' }}>
          Pengajuan reservasi Anda sedang menunggu persetujuan dari petugas. Anda akan mendapat notifikasi setelah diproses.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={() => navigate('/reservations')}
            style={{ padding: '10px 24px', borderRadius: 'var(--radius)', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
            Lihat Reservasi Saya
          </button>
          <button onClick={() => { setSuccess(false); setPurpose(''); }}
            style={{ padding: '10px 24px', borderRadius: 'var(--radius)', background: 'var(--surface)', color: 'var(--text-h)', border: '1px solid var(--border)', fontWeight: 500, cursor: 'pointer' }}>
            Ajukan Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '680px', margin: '0 auto' }}>
      {/* Header */}
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

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: 'var(--shadow)' }}>
        {error && (
          <div style={{ padding: '12px 16px', marginBottom: '20px', borderRadius: 'var(--radius-sm)', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', fontSize: '0.875rem' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Pilih fasilitas */}
          <div>
            <label style={labelStyle}><Building2 size={13} style={{ display: 'inline', marginRight: 6 }} />Fasilitas</label>
            <select style={inputStyle} value={facilityId} onChange={e => setFacilityId(e.target.value)} required>
              <option value="">-- Pilih Fasilitas --</option>
              {facilities.map((f) => (
                <option key={f.fac_id} value={f.fac_id}>{f.fac_name}</option>
              ))}
            </select>
          </div>

          {/* Tanggal */}
          <div>
            <label style={labelStyle}><Calendar size={13} style={{ display: 'inline', marginRight: 6 }} />Tanggal Reservasi</label>
            <input type="date" style={inputStyle} value={date} min={todayStr()} onChange={e => setDate(e.target.value)} required />
          </div>

          {/* Waktu */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}><Clock size={13} style={{ display: 'inline', marginRight: 6 }} />Waktu Mulai</label>
              <select style={inputStyle} value={startTime} onChange={e => setStartTime(e.target.value)} required>
                {TIME_SLOTS.filter(t => t < '20:00').map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}><Clock size={13} style={{ display: 'inline', marginRight: 6 }} />Waktu Selesai</label>
              <select style={inputStyle} value={endTime} onChange={e => setEndTime(e.target.value)} required>
                {TIME_SLOTS.filter(t => t > startTime).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Tujuan */}
          <div>
            <label style={labelStyle}><FileText size={13} style={{ display: 'inline', marginRight: 6 }} />Tujuan Peminjaman</label>
            <textarea
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }}
              placeholder="Jelaskan tujuan dan kegiatan yang akan dilakukan di fasilitas ini (min. 10 karakter)..."
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              required
              minLength={10}
            />
            <p style={{ fontSize: '0.75rem', color: purpose.length < 10 ? '#dc2626' : 'var(--text-muted)', marginTop: '4px' }}>
              {purpose.length} / minimal 10 karakter
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px', borderRadius: 'var(--radius)', border: 'none',
              background: loading ? 'var(--border)' : 'var(--primary)', color: '#fff',
              fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
            }}
          >
            {loading ? 'Mengajukan...' : '📋 Ajukan Reservasi'}
          </button>
        </form>
      </div>
    </div>
  );
}
