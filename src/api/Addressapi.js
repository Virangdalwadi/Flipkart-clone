import api from "./axiosInstance.js";

export const createAddress = (data) => api.post("/addresses", data);

export const getAddresses = () => api.get("/addresses");

export const getAddressById = (id) => api.get(`/addresses/${id}`);

export const updateAddress = (id, data) => api.put(`/addresses/${id}`, data);

export const deleteAddress = (id) => api.delete(`/addresses/${id}`);
