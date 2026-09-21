// src/api/axiosInstance.jsx
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3044/api", // your backend base URL
  withCredentials: true, // REQUIRED so the refreshtoken httpOnly cookie is sent/received
});

let getAccessToken = () => null;
let setAccessToken = () => { };
let clearAuthState = () => { };

export const registerAuthHandlers = (getter, setter, clearState) => {
  getAccessToken = getter;
  setAccessToken = setter;
  clearAuthState = clearState;
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes("/auth/refresh-token")
    ) {
      original._retry = true;
      try {
        const res = await api.get("/auth/refresh-token");
        setAccessToken(res.data.accesstoken);
        original.headers.Authorization = `Bearer ${res.data.accesstoken}`;
        return api(original);
      } catch {
        clearAuthState();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
