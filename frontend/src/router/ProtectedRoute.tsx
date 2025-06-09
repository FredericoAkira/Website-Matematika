import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  isAllowed: boolean;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAllowed,
  redirectPath = "/",
}) => {
  return isAllowed ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;
