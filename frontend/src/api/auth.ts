import axiosInstance from "./axios";

export const loginApi = async (email: string, password: string) => {
  const response = await axiosInstance.post("/api/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const registerApi = async (data: {
  full_name: string;
  email: string;
  nim_nip?: string;
  password: string;
  password_confirmation: string;
}) => {
  const response = await axiosInstance.post("/api/auth/register", data);

  return response.data;
};

export const logoutApi = async () => {
  const response = await axiosInstance.post("/api/auth/logout");

  return response.data;
};

export const getMeApi = async () => {
  const response = await axiosInstance.get("/api/auth/me");

  return response.data;
};