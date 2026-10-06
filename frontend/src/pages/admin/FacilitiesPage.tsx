import { useEffect, useState } from 'react';
import { Building2, Pencil, Plus } from 'lucide-react';
import { createFacilityApi, getFacilitiesApi, updateFacilityApi } from '../../api/facilities';
import FacilityForm from '../../components/facilities/FacilityForm';
import type { Facility } from '../../types/facility';

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [editing, setEditing] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadFacilities = async () => {
    setLoading(true);
    try {
      const response = await getFacilitiesApi();
      setFacilities(response.data.data ?? []);
      setError('');
    } catch {
      setError('Gagal memuat daftar fasilitas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFacilities();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setError('');
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
    } catch (requestError: any) {
      setError(requestError.response?.data?.message ?? 'Gagal menyimpan fasilitas.');
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
            key={editing?.fac_id ?? 'new'}
            initialData={editing ?? {}}
            onSubmit={saveFacility}
            submitting={submitting}
          />
        </aside>

        {/* ── KANAN: Daftar (scroll) ── */}
        <section className="admin-split-right">
          <div className="admin-split-right-head">
            <h2>Daftar Fasilitas</h2>
            <span className="admin-count">{facilities.length} item</span>
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
                ) : facilities.map((facility) => (
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