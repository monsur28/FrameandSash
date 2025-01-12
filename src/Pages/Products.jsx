import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../ContextProvider/LanguageContext";

export default function Products() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [products] = useState([
    {
      id: 1,
      title: "Windows",
      icon: (
        <img
          src="https://www.clipartmax.com/png/small/227-2276307_window-glass-mirror-home-safety-icon-glass-window-icon-png-white.png"
          className="w-6 h-6 text-gray-600 object-contain"
          alt="Window"
        />
      ),
      types: 11,
      available: true,
    },
    {
      id: 2,
      title: "Doors",
      icon: (
        <img
          src="https://www.clipartmax.com/png/middle/12-128373_clipart-of-door-best-18332-clipartion-com-colouring-picture-of-door.png"
          alt="Door"
          className="w-6 h-6 text-gray-600 object-co"
        />
      ),
      types: 11,
      available: true,
    },
  ]);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center mb-8">
        <h1 className="text-xl lg:text-3xl  font-bold text-gray-800">
          {t("productList")}
        </h1>
        <button
          onClick={() => navigate("/dashboard/products/create-product")}
          className="mt-4 sm:mt-0 bg-primary hover:bg-teal-600 text-white px-3 sm:px-2 lg:px-2 py-1 lg:py-2 rounded-full flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t("createProduct")}
        </button>
      </div>

      {/* Product Table */}
      <div className="border-2 border-white bg-white50 backdrop-blur-16.5 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-gray-500 text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-4 border-b font-medium">Product Title</th>
              <th className="p-4 border-b font-medium">Types</th>
              <th className="p-4 border-b font-medium">Accessories</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                onClick={() => navigate(`/dashboard/products/${product.title}`)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="p-4 flex items-center gap-3">
                  {product.icon}
                  <span className="font-medium text-gray-900">
                    {product.title}
                  </span>
                </td>
                <td className="p-4 text-teal-500">{product.types}</td>
                <td className="p-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                  <span>Available</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
