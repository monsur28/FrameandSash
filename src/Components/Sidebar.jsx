import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ menuItems }) => {
  const location = useLocation(); // Get current location

  const isActive = (path) => {
    return location.pathname === path ? "bg-teal-200 text-teal-700" : "";
  };

  return (
    <div className="space-y-4 p-4 bg-primary text-white min-h-screen lg:min-h-0 overflow-y-auto">
      {/* Logo Section */}
      <div className="mb-8 text-center">
        <img
          src="https://i.ibb.co.com/ZJ9hDdn/Brand-Logo.webp"
          alt="Logo"
          className="mb-4  lg:w-full lg:h-auto mx-auto"
        />
      </div>

      {/* Menu Items */}
      {menuItems.map((item) => (
        <div key={item.label} className="group">
          <Link
            to={item.link}
            className={`flex items-center p-2 rounded-lg ${isActive(
              item.link
            )} hover:bg-teal-600 hover:text-white transition duration-200`}
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </Link>

          {/* Subitems */}
          {item.subItems && (
            <div className="ml-6 space-y-2 mt-2 mr-14">
              {item.subItems.map((subItem) => (
                <a
                  key={subItem.label}
                  href={subItem.link}
                  className={`flex items-center rounded-lg w-full  ${isActive(
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
