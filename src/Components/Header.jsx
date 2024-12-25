import { Bell, Mail, Search, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { UseSidebar } from "../Shared/SidebarContext";

export default function Header() {
  const location = useLocation();
  const { toggleSidebar } = UseSidebar(); // Use the sidebar toggle function

  let title;
  switch (location.pathname) {
    case "/dashboard/manufacturer":
      title = "Manufacturer";
      break;
    case "/dashboard/products":
      title = "Products";
      break;
    case "/dashboard/reseller":
      title = "Reseller";
      break;
    case "/dashboard/rolemanagement":
      title = "Role Management";
      break;
    case "/dashboard/offers":
      title = "Offers";
      break;
    default:
      title = "Dashboard";
      break;
  }

  return (
    <header
      className="px-4 sm:px-6 py-4 shadow-sm"
      aria-labelledby="header-title"
    >
      <div className="flex items-center justify-between lg:gap-0">
        {/* Toggle Button for Sidebar (Mobile) */}
        <button
          onClick={toggleSidebar}
          className="block lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0A9B9B]"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Title (Hidden on Mobile, visible on larger screens) */}
        <h1
          id="header-title"
          className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-[#0A9B9B] truncate mr-26 lg:ml-0 hidden sm:block"
          aria-label={title}
        >
          {title}
        </h1>

        {/* Search Bar (Mobile Version) */}
        <div className="block  flex-grow max-w-3xl mx-4 lg:mx-8 xl:mx-16">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search Product Here...."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border-0 focus:ring-2 focus:ring-[#0A9B9B] outline-none text-sm"
              aria-label="Search Products"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
          <button
            className="relative hover:opacity-80 p-2"
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6 text-gray-700" />
            <span
              className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"
              aria-hidden="true"
            />
          </button>

          <button className="hover:opacity-80 p-2" aria-label="Messages">
            <Mail className="w-6 h-6 text-gray-700" />
          </button>

          {/* Language Selector (hidden on mobile) */}
          <div className="relative hidden sm:block">
            <button
              className="flex items-center justify-center space-x-2 bg-white rounded-full px-4 py-2 hover:bg-gray-50"
              aria-label="Language Selector"
            >
              <span className="text-sm font-medium">English</span>
              <img
                src="https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg"
                alt="US Flag"
                className="w-5 h-5 rounded-sm"
                aria-hidden="true"
              />
            </button>
          </div>

          <button
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden hover:opacity-90 flex-shrink-0"
            aria-label="Profile"
          >
            <img
              src="https://images.squarespace-cdn.com/content/v1/53b599ebe4b08a2784696956/1451882872681-B0PM3YN9RPLLA36MKVI8/image-asset.jpeg?format=500w"
              alt="Profile picture"
              className="w-full h-full object-cover"
              role="img"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
