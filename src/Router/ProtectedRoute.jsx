import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "../Hooks/UseAuth";
import { Loader } from "lucide-react";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    ); // Prevent redirect before auth state loads
  }

  if (user) {
    return children;
  }
  return <Navigate to="/register"></Navigate>;
};

PrivateRoute.propTypes = {
  children: PropTypes.object,
};

export default PrivateRoute;
