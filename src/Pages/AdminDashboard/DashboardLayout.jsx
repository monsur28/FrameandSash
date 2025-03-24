import { Outlet } from "react-router-dom";
import {
  FileText,
  Home,
  Layers,
  ListOrdered,
  MessageSquare,
  Package,
  Percent,
  Settings,
  Tag,
  Upload,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import Sidebar from "../../Components/Sidebar";
import { UseSidebar } from "../../ContextProvider/SidebarContext";
import Header from "../../Components/Header";
import { SweetAlertProvider } from "../../ContextProvider/SweetAlertContext";
import useAuth from "../../Hooks/UseAuth";
import { MdOutlinePayment } from "react-icons/md";
import { useLanguage } from "../../ContextProvider/LanguageContext";
import { FaShippingFast } from "react-icons/fa";

const DashboardLayout = () => {
  const { isOpen, toggleSidebar } = UseSidebar();
  const { t } = useLanguage();
  const { user } = useAuth();

  // Define menuItems based on user role
  let menuItems = [];

  if (user.role === "+admin$") {
    menuItems = [
      {
        icon: <Home className="w-5 h-5" />,
        label: `${t("dashboard")}`,
        link: "/adminDashboard/dashboard",
      },
      {
        icon: <Package className="w-5 h-5" />,
        label: `${t("products")}`,
        link: "/adminDashboard/products",
      },
      {
        icon: <Users className="w-5 h-5" />,
        label: `${t("manufacturer")}`,
        link: "/adminDashboard/manufacturer",
      },
      {
        icon: <UserPlus className="w-5 h-5" />,
        label: `${t("reseller")}`,
        link: "/adminDashboard/reseller",
      },
      {
        icon: <Tag className="w-5 h-5" />,
        label: `${t("offers")}`,
        link: "/adminDashboard/offers",
      },
      {
        icon: <Layers className="w-5 h-5" />,
        label: `${t("packages")}`,
        link: "/adminDashboard/packages",
      },
      {
        icon: <ListOrdered className="w-5 h-5" />,
        label: `${t("order")}`,
        link: "/adminDashboard/order",
      },
      {
        icon: <MdOutlinePayment className="w-5 h-5" />,
        label: `${t("Payment History")}`,
        link: "/adminDashboard/payment-history",
      },
      {
        icon: <User className="w-5 h-5" />,
        label: `${t("User Management")}`,
        link: "/adminDashboard/users",
      },
      {
        icon: <Upload className="w-5 h-5" />,
        label: `${t("imageupload")}`,
        link: "/adminDashboard/imageupload",
      },
      {
        icon: <FileText className="w-5 h-5" />,
        label: `${t("blogs")}`,
        link: "/adminDashboard/blogs",
      },
      {
        icon: <MessageSquare className="w-5 h-5" />,
        label: `${t("contact")}`,
        link: "/adminDashboard/contact",
      },
      {
        icon: <Percent className="w-5 h-5" />,
        label: `${t("discount")}`,
        link: "/adminDashboard/discount",
      },
      {
        icon: <FaShippingFast className="w-5 h-5" />,
        label: `${t("Delivery System")}`,
        link: "/adminDashboard/delivery-system",
      },
      {
        icon: <Settings className="w-5 h-5" />,
        label: `${t("settings")}`,
        link: "/adminDashboard/settings",
        subItems: [
          {
            label: `${t("siteinfo")}`,
            link: "/adminDashboard/settings/siteinfo",
          },
          {
            label: `${t("siteimage")}`,
            link: "/adminDashboard/settings/siteimage",
          },
        ],
      },
    ];
  } else {
    menuItems = [
      {
        icon: <Home className="w-5 h-5" />,
        label: `${t("dashboard")}`,
        link: "/adminDashboard/dashboard",
      },
      {
        icon: <Package className="w-5 h-5" />,
        label: `${t("products")}`,
        link: "/adminDashboard/products",
      },
      {
        icon: <ListOrdered className="w-5 h-5" />,
        label: `${t("orders")}`,
        link: "/adminDashboard/orders",
      },
      {
        icon: <MdOutlinePayment className="w-5 h-5" />,
        label: `${t("Payment History")}`,
        link: "/adminDashboard/payment-history",
      },
      // {
      //   icon: <Users className="w-5 h-5" />,
      //   label: `${t("manufacturer")}`,
      //   link: "/adminDashboard/manufacturer",
      // },
      // {
      //   icon: <UserPlus className="w-5 h-5" />,
      //   label: `${t("reseller")}`,
      //   link: "/adminDashboard/reseller",
      // },
      // {
      //   icon: <Tag className="w-5 h-5" />,
      //   label: `${t("offers")}`,
      //   link: "/adminDashboard/offers",
      // },
      // {
      //   icon: <Layers className="w-5 h-5" />,
      //   label: `${t("packages")}`,
      //   link: "/adminDashboard/packages",
      // },
      // {
      //   icon: <User className="w-5 h-5" />,
      //   label: `${t("User Management")}`,
      //   link: "/adminDashboard/users",
      // },
      // {
      //   icon: <Upload className="w-5 h-5" />,
      //   label: `${t("imageupload")}`,
      //   link: "/adminDashboard/imageupload",
      // },
      {
        icon: <FileText className="w-5 h-5" />,
        label: `${t("blog")}`,
        link: "/adminDashboard/blogs",
      },
      {
        icon: <MessageSquare className="w-5 h-5" />,
        label: `${t("contact")}`,
        link: "/adminDashboard/contact",
      },
      {
        icon: <Percent className="w-5 h-5" />,
        label: `${t("discount")}`,
        link: "/adminDashboard/discount",
      },
      {
        icon: <Settings className="w-5 h-5" />,
        label: `${t("settings")}`,
        link: "/adminDashboard/settings",
      },
      // {
      //   icon: <Settings className="w-5 h-5" />,
      //   label: `${t("settings")}`,
      //   link: "/adminDashboard/settings",
      //   subItems: [
      //     {
      //       label: `${t("siteinfo")}`,
      //       link: "/adminDashboard/settings/siteinfo",
      //     },
      //     {
      //       label: `${t("siteimage")}`,
      //       link: "/adminDashboard/settings/siteimage",
      //     },
      //   ],
      // },
    ];
  }

  return (
    <SweetAlertProvider>
      <div className="flex flex-col lg:flex-row w-full min-w-min bg-gradient-to-r from-custom-light to-custom-dark">
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
          <main className="p-4 md:p-6 flex-grow min-h-screen overflow-y-auto">
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
