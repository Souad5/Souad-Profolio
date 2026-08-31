import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { login as apiLogin, fetchMe } from "../api/endpoints.js";
import { setAuthToken } from "../api/client.js";

const AuthContext = createContext(null);
const STORAGE_KEY = "portfolio_admin_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  const login = useCallback(async ({ email, password }) => {
    const res = await apiLogin({ email, password });
    localStorage.setItem(STORAGE_KEY, res.data.token);
    setAuthToken(res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthToken(null);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      fetchMe()
        .then((res) => setUser(res.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    }
  }, [token, logout]);

  const value = useMemo(
    () => ({ user, token, loading, login, logout, isAuthenticated: !!token }),
    [user, token, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
