import { Clock, CheckCircle, XCircle, AlertCircle, FolderKanban, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface Report {
  rep_id: number;
  rep_description: string;
  rep_photo?: string;
  created_at: string;
  facility?: { fac_name: string };
  category?: { rep_cat_name: string };
  rep_status?: { rep_status_name: string };
}

const STATUS_STYLE: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  baru:     { bg: '#dbeafe', text: '#1e40af', icon: <AlertCircle size={12} /> },
  diproses: { bg: '#fef3c7', text: '#92400e', icon: <Clock size={12} /> },
  selesai:  { bg: '#d1fae5', text: '#065f46', icon: <CheckCircle size={12} /> },
  ditolak:  { bg: '#fee2e2', text: '#991b1b', icon: <XCircle size={12} /> },
};

const CAT_LABEL: Record<string, string> = {
  kerusakan_ringan: 'Kerusakan Ringan',
  kerusakan_berat:  'Kerusakan Berat',
  kebersihan:       'Kebersihan',
  keamanan:         'Keamanan',
  lainnya:          'Lainnya',
};

interface ReportTableProps {
  reports: Report[];
  loading: boolean;
  error: string;
  /** Show "Buat Laporan" header button — off by default for officer view */
  showCreateButton?: boolean;
  /** Show officer action column (update status) */
  onUpdateStatus?: (report: Report) => void;
  emptyTitle?: string;
  emptyDesc?: string;
}

export default function ReportTable({
  reports,
  loading,
  error,
  showCreateButton = false,
  onUpdateStatus,
  emptyTitle = 'Belum ada laporan',
  emptyDesc = 'Temukan masalah fasilitas? Bantu laporkan kepada petugas.',
}: ReportTableProps) {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: 48, height: 48, borderRadius: '10px', background: 'var(--primary-bg)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FolderKanban size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, color: 'var(--text-h)' }}>
              {showCreateButton ? 'Laporan Saya' : 'Antrian Laporan'}
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              {showCreateButton ? 'Riwayat pelaporan kerusakan dan masalah fasilitas' : 'Kelola dan tindak lanjuti laporan kerusakan fasilitas'}
            </p>
          </div>
        </div>
        {showCreateButton && (
          <button onClick={() => navigate('/reports/new')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: 'var(--radius)', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
            <Plus size={16} /> Buat Laporan
          </button>
        )}
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

      {/* Empty State */}
      {!loading && reports.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
          <FolderKanban size={48} style={{ opacity: 0.12, marginBottom: '16px', color: 'var(--text-h)' }} />
          <p style={{ fontWeight: 600, color: 'var(--text-h)', margin: 0 }}>{emptyTitle}</p>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.9rem' }}>{emptyDesc}</p>
          {showCreateButton && (
            <button onClick={() => navigate('/reports/new')}
              style={{ marginTop: '20px', padding: '10px 24px', borderRadius: 'var(--radius)', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
              + Buat Laporan
            </button>
          )}
        </div>
      )}

      {/* List */}
      {!loading && reports.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reports.map((r) => {
            const statusKey = r.rep_status?.rep_status_name?.toLowerCase() ?? '';
            const badge = STATUS_STYLE[statusKey] ?? STATUS_STYLE.baru;
            const catKey = r.category?.rep_cat_name?.toLowerCase() ?? '';
            const catLabel = CAT_LABEL[catKey] || r.category?.rep_cat_name || '-';

            return (
              <div key={r.rep_id} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '20px 24px',
                boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '20px', alignItems: 'flex-start',
                flexWrap: 'wrap',
              }}>
                {/* Thumbnail */}
                {r.rep_photo && (
                  <img src={r.rep_photo} alt="foto laporan"
                    style={{ width: 72, height: 72, borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border)' }}
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                  />
                )}

                {/* Content */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-h)', fontSize: '1rem' }}>
                      {r.facility?.fac_name ?? 'Fasilitas'}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: badge.bg, color: badge.text }}>
                      {badge.icon} {r.rep_status?.rep_status_name ?? 'Baru'}
                    </span>
                    <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: 'var(--primary-bg)', color: 'var(--primary-dark)' }}>
                      {catLabel}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 4px', fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.5 }}>
                    {r.rep_description}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    🕐 {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>

                {/* Officer Action */}
                {onUpdateStatus && statusKey !== 'selesai' && statusKey !== 'ditolak' && (
                  <button onClick={() => onUpdateStatus(r)}
                    style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary)', background: 'var(--primary-bg)', color: 'var(--primary-dark)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', flexShrink: 0 }}>
                    Tindak Lanjut
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
