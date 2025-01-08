import { useLocation } from "react-router-dom";
import MonthlyOrdersChart from "../Components/MonthlyOrdersChart";
import RevenueCard from "../Shared/RevenueCard";

const windows = [
  {
    type: "Windows 1",
    accessories: "04",
    price: "$250",
    rating: 4.8,
    orders: 500,
  },
  {
    type: "Windows 2",
    accessories: "04",
    price: "$350",
    rating: 4.9,
    orders: 400,
  },
  {
    type: "Windows 3",
    accessories: "04",
    price: "$450",
    rating: 4.5,
    orders: 300,
  },
  {
    type: "Windows 4",
    accessories: "04",
    price: "$550",
    rating: 4.7,
    orders: 200,
  },
  {
    type: "Windows 5",
    accessories: "04",
    price: "$650",
    rating: 4.5,
    orders: 100,
  },
];

// Header Component
const ManufacturerHeader = ({ logo, name }) => (
  <div className="border-white bg-white50 backdrop-blur-16.5 rounded-lg p-4 sm:p-6 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    {/* Left Section: Logo and Details */}
    <div className="flex items-center gap-4">
      <img
        src={logo}
        className="w-12 h-12 sm:w-16 sm:h-16 bg-[#00A7A0] rounded-lg"
        alt="Logo"
      />
      <div>
        <h1 className="text-lg sm:text-xl font-semibold">{name}</h1>
        <p className="text-gray-500 text-sm">5020 Weston Parkway, Suite 400</p>
        <p className="text-gray-500 text-sm">Cary, NC 27513</p>
      </div>
    </div>
    {/* Right Section: Package Info */}
    <div className="bg-[#00A7A0] text-white px-4 sm:px-6 py-2 rounded-lg text-center sm:text-right w-full sm:w-auto">
      Gold Package
    </div>
  </div>
);

// Chart Section Component
const ChartSection = ({ title, onDownload, chartComponent, cardComponent }) => (
  <div className="border-white bg-white50 backdrop-blur-16.5 p-4 sm:p-6 rounded-lg shadow-sm mb-6">
    {/* Header Section */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
      <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-0">{title}</h2>
      <button
        className="bg-[#00A7A0] text-white px-4 sm:px-6 py-2 rounded-lg w-full sm:w-auto"
        onClick={onDownload}
      >
        Download
      </button>
    </div>
    {/* Chart and Card Section */}
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 items-center">
      <div className="lg:col-span-2 ">{chartComponent}</div>
      <div className="lg:col-span-1">{cardComponent}</div>
    </div>
  </div>
);

// Windows Table Component
const WindowsTable = () => (
  <div className="border-white  bg-white50 backdrop-blur-16.5 p-6 rounded-lg shadow-sm overflow-x-auto">
    <table className="table-auto w-full text-left">
      <thead>
        <tr className="text-gray-500 bg-gray-100">
          <th className="p-4">Windows Type</th>
          <th className="p-4">Accessories</th>
          <th className="p-4">Market Price</th>
          <th className="p-4">Average Rating</th>
          <th className="p-4">Total Order</th>
        </tr>
      </thead>
      <tbody className="divide-y-8">
        {windows.map((window, index) => (
          <tr
            key={index}
            className={`bg-[#7AC7C4] text-white ${
              index % 2 === 0 ? "bg-opacity-90" : "bg-opacity-80"
            }`}
          >
            <td className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg" />
              {window.type}
            </td>
            <td className="p-4">{window.accessories}</td>
            <td className="p-4">{window.price}</td>
            <td className="p-4">{window.rating}</td>
            <td className="p-4">{window.orders}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Main ManufacturerDetails Component
export default function ManufacturerDetails({ windowsData }) {
  const location = useLocation();
  const { logo, name } = location.state; // Extract the logo and name from the passed state

  const headerData = {
    logo: logo,
    name: name,
  };
  return (
    <div className="p-6  min-h-screen">
      <ManufacturerHeader {...headerData} />
      <ChartSection
        title="Monthly Orders"
        chartComponent={<MonthlyOrdersChart />}
        cardComponent={<RevenueCard />}
        onDownload={() => console.log("Download chart")}
      />
      <WindowsTable windows={windowsData} />
    </div>
  );
}
