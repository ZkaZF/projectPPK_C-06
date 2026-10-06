import type { Facility } from '../types/facility';

export const isAvailable = (facility: Facility): boolean => {
  if (facility.fac_stat_id !== undefined) {
    return Number(facility.fac_stat_id) === 1;
  }
  const statusName = facility.status?.fac_status_name?.toLowerCase() ?? '';
  return statusName === 'aktif' || statusName === 'available';
};

export const getFacilityPrefix = (typeName: string): string => {
  const map: Record<string, string> = {
    ruang_kelas: 'GKB',
    aula: 'GED',
    laboratorium: 'LAB',
    alat: 'STU',
    lapangan: 'LAP',
  };
  return map[typeName] ?? 'FAS';
};

export const getFacilityTypeLabel = (typeName: string, fallback?: string): string => {
  const map: Record<string, string> = {
    ruang_kelas: 'Ruang Kelas Smart',
    aula: 'Aula & Konvensi',
    laboratorium: 'Laboratorium',
    alat: 'Studio Multimedia',
    lapangan: 'Fasilitas Olahraga',
  };
  return map[typeName] ?? (fallback || typeName || '-');
};
