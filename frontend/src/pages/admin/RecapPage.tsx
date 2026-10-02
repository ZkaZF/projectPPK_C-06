import { useState, useEffect } from 'react';
import { TrendingUp, Download, AlertCircle, Calendar } from 'lucide-react';
import { adminGetRecapApi, adminExportRecapApi } from '../../api/admin';

interface RecapEntry {
  facility_name: string;
  total_reservations: number;
  approved: number;
  rejected: number;
  cancelled: number;
  total_reports: number;
}

export default function RecapPage() {
  const [data, setData]           = useState<RecapEntry[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [exporting, setExporting] = useState<'csv' | 'excel' | null>(null);
  const [dateFrom, setDateFrom]   = useState('');
  const [dateTo, setDateTo]       = useState('');

  const load = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (dateFrom) params.from = dateFrom;
    if (dateTo)   params.to   = dateTo;
    adminGetRecapApi(params)
      .then((r: any) => setData(r.data.data ?? r.data))
      .catch(() => setError('Gagal memuat data rekapitulasi.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleExport = async (format: 'csv' | 'excel') => {
    setExporting(format);
    try {
      const res = await adminExportRecapApi(format);
      const mime = format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const ext  = format === 'csv' ? 'csv' : 'xlsx';
      const url  = URL.createObjectURL(new Blob([res.data], { type: mime }));
      const a    = document.createElement('a');
      a.href = url;
      a.download = `rekap-unifare-${new Date().toISOString().slice(0, 10)}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Gagal mengekspor data.');
    } finally { setExporting(null); }
  };

  const inputStyle: React.CSSProperties = {
    padding: '9px 14px', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)', background: 'var(--surface-2)',
    color: 'var(--text-h)', fontSize: '0.875rem', outline: 'none',
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1140px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: 48, height: 48, borderRadius: '10px', background: 'var(--primary-bg)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, color: 'var(--text-h)' }}>Rekap Data</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem' }}>Rekapitulasi aktivitas reservasi dan laporan fasilitas</p>
          </div>
        </div>

        {/* Export buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleExport('csv')} disabled={exporting !== null}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-h)', fontWeight: 600, fontSize: '0.875rem', cursor: exporting ? 'not-allowed' : 'pointer' }}>
            <Download size={15} /> {exporting === 'csv' ? 'Mengekspor...' : 'Export CSV'}
          </button>
          <button onClick={() => handleExport('excel')} disabled={exporting !== null}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: 'var(--radius)', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.875rem', cursor: exporting ? 'not-allowed' : 'pointer' }}>
            <Download size={15} /> {exporting === 'excel' ? 'Mengekspor...' : 'Export Excel'}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', flexWrap: 'wrap' }}>
        <Calendar size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter:</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text)' }}>
          Dari <input type="date" style={inputStyle} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text)' }}>
          Sampai <input type="date" style={inputStyle} value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </label>
        <button onClick={load}
          style={{ padding: '9px 18px', borderRadius: 'var(--radius-sm)', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
          Terapkan
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: '#fee2e2', color: '#dc2626', marginBottom: '20px', fontSize: '0.875rem' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite' }} />
        </div>
      )}

      {/* Table */}
      {!loading && data.length > 0 && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'auto', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                {['Fasilitas', 'Total Reservasi', 'Disetujui', 'Ditolak', 'Dibatalkan', 'Total Laporan'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: h === 'Fasilitas' ? 'left' : 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: idx < data.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-h)' }}>{row.facility_name}</td>
                  <td style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: 'var(--text-h)' }}>{row.total_reservations}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '999px', background: '#d1fae5', color: '#065f46', fontWeight: 600, fontSize: '0.8rem' }}>{row.approved}</span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '999px', background: '#fee2e2', color: '#dc2626', fontWeight: 600, fontSize: '0.8rem' }}>{row.rejected}</span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '999px', background: '#f1f5f9', color: '#64748b', fontWeight: 600, fontSize: '0.8rem' }}>{row.cancelled}</span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: 'var(--primary-dark)' }}>{row.total_reports}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && data.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
          <TrendingUp size={48} style={{ opacity: 0.12, marginBottom: '16px', color: 'var(--text-h)' }} />
          <p style={{ fontWeight: 600, color: 'var(--text-h)', margin: 0 }}>Belum ada data rekap</p>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.9rem' }}>Coba ubah filter tanggal atau tunggu ada aktivitas di sistem.</p>
        </div>
      )}
    </div>
  );
}
