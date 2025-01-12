import { Outlet } from "react-router-dom";
import {
  FileText,
  // Globe,
  Home,
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
import { UseSidebar } from "../ContextProvider/SidebarContext";
import { SweetAlertProvider } from "../ContextProvider/SweetAlertContext";
import { useLanguage } from "../ContextProvider/LanguageContext";

const DashboardLayout = () => {
  const { isOpen, toggleSidebar } = UseSidebar();
  const { t } = useLanguage();

  const menuItems = [
    {
      icon: <Home className="w-5 h-5" />,
      label: `${t("dashboard")}`,
      link: "/dashboard",
    },
    {
      icon: <Package className="w-5 h-5" />,
      label: `${t("products")}`,
      link: "/dashboard/products",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: `${t("manufacturer")}`,
      link: "/dashboard/manufacturer",
    },
    {
      icon: <UserPlus className="w-5 h-5" />,
      label: `${t("reseller")}`,
      link: "/dashboard/reseller",
    },
    {
      icon: <Tag className="w-5 h-5" />,
      label: `${t("offers")}`,
      link: "/dashboard/offers",
    },
    {
      icon: <Layers className="w-5 h-5" />,
      label: `${t("packages")}`,
      link: "/dashboard/packages",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: `${t("rolemanagement")}`,
      link: "/dashboard/rolemanagement",
    },
    {
      icon: <Upload className="w-5 h-5" />,
      label: `${t("imageupload")}`,
      link: "/dashboard/imageupload",
    },
    // {
    //   icon: <Globe className="w-5 h-5" />,
    //   label: "Languages",
    //   link: "/languages",
    // },
    {
      icon: <FileText className="w-5 h-5" />,
      label: `${t("blog")}`,
      link: "/dashboard/blog",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: `${t("contact")}`,
      link: "/dashboard/contact",
    },
    {
      icon: <Percent className="w-5 h-5" />,
      label: `${t("discount")}`,
      link: "/dashboard/discount",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: `${t("settings")}`,
      link: "/dashboard/settings",
      subItems: [
        { label: `${t("siteinfo")}`, link: "/dashboard/settings/siteinfo" },
        { label: `${t("siteimage")}`, link: "/dashboard/settings/siteimage" },
        // {
        //   label: "Push Notification",
        //   link: "/dashboard/settings/pushnotification",
        // },
      ],
    },
  ];

  return (
    <SweetAlertProvider>
      <div className="flex flex-col lg:flex-row w-full bg-gradient-to-r from-custom-light to-custom-dark">
        {/* Sidebar */}
        <div
          className={`fixed z-20 inset-y-0 left-0 w-56 bg-primary transform ${
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
          <main className="p-4 md:p-6 flex-grow h-screen overflow-y-auto">
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
    </SweetAlertProvider>
  );
};

export default DashboardLayout;
