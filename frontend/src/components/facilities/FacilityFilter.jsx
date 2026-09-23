import { mockFacilityTypes } from '../../__mocks__/facilities';

const EMPTY_FILTERS = { type: '', location: '', capacity: '' };

export default function FacilityFilter({ filters, onFilterChange, onReset }) {
  const handleChange = (field) => (e) => {
    onFilterChange({ ...filters, [field]: e.target.value });
  };

  return (
    <div className="card p-3 mb-4">
      <div className="row g-3 align-items-end">
        <div className="col-12 col-md-4">
          <label className="form-label">Tipe Fasilitas</label>
          <select
            className="form-select"
            value={filters.type}
            onChange={handleChange('type')}
          >
            <option value="">Semua Tipe</option>
            {mockFacilityTypes.map((t) => (
              <option key={t.fac_type_id} value={t.fac_type_name}>
                {t.fac_type_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label">Lokasi</label>
          <input
            type="text"
            className="form-control"
            placeholder="Cari lokasi..."
            value={filters.location}
            onChange={handleChange('location')}
          />
        </div>

        <div className="col-12 col-md-3">
          <label className="form-label">Kapasitas Minimal</label>
          <input
            type="number"
            min="0"
            className="form-control"
            placeholder="cth. 20"
            value={filters.capacity}
            onChange={handleChange('capacity')}
          />
        </div>

        <div className="col-12 col-md-1">
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={() => onFilterChange(EMPTY_FILTERS) || onReset?.()}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export { EMPTY_FILTERS };
