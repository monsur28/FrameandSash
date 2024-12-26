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
  <div className="border-white bg-white/50 backdrop-blur-[16.5px] rounded-lg p-6 shadow-sm mb-6 flex justify-between items-center">
    <div className="flex items-center gap-4">
      <img
        src={logo}
        className="w-12 h-12 bg-[#00A7A0] rounded-lg"
        alt="Logo"
      />
      <div>
        <h1 className="text-xl font-semibold">{name}</h1>
        <p className="text-gray-500 text-sm">5020 weston parkway, Suite 400</p>
        <p className="text-gray-500 text-sm">cary, NC 27513</p>
      </div>
    </div>
    <div className="bg-[#00A7A0] text-white px-6 py-2 rounded-lg">
      Gold Package
    </div>
  </div>
);

// Chart Section Component
const ChartSection = ({ title, onDownload, chartComponent, cardComponent }) => (
  <div className="border-white bg-white/50 backdrop-blur-[16.5px] p-6 rounded-lg shadow-sm mb-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <button
        className="bg-[#00A7A0] text-white px-6 py-2 rounded-lg"
        onClick={onDownload}
      >
        Download
      </button>
    </div>
    <div className="flex gap-6">
      <div className="flex-1">{chartComponent}</div>
      <div className="w-64">{cardComponent}</div>
    </div>
  </div>
);

// Windows Table Component
const WindowsTable = () => (
  <div className="border-white bg-white/50 backdrop-blur-[16.5px] p-6 rounded-lg shadow-sm">
    <div className="grid grid-cols-5 gap-4 mb-4 px-4 text-gray-500">
      <div>Windows Type</div>
      <div>Accessories</div>
      <div>Market Price</div>
      <div>Average Rating</div>
      <div>Total Order</div>
    </div>
    {windows.map((window, index) => (
      <div
        key={index}
        className="grid grid-cols-5 gap-4 bg-[#7AC7C4] text-white rounded-xl p-4 mb-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg" />
          {window.type}
        </div>
        <div>{window.accessories}</div>
        <div>{window.price}</div>
        <div>{window.rating}</div>
        <div>{window.orders}</div>
      </div>
    ))}
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
