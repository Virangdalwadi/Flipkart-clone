import api from "./axiosInstance";

export const getAdminUsers = async (params = {}, { signal } = {}) => {
  const response = await api.get("/admin/users", { params, signal });
  return response.data;
};

export const getAdminUserById = async (id, { signal } = {}) => {
  const response = await api.get(`/admin/users/${id}`, { signal });
  return response.data.user;
};

export const updateAdminUserStatus = async (id, isActive) => {
  const response = await api.patch(`/admin/users/${id}/status`, { isActive });
  return response.data.user;
};
