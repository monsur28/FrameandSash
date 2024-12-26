import { Download } from "lucide-react";
import MonthlyOrdersChart from "../Components/MonthlyOrdersChart";
import { useNavigate } from "react-router-dom";

const Resellers = () => {
  const navigate = useNavigate();
  const resellers = [
    {
      logo: "https://i.ibb.co/ryTWxGF/plygem.webp",
      name: "Ply Gem",
      reseller: "03",
      totalSales: "$5000",
      rating: "4.8",
      package: "Gold",
      expiry: "25-12-2025",
    },
    {
      logo: "https://i.ibb.co/yQGBMPk/Championwindows.webp",
      name: "Champion Windows",
      reseller: "05",
      totalSales: "$5100",
      rating: "4.9",
      package: "Gold",
      expiry: "20-11-2025",
    },
    {
      logo: "https://i.ibb.co/bmW36hz/alsidelogo.webp",
      name: "Alside, Inc",
      reseller: "07",
      totalSales: "$6500",
      rating: "5.0",
      package: "Platinum",
      expiry: "15-07-2025",
    },
    {
      logo: "https://i.ibb.co/z4C0B8z/pella-logo.webp",
      name: "Pella",
      reseller: "10",
      totalSales: "$7000",
      rating: "4.8",
      package: "Diamond",
      expiry: "10-08-2025",
    },
  ];

  const handleResellerClick = (resellerName) => {
    const selectedReseller = resellers.find(
      (item) => item.name === resellerName
    );
    const encodedName = encodeURIComponent(resellerName);
    navigate(`/dashboard/reseller/${encodedName}`, {
      state: selectedReseller,
    });
  };

  return (
    <div className="p-5">
      {/* Chart Section */}
      <div className="rounded-[24px] border-2 border-white bg-white/50 backdrop-blur-[16.5px] p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold">ChartBoard</h2>
            <div className="flex gap-2 mt-4">
              <button className="bg-[#009DAA] text-white px-4 py-2 rounded">
                This Year
              </button>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
                Last Year
              </button>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard/reseller/addreseller")}
            className="bg-[#009DAA] text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add Reseller</span>
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <div className="w-full lg:w-3/4">
            <MonthlyOrdersChart />
          </div>
          <div className="w-full lg:w-auto">
            <button className="bg-[#009DAA] text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resellers List Section */}
      <div className="mt-4 p-4 rounded-[24px] border-2 border-white bg-white/50 backdrop-blur-[16.5px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Resellers Company List</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Compared by</span>
            <select className="p-1 border rounded-lg">
              <option>Total Sales</option>
            </select>
          </div>
        </div>
        <table className="min-w-full text-left">
          <thead>
            <tr>
              {[
                "Company Name",
                "Re-Seller",
                "Total Sales",
                "Rating",
                "Package",
                "Expiry Date",
              ].map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-xs font-medium text-gray-500 uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resellers.map((item, index) => (
              <tr
                key={index}
                onClick={() => handleResellerClick(item.name)}
                className="hover:bg-[#009DAA] hover:text-white cursor-pointer"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.logo}
                      alt={item.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{item.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{item.reseller}</td>
                <td className="px-4 py-3">{item.totalSales}</td>
                <td className="px-4 py-3">{item.rating}</td>
                <td className="px-4 py-3">{item.package}</td>
                <td className="px-4 py-3">{item.expiry}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Resellers;
