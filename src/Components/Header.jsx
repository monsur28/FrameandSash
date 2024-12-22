import { useLocation } from "react-router-dom"; // Import useLocation hook
import { Bell, Mail, Search } from "lucide-react";

const Header = () => {
  const location = useLocation(); // Get the current route path

  // Determine the dynamic title based on the current route
  let title;
  switch (location.pathname) {
    case "/manufacturer":
      title = "Manufacturer Dashboard";
      break;
    case "/reseller":
      title = "Reseller Dashboard";
      break;
    default:
      title = "Dashboard";
      break;
  }

  return (
    <div className="flex flex-wrap justify-between items-center p-4 bg-gray-50 shadow-md">
      {/* Dynamic Title */}
      <h1 className="text-xl lg:text-2xl font-semibold">{title}</h1>

      {/* Search Bar and Actions */}
      <div className="flex items-center justify-between flex-grow lg:flex-grow-0 space-x-4 mt-4 lg:mt-0 w-full lg:w-auto">
        {/* Search Bar */}
        <SearchBar />
        {/* Header Actions */}
        <HeaderActions />
      </div>
    </div>
  );
};

const SearchBar = () => (
  <div className="relative flex-grow lg:flex-grow-0 max-w-full lg:max-w-sm">
    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
    <input
      type="text"
      placeholder="Search Products"
      className="pl-10 pr-3 py-2 bg-gray-200 rounded-lg w-full lg:w-96 focus:outline-none focus:ring focus:ring-teal-300"
    />
  </div>
);

const HeaderActions = () => (
  <div className="flex items-center space-x-4 justify-end flex-wrap">
    {/* Notification Icon */}
    <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />

    {/* Mail Icon */}
    <Mail className="w-5 h-5 text-gray-600 cursor-pointer" />

    {/* Language Selector */}
    <div className="flex items-center space-x-2">
      <span className="text-sm">English</span>
      <img
        src="https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg"
        alt="US Flag"
        className="w-6"
      />
    </div>

    {/* Profile Image */}
    <img
      src="https://cdnstorage.sendbig.com/unreal/female.webp"
      alt="Profile"
      className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 lg:border-4 border-[#37B34A]"
    />
  </div>
);

export default Header;
