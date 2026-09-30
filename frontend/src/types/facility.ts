export interface FacilityType {
  fac_type_id?: number | string;
  fac_type_name: string;
}

export interface FacilityStatus {
  fac_status_id?: number | string;
  fac_status_name: string;
}

export interface Facility {
  fac_id: number | string;
  fac_name: string;
  type?: FacilityType;
  status?: FacilityStatus;
  fac_location?: string;
  fac_capacity?: number | null;
  fac_description?: string;
  fac_image?: string;
}

export interface FacilityFilterState {
  type: string;
  location: string;
  capacity: string;
}

export interface Slot {
  status: 'available' | 'booked' | string;
  start: string;
  end: string;
}
