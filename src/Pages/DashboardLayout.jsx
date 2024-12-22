import {
  Home,
  Package,
  Users,
  UserPlus,
  Tag,
  Layers,
  Upload,
  Globe,
  FileText,
  MessageSquare,
  Percent,
  Settings,
  Menu,
  X,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { Outlet } from "react-router-dom"; // Import Outlet for nested routing
import { useState } from "react";

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
      link: "/products",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Manufacturer",
      link: "/dashboard/manufacturer",
    },
    {
      icon: <UserPlus className="w-5 h-5" />,
      label: "Re-Seller",
      link: "/reseller",
    },
    { icon: <Tag className="w-5 h-5" />, label: "Offer", link: "/offers" },
    {
      icon: <Layers className="w-5 h-5" />,
      label: "Packages",
      link: "/packages",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Role Management",
      link: "/roles",
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 mt-10">
      {/* Sidebar Toggle for Mobile */}
      <button
        className="lg:hidden p-2 bg-teal-500 text-white fixed top-4 left-4 z-20 rounded-md"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed z-10 inset-y-0 left-0 w-64 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out bg-white shadow-lg`}
      >
        <Sidebar menuItems={menuItems} />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <Header />
        <main className="p-4 md:p-6">
          <Outlet /> {/* Dynamic content rendered here */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
