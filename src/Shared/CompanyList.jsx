/* eslint-disable react/prop-types */
// ManufacturerList.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import { Download } from "lucide-react";
import MonthlyOrdersChart from "../Components/MonthlyOrdersChart";
import FormModal from "./FormModal";

// The reusable list component for Manufacturer and Reseller
const CompanyList = ({ title, formFields, data, onSubmit, fieldToCompare }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="bg-[#DDDDDD] p-5 rounded-md flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold">{title}</h2>
          <div className="flex space-x-4 mt-4">
            <button className="bg-teal-500 text-white px-4 py-2 rounded">
              This Year
            </button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
              Last Year
            </button>
          </div>
        </div>
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add {title}</span>
          </button>
          <button className="bg-cyan-400 text-white px-4 py-2 mt-4 rounded-lg flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Download</span>
          </button>
        </div>
      </div>
      <div>
        <MonthlyOrdersChart />
      </div>
      <div className="bg-[#DDDDDD] mt-4 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{title} List</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Compared by</span>
            <select>
              <option>{fieldToCompare}</option>
            </select>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-500">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Re-Seller
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Sales
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Average Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Packages
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiry Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-500">
            {data.map((item) => (
              <tr key={item.name}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  <div className="flex items-center gap-3">
                    <img src={item.logo} alt={item.name} className="w-8 h-8" />
                    {item.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.reseller}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.totalSales}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.rating}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.package}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.expiry}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Component */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formTitle={`Add ${title}`}
        formFields={formFields}
        onSubmit={onSubmit}
      />
    </div>
  );
};
CompanyList.propTypes = {
  title: PropTypes.string.isRequired,
  formFields: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  onAddItem: PropTypes.func.isRequired,
  fieldToCompare: PropTypes.string.isRequired,
};

export default CompanyList;
