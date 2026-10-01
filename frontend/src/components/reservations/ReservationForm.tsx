import { useState } from 'react';
import { Calendar, Clock, Building2, FileText } from 'lucide-react';

export interface FacilityOption { fac_id: number | string; fac_name: string; }

export interface ReservationPayload {
  facility_id: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  purpose: string;
}

interface ReservationFormProps {
  facilities: FacilityOption[];
  initialFacilityId?: string;
  initialDate?: string;
  initialStartTime?: string;
  initialEndTime?: string;
  loading: boolean;
  error: string;
  onSubmit: (payload: ReservationPayload) => void;
}

function todayStr() { return new Date().toISOString().slice(0, 10); }

const TIME_SLOTS = Array.from({ length: 26 }, (_, i) => {
  const h = Math.floor(i / 2) + 7;
  const m = i % 2 === 0 ? '00' : '30';
  return `${String(h).padStart(2, '0')}:${m}`;
}).filter((t) => t <= '20:00');

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)', background: 'var(--surface-2)',
  color: 'var(--text-h)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: '6px', fontSize: '0.8rem',
  fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em',
};

export default function ReservationForm({
  facilities, initialFacilityId = '', initialDate, initialStartTime = '08:00',
  initialEndTime = '09:00', loading, error, onSubmit,
}: ReservationFormProps) {
  const [facilityId, setFacilityId] = useState(initialFacilityId);
  const [date, setDate] = useState(initialDate ?? todayStr());
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [purpose, setPurpose] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityId) { setLocalError('Pilih fasilitas terlebih dahulu.'); return; }
    if (startTime >= endTime) { setLocalError('Waktu selesai harus setelah waktu mulai.'); return; }
    if (purpose.length < 10) { setLocalError('Tujuan minimal 10 karakter.'); return; }
    setLocalError('');
    onSubmit({ facility_id: facilityId, reservation_date: date, start_time: startTime, end_time: endTime, purpose });
  };

  const displayError = localError || error;

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: 'var(--shadow)' }}>
      {displayError && (
        <div style={{ padding: '12px 16px', marginBottom: '20px', borderRadius: 'var(--radius-sm)', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', fontSize: '0.875rem' }}>
          ⚠️ {displayError}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={labelStyle}><Building2 size={13} style={{ display: 'inline', marginRight: 6 }} />Fasilitas</label>
          <select style={inputStyle} value={facilityId} onChange={(e) => setFacilityId(e.target.value)} required>
            <option value="">-- Pilih Fasilitas --</option>
            {facilities.map((f) => <option key={f.fac_id} value={f.fac_id}>{f.fac_name}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}><Calendar size={13} style={{ display: 'inline', marginRight: 6 }} />Tanggal Reservasi</label>
          <input type="date" style={inputStyle} value={date} min={todayStr()} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}><Clock size={13} style={{ display: 'inline', marginRight: 6 }} />Waktu Mulai</label>
            <select style={inputStyle} value={startTime} onChange={(e) => setStartTime(e.target.value)} required>
              {TIME_SLOTS.filter((t) => t < '20:00').map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}><Clock size={13} style={{ display: 'inline', marginRight: 6 }} />Waktu Selesai</label>
            <select style={inputStyle} value={endTime} onChange={(e) => setEndTime(e.target.value)} required>
              {TIME_SLOTS.filter((t) => t > startTime).map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label style={labelStyle}><FileText size={13} style={{ display: 'inline', marginRight: 6 }} />Tujuan Peminjaman</label>
          <textarea
            style={{ ...inputStyle, minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }}
            placeholder="Jelaskan tujuan dan kegiatan yang akan dilakukan di fasilitas ini (min. 10 karakter)..."
            value={purpose} onChange={(e) => setPurpose(e.target.value)} required minLength={10}
          />
          <p style={{ fontSize: '0.75rem', color: purpose.length < 10 ? '#dc2626' : 'var(--text-muted)', marginTop: '4px' }}>
            {purpose.length} / minimal 10 karakter
          </p>
        </div>
        <button type="submit" disabled={loading}
          style={{ padding: '12px', borderRadius: 'var(--radius)', border: 'none', background: loading ? 'var(--border)' : 'var(--primary)', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
          {loading ? 'Mengajukan...' : '📋 Ajukan Reservasi'}
        </button>
      </form>
    </div>
  );
}
