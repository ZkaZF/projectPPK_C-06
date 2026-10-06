import { useState, useEffect } from 'react';
import { getReportQueueApi, updateReportStatusApi } from '../../api/reports';
import ReportTable, { type Report } from '../../components/reports/ReportTable';
import { X, CheckCircle, Clock } from 'lucide-react';

// Status ID sesuai seeder database: 1=baru, 2=diproses, 3=selesai, 4=ditolak
const STATUS_OPTIONS = [
  { id: 2, label: 'Sedang Diproses' },
  { id: 3, label: 'Selesai / Terselesaikan' },
  { id: 4, label: 'Ditolak' },
];

export default function ReportQueuePage() {
  const [reports, setReports]   = useState<Report[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [selected, setSelected] = useState<Report | null>(null);
  const [newStatusId, setNewStatusId] = useState<number | ''>('');
  const [note, setNote]         = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');

  const load = () => {
    setLoading(true);
    getReportQueueApi()
      .then((r: any) => setReports(r.data.data ?? r.data))
      .catch(() => setError('Gagal memuat antrian laporan.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleUpdate = async () => {
    if (!selected || newStatusId === '') return;
    setSubmitting(true);
    setActionError('');
    try {
      await updateReportStatusApi(selected.rep_id, { rep_stat_id: newStatusId, rep_resolution_note: note });
      setSelected(null);
      setNewStatusId('');
      setNote('');
      load();
    } catch (err: any) {
      setActionError(err.response?.data?.message ?? 'Gagal memperbarui status.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)', background: 'var(--surface-2)',
    color: 'var(--text-h)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '6px', fontSize: '0.78rem',
    fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em',
  };
  const overlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px',
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1140px', margin: '0 auto' }}>
      <ReportTable
        reports={reports}
        loading={loading}
        error={error}
        showCreateButton={false}
        onUpdateStatus={(r) => { setSelected(r); setNewStatusId(''); setNote(''); setActionError(''); }}
        emptyTitle="Tidak ada laporan masuk"
        emptyDesc="Semua laporan sudah ditangani atau belum ada laporan baru."
      />

      {/* ── Update Status Modal ── */}
      {selected && (
        <div style={overlayStyle}>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '32px', maxWidth: '480px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--text-h)' }}>Tindak Lanjut Laporan</h2>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {selected.facility?.fac_name} · {selected.category?.rep_cat_name}
                </p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            {/* Report Preview */}
            <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: selected.rep_photo_url ? '12px' : '20px', fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.6 }}>
              {selected.rep_description}
            </div>

            {/* Foto Bukti */}
            {selected.rep_photo_url && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Foto Bukti</p>
                <a href={selected.rep_photo_url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={selected.rep_photo_url}
                    alt="foto bukti laporan"
                    style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--border)', cursor: 'zoom-in', display: 'block' }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                </a>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>Klik foto untuk melihat ukuran penuh</p>
              </div>
            )}

            {actionError && (
              <div style={{ padding: '10px 14px', marginBottom: '16px', borderRadius: 'var(--radius-sm)', background: '#fee2e2', color: '#dc2626', fontSize: '0.875rem' }}>
                {actionError}
              </div>
            )}

            {/* Status Select */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Ubah Status</label>
              <select style={inputStyle} value={newStatusId} onChange={e => setNewStatusId(e.target.value === '' ? '' : Number(e.target.value))}>
                <option value="">-- Pilih Status --</option>
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Catatan */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Catatan Resolusi (Opsional)</label>
              <textarea
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
                placeholder="Tuliskan tindakan yang sudah dilakukan atau alasan penolakan..."
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelected(null)} disabled={submitting}
                style={{ padding: '10px 20px', borderRadius: 'var(--radius)', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', fontWeight: 600, cursor: 'pointer' }}>
                Batal
              </button>
              <button onClick={handleUpdate} disabled={newStatusId === '' || submitting}
                style={{ padding: '10px 20px', borderRadius: 'var(--radius)', background: newStatusId === '' ? 'var(--border)' : 'var(--primary)', color: newStatusId === '' ? 'var(--text-muted)' : '#fff', border: 'none', fontWeight: 600, cursor: newStatusId === '' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {submitting ? <><Clock size={16} /> Menyimpan...</> : <><CheckCircle size={16} /> Simpan Status</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
