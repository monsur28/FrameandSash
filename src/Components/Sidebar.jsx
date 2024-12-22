/* eslint-disable react/prop-types */
import { useLocation } from "react-router-dom";

const Sidebar = ({ menuItems }) => {
  const location = useLocation(); // Get current location

  const isActive = (path) => {
    return location.pathname === path ? "bg-teal-200 text-teal-700" : "";
  };

  return (
    <div className="space-y-4 p-4 bg-[#009DAA] text-white min-h-screen lg:min-h-0">
      {/* Logo Section */}
      <div className="mb-8 text-center">
        <img
          src="https://i.ibb.co/P4dg89X/db.jpg"
          alt="Logo"
          className="mb-4 w-20 h-20 rounded-full mx-auto lg:w-full lg:h-auto"
        />
      </div>

      {/* Menu Items */}
      {menuItems.map((item) => (
        <div key={item.label} className="group">
          <a
            href={item.link}
            className={`flex items-center p-2 rounded-lg ${isActive(
              item.link
            )} hover:bg-teal-600 hover:text-white transition duration-200`}
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </a>

          {/* Subitems */}
          {item.subItems && (
            <div className="ml-6 space-y-2 mt-2">
              {item.subItems.map((subItem) => (
                <a
                  key={subItem.label}
                  href={subItem.link}
                  className={`flex items-center p-2 rounded-lg ${isActive(
                    subItem.link
                  )} hover:bg-teal-600 hover:text-white transition duration-200`}
                >
                  <span className="ml-3">{subItem.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
