import { useState, useEffect } from "react";
import { Edit3, Trash2 } from "lucide-react";
import axiosSecure from "../../Hooks/AsiosSecure";

const ShippingOptionTableContent = ({ shippingOptions, fetchData, onEdit }) => {
  const [shippingZones, setShippingZones] = useState([]);

  // Fetch shipping zones when the component mounts
  useEffect(() => {
    const fetchShippingZones = async () => {
      try {
        const response = await axiosSecure.get(
          "/admin/shipping/shipping-zones"
        );
        setShippingZones(response.data); // Store fetched shipping zones
      } catch (error) {
        console.error("Failed to fetch shipping zones:", error);
      }
    };

    fetchShippingZones();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/admin/shipping/shipping-options/${id}`);
      fetchData(); // Re-fetch ALL data
    } catch (err) {
      console.error("Failed to delete shipping option", err);
      alert("Failed to delete shipping option. Please try again.");
      fetchData();
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse rounded-lg shadow-md">
        <thead className="bg-[#00A99D] text-white">
          <tr>
            <th className="px-6 py-3 text-left">Option ID</th>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Cost</th>
            <th className="px-6 py-3 text-left">Delivery Time</th>
            <th className="px-6 py-3 text-left">Active</th>
            <th className="px-6 py-3 text-left">Shipping Zone</th>
            <th className="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {shippingOptions.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-gray-500">
                No shipping options available.
              </td>
            </tr>
          ) : (
            shippingOptions.map((option, index) => (
              <tr key={option.id} className="hover:bg-gray-50">
                <td className="px-6 py-3">{index + 1}</td>
                <td className="px-6 py-3">{option.name}</td>
                <td className="px-6 py-3">{option.cost}</td>
                <td className="px-6 py-3">{option.delivery_days}</td>
                <td className="px-6 py-3">{option.active ? "Yes" : "No"}</td>
                <td className="px-6 py-3">
                  {
                    shippingZones.find(
                      (zone) => zone.id === option.shipping_zone_id
                    )?.name
                  }
                </td>
                <td className="px-6 py-3 flex gap-2">
                  <Edit3
                    className="text-blue-500 cursor-pointer"
                    onClick={() => onEdit(option)}
                  />
                  <Trash2
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDelete(option.id)}
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

export default ShippingOptionTableContent;
