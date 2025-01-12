import { useState } from "react";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import { useLanguage } from "../ContextProvider/LanguageContext";

export default function Discount() {
  const [discounts, setDiscounts] = useState([
    {
      id: 1,
      code: "SUMMER10",
      description: "10% off on summer sale",
      expiry: "2024-07-01",
    },
    {
      id: 2,
      code: "FESTIVE15",
      description: "15% off during the festive season",
      expiry: "2024-12-31",
    },
  ]);

  const [newDiscount, setNewDiscount] = useState({
    code: "",
    description: "",
    expiry: "",
  });
  const { t } = useLanguage();

  const handleAddDiscount = () => {
    if (newDiscount.code && newDiscount.description && newDiscount.expiry) {
      setDiscounts([
        ...discounts,
        { id: discounts.length + 1, ...newDiscount },
      ]);
      setNewDiscount({ code: "", description: "", expiry: "" });
    } else {
      alert("All fields are required.");
    }
  };

  const handleDelete = (id) => {
    setDiscounts(discounts.filter((discount) => discount.id !== id));
  };

  return (
    <div className="p-6 h-screen ">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 p-6">
          <h1 className="text-2xl font-semibold text-gray-700">
            {t("ManageDiscounts")}
          </h1>
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
            onClick={handleAddDiscount}
          >
            <PlusCircle size={20} />
            <span>{t("AddDiscount")}</span>
          </button>
        </div>

        {/* Discount Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-100 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                  {t("Code")}
                </th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                  {t("Description")}
                </th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                  {t("ExpiryDate")}
                </th>
                <th className="px-4 py-2 text-center text-gray-600 font-semibold">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount.id} className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-2 border">{discount.code}</td>
                  <td className="px-4 py-2 border">{discount.description}</td>
                  <td className="px-4 py-2 border">{discount.expiry}</td>
                  <td className="px-4 py-2 border text-center">
                    <button className="text-green-500 hover:text-green-700 mx-2">
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 mx-2"
                      onClick={() => handleDelete(discount.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Discount Form */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-600 mb-4">
            {t("AddNewDiscount")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder={t("DiscountCode")}
              value={newDiscount.code}
              onChange={(e) =>
                setNewDiscount({ ...newDiscount, code: e.target.value })
              }
              className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder={t("Description")}
              value={newDiscount.description}
              onChange={(e) =>
                setNewDiscount({ ...newDiscount, description: e.target.value })
              }
              className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={newDiscount.expiry}
              onChange={(e) =>
                setNewDiscount({ ...newDiscount, expiry: e.target.value })
              }
              className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
