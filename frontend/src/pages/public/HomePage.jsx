import { useEffect, useMemo, useState } from 'react';
import FacilityCard from '../../components/facilities/FacilityCard';
import FacilityFilter, { EMPTY_FILTERS } from '../../components/facilities/FacilityFilter';
import { mockFacilities } from '../../__mocks__/facilities';
// import { getFacilitiesApi } from '../../api/facilities'; // aktifkan saat backend siap

export default function HomePage() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  useEffect(() => {
    // Sementara pakai mock. Ganti dengan:
    // getFacilitiesApi(filters).then((res) => setFacilities(res.data.data));
    setLoading(true);
    const timer = setTimeout(() => {
      setFacilities(mockFacilities);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    return facilities.filter((f) => {
      if (filters.type && f.fac_type?.fac_type_name !== filters.type) return false;
      if (
        filters.location &&
        !f.fac_location.toLowerCase().includes(filters.location.toLowerCase())
      )
        return false;
      if (filters.capacity && (f.fac_capacity ?? 0) < Number(filters.capacity))
        return false;
      return true;
    });
  }, [facilities, filters]);

  return (
    <div className="container py-4">
      <h1 className="mb-4">Fasilitas Kampus</h1>

      <FacilityFilter
        filters={filters}
        onFilterChange={setFilters}
        onReset={() => setFilters(EMPTY_FILTERS)}
      />

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Memuat...</span>
          </div>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center text-muted py-5">
          <p className="fs-5">Tidak ada fasilitas yang cocok dengan filter kamu.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="row">
          {filtered.map((f) => (
            <FacilityCard key={f.fac_id} facility={f} />
          ))}
        </div>
      )}
    </div>
  );
}
