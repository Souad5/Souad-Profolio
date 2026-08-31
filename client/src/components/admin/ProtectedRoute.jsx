import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import { LoadingState } from "./States.jsx";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingState label="Checking session…" />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
}
