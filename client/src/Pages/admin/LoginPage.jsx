import { useState } from "react";
import { Navigate, Link } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import { AppButton } from "../../components/ui/app-button.jsx";
import { AppInput } from "../../components/ui/app-input.jsx";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

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
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl justify-center">Admin Login</h1>
          <p className="text-center text-sm opacity-70 mb-2">Portfolio Content Management System</p>
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
            {error && <div className="alert alert-error py-2 text-sm">{error}</div>}
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
