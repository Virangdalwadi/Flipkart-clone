// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api, { registerAuthHandlers } from "../api/axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Keep the interceptor's handlers in sync with the latest token
  useEffect(() => {
    registerAuthHandlers(() => accessToken, setAccessToken);
  }, [accessToken]);

  // Try to silently restore session on app load using the refresh cookie
  // Runs ONCE on mount only
  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const res = await api.post("/auth/refreshtoken");
        setAccessToken(res.data.accesstoken);
        const meRes = await api.get("/auth/getme", {
          headers: { Authorization: `Bearer ${res.data.accesstoken}` },
        });
        setUser(meRes.data.user);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    tryRefresh();
  }, []); // empty deps — mount only

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setAccessToken(res.data.accesstoken);
    setUser(res.data.user);
  };

  const register = async (username, email, password) => {
    const res = await api.post("/auth/register", { username, email, password });
    setAccessToken(res.data.accesstoken);
    setUser(res.data.user);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
