import { useState } from 'react';
import { Building2, AlignLeft, Camera } from 'lucide-react';

interface FacilityOption { fac_id: number | string; fac_name: string; }

const CATEGORIES = [
  { id: 1, name: 'Kerusakan Ringan' },
  { id: 2, name: 'Kerusakan Berat' },
  { id: 3, name: 'Kebersihan' },
  { id: 4, name: 'Keamanan' },
  { id: 5, name: 'Lainnya' },
];

interface ReportFormProps {
  facilities: FacilityOption[];
  loading: boolean;
  error: string;
  onSubmit: (formData: FormData) => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)', background: 'var(--surface-2)',
  color: 'var(--text-h)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: '6px', fontSize: '0.8rem',
  fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em',
};

export default function ReportForm({ facilities, loading, error, onSubmit }: ReportFormProps) {
  const [facilityId, setFacilityId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState('');

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPhoto(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityId) { setLocalError('Pilih fasilitas terlebih dahulu.'); return; }
    if (!categoryId) { setLocalError('Pilih kategori laporan.'); return; }
    if (description.length < 10) { setLocalError('Deskripsi minimal 10 karakter.'); return; }
    setLocalError('');
    const fd = new FormData();
    fd.append('fac_id', facilityId);
    fd.append('rep_cat_id', categoryId);
    fd.append('rep_description', description);
    if (photo) fd.append('rep_photo', photo);
    onSubmit(fd);
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
          <label style={labelStyle}><Building2 size={13} style={{ display: 'inline', marginRight: 6 }} />Fasilitas yang Dilaporkan</label>
          <select style={inputStyle} value={facilityId} onChange={(e) => setFacilityId(e.target.value)} required>
            <option value="">-- Pilih Fasilitas --</option>
            {facilities.map((f) => <option key={f.fac_id} value={f.fac_id}>{f.fac_name}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Kategori Laporan</label>
          <select style={inputStyle} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            <option value="">-- Pilih Kategori --</option>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}><AlignLeft size={13} style={{ display: 'inline', marginRight: 6 }} />Deskripsi Masalah</label>
          <textarea
            style={{ ...inputStyle, minHeight: '110px', resize: 'vertical', fontFamily: 'inherit' }}
            placeholder="Jelaskan secara detail masalah yang ditemukan (min. 10 karakter)..."
            value={description} onChange={(e) => setDescription(e.target.value)} required minLength={10}
          />
          <p style={{ fontSize: '0.75rem', color: description.length < 10 ? '#dc2626' : 'var(--text-muted)', marginTop: '4px' }}>
            {description.length} / minimal 10 karakter
          </p>
        </div>
        <div>
          <label style={labelStyle}><Camera size={13} style={{ display: 'inline', marginRight: 6 }} />Foto Bukti (Opsional)</label>
          <input type="file" accept="image/*" onChange={handlePhoto} style={{ ...inputStyle, padding: '8px', cursor: 'pointer' }} />
          {preview && (
            <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
              <img src={preview} alt="preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', objectFit: 'cover' }} />
              <button type="button" onClick={() => { setPhoto(null); setPreview(null); }}
                style={{ position: 'absolute', top: '6px', right: '6px', background: '#dc2626', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ✕
              </button>
            </div>
          )}
        </div>
        <button type="submit" disabled={loading}
          style={{ padding: '12px', borderRadius: 'var(--radius)', border: 'none', background: loading ? 'var(--border)' : 'var(--primary)', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
          {loading ? 'Mengirim...' : '📋 Kirim Laporan'}
        </button>
      </form>
    </div>
  );
}
