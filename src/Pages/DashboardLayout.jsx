import { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { Outlet } from "react-router-dom";
import {
  FileText,
  Globe,
  Home,
  Layers,
  Menu,
  MessageSquare,
  Package,
  Percent,
  Settings,
  Tag,
  Upload,
  UserPlus,
  Users,
  X,
} from "lucide-react";

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      icon: <Home className="w-5 h-5" />,
      label: "Dashboard",
      link: "/dashboard",
    },
    {
      icon: <Package className="w-5 h-5" />,
      label: "Products",
      link: "/dashboard/products",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Manufacturer",
      link: "/dashboard/manufacturer",
    },
    {
      icon: <UserPlus className="w-5 h-5" />,
      label: "Re-Seller",
      link: "/dashboard/reseller",
    },
    { icon: <Tag className="w-5 h-5" />, label: "Offer", link: "/offers" },
    {
      icon: <Layers className="w-5 h-5" />,
      label: "Packages",
      link: "/dashboard/packages",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Role Management",
      link: "/dashboard/rolemanagement",
    },
    {
      icon: <Upload className="w-5 h-5" />,
      label: "Image Upload",
      link: "/upload",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: "Languages",
      link: "/languages",
    },
    { icon: <FileText className="w-5 h-5" />, label: "Blogs", link: "/blogs" },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Contact",
      link: "/contact",
    },
    {
      icon: <Percent className="w-5 h-5" />,
      label: "Discount",
      link: "/discount",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      link: "/settings",
      subItems: [
        { label: "Site Info", link: "/settings/site-info" },
        { label: "Site Image", link: "/settings/site-image" },
        { label: "SEO", link: "/settings/seo" },
        { label: "Push Notification", link: "/settings/push-notification" },
      ],
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row w-full md:w-full lg:w-full bg-gradient-to-r from-[#FFFFFF] to-[#009DAA7D]">
      {/* Sidebar Toggle for Mobile */}
      <button
        className="lg:hidden p-2 text-[#009DAA] fixed top-4 left-4 z-20 rounded-md"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Backdrop for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-20 inset-y-0 left-0 w-48 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out overflow-y-auto`}
        style={{ scrollbarWidth: "none" }} // For Firefox to hide the scrollbar
      >
        <Sidebar menuItems={menuItems} />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-44 flex flex-col">
        <Header />
        <main className="p-4 md:p-6 flex-grow">
          <Outlet />
        </main>
      </div>

      <style>
        {`
          /* Hide scrollbar for Webkit browsers (Chrome, Safari) */
          .overflow-y-auto::-webkit-scrollbar {
            display: none;
          }

          /* Hide scrollbar for Firefox */
          .overflow-y-auto {
            scrollbar-width: none;
          }
        `}
      </style>
    </div>
  );
};

export default DashboardLayout;
