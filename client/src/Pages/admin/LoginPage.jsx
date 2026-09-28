import { useEffect, useState } from "react";
import { Navigate, Link, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import { AppButton } from "../../components/ui/app-button.jsx";
import { AppInput } from "../../components/ui/app-input.jsx";
import { usePreferences } from "../../hooks/usePreferences.js";
import { cn } from "../../lib/utils.js";

export default function LoginPage() {
  const { login, isAuthenticated, endReason } = useAuth();
  // Same theme scoping as AdminLayout: the admin's own theme on this subtree,
  // and the early-paint placeholder attributes removed from <html> (left in
  // place they mixed with the public theme — light card, light text).
  const { resolvedTheme } = usePreferences();
  useEffect(() => {
    document.documentElement.removeAttribute("data-admin-theme");
    document.documentElement.removeAttribute("data-admin-font-scale");
  }, []);
  const location = useLocation();
  // Only same-app admin paths are honoured as a return target.
  const from = typeof location.state?.from === "string" && location.state.from.startsWith("/admin")
    ? location.state.from
    : "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to={from} replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login({ email, password });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      data-admin-theme={resolvedTheme}
      className={cn(
        "flex min-h-screen items-center justify-center bg-base-200 p-4 text-foreground",
        resolvedTheme === "dark" && "dark"
      )}
    >
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl justify-center">Admin Login</h1>
          <p className="text-center text-sm opacity-70 mb-2">Portfolio Content Management System</p>
          {endReason && !error && (
            <div role="status" className="alert alert-warning py-2 text-sm">
              {endReason === "forbidden"
                ? "Your account doesn't have admin access."
                : "Your session expired. Please sign in again."}
            </div>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
            <AppInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
            <AppInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            {error && <div role="alert" className="alert alert-error py-2 text-sm">{error}</div>}
            <AppButton type="submit" className="w-full" loading={loading}>
              Sign In
            </AppButton>
          </form>
          <Link to="/" className="link link-primary text-sm text-center pt-2">← Back to portfolio</Link>
        </div>
      </div>
    </div>
  );
}
