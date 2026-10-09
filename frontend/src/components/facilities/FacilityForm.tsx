import React, { useState } from 'react';
import { Building2, Layers, MapPin, Users, FileText, Image as ImageIcon } from 'lucide-react';
import type { Facility, FacilityType } from '../../types/facility';
import { FileUploadCard, type UploadedFile } from '../ui/file-upload-card';

// @ts-ignore
import { mockFacilityTypes } from '../../__mocks__/facilities';

interface FacilityFormProps {
  initialData?: Partial<Facility>;
  onSubmit: (formData: FormData) => void;
  submitting?: boolean;
}

interface FormState {
  fac_name: string;
  fac_type_id: string;
  fac_location: string;
  fac_capacity: string;
  fac_description: string;
  fac_stat_id: string;
}

interface FormErrors {
  fac_name?: string;
  fac_type_id?: string;
  fac_location?: string;
}

export default function FacilityForm({ initialData = {}, onSubmit, submitting }: FacilityFormProps) {
  const [form, setForm] = useState<FormState>({
    fac_name: initialData.fac_name || '',
    fac_type_id: String(initialData.type?.fac_type_id || ''),
    fac_location: initialData.fac_location || '',
    fac_capacity: String(initialData.fac_capacity || ''),
    fac_description: initialData.fac_description || '',
    fac_stat_id: String(initialData.status?.fac_stat_id || initialData.status?.fac_status_id || 1),
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [image, setImage] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [imagePreview, setImagePreview] = useState(initialData.fac_image || '');

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
    if (!validate()) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append('fac_image', image);
    onSubmit(formData);
  };

  const handleFilesChange = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      const selectedImage = newFiles[0];
      setUploadedFiles([{ id: `${selectedImage.name}-${Date.now()}`, file: selectedImage, progress: 100, status: 'completed' }]);
      setImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage));
    }
  };

  const handleFileRemove = () => {
    setUploadedFiles([]);
    setImage(null);
    setImagePreview(initialData.fac_image || '');
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '6px', fontSize: '0.78rem',
    fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em',
  };
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)', background: 'var(--surface-2)',
    color: 'var(--text-h)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
  };
  const inputErrorStyle: React.CSSProperties = { ...inputStyle, borderColor: '#fca5a5', background: '#fef2f2' };

  return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Nama Fasilitas */}
        <div>
          <label style={labelStyle}>
            <Building2 size={13} style={{ display: 'inline', marginRight: 6 }} />Nama Fasilitas
          </label>
          <input
            type="text"
            style={errors.fac_name ? inputErrorStyle : inputStyle}
            value={form.fac_name}
            onChange={handleChange('fac_name')}
          />
          {errors.fac_name && <div style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px' }}>{errors.fac_name}</div>}
        </div>

        {/* Tipe Fasilitas */}
        <div>
          <label style={labelStyle}>
            <Layers size={13} style={{ display: 'inline', marginRight: 6 }} />Tipe Fasilitas
          </label>
          <select
            style={errors.fac_type_id ? inputErrorStyle : inputStyle}
            value={form.fac_type_id}
            onChange={handleChange('fac_type_id')}
          >
            <option value="">-- Pilih Tipe --</option>
            {mockFacilityTypes.map((t: FacilityType) => (
              <option key={t.fac_type_id} value={t.fac_type_id}>
                {t.fac_type_name}
              </option>
            ))}
          </select>
          {errors.fac_type_id && <div style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px' }}>{errors.fac_type_id}</div>}
        </div>

        {/* Lokasi */}
        <div>
          <label style={labelStyle}>
            <MapPin size={13} style={{ display: 'inline', marginRight: 6 }} />Lokasi
          </label>
          <input
            type="text"
            style={errors.fac_location ? inputErrorStyle : inputStyle}
            value={form.fac_location}
            onChange={handleChange('fac_location')}
          />
          {errors.fac_location && <div style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px' }}>{errors.fac_location}</div>}
        </div>

        {/* Kapasitas */}
        <div>
          <label style={labelStyle}>
            <Users size={13} style={{ display: 'inline', marginRight: 6 }} />Kapasitas
          </label>
          <input
            type="number"
            min="1"
            style={inputStyle}
            value={form.fac_capacity}
            onChange={handleChange('fac_capacity')}
          />
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />

        {/* Deskripsi */}
        <div>
          <label style={labelStyle}>
            <FileText size={13} style={{ display: 'inline', marginRight: 6 }} />Deskripsi
          </label>
          <textarea
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            value={form.fac_description}
            onChange={handleChange('fac_description')}
          />
        </div>

        {/* Gambar */}
        <div>
          <label style={labelStyle}>
            <ImageIcon size={13} style={{ display: 'inline', marginRight: 6 }} />Gambar Fasilitas
          </label>
          <FileUploadCard
            files={uploadedFiles}
            onFilesChange={handleFilesChange}
            onFileRemove={handleFileRemove}
            className="mt-2 w-full max-w-full"
            title="Upload Gambar Fasilitas"
            description="Format gambar (JPEG, PNG). Ukuran disarankan 16:9"
          />
          {imagePreview && uploadedFiles.length === 0 && (
            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase' }}>Preview Gambar Saat Ini:</p>
              <img
                src={imagePreview}
                alt="Preview gambar fasilitas"
                style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%', padding: '12px', background: 'var(--primary)', color: 'white',
            border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '0.95rem',
            cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, marginTop: '8px'
          }}
        >
          {submitting ? 'Menyimpan...' : 'Simpan Fasilitas'}
        </button>
      </form>
    </div>
  );
}
