import React, { useState } from "react";
import { Bell, ChevronDown, Mail, Menu, Search, X } from "lucide-react"; // Added Menu and X icons
import { useLocation } from "react-router-dom";

export default function ProductHeader() {
  const location = useLocation();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className="px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Title and Search Bar */}
        <div className="flex flex-row sm:flex-row sm:items-center gap-4 sm:gap-4 lg:gap-8 flex-grow">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#0A9B9B] mb-2 sm:mb-0 ml-12 lg:ml-8">
            {title}
          </h1>
          {/* Search Bar (Hidden on mobile) */}
          <div className="relative max-w-xl w-full md:w-2/3 mb-2 sm:mb-0 sm:block hidden">
            <Search className="absolute left-5 lg:left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Product Here...."
              className="w-4/3 lg:w-full md:w-2/3 pl-10 pr-4 py-2 rounded-full bg-white/80 border-0 focus:ring-2 focus:ring-[#0A9B9B] outline-none text-sm ml-0"
            />
          </div>
        </div>
        {/* Mobile Menu Button */}
        <div className="flex items-center  sm:hidden">
          <button className="relative hover:opacity-80 p-2">
            <Bell className="w-6 h-6 text-gray-700" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
          </button>

          {/* Message Icon */}
          <button className="hover:opacity-80 p-2">
            <Mail className="w-6 h-6 text-gray-700" />
          </button>
          <button className="w-10 h-10 rounded-full overflow-hidden sm:block md:hidden lg:hidden hover:opacity-90 flex-shrink-0">
            <img
              src="https://images.squarespace-cdn.com/content/v1/53b599ebe4b08a2784696956/1451882872681-B0PM3YN9RPLLA36MKVI8/image-asset.jpeg?format=500w"
              alt="Profile picture"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
        {/* Desktop Right Section */}
        <div className="hidden sm:flex items-center space-x-4 lg:space-x-6">
          <RightSectionContent />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden mt-4 space-y-4 flex flex-col gap-4 items-center justify-center">
          {/* Add Search bar in mobile menu if needed */}
          <div className="relative max-w-xl w-full mb-2 sm:mb-0">
            <Search className="absolute left-5 lg:left-24 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Product Here...."
              className=" w-16 lg:w-full md:w-2/3 pl-10 pr-4 py-2 rounded-full bg-white/80 border-0 focus:ring-2 focus:ring-[#0A9B9B] outline-none text-sm ml-0 lg:ml-20"
            />
          </div>
        </div>
      )}
    </header>
  );
}

function RightSectionContent() {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  return (
    <>
      {/* Notification Bell */}
      <button className="relative hover:opacity-80 p-2">
        <Bell className="w-6 h-6 text-gray-700" />
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
      </button>

      {/* Message Icon */}
      <button className="hover:opacity-80 p-2">
        <Mail className="w-6 h-6 text-gray-700" />
      </button>

      {/* Language Selector */}
      <div className="relative z-10">
        <button
          className="flex items-center space-x-2 bg-white rounded-full px-3 py-1.5 hover:bg-gray-50"
          onClick={() => setIsLanguageOpen(!isLanguageOpen)}
        >
          <span className="text-sm font-medium">English</span>
          <img
            src="https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg"
            alt="US Flag"
            width={20}
            height={20}
            className="rounded-sm"
          />
          <ChevronDown className="w-4 h-4 text-gray-600" />
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
      <button className="w-10 h-10 rounded-full overflow-hidden hover:opacity-90 flex-shrink-0">
        <img
          src="https://images.squarespace-cdn.com/content/v1/53b599ebe4b08a2784696956/1451882872681-B0PM3YN9RPLLA36MKVI8/image-asset.jpeg?format=500w"
          alt="Profile picture"
          className="w-full h-full object-cover"
        />
      </button>
    </>
  );
}
