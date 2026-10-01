export interface FacilityOption {
  fac_id: number | string;
  fac_name: string;
}

export interface ReservationPayload {
  facility_id: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  purpose: string;
}
