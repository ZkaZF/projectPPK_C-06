import { useNavigate } from 'react-router-dom';
import ReportForm from '../../components/reports/ReportForm';

export default function NewReportPage() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '32px', maxWidth: '680px', margin: '0 auto' }}>
      <ReportForm onBack={() => navigate(-1)} />
    </div>
  );
}

