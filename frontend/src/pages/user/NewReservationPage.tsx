import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Building2, FileText, ArrowLeft, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { getFacilitiesApi } from '../../api/facilities';
import { createReservationApi } from '../../api/reservations';
import SlotCalendar from '../../components/facilities/SlotCalendar';

interface FacilityOption { fac_id: number | string; fac_name: string; }

function todayStr() { return new Date().toISOString().slice(0, 10); }

export default function NewReservationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { facilityId?: string; date?: string; start?: string; end?: string } | null;

  const [facilities, setFacilities] = useState<FacilityOption[]>([]);
  const [facilityId, setFacilityId] = useState(state?.facilityId ?? '');
  const [date, setDate]             = useState(state?.date ?? todayStr());
  const [startTime, setStartTime]   = useState(state?.start ?? '');
  const [endTime, setEndTime]       = useState(state?.end ?? '');
  const [purpose, setPurpose]       = useState('');
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    getFacilitiesApi()
      .then((r: any) => setFacilities(r.data.data ?? r.data))
      .catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityId) { setError('Pilih fasilitas terlebih dahulu.'); return; }
    if (!startTime || !endTime) { setError('Pilih slot waktu dari kalender terlebih dahulu.'); return; }
    if (purpose.length < 10) { setError('Tujuan minimal 10 karakter.'); return; }
    setError('');
    setShowConfirm(true);
  };

  const confirmAndSubmit = async () => {
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
      setShowConfirm(false);
      setSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Gagal mengajukan reservasi. Coba lagi.';
      setError(msg);
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const selectedFacility = facilities.find(f => String(f.fac_id) === String(facilityId));

  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '6px', fontSize: '0.78rem',
    fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em',
  };
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)', background: 'var(--surface-2)',
    color: 'var(--text-h)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
  };

  // Modal overlay styles
  const overlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    animation: 'fadeIn 0.2s ease-out', padding: '20px',
  };
  const modalStyle: React.CSSProperties = {
    background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '32px',
    maxWidth: '500px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  // ── Form ────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '32px', maxWidth: '680px', margin: '0 auto' }}>
      {/* Back */}
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Kembali
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
        <div style={{ width: 48, height: 48, borderRadius: '10px', background: 'var(--primary-bg)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Calendar size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, color: 'var(--text-h)' }}>Ajukan Reservasi</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem' }}>Isi detail peminjaman fasilitas yang Anda butuhkan</p>
        </div>
      </div>

      {/* Single card */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: 'var(--shadow)' }}>
        {error && (
          <div style={{ padding: '12px 16px', marginBottom: '24px', borderRadius: 'var(--radius-sm)', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Fasilitas */}
          <div>
            <label style={labelStyle}>
              <Building2 size={13} style={{ display: 'inline', marginRight: 6 }} />Fasilitas
            </label>
            <select style={inputStyle} value={facilityId}
              onChange={e => { setFacilityId(e.target.value); setStartTime(''); setEndTime(''); }} required>
              <option value="">-- Pilih Fasilitas --</option>
              {facilities.map((f) => (
                <option key={f.fac_id} value={f.fac_id}>{f.fac_name}</option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--border)' }} />

          {/* Scheduler */}
          <div>
            <label style={{ ...labelStyle, marginBottom: '14px' }}>
              <Calendar size={13} style={{ display: 'inline', marginRight: 6 }} />Jadwal Ketersediaan
            </label>

            {facilityId ? (
              <>
                <SlotCalendar
                  facilityId={facilityId}
                  date={date}
                  onDateChange={d => { setDate(d); setStartTime(''); setEndTime(''); }}
                  onSlotSelect={(start, end) => { setStartTime(start); setEndTime(end); }}
                />
                {/* Slot selected preview */}
                {startTime && endTime && (
                  <div style={{ marginTop: '14px', padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--primary-bg)', border: '1.5px solid var(--primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Calendar size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--primary-dark)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Slot terpilih</p>
                      <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-h)' }}>
                        {startTime} – {endTime} &nbsp;·&nbsp;
                        <span style={{ fontWeight: 400, fontSize: '0.88rem' }}>
                          {new Date(date + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ padding: '32px 24px', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 'var(--radius)' }}>
                <Building2 size={32} style={{ opacity: 0.12, marginBottom: '10px', color: 'var(--text-h)' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                  Pilih fasilitas di atas untuk melihat jadwal ketersediaan.
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--border)' }} />

          {/* Tujuan */}
          <div>
            <label style={labelStyle}>
              <FileText size={13} style={{ display: 'inline', marginRight: 6 }} />Tujuan Peminjaman
            </label>
            <textarea
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }}
              placeholder="Jelaskan tujuan dan kegiatan yang akan dilakukan di fasilitas ini (min. 10 karakter)..."
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              required
              minLength={10}
            />
            <p style={{ fontSize: '0.75rem', color: purpose.length > 0 && purpose.length < 10 ? '#dc2626' : 'var(--text-muted)', marginTop: '4px' }}>
              {purpose.length} / minimal 10 karakter
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !startTime || !endTime}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '13px', borderRadius: 'var(--radius)', border: 'none',
              background: loading || !startTime
                ? 'var(--border)'
                : 'linear-gradient(135deg, var(--primary), var(--primary-light))',
              color: loading || !startTime ? 'var(--text-muted)' : '#fff',
              fontWeight: 700, fontSize: '0.95rem',
              cursor: loading || !startTime ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: startTime ? '0 4px 15px rgba(255,122,83,0.3)' : 'none',
            }}
          >
            {startTime ? `Ajukan Reservasi (${startTime} – ${endTime})` : 'Pilih slot waktu dahulu'}
          </button>
        </form>
      </div>

      {/* ── Confirmation Modal ── */}
      {showConfirm && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-h)' }}>Konfirmasi Reservasi</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5 }}>
              Pastikan detail reservasi Anda sudah benar sebelum mengajukan.
            </p>
            
            <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 4px' }}>Fasilitas</p>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-h)' }}>{selectedFacility?.fac_name}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 4px' }}>Tanggal</p>
                  <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-h)' }}>{new Date(date + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 4px' }}>Waktu</p>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--primary-dark)' }}>{startTime} – {endTime}</p>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 4px' }}>Tujuan Peminjaman</p>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-h)', lineHeight: 1.5 }}>{purpose}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowConfirm(false)} disabled={loading}
                style={{ padding: '10px 20px', borderRadius: 'var(--radius)', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
                Batal
              </button>
              <button onClick={confirmAndSubmit} disabled={loading}
                style={{ padding: '10px 20px', borderRadius: 'var(--radius)', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {loading ? 'Mengajukan...' : <><CheckCircle size={16} /> Konfirmasi & Ajukan</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success Modal ── */}
      {success && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, textAlign: 'center', padding: '40px 32px' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={36} style={{ color: '#059669' }} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 12px', color: 'var(--text-h)' }}>Reservasi Berhasil Diajukan!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px', lineHeight: 1.6 }}>
              Pengajuan reservasi Anda sedang menunggu persetujuan dari petugas. Anda dapat mengecek status reservasi di halaman reservasi.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => navigate('/reservations')}
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                Lihat Reservasi Saya
              </button>
              <button onClick={() => { setSuccess(false); setPurpose(''); setStartTime(''); setEndTime(''); }}
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', background: 'transparent', color: 'var(--text-muted)', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
