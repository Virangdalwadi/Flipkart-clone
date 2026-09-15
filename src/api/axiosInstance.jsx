// src/api/axiosInstance.jsx
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3044/api", // your backend base URL
  withCredentials: true, // REQUIRED so the refreshtoken httpOnly cookie is sent/received
});

let getAccessToken = () => null;
let setAccessToken = () => { };

export const registerAuthHandlers = (getter, setter) => {
  getAccessToken = getter;
  setAccessToken = setter;
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
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const res = await api.post("/auth/refreshtoken");
        setAccessToken(res.data.accesstoken);
        original.headers.Authorization = `Bearer ${res.data.accesstoken}`;
        return api(original);
      } catch {
        setAccessToken(null);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
