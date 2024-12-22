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
  Calendar,
  Menu,
  X,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import StatsCard from "../Components/StateCard";
import ChartBoard from "../Components/ChartBoard";
import TopSellingTable from "../Components/TopSellingTable";
import CustomerReview from "../Components/CustomerReview";
import { useState } from "react";

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: "Dashboard" },
    { icon: <Package className="w-5 h-5" />, label: "Products" },
    { icon: <Users className="w-5 h-5" />, label: "Manufacturer" },
    { icon: <UserPlus className="w-5 h-5" />, label: "Re-Seller" },
    { icon: <Tag className="w-5 h-5" />, label: "Offer" },
    { icon: <Layers className="w-5 h-5" />, label: "Packages" },
    { icon: <Users className="w-5 h-5" />, label: "Role Management" },
    { icon: <Upload className="w-5 h-5" />, label: "Image Upload" },
    { icon: <Globe className="w-5 h-5" />, label: "Languages" },
    { icon: <FileText className="w-5 h-5" />, label: "Blogs" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Contact" },
    { icon: <Percent className="w-5 h-5" />, label: "Discount" },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      subItems: ["Site Info", "Site Image", "SEO", "Push Notification"],
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
        <div className="flex flex-col sm:flex-row items-center sm:justify-between bg-white p-4 rounded-md shadow-md space-y-4 sm:space-y-0">
          {/* Date Range Picker */}
          <div className="flex items-center space-x-2 border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-600 w-full sm:w-auto">
            <span>Nov 1, 2024 - Nov 24, 2024</span>
            <Calendar className="w-5 h-5 text-gray-500" />
          </div>

          {/* Export Button */}
          <button className="flex items-center justify-center space-x-2 bg-teal-500 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-teal-600 transition duration-200 w-full sm:w-auto">
            <span>Export Data</span>
          </button>
        </div>
        <main className="p-4 md:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <StatsCard title="Total Visitors" value="19587" info={true} />
                <StatsCard title="Conversion Rate" value="5%" info={true} />
                <StatsCard title="AOV" value="$575" info={true} />
                <StatsCard title="Return Customers" value="55%" info={true} />
              </div>
              <div className="lg:col-span-2">
                <ChartBoard />
              </div>
            </div>
            <div>
              <TopSellingTable />
              <div className="mt-6">
                <CustomerReview />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
