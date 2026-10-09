import { useEffect, useMemo, useState } from 'react';
import { isAxiosError } from 'axios';
import { Building2, Pencil, Plus, Search, X } from 'lucide-react';
import {
  createFacilityApi,
  createFacilityTypeApi,
  getFacilitiesApi,
  getFacilityTypesApi,
  updateFacilityApi,
} from '../../api/facilities';
import FacilityForm from '../../components/facilities/FacilityForm';
import type { Facility, FacilityType } from '../../types/facility';

interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

const getRequestErrorMessage = (requestError: unknown): string => {
  if (!isAxiosError<ApiErrorResponse>(requestError)) {
    return 'Fasilitas belum dapat disimpan. Silakan coba lagi.';
  }

  const response = requestError.response?.data;
  const validationErrors = response?.errors;
  if (validationErrors) {
    const messages = Object.entries(validationErrors)
      .flatMap(([field, errors]) => errors.map((message) => {
        const label = field === 'fac_image' ? 'Foto fasilitas' : field;
        return `${label}: ${message}`;
      }));
    if (messages.length > 0) return messages.join(' ');
  }

  return response?.message
    ?? (requestError.response
      ? 'Fasilitas belum dapat disimpan. Silakan coba lagi.'
      : 'Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.');
};

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([]);
  const [editing, setEditing] = useState<Facility | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadFacilities = async () => {
    setLoading(true);
    try {
      const [facilitiesResponse, typesResponse] = await Promise.all([
        getFacilitiesApi(),
        getFacilityTypesApi(),
      ]);
      setFacilities(facilitiesResponse.data.data ?? []);
      setFacilityTypes(typesResponse.data.data ?? []);
      setError('');
    } catch {
      setError('Gagal memuat daftar fasilitas atau jenis fasilitas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFacilities();
  }, []);

  const filteredFacilities = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase('id');
    if (!query) return facilities;

    return facilities.filter((facility) => [
      facility.fac_name,
      facility.fac_location,
      facility.type?.fac_type_name,
      facility.status?.fac_status_name,
    ].some((value) => value?.toLocaleLowerCase('id').includes(query)));
  }, [facilities, searchQuery]);

  const resetForm = () => {
    setEditing(null);
    setFormVersion((version) => version + 1);
    setError('');
  };

  const createFacilityType = async (name: string) => {
    const response = await createFacilityTypeApi(name);
    const createdType = response.data.data;
    setFacilityTypes((types) => [...types, createdType]);
    return createdType;
  };

  const saveFacility = async (data: FormData) => {
    setSubmitting(true);
    setError('');
    try {
      if (editing) {
        await updateFacilityApi(editing.fac_id, data);
      } else {
        await createFacilityApi(data);
      }
      resetForm();
      await loadFacilities();
    } catch (requestError: unknown) {
      setError(getRequestErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Kelola Fasilitas</h1>
          <p className="admin-page-subtitle">Atur informasi dan gambar fasilitas kampus.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={resetForm}>
          <Plus size={16} style={{ marginRight: 6 }} /> Tambah Fasilitas
        </button>
      </header>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="admin-split">
        {/* ── KIRI: Form (sticky) ── */}
        <aside className="admin-split-left">
          <div className="admin-split-left-head">
            <h2>{editing ? 'Edit Fasilitas' : 'Fasilitas Baru'}</h2>
            {editing && (
              <button
                type="button"
                className="admin-split-cancel"
                onClick={resetForm}
                title="Batalkan edit"
              >
                ×
              </button>
            )}
          </div>
          <FacilityForm
            key={editing?.fac_id ?? `new-${formVersion}`}
            initialData={editing ?? {}}
            facilityTypes={facilityTypes}
            onCreateFacilityType={createFacilityType}
            onSubmit={saveFacility}
            submitting={submitting}
          />
        </aside>

        {/* ── KANAN: Daftar (scroll) ── */}
        <section className="admin-split-right">
          <div className="admin-split-right-head">
            <h2>Daftar Fasilitas</h2>
            <span className="admin-count">
              {searchQuery.trim()
                ? `${filteredFacilities.length} dari ${facilities.length} item`
                : `${facilities.length} item`}
            </span>
          </div>

          <div className="admin-facility-search">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari nama fasilitas, lokasi, jenis..."
              aria-label="Cari fasilitas"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Hapus pencarian"
                title="Hapus pencarian"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="admin-table-wrap">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Gambar</th>
                  <th>Fasilitas</th>
                  <th>Lokasi</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-4">Memuat fasilitas...</td></tr>
                ) : facilities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      <Building2 size={18} /> Belum ada fasilitas.
                    </td>
                  </tr>
                ) : filteredFacilities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      Tidak ada fasilitas yang cocok dengan “{searchQuery}”.
                    </td>
                  </tr>
                ) : filteredFacilities.map((facility) => (
                  <tr
                    key={facility.fac_id}
                    className={editing?.fac_id === facility.fac_id ? 'row-active' : ''}
                  >
                    <td style={{ width: 112 }}>
                      <img
                        src={facility.fac_image || 'https://placehold.co/120x80?text=Fasilitas'}
                        alt={facility.fac_name}
                        style={{ width: 88, height: 60, objectFit: 'cover', borderRadius: 4 }}
                        onError={(event) => {
                          event.currentTarget.src = 'https://placehold.co/120x80?text=Fasilitas';
                        }}
                      />
                    </td>
                    <td>
                      <strong>{facility.fac_name}</strong>
                      <br />
                      <small className="text-muted">{facility.type?.fac_type_name}</small>
                    </td>
                    <td>{facility.fac_location}</td>
                    <td>{facility.status?.fac_status_name ?? '-'}</td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        type="button"
                        aria-label={`Edit ${facility.fac_name}`}
                        title="Edit fasilitas"
                        onClick={() => setEditing(facility)}
                      >
                        <Pencil size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}