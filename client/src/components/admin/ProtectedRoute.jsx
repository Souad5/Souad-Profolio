import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import { LoadingState } from "./States.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingState label="Checking session…" />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return children;
}
