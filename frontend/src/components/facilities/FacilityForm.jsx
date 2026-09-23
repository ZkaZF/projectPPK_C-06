import { useState } from 'react';
import { mockFacilityTypes } from '../../__mocks__/facilities';

const FACILITY_STATUSES = [
  { fac_stat_id: 1, fac_status_name: 'aktif' },
  { fac_stat_id: 2, fac_status_name: 'dalam_perbaikan' },
  { fac_stat_id: 3, fac_status_name: 'nonaktif' },
];

const emptyForm = {
  fac_name: '',
  fac_type_id: '',
  fac_location: '',
  fac_capacity: '',
  fac_description: '',
  fac_stat_id: 1,
  fac_image: null,
};

/**
 * props:
 *  - initialData: object fasilitas untuk mode edit (opsional)
 *  - onSubmit(formData): dipanggil saat form disubmit, menerima FormData
 *  - submitting: boolean, disable tombol saat request berjalan
 */
export default function FacilityForm({ initialData, onSubmit, submitting }) {
  const [form, setForm] = useState({
    fac_name: initialData?.fac_name ?? emptyForm.fac_name,
    fac_type_id: initialData?.fac_type?.fac_type_id ?? emptyForm.fac_type_id,
    fac_location: initialData?.fac_location ?? emptyForm.fac_location,
    fac_capacity: initialData?.fac_capacity ?? emptyForm.fac_capacity,
    fac_description: initialData?.fac_description ?? emptyForm.fac_description,
    fac_stat_id: initialData?.fac_status?.fac_stat_id ?? emptyForm.fac_stat_id,
    fac_image: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    const value = field === 'fac_image' ? e.target.files[0] : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fac_name.trim()) errs.fac_name = 'Nama fasilitas wajib diisi';
    if (!form.fac_type_id) errs.fac_type_id = 'Tipe fasilitas wajib dipilih';
    if (!form.fac_location.trim()) errs.fac_location = 'Lokasi wajib diisi';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val !== null && val !== '') payload.append(key, val);
    });
    onSubmit?.(payload);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label className="form-label">Nama Fasilitas</label>
        <input
          type="text"
          className={`form-control ${errors.fac_name ? 'is-invalid' : ''}`}
          value={form.fac_name}
          onChange={handleChange('fac_name')}
        />
        {errors.fac_name && <div className="invalid-feedback">{errors.fac_name}</div>}
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Tipe Fasilitas</label>
          <select
            className={`form-select ${errors.fac_type_id ? 'is-invalid' : ''}`}
            value={form.fac_type_id}
            onChange={handleChange('fac_type_id')}
          >
            <option value="">Pilih tipe...</option>
            {mockFacilityTypes.map((t) => (
              <option key={t.fac_type_id} value={t.fac_type_id}>
                {t.fac_type_name}
              </option>
            ))}
          </select>
          {errors.fac_type_id && (
            <div className="invalid-feedback">{errors.fac_type_id}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Kapasitas (opsional)</label>
          <input
            type="number"
            min="0"
            className="form-control"
            value={form.fac_capacity}
            onChange={handleChange('fac_capacity')}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Lokasi</label>
        <input
          type="text"
          className={`form-control ${errors.fac_location ? 'is-invalid' : ''}`}
          value={form.fac_location}
          onChange={handleChange('fac_location')}
        />
        {errors.fac_location && (
          <div className="invalid-feedback">{errors.fac_location}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Deskripsi</label>
        <textarea
          className="form-control"
          rows={3}
          value={form.fac_description}
          onChange={handleChange('fac_description')}
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={form.fac_stat_id}
            onChange={handleChange('fac_stat_id')}
          >
            {FACILITY_STATUSES.map((s) => (
              <option key={s.fac_stat_id} value={s.fac_stat_id}>
                {s.fac_status_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Gambar (opsional)</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleChange('fac_image')}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Tambah Fasilitas'}
      </button>
    </form>
  );
}
