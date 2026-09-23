import { Link } from 'react-router-dom';

const STATUS_BADGE = {
  aktif: 'bg-success',
  dalam_perbaikan: 'bg-warning text-dark',
  nonaktif: 'bg-secondary',
};

const TYPE_LABEL = {
  ruang_kelas: 'Ruang Kelas',
  aula: 'Aula',
  laboratorium: 'Laboratorium',
  alat: 'Alat',
  lapangan: 'Lapangan',
};

export default function FacilityCard({ facility }) {
  const {
    fac_id,
    fac_name,
    fac_type,
    fac_location,
    fac_capacity,
    fac_status,
    fac_image,
  } = facility;

  const statusClass = STATUS_BADGE[fac_status?.fac_status_name] || 'bg-secondary';
  const typeLabel = TYPE_LABEL[fac_type?.fac_type_name] || fac_type?.fac_type_name;

  return (
    <div className="col-12 col-sm-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm">
        <img
          src={fac_image || 'https://placehold.co/400x220?text=Fasilitas'}
          className="card-img-top"
          alt={fac_name}
          style={{ objectFit: 'cover', height: 180 }}
        />
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title mb-0">{fac_name}</h5>
            <span className={`badge ${statusClass}`}>{fac_status?.fac_status_name}</span>
          </div>
          <span className="badge bg-info text-dark align-self-start mb-2">{typeLabel}</span>
          <p className="card-text text-muted mb-1">
            <i className="bi bi-geo-alt me-1" />
            {fac_location}
          </p>
          {fac_capacity != null && (
            <p className="card-text text-muted mb-3">Kapasitas: {fac_capacity} orang</p>
          )}
          <Link
            to={`/facilities/${fac_id}`}
            className="btn btn-primary mt-auto"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
