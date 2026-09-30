import api from './axios';

// User endpoints
export const createReportApi  = (data: FormData)          => api.post('/reports', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getMyReportsApi  = ()                         => api.get('/reports/my');
export const getReportApi     = (id: number | string)      => api.get(`/reports/${id}`);

// Officer endpoints
export const getReportQueueApi   = ()                         => api.get('/reports/queue');
export const updateReportStatusApi = (id: number | string, data: object) =>
  api.patch(`/reports/${id}/status`, data);
