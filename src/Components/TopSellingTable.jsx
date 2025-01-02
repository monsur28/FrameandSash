import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

const TopSellingTable = () => {
  const [activeTab, setActiveTab] = useState("top");

  const salesData = [
    { product: "Window 01", units: "05" },
    { product: "Window 02", units: "03" },
    { product: "Window 03", units: "09" },
    { product: "Window 04", units: "07" },
    { product: "Window 05", units: "06" },
  ];

  return (
    <div className=" rounded-[24px] p-6 shadow-sm border-2 border-white bg-white/50 backdrop-blur-[16.5px]">
      <div className="flex justify-center mb-4 space-x-4">
        <button
          onClick={() => setActiveTab("top")}
          className={`flex items-center px-6 py-2 rounded-md ${
            activeTab === "top" ? "bg-[#009daa] text-white" : "text-gray-600"
          }`}
        >
          <ArrowUp className="w-4 h-4 mr-2" />
          Top Selling
        </button>
        <button
          onClick={() => setActiveTab("low")}
          className={`flex items-center px-6 py-2 rounded-md ${
            activeTab === "low" ? "bg-[#009daa] text-white" : "text-gray-600"
          }`}
        >
          Low Selling
          <ArrowDown className="w-4 h-4 ml-2" />
        </button>
      </div>

      <div>
        <div className="grid grid-cols-2 py-2 text-teal-500 font-semibold border-b border-teal-200">
          <div>Products</div>
          <div className="text-right">Unit Sold</div>
        </div>

        {salesData.map((item, index) => (
          <div
            key={index}
            style={{ background: "rgba(0, 157, 170, 0.15)" }}
            className="grid grid-cols-2 p-3 rounded-[60px] border-b border-teal-100 hover:bg-teal-50 mb-4"
          >
            <div>{item.product}</div>
            <div className="text-right">{item.units}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingTable;
