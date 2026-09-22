export const OPERATING_HOURS = {
  START: "07:00",
  END: "20:00",
};

export const ROLES = {
  PENGGUNA: "pengguna",
  PETUGAS: "petugas",
  ADMIN: "admin",
} as const;

export const RESERVATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
} as const;