import { useState, useEffect } from 'react';
import { FolderKanban, Building2, AlignLeft, CheckCircle, ArrowLeft, AlertCircle, Send } from 'lucide-react';
import { getFacilitiesApi } from '../../api/facilities';
import { createReportApi } from '../../api/reports';
import { FileUploadCard, type UploadedFile } from '../ui/file-upload-card';

interface FacilityOption { fac_id: number | string; fac_name: string; }

const CATEGORIES = [
  { id: 1, name: 'Kerusakan Ringan' },
  { id: 2, name: 'Kerusakan Berat' },
  { id: 3, name: 'Kebersihan' },
  { id: 4, name: 'Keamanan' },
  { id: 5, name: 'Lainnya' },
];

interface ReportFormProps {
  onSuccess?: () => void;
  onBack?: () => void;
  /** Pre-select facility (e.g. when coming from FacilityDetailPage) */
  initialFacilityId?: string;
}

export default function ReportForm({ onSuccess, onBack, initialFacilityId }: ReportFormProps) {
  const [facilities, setFacilities]       = useState<FacilityOption[]>([]);
  const [facilityId, setFacilityId]       = useState(initialFacilityId ?? '');
  const [categoryId, setCategoryId]       = useState('');
  const [description, setDescription]    = useState('');
  const [photo, setPhoto]                 = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading]             = useState(false);
  const [success, setSuccess]             = useState(false);
  const [error, setError]                 = useState('');

  useEffect(() => {
    getFacilitiesApi()
      .then((r: any) => setFacilities(r.data.data ?? r.data))
      .catch(() => {});
  }, []);

  const handleFilesChange = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      const file = newFiles[0];
      setUploadedFiles([{ id: `${file.name}-${Date.now()}`, file, progress: 100, status: 'completed' }]);
      setPhoto(file);
    }
  };
  const handleFileRemove = () => { setUploadedFiles([]); setPhoto(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityId)           { setError('Pilih fasilitas terlebih dahulu.');    return; }
    if (!categoryId)           { setError('Pilih kategori laporan.');              return; }
    if (description.length < 10) { setError('Deskripsi minimal 10 karakter.');   return; }

    const fd = new FormData();
    fd.append('fac_id',          facilityId);
    fd.append('rep_cat_id',      categoryId);
    fd.append('rep_description', description);
    if (photo) fd.append('rep_photo', photo);

    setLoading(true);
    setError('');
    try {
      await createReportApi(fd);
      setSuccess(true);
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Gagal mengirim laporan. Coba lagi.');
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

  /* ── Success State ── */
  if (success) {
    return (
      <div style={{ padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckCircle size={36} style={{ color: '#059669' }} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-h)', marginBottom: '12px' }}>Laporan Terkirim!</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '28px' }}>
          Laporan Anda sudah diterima dan akan ditindaklanjuti oleh petugas. Terima kasih!
        </p>
        <button
          onClick={() => { setSuccess(false); setDescription(''); setPhoto(null); setUploadedFiles([]); setCategoryId(''); }}
          style={{ padding: '10px 24px', borderRadius: 'var(--radius)', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
        >
          Buat Laporan Lagi
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Optional back button */}
      {onBack && (
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Kembali
        </button>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
        <div style={{ width: 44, height: 44, borderRadius: '10px', background: 'var(--primary-bg)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FolderKanban size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-h)' }}>Buat Laporan</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Laporkan kerusakan atau masalah fasilitas kampus</p>
        </div>
      </div>

      {/* Card */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: 'var(--shadow)' }}>
        {error && (
          <div style={{ padding: '12px 16px', marginBottom: '20px', borderRadius: 'var(--radius-sm)', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Fasilitas */}
          <div>
            <label style={labelStyle}><Building2 size={13} style={{ display: 'inline', marginRight: 6 }} />Fasilitas yang Dilaporkan</label>
            <select style={inputStyle} value={facilityId} onChange={e => setFacilityId(e.target.value)} required>
              <option value="">-- Pilih Fasilitas --</option>
              {facilities.map(f => <option key={f.fac_id} value={f.fac_id}>{f.fac_name}</option>)}
            </select>
          </div>

          {/* Kategori */}
          <div>
            <label style={labelStyle}>Kategori Laporan</label>
            <select style={inputStyle} value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
              <option value="">-- Pilih Kategori --</option>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Deskripsi */}
          <div>
            <label style={labelStyle}><AlignLeft size={13} style={{ display: 'inline', marginRight: 6 }} />Deskripsi Masalah</label>
            <textarea
              style={{ ...inputStyle, minHeight: '110px', resize: 'vertical', fontFamily: 'inherit' }}
              placeholder="Jelaskan secara detail masalah yang ditemukan (min. 10 karakter)..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              required minLength={10}
            />
            <p style={{ fontSize: '0.75rem', color: description.length < 10 ? '#dc2626' : 'var(--text-muted)', marginTop: '4px' }}>
              {description.length} / minimal 10 karakter
            </p>
          </div>

          {/* Foto */}
          <div>
            <label style={labelStyle}>Foto Bukti (Opsional)</label>
            <FileUploadCard
              files={uploadedFiles}
              onFilesChange={handleFilesChange}
              onFileRemove={handleFileRemove}
              className="mt-2 w-full max-w-full"
            />
          </div>

          <button type="submit" disabled={loading}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: 'var(--radius)', border: 'none', background: loading ? 'var(--border)' : 'var(--primary)', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
            {loading ? 'Mengirim...' : <><Send size={18} /> Kirim Laporan</>}
          </button>
        </form>
      </div>
    </div>
  );
}
