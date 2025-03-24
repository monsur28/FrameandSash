// ShippingRuleTableContent.jsx
import { Edit3, Trash2 } from "lucide-react";
import axiosSecure from "../../Hooks/AsiosSecure";

const ShippingRuleTableContent = ({
  shippingRules,
  shippingOptions,
  fetchData,
  handleEditShippingRule,
}) => {
  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/admin/shipping/shipping-rules/${id}`);
      fetchData(); // Re-fetch after deletion
    } catch (err) {
      console.error("Failed to delete shipping rule", err);
      alert("Failed to delete shipping rule. Please try again");
      fetchData(); // Re-fetch on error
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse rounded-lg shadow-md">
        <thead className="bg-[#00A99D] text-white">
          <tr>
            <th className="px-6 py-3 text-left">Rule ID</th>
            <th className="px-6 py-3 text-left">Type</th>
            <th className="px-6 py-3 text-left">Condition</th>
            <th className="px-6 py-3 text-left">Action</th>
            <th className="px-6 py-3 text-left">Modifier Value</th>
            <th className="px-6 py-3 text-left">Active</th>
            <th className="px-6 py-3 text-left">Shipping Option</th>
            <th className="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {shippingRules.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                No shipping rules available
              </td>
            </tr>
          ) : (
            shippingRules.map((rule) => (
              <tr key={rule.id} className="hover:bg-gray-50">
                <td className="px-6 py-3">{rule.id}</td>
                <td className="px-6 py-3">{rule.type}</td>
                <td className="px-6 py-3">
                  {rule.condition?.operator} {rule.condition?.value}
                </td>
                <td className="px-6 py-3">{rule.actionType}</td>
                <td className="px-6 py-3">{rule.modifierValue}</td>
                <td className="px-6 py-3">{rule.active ? "Yes" : "No"}</td>
                <td className="px-6 py-3">
                  {shippingOptions.find(
                    (option) => option.id === rule.shippingOptionId
                  )?.name || "N/A"}
                </td>
                <td className="px-6 py-3 flex gap-2">
                  <Edit3
                    className="text-blue-500 cursor-pointer"
                    onClick={() => handleEditShippingRule(rule)}
                  />
                  <Trash2
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDelete(rule.id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ShippingRuleTableContent;
