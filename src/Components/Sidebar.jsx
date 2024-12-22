/* eslint-disable react/prop-types */
import { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ menuItems }) => {
  const [activeItem, setActiveItem] = useState("Dashboard"); // Track active item

  const handleClick = (label) => {
    setActiveItem(label); // Set the clicked item as active
  };

  return (
    <div className="w-64 bg-[#009daa] text-white h-screen p-4">
      {/* Logo Section */}
      <div className="mb-8">
        <img
          src="https://i.ibb.co/P4dg89X/db.jpg"
          alt="Logo"
          className="mb-4 w-full h-auto rounded-lg"
        />
      </div>

      {/* Navigation Items */}
      <nav>
        {menuItems.map((item, index) => (
          <SidebarItem
            key={index}
            {...item}
            isActive={activeItem === item.label} // Pass active state
            onClick={() => handleClick(item.label)} // Handle item click
          />
        ))}
      </nav>
    </div>
  );
};

const SidebarItem = ({ icon, label, link, subItems, isActive, onClick }) => (
  <div className="mb-2">
    {/* Main Item */}
    <NavLink
      to={link}
      onClick={onClick} // Trigger the click handler
      className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
        isActive ? "bg-white text-[#009daa]" : "hover:bg-teal-600"
      }`}
    >
      {icon}
      <span className={`text-sm ${isActive ? "font-semibold" : ""}`}>
        {label}
      </span>
    </NavLink>

    {/* Sub-Items */}
    {subItems && (
      <div className="ml-8 mt-1">
        {subItems.map((subItem, index) => (
          <NavLink
            key={index}
            to={subItem.link}
            className="block text-sm py-1 text-white hover:text-teal-200 transition-colors duration-200"
          >
            {subItem.label}
          </NavLink>
        ))}
      </div>
    )}
  </div>
);

export default Sidebar;
