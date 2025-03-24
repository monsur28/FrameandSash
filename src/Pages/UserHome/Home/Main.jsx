import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../../Shared/Navbar";
import Footer from "../../../Shared/Footer";

const Main = () => {
  const location = useLocation(); // Get the current route
  const hideFooter = location.pathname === "/login"; // Check if we are on the login page

  return (
    <div>
      <Navbar />
      <Outlet />
      {!hideFooter && <Footer />} {/* Hide Footer on Login Page */}
    </div>
  );
};

export default Main;
