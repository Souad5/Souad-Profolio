import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { login as apiLogin, fetchMe } from "../api/endpoints.js";
import { setAuthToken, setUnauthorizedHandler } from "../api/client.js";

const AuthContext = createContext(null);
const STORAGE_KEY = "portfolio_admin_token";

// Query-key roots that hold admin-only data; dropped on logout so nothing
// from the session lingers in memory.
const ADMIN_KEYS = ["admin", "admin-stats", "admin-messages", "stats", "messages", "settings", "skillCats"];

// Reads the JWT's `exp` claim (no verification — the server does that) so an
// already-expired token is discarded on load instead of flashing the panel.
function isExpired(token) {
  try {
    const { exp } = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof exp === "number" && exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

// Initial session from storage; an expired token is dropped and reported so
// the login page can say why the user has to sign in again.
function readStoredSession() {
  const t = localStorage.getItem(STORAGE_KEY);
  if (t && isExpired(t)) {
    localStorage.removeItem(STORAGE_KEY);
    return { token: null, reason: "expired" };
  }
  return { token: t, reason: null };
}

export function AuthProvider({ children }) {
  const qc = useQueryClient();
  const [initial] = useState(readStoredSession);
  const [token, setToken] = useState(initial.token);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!initial.token);
  // Why the last session ended ("expired" | "forbidden" | null) — shown on the login page.
  const [endReason, setEndReason] = useState(initial.reason);

  const clearSession = useCallback(
    (reason = null) => {
      localStorage.removeItem(STORAGE_KEY);
      setAuthToken(null);
      setToken(null);
      setUser(null);
      setLoading(false);
      setEndReason(reason);
      for (const key of ADMIN_KEYS) qc.removeQueries({ queryKey: [key] });
    },
    [qc]
  );

  const login = useCallback(async ({ email, password }) => {
    const res = await apiLogin({ email, password });
    localStorage.setItem(STORAGE_KEY, res.data.token);
    setAuthToken(res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    setEndReason(null);
    return res.data.user;
  }, []);

  const logout = useCallback(() => clearSession(null), [clearSession]);

  // Any authenticated request that returns 401/403 ends the session; the
  // route guard then redirects to the login page with an explanation.
  useEffect(() => {
    setUnauthorizedHandler((status) => clearSession(status === 403 ? "forbidden" : "expired"));
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  useEffect(() => {
    if (!token) return;
    setAuthToken(token);
    fetchMe()
      .then((res) => setUser(res.data))
      // 401/403 already ended the session via the unauthorized handler. Any
      // other failure (offline, 429, 5xx) is not a verdict on the token, so
      // keep the session and let the pages show their own error states.
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, clearSession]);

  const value = useMemo(
    () => ({ user, token, loading, login, logout, endReason, isAuthenticated: !!token }),
    [user, token, loading, login, logout, endReason]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
