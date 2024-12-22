/* eslint-disable react/prop-types */
import { useLocation } from "react-router-dom";

const Sidebar = ({ menuItems }) => {
  const location = useLocation(); // Get current location

  const isActive = (path) => {
    return location.pathname === path ? "bg-teal-100 text-teal-600" : "";
  };

  return (
    <div className="space-y-4 p-4 bg-[#009daa]">
      {/* Logo Section */}
      <div className="mb-8">
        <img
          src="https://i.ibb.co/P4dg89X/db.jpg"
          alt="Logo"
          className="mb-4 w-full h-auto rounded-lg"
        />
      </div>
      {menuItems.map((item) => (
        <div key={item.label}>
          <a
            href={item.link}
            className={`flex items-center p-2 rounded-lg ${isActive(
              item.link
            )} hover:bg-teal-50`}
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </a>
          {/* Handle subItems for dropdown-like behavior */}
          {item.subItems && (
            <div className="ml-4 space-y-2">
              {item.subItems.map((subItem) => (
                <a
                  key={subItem.label}
                  href={subItem.link}
                  className={`flex items-center p-2 rounded-lg ${isActive(
                    subItem.link
                  )} hover:bg-teal-50`}
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
