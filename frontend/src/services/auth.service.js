import apiClient from "./api/apiClient";

export const login = async (credentials) => {
  const response = await apiClient.post("/auth/login", credentials);
  return response.data;
};

export const register = async (credentials) => {
  const response = await apiClient.post("/auth/register", credentials);
  return response.data;
};
