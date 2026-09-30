import api from './axios';

// User endpoints
export const createReservationApi  = (data: object)   => api.post('/reservations', data);
export const getMyReservationsApi  = ()                => api.get('/reservations/my');
export const getReservationApi     = (id: number | string) => api.get(`/reservations/${id}`);
export const cancelReservationApi  = (id: number | string) => api.patch(`/reservations/${id}/cancel`);

// Officer endpoints
export const getReservationQueueApi  = ()                          => api.get('/reservations/queue');
export const approveReservationApi   = (id: number | string)       => api.patch(`/reservations/${id}/approve`);
export const rejectReservationApi    = (id: number | string, reason: string) =>
  api.patch(`/reservations/${id}/reject`, { cancel_reason: reason });
export const forceCancelReservationApi = (id: number | string, reason: string) =>
  api.patch(`/reservations/${id}/force-cancel`, { cancel_reason: reason });
