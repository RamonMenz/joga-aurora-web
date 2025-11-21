import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/auth/useAuth";
import { ROUTES } from "@/util/constants";

export const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};
