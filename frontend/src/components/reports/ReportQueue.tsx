import { useState, useEffect } from 'react';
import { ClipboardList, Clock, AlertCircle } from 'lucide-react';
import { getReportQueueApi, updateReportStatusApi } from '../../api/reports';

interface QueueReport {
  rep_id: number;
  rep_description: string;
  created_at: string;
  facility?: { fac_name: string };
  rep_status?: { rep_status_name: string };
}

const STATUS_OPTIONS = [
  { id: 2, name: 'Diproses' },
  { id: 3, name: 'Selesai' },
  { id: 4, name: 'Ditolak' },
];

export default function ReportQueue() {
  const [reports, setReports] = useState<QueueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Record<number, number>>({});
  const [note, setNote] = useState<Record<number, string>>({});

  const load = () => {
    setLoading(true);
    getReportQueueApi()
      .then((r: any) => setReports(r.data.data ?? r.data))
      .catch(() => setError('Gagal memuat antrian laporan.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpdate = async (id: number) => {
    const statId = selectedStatus[id];
    if (!statId) {
      alert('Pilih status terlebih dahulu.');
      return;
    }
    setUpdating(id);
    try {
      // PERBAIKAN: Atribut diubah dari 'catatan' menjadi 'rep_resolution_note'
      await updateReportStatusApi(id, {
        rep_stat_id: statId,
        rep_resolution_note: note[id] ?? '',
      });
      load();
    } catch {
      alert('Gagal memperbarui status laporan.');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }
  if (error) {
    return <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: '#fee2e2', color: '#dc2626', fontSize: '0.875rem' }}>⚠️ {error}</div>;
  }
  if (reports.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
        <ClipboardList size={48} style={{ opacity: 0.12, marginBottom: '16px', color: 'var(--text-h)' }} />
        <p style={{ fontWeight: 600, color: 'var(--text-h)', margin: 0 }}>Tidak ada laporan dalam antrian</p>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {reports.map((r) => (
        <div key={r.rep_id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-h)', fontSize: '1rem' }}>{r.facility?.fac_name ?? 'Fasilitas'}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: '#dbeafe', color: '#1e40af' }}>
              <AlertCircle size={12} /> {r.rep_status?.rep_status_name ?? 'baru'}
            </span>
          </div>
          <p style={{ margin: '0 0 4px', fontSize: '0.88rem', color: 'var(--text)' }}>{r.rep_description}</p>
          <p style={{ margin: '0 0 12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
            {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={selectedStatus[r.rep_id] ?? ''}
              onChange={(e) => setSelectedStatus((s) => ({ ...s, [r.rep_id]: Number(e.target.value) }))}
              style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-h)' }}
            >
              <option value="">-- Ubah Status --</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Catatan (opsional)"
              value={note[r.rep_id] ?? ''}
              onChange={(e) => setNote((n) => ({ ...n, [r.rep_id]: e.target.value }))}
              style={{ flex: 1, minWidth: '160px', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-h)' }}
            />
            <button
              onClick={() => handleUpdate(r.rep_id)}
              disabled={updating === r.rep_id}
              style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
            >
              {updating === r.rep_id ? 'Menyimpan...' : 'Update'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
