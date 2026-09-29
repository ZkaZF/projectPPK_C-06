// !!!note : edit ini untuk path api axios!!!
import api from './axios';

// method mengembalikan daftar fasilitas dengan filter type, location, dan capacity
export const getFacilitiesApi = (filters = {}) =>
	api.get('/facilities',{params:filters});

// method mengembalikan detail satu fasilitas
export const getFacilityApi = (id) =>
	api.get(`facilities/${id}`);

// method mengembalikan daftar slot 30 menit untuk tanggal tertentu
export const getSlotsApi = (id,date) =>
	api.get(`/facilities/${id}/slots`,{params:{date}});

// method membuat fasilitas baru
export const createFacilityApi = (data) =>
	api.post('/facilities',data);

// method mengubah fasilitas
export const updateFacilityApi = (id,data) =>
	api.put(`/facilities/${id}`,data);

// method mengubah status fasilitas
export const updateFacilityStatusApi = (id,facStatId) =>
	api.patch(`/facilities/${id}/status`,{fac_stat_id:facStatId});

