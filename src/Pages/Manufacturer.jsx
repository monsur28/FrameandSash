import { Download } from "lucide-react";
import MonthlyOrdersChart from "../Components/MonthlyOrdersChart";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../ContextProvider/LanguageContext";

const Manufacturer = () => {
  const navigate = useNavigate();
  const [activeYear, setActiveYear] = useState("thisYear");
  const { t } = useLanguage();
  const manufacturers = [
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

  const handleManufacturerClick = (manufacturerName) => {
    const manufacturer = manufacturers.find(
      (item) => item.name === manufacturerName
    );
    const encodedName = encodeURIComponent(manufacturerName);
    navigate(`/dashboard/manufacturer/${encodedName}`, {
      state: manufacturer, // Passing the manufacturer data to the next page
    });
  };

  return (
    <div>
      <div className="rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 justify-between mb-6">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">
              {t("chartBoard")}
            </h2>
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                className={`px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base ${
                  activeYear === "thisYear"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveYear("thisYear")}
              >
                {t("thisYear")}
              </button>
              <button
                className={`px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base ${
                  activeYear === "lastYear"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveYear("lastYear")}
              >
                {t("lastYear")}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-start lg:justify-end">
            <button
              onClick={() =>
                navigate("/dashboard/manufacturer/addmanufacturer")
              }
              className="bg-primary text-white px-3 py-1 md:px-4 md:py-2 rounded-lg flex items-center space-x-2 text-sm md:text-base"
            >
              <span>+</span>
              <span> {t("addManufacturer")} </span>
            </button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 mt-4 justify-between items-start">
          <div className="w-full lg:w-3/4 rounded-lg">
            <MonthlyOrdersChart activeYear={activeYear} />
          </div>
          <div className="w-full lg:w-auto">
            <button className="w-full lg:w-auto bg-primary text-white px-3 py-1 md:px-4 md:py-2 mt-2 lg:mt-4 rounded-lg flex items-center justify-center space-x-2 text-sm md:text-base">
              <Download className="h-4 w-4 md:h-5 md:w-5" />
              <span>{t("download")}</span>
            </button>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-1 lg:gap-2 mt-8 space-y-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19">
                  <circle cx="9.5" cy="9.5" r="9.5" fill="#009DAA" />
                </svg>
                <h2 className="text-sm md:text-base">Ply Gem</h2>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19">
                  <circle cx="9.5" cy="9.5" r="9.5" fill="#252526" />
                </svg>
                <h2 className="text-sm md:text-base">Alside Inc</h2>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19">
                  <circle cx="9.5" cy="9.5" r="9.5" fill="#CC4646" />
                </svg>
                <h2 className="text-sm md:text-base">Pella</h2>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19">
                  <circle cx="9.5" cy="9.5" r="9.5" fill="#03ADD9" />
                </svg>
                <h2 className="text-sm md:text-base">Champion Window</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 mt-4 p-4 sm:p-6 overflow-x-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl lg:text-3xl font-semibold mb-2 sm:mb-0">
            {t("manufacturerCompanyList")}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-500">
              {t("comparedBy")}:
            </span>
            <select className="text-xs sm:text-sm p-1 rounded-lg border border-gray-300">
              <option>{t("totalSales")}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto space-y-[20px]">
          <div className="divide-y divide-gray-500">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("companyName")}
                  </th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("reseller")}
                  </th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("totalSales")}
                  </th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("averageRating")}
                  </th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("package")}
                  </th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t("ExpiryDate")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-8 rounded-2xl space-y-[20px]">
                {manufacturers.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => handleManufacturerClick(item.name)}
                    className="transition-all hover:bg-white hover:bg-opacity-10 bg-[rgba(0,157,170,0.6)]"
                  >
                    <td className="px-2 sm:px-4 lg:px-6 py-4 whitespace-nowrap font-medium">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <img
                          src={item.logo}
                          alt={item.name}
                          className="w-6 h-6 sm:w-8 sm:h-8"
                        />
                        <span className="text-xs sm:text-sm">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-4 text-xs sm:text-sm">
                      {item.reseller}
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-4 text-xs sm:text-sm">
                      {item.totalSales}
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-4 text-xs sm:text-sm">
                      {item.rating}
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-4 text-xs sm:text-sm">
                      {item.package}
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-4 text-xs sm:text-sm">
                      {item.expiry}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manufacturer;
