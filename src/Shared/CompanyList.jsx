import PropTypes from "prop-types";
import { Download } from "lucide-react";
import MonthlyOrdersChart from "../Components/MonthlyOrdersChart";

const CompanyList = ({ title, data, fieldToCompare }) => {
  return (
    <div className="p-5">
      <div className=" rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 p-4 md:p-6 lg:p-8">
        <div className="w-full md:w-1/2 lg:w-full flex flex-col lg:flex-row items-start  justify-between mb-6">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-2xl sm:text-3xl font-semibold">ChartBoard</h2>
            <div className="flex flex-wrap gap-2 mt-4">
              <button className="bg-primary text-white px-3 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base">
                This Year
              </button>
              <button className="bg-gray-200 text-gray-700 px-3 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base">
                Last Year
              </button>
            </div>
          </div>
          <button className="bg-primary text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg flex items-center space-x-2 text-sm sm:text-base">
            <span>+</span>
            <span>Add {title}</span>
          </button>
        </div>
        <div className="flex flex-col-reverse lg:flex-row gap-4 mt-4 justify-between items-start ">
          <div className="w-full lg:w-3/4 rounded-lg">
            <MonthlyOrdersChart />
          </div>
          <div className="w-full lg:w-auto ">
            <button className="w-full lg:w-auto bg-primary text-white px-3 py-1 sm:px-4 sm:py-2 mt-2 lg:mt-4 rounded-lg flex items-center justify-center space-x-2 text-sm sm:text-base">
              <Download className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Download</span>
            </button>
            <div className="grid grid-cols-2 gap-4 mt-8 space-y-4">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                >
                  <circle cx="9.5" cy="9.5" r="9.5" fill="#009DAA" />
                </svg>
                <h2>Ply Gem</h2>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                >
                  <circle cx="9.5" cy="9.5" r="9.5" fill="#252526" />
                </svg>
                <h2>Alside Inc</h2>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                >
                  <circle cx="9.5" cy="9.5" r="9.5" fill="#CC4646" />
                </svg>
                <h2>Pella</h2>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                >
                  <circle cx="9.5" cy="9.5" r="9.5" fill="#03ADD9" />
                </svg>
                <h2>Cham Window</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 mt-4 p-4 sm:p-6 overflow-x-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h2 className="text-lg lg:text-3xl sm:text-xl font-semibold mb-2 sm:mb-0">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-500">
              Compared by
            </span>
            <select className="text-xs sm:text-sm">
              <option>{fieldToCompare}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto space-y-[20px]">
          <div className="overflow-x-auto divide-y divide-gray-500">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Re-Seller
                  </th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Sales
                  </th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Rating
                  </th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Packages
                  </th>
                  <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-8 rounded-2xl space-y-[20px] overflow-hidden">
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className="transition-all hover:bg-white  hover:bg-opacity-10  bg-[rgba(0,157,170,0.6)]"
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
                    <td className="px-2 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
                      {item.reseller}
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
                      {item.totalSales}
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
                      {item.rating}
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
                      {item.package}
                    </td>
                    <td className="px-2 sm:px-4 lg:px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
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

CompanyList.propTypes = {
  title: PropTypes.string.isRequired,
  formFields: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fieldToCompare: PropTypes.string.isRequired,
};

export default CompanyList;
