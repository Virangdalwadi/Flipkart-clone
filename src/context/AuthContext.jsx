// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useRef } from "react";
import api, { registerAuthHandlers } from "../api/axiosInstance";

const AuthContext = createContext();
const GUEST_CART_MERGE_KEY = "guestCartMergeHandled";

const readGuestCart = () => {
  try {
    const storedItems = JSON.parse(localStorage.getItem("Products") || "[]");
    return Array.isArray(storedItems) ? storedItems : [];
  } catch {
    return [];
  }
};

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const restorationStarted = useRef(false);

  // Keep the interceptor's handlers in sync with the latest token
  useEffect(() => {
    registerAuthHandlers(
      () => accessToken,
      setAccessToken,
      () => {
        setAccessToken(null);
        setUser(null);
      },
    );
  }, [accessToken]);

  useEffect(() => {
    if (!user || !accessToken || loading) return;

    const alreadyHandled = sessionStorage.getItem(GUEST_CART_MERGE_KEY) === "true";
    if (alreadyHandled) return;

    const guestCartItems = readGuestCart();
    if (!guestCartItems.length) {
      sessionStorage.setItem(GUEST_CART_MERGE_KEY, "true");
      return;
    }

    const mergeGuestCart = async () => {
      try {
        await api.post(
          "/cart/merge",
          {
            items: guestCartItems.map((item) => ({
              productId: item.id ?? item.productId ?? item.btn_id,
              quantity: Number(item.quantity) || 1,
            })),
          },
        );

        localStorage.removeItem("Products");
        sessionStorage.setItem(GUEST_CART_MERGE_KEY, "true");
        await api.get("/cart");
      } catch (error) {
        console.error("Guest cart merge failed:", error);
      }
    };

    mergeGuestCart();
  }, [user, accessToken, loading]);

  // Try to silently restore session on app load using the refresh cookie
  // Runs ONCE on mount only
  useEffect(() => {
    if (restorationStarted.current) return;
    restorationStarted.current = true;

    const tryRefresh = async () => {
      try {
        const res = await api.get("/auth/refresh-token");
        setAccessToken(res.data.accesstoken);
        const meRes = await api.get("/auth/get-me", {
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
    try {
      await api.get("/auth/logout");
    } catch {
    } finally {
      localStorage.removeItem("Products");
      sessionStorage.removeItem(GUEST_CART_MERGE_KEY);
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
