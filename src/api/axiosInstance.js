import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api", // your backend base URL
  withCredentials: true, // REQUIRED so the refreshtoken httpOnly cookie is sent/received
});

const backendAvailabilityListeners = new Set();
let backendAvailability = { status: "idle" };

const publishBackendAvailability = (status) => {
  backendAvailability = { status };
  backendAvailabilityListeners.forEach((listener) =>
    listener(backendAvailability),
  );
};

export const subscribeToBackendAvailability = (listener) => {
  backendAvailabilityListeners.add(listener);
  listener(backendAvailability);
  return () => backendAvailabilityListeners.delete(listener);
};

let getAccessToken = () => null;
let setAccessToken = () => {};
let clearAuthState = () => {};

export const registerAuthHandlers = (getter, setter, clearState) => {
  getAccessToken = getter;
  setAccessToken = setter;
  clearAuthState = clearState;
};

api.interceptors.request.use((config) => {
  if (config._trackBackendAvailability) {
    publishBackendAvailability("checking");
  }
  return config;
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => {
    if (res.config._trackBackendAvailability) {
      publishBackendAvailability(res.status >= 500 ? "error" : "ready");
    }
    return res;
  },
  async (error) => {
    const original = error.config;
    if (original?._trackBackendAvailability) {
      publishBackendAvailability(
        error.response && error.response.status < 500 ? "ready" : "error",
      );
    }

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
  },
);

export default api;
