import api from './axios';

// ── Admin: User Management ────────────────────────────────────────────
export const adminGetUsersApi    = (params?: object) => api.get('/admin/users', { params });
export const adminCreateUserApi  = (data: object)    => api.post('/admin/users', data);
export const adminVerifyUserApi  = (id: number | string) => api.patch(`/admin/users/${id}/verify`);
export const adminRejectUserApi  = (id: number | string, reason?: string) =>
  api.patch(`/admin/users/${id}/reject`, { reason });
export const adminGetPendingUsersApi = () => api.get('/admin/users?status=pending');

// ── Admin: Facility Management ────────────────────────────────────────
export const adminGetFacilitiesApi    = (params?: object) => api.get('/admin/facilities', { params });
export const adminCreateFacilityApi   = (data: object)    => api.post('/admin/facilities', data);
export const adminUpdateFacilityApi   = (id: number | string, data: object) =>
  api.put(`/admin/facilities/${id}`, data);
export const adminDeleteFacilityApi   = (id: number | string) => api.delete(`/admin/facilities/${id}`);

// ── Admin: Recap & Stats ──────────────────────────────────────────────
export const adminGetRecapApi   = (params?: object) => api.get('/admin/recap', { params });
export const adminGetStatsApi   = ()                 => api.get('/admin/stats');
export const adminExportRecapApi = (format: 'csv' | 'excel') =>
  api.get(`/admin/recap/export?format=${format}`, { responseType: 'blob' });
