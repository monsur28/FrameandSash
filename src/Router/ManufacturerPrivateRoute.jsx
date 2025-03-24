import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../Hooks/UseAuth";

const ManufacturerPrivateRoute = () => {
  const { user, loading } = useAuth(); // Get user info from auth state

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking auth
  }

  if (!user) {
    return <Navigate to="/login" replace />; // Redirect if not logged in
  }

  if (user.role !== "manufacturer") {
    return <Navigate to="/adminDashboard" replace />; // Redirect if not a manufacturer
  }

  return <Outlet />; // Render manufacturer routes
};

export default ManufacturerPrivateRoute;
