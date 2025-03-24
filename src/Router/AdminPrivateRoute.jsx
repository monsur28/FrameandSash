import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "../Hooks/UseAuth";
import Loader from "../Shared/Loader";

const AdminPrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    ); // Prevent redirect before auth state loads
  }

  if (user && (user?.role === "+admin$" || user?.role === "manufacturer")) {
    return children;
  }

  return <Navigate to="/" />;
};

AdminPrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminPrivateRoute;
