/* eslint-disable react/prop-types */
import { useState } from "react"; // Import useState

const Sidebar = ({ menuItems }) => {
  const [activeItem, setActiveItem] = useState("Dashboard"); // Track active item

  const handleClick = (label) => {
    setActiveItem(label); // Set the clicked item as active
  };

  return (
    <div className="w-64 bg-[#009daa] text-white h-screen p-4">
      <div className="mb-8">
        <img
          src="https://i.ibb.co.com/P4dg89X/db.jpg"
          alt="Logo"
          className="mb-4"
        />
      </div>
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

const SidebarItem = ({ icon, label, subItems, isActive, onClick }) => (
  <div className="mb-2">
    <div
      onClick={onClick} // Trigger the click handler
      className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${
        isActive ? "bg-white text-[#009daa]" : "hover:bg-teal-600"
      }`}
    >
      {icon}
      <span className={`text-sm ${isActive ? "font-semibold" : ""}`}>
        {label}
      </span>
    </div>
    {subItems && (
      <div className="ml-8">
        {subItems.map((subItem, index) => (
          <div
            key={index}
            className="text-sm py-1 hover:text-teal-200 cursor-pointer"
          >
            {subItem}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default Sidebar;
