import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type ProtectedRouteProps = {
  roles?: string[];
};

export const ProtectedRoute = ({ roles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role.role_name)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};