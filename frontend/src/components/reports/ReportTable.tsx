import { FolderKanban, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/date';

export interface Report {
  rep_id: number;
  rep_description: string;
  rep_photo?: string;
  created_at: string;
  facility?: { fac_name: string };
  category?: { rep_cat_name: string };
  rep_status?: { rep_status_name: string };
}

interface ReportTableProps {
  reports: Report[];
  loading: boolean;
  error: string;
  onCreateNew: () => void;
}

const STATUS_STYLE: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  baru:      { bg: '#dbeafe', text: '#1e40af', icon: <AlertCircle size={12} /> },
  diproses:  { bg: '#fef3c7', text: '#92400e', icon: <Clock size={12} /> },
  selesai:   { bg: '#d1fae5', text: '#065f46', icon: <CheckCircle size={12} /> },
  ditolak:   { bg: '#fee2e2', text: '#991b1b', icon: <XCircle size={12} /> },
};

const CAT_LABEL: Record<string, string> = {
  kerusakan_ringan: 'Kerusakan Ringan',
  kerusakan_berat:  'Kerusakan Berat',
  kebersihan:       'Kebersihan',
  keamanan:         'Keamanan',
  lainnya:          'Lainnya',
};

export default function ReportTable({ reports, loading, error, onCreateNew }: ReportTableProps) {
  if (error) {
    return <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: '#fee2e2', color: '#dc2626', marginBottom: '20px', fontSize: '0.875rem' }}>⚠️ {error}</div>;
  }
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }
  if (reports.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
        <FolderKanban size={48} style={{ opacity: 0.12, marginBottom: '16px', color: 'var(--text-h)' }} />
        <p style={{ fontWeight: 600, color: 'var(--text-h)', margin: 0 }}>Belum ada laporan</p>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.9rem' }}>Temukan masalah fasilitas? Bantu laporkan kepada petugas.</p>
        <button onClick={onCreateNew} style={{ marginTop: '20px', padding: '10px 24px', borderRadius: 'var(--radius)', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
          + Buat Laporan
        </button>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {reports.map((r) => {
        const statusKey = r.rep_status?.rep_status_name?.toLowerCase() ?? '';
        const badge = STATUS_STYLE[statusKey] ?? STATUS_STYLE.baru;
        const catKey = r.category?.rep_cat_name?.toLowerCase() ?? '';
        const catLabel = CAT_LABEL[catKey] || r.category?.rep_cat_name || '-';
        return (
          <div key={r.rep_id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            {r.rep_photo && (
              <img src={r.rep_photo} alt="foto laporan" style={{ width: 72, height: 72, borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border)' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-h)', fontSize: '1rem' }}>{r.facility?.fac_name ?? 'Fasilitas'}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: badge.bg, color: badge.text }}>
                  {badge.icon} {r.rep_status?.rep_status_name ?? '-'}
                </span>
                <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: 'var(--primary-bg)', color: 'var(--primary-dark)' }}>{catLabel}</span>
              </div>
              <p style={{ margin: '0 0 4px', fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.5 }}>{r.rep_description}</p>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                🕐 {formatDate(r.created_at)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
