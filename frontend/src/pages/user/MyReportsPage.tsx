import { useState, useEffect } from 'react';
import { getMyReportsApi } from '../../api/reports';
import ReportTable, { type Report } from '../../components/reports/ReportTable';

export default function MyReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    getMyReportsApi()
      .then((r: any) => setReports(r.data.data ?? r.data))
      .catch(() => setError('Gagal memuat laporan.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '32px', maxWidth: '1140px', margin: '0 auto' }}>
      <ReportTable
        reports={reports}
        loading={loading}
        error={error}
        showCreateButton={true}
      />
    </div>
  );
}
