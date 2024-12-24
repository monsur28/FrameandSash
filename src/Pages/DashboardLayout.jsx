import { Outlet } from "react-router-dom";
import {
  FileText,
  Globe,
  // Home,
  Layers,
  MessageSquare,
  Package,
  Percent,
  Settings,
  Tag,
  Upload,
  UserPlus,
  Users,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { UseSidebar } from "../Shared/SidebarContext";

const DashboardLayout = () => {
  const { isOpen, toggleSidebar } = UseSidebar();

  const menuItems = [
    // {
    //   icon: <Home className="w-5 h-5" />,
    //   label: "Dashboard",
    //   link: "/dashboard",
    // },
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
    <div className="flex flex-col lg:flex-row w-full bg-gradient-to-r from-[#FFFFFF] to-[#009DAA7D]">
      {/* Sidebar */}
      <div
        className={`fixed z-20 inset-y-0 left-0 w-56 bg-[#009DAA] transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        <Sidebar menuItems={menuItems} />
      </div>

      {/* Backdrop for Mobile Sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-56 flex flex-col">
        <Header />
        <main className="p-4 md:p-6 flex-grow">
          <Outlet />
        </main>
      </div>

      {/* Hide Scrollbars */}
      <style>
        {`
          /* Hide scrollbar for webkit-based browsers */
          .overflow-y-auto::-webkit-scrollbar {
            display: none;
          }
          /* Hide scrollbar for Firefox */
          .overflow-y-auto {
            scrollbar-width: none; /* Firefox */
          }
          /* Hide scrollbar for IE and Edge */
          .overflow-y-auto {
            -ms-overflow-style: none; /* Internet Explorer 10+ */
          }
        `}
      </style>
    </div>
  );
};

export default DashboardLayout;
