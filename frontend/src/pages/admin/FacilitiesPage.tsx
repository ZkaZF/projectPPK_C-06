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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (facility: Facility) => {
    setEditing(facility);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleFormSubmit = async (data: FormData) => {
    await saveFacility(data);
    if (!error) {
      setIsModalOpen(false);
    }
  };

  // Modal overlay styles
  const overlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    animation: 'fadeIn 0.2s ease-out', padding: '20px',
  };
  const modalStyle: React.CSSProperties = {
    background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '32px',
    maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  return (
    <main className="admin-page">
      <header className="admin-page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="admin-page-title">Kelola Fasilitas</h1>
          <p className="admin-page-subtitle">Atur informasi dan gambar fasilitas kampus.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={handleAddNew} style={{ padding: '10px 20px', fontSize: '0.95rem' }}>
          <Plus size={18} style={{ marginRight: 6 }} /> Tambah Fasilitas
        </button>
      </header>

      {error && <div className="alert alert-danger" role="alert" style={{ marginBottom: '24px' }}>{error}</div>}

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "32px", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-h)', margin: 0 }}>Daftar Fasilitas ({searchQuery.trim() ? `${filteredFacilities.length}/${facilities.length}` : facilities.length})</h2>
            <div className="admin-facility-search" style={{ maxWidth: '350px', width: '100%', margin: 0 }}>
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
        </div>

        <div className="admin-table-wrap" style={{ overflowX: 'auto' }}>
          <table className="table align-middle mb-0" style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px', fontWeight: 600 }}>Gambar</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Fasilitas</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Lokasi</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>Memuat fasilitas...</td></tr>
              ) : facilities.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    <Building2 size={32} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                    <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>Belum ada fasilitas.</p>
                  </td>
                </tr>
              ) : filteredFacilities.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    Tidak ada fasilitas yang cocok dengan “{searchQuery}”.
                  </td>
                </tr>
              ) : filteredFacilities.map((facility) => (
                <tr
                  key={facility.fac_id}
                  style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}
                >
                  <td style={{ padding: '16px', width: '120px' }}>
                    <img
                      src={facility.fac_image || 'https://placehold.co/120x80?text=Fasilitas'}
                      alt={facility.fac_name}
                      style={{ width: '96px', height: '64px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                      onError={(event) => {
                        event.currentTarget.src = 'https://placehold.co/120x80?text=Fasilitas';
                      }}
                    />
                  </td>
                  <td style={{ padding: '16px' }}>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--text-h)', display: 'block', marginBottom: '4px' }}>{facility.fac_name}</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: '4px' }}>{facility.type?.fac_type_name}</span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text)' }}>{facility.fac_location}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                        fontSize: '0.85rem', fontWeight: 500, padding: '4px 10px', borderRadius: '20px',
                        background: facility.status?.fac_status_name?.toLowerCase() === 'aktif' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: facility.status?.fac_status_name?.toLowerCase() === 'aktif' ? '#10b981' : '#f59e0b'
                     }}>
                        {facility.status?.fac_status_name ?? '-'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      type="button"
                      aria-label={`Edit ${facility.fac_name}`}
                      title="Edit fasilitas"
                      onClick={() => handleEdit(facility)}
                      style={{ padding: '8px', borderRadius: '8px' }}
                    >
                      <Pencil size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div style={overlayStyle} onClick={closeModal}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-h)', margin: 0 }}>
                {editing ? 'Edit Fasilitas' : 'Fasilitas Baru'}
              </h2>
              <button 
                onClick={closeModal} 
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-h)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'all 0.2s' }}
              >
                <X size={20} />
              </button>
            </div>
            
            <FacilityForm
              key={editing?.fac_id ?? `new-${formVersion}`}
              initialData={editing ?? {}}
              facilityTypes={facilityTypes}
              onCreateFacilityType={createFacilityType}
              onSubmit={handleFormSubmit}
              submitting={submitting}
            />
          </div>
        </div>
      )}
    </main>
  );
}