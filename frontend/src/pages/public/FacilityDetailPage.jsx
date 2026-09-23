import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SlotCalendar from '../../components/facilities/SlotCalendar';
import { getMockFacilityById } from '../../__mocks__/facilities';
// import { getFacilityApi } from '../../api/facilities'; // aktifkan saat backend siap

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function FacilityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(todayStr());
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    setLoading(true);
    // Sementara pakai mock. Ganti dengan:
    // getFacilityApi(id).then((res) => setFacility(res.data.data));
    const timer = setTimeout(() => {
      setFacility(getMockFacilityById(id));
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [id]);

  const handleReserve = () => {
    if (!selectedSlot) return;
    // Halaman form reservasi dibuat di Fase 4 — sementara arahkan dengan state.
    navigate('/reservations/new', {
      state: { facilityId: id, date, ...selectedSlot },
    });
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="container py-5 text-center text-muted">
        <p className="fs-5">Fasilitas tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12 col-lg-5 mb-4">
          <img
            src={facility.fac_image || 'https://placehold.co/500x300?text=Fasilitas'}
            className="img-fluid rounded mb-3"
            alt={facility.fac_name}
          />
          <h2>{facility.fac_name}</h2>
          <span className="badge bg-info text-dark mb-2">
            {facility.fac_type?.fac_type_name}
          </span>
          <p className="text-white-50 mb-1">{facility.fac_location}</p>
          {facility.fac_capacity != null && (
            <p className="text-white-50 mb-1">Kapasitas: {facility.fac_capacity} orang</p>
          )}
          <p>{facility.fac_description}</p>

          <button
            className="btn btn-primary w-100 mt-3"
            disabled={!selectedSlot}
            onClick={handleReserve}
          >
            {selectedSlot
              ? `Ajukan Reservasi (${selectedSlot.start}–${selectedSlot.end})`
              : 'Pilih slot terlebih dahulu'}
          </button>
        </div>

        <div className="col-12 col-lg-7">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Jadwal Ketersediaan</h5>
            <input
              type="date"
              className="form-control w-auto"
              value={date}
              min={todayStr()}
              onChange={(e) => {
                setDate(e.target.value);
                setSelectedSlot(null);
              }}
            />
          </div>
          <SlotCalendar
            facilityId={id}
            date={date}
            onSlotSelect={(start, end) => setSelectedSlot({ start, end })}
          />
        </div>
      </div>
    </div>
  );
}
