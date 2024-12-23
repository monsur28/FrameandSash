import React, { useState } from "react";
import { Bell, ChevronDownIcon, Mail, Search } from "lucide-react"; // Ensure icons are correctly imported
import { useLocation } from "react-router-dom";

export default function ProductHeader() {
  const location = useLocation();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
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
    default:
      title = "Dashboard";
      break;
  }

  return (
    <header className="px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-10 lg:gap-48">
          {/* Title */}
          <h1 className="text-3xl font-semibold text-[#0A9B9B] mb-4 sm:mb-0 ml-10">
            {title}
          </h1>
          {/* Search Bar */}
          <div className="relative max-w-xl w-full sm:mx-12 mb-4 sm:mb-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Product Here...."
              className="w-52 lg:w-full pl-12 pr-4 py-2.5 rounded-full bg-white/80 border-0 focus:ring-2 focus:ring-[#0A9B9B] outline-none"
            />
          </div>
        </div>

        {/* Right Section (Hidden on mobile) */}
        <div className="hidden sm:flex items-center space-x-6">
          {/* Notification Bell */}
          <button className="relative hover:opacity-80">
            <Bell className="w-6 h-6 text-gray-700" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
          </button>

          {/* Message Icon */}
          <button className="hover:opacity-80">
            <Mail className="w-6 h-6 text-gray-700" />
          </button>

          {/* Language Selector */}
          <div className="relative z-10">
            <button
              className="flex items-center space-x-2 bg-white rounded-full px-4 py-1.5 hover:bg-gray-50"
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            >
              <span className="text-sm font-medium">English</span>
              <img
                src="https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg"
                alt="US Flag"
                width={20}
                height={20}
                className="rounded-sm "
              />
              <ChevronDownIcon className="w-4 h-4 text-gray-600" />
            </button>

            {isLanguageOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                <button className="flex items-center space-x-3 px-4 py-2 w-full hover:bg-gray-50">
                  <img
                    src="https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg"
                    alt="US Flag"
                    width={20}
                    height={20}
                    className="rounded-sm"
                  />
                  <span>English</span>
                </button>
                {/* Add more language options here */}
              </div>
            )}
          </div>

          {/* Profile Picture */}
          <button className="w-10 h-10 rounded-full overflow-hidden hover:opacity-90">
            <img
              src="https://images.squarespace-cdn.com/content/v1/53b599ebe4b08a2784696956/1451882872681-B0PM3YN9RPLLA36MKVI8/image-asset.jpeg?format=500w"
              alt="Profile picture"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
