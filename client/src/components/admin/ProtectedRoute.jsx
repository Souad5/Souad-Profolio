import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import { LoadingState } from "./States.jsx";

// Guards every /admin route. Unauthenticated visitors (including direct URL
// access and sessions that just expired) are sent to the login page, which
// returns them to the page they asked for after signing in. The server
// enforces the same rule on every /api/admin request (401/403).
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingState label="Checking session…" />;
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return children;
}
