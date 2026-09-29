import React, { useState } from 'react';
import type { Facility, FacilityType } from '../../types/facility';

// @ts-ignore
import { mockFacilityTypes } from '../../__mocks__/facilities';

interface FacilityFormProps {
  initialData?: Partial<Facility>;
  onSubmit: (formData: FormState) => void;
  submitting?: boolean;
}

interface FormState {
  fac_name: string;
  fac_type_id: string;
  fac_location: string;
  fac_capacity: string;
  fac_description: string;
}

interface FormErrors {
  fac_name?: string;
  fac_type_id?: string;
  fac_location?: string;
}

export default function FacilityForm({ initialData = {}, onSubmit, submitting }: FacilityFormProps) {
  const [form, setForm] = useState<FormState>({
    fac_name: initialData.fac_name || '',
    fac_type_id: String(initialData.fac_type?.fac_type_id || ''),
    fac_location: initialData.fac_location || '',
    fac_capacity: String(initialData.fac_capacity || ''),
    fac_description: initialData.fac_description || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.fac_name.trim()) errs.fac_name = 'Nama fasilitas wajib diisi';
    if (!form.fac_type_id) errs.fac_type_id = 'Tipe fasilitas wajib dipilih';
    if (!form.fac_location.trim()) errs.fac_location = 'Lokasi wajib diisi';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
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

      <div className="mb-3">
        <label className="form-label">Tipe Fasilitas</label>
        <select
          className={`form-select ${errors.fac_type_id ? 'is-invalid' : ''}`}
          value={form.fac_type_id}
          onChange={handleChange('fac_type_id')}
        >
          <option value="">Pilih Tipe</option>
          {mockFacilityTypes.map((t: FacilityType) => (
            <option key={t.fac_type_id} value={t.fac_type_id}>
              {t.fac_type_name}
            </option>
          ))}
        </select>
        {errors.fac_type_id && <div className="invalid-feedback">{errors.fac_type_id}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Lokasi</label>
        <input
          type="text"
          className={`form-control ${errors.fac_location ? 'is-invalid' : ''}`}
          value={form.fac_location}
          onChange={handleChange('fac_location')}
        />
        {errors.fac_location && <div className="invalid-feedback">{errors.fac_location}</div>}
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Menyimpan...' : 'Simpan'}
      </button>
    </form>
  );
}
