import type { AxiosResponse } from 'axios';
import api from './axios';
import type { Facility, FacilityFilterState, FacilityType } from '../types/facility';

interface FacilityListResponse {
  data: Facility[];
}

interface FacilityTypeListResponse {
  data: FacilityType[];
}

interface FacilityTypeResponse {
  data: FacilityType;
}

export const getFacilitiesApi = (filters: Partial<FacilityFilterState> = {}):
  Promise<AxiosResponse<FacilityListResponse>> => api.get('/facilities', { params: filters });

export const getFacilityTypesApi = (): Promise<AxiosResponse<FacilityTypeListResponse>> =>
  api.get('/facility-types');

export const createFacilityTypeApi = (fac_type_name: string): Promise<AxiosResponse<FacilityTypeResponse>> =>
  api.post('/facility-types', { fac_type_name });

export const getFacilityApi = (id: number | string): Promise<AxiosResponse<{ data: Facility }>> =>
  api.get(`/facilities/${id}`);

export const getSlotsApi = (id: number | string, date: string) =>
  api.get(`/facilities/${id}/slots`, { params: { date } });

export const createFacilityApi = (data: FormData) => api.post('/facilities', data);

export const updateFacilityApi = (id: number | string, data: FormData) => {
  data.append('_method', 'PUT');
  return api.post(`/facilities/${id}`, data);
};

export const updateFacilityStatusApi = (id: number | string, facStatId: number | string) =>
  api.patch(`/facilities/${id}/status`, { fac_stat_id: facStatId });