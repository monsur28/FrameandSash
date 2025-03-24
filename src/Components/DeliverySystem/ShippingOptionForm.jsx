import { useState, useEffect } from "react";

function ShippingOptionForm({
  closeModal,
  onSave,
  onEdit,
  shippingZones,
  option,
}) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  const [active, setActive] = useState(true);
  const [shippingZoneId, setShippingZoneId] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (option) {
      setName(option.name || "");
      setCost(option.cost || "");
      setDeliveryDays(option.delivery_days || option.deliveryTime || ""); // Handle both if needed for editing
      setActive(option.active);
      setShippingZoneId(
        option.shipping_zone_id ? option.shipping_zone_id.toString() : ""
      );
    }
  }, [option]);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!cost.trim() || isNaN(parseFloat(cost)))
      newErrors.cost = "Cost is required and must be a number";
    if (typeof deliveryDays === "string" && !deliveryDays.trim()) {
      newErrors.deliveryDays = "Delivery Days is required";
    } else if (typeof deliveryDays !== "string" && !deliveryDays) {
      newErrors.deliveryDays = "Delivery Days is required";
    }
    if (!shippingZoneId) newErrors.shippingZoneId = "Shipping Zone is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newShippingOption = {
      name: name,
      cost: parseFloat(cost),
      delivery_days: deliveryDays,
      active: active,
      shipping_zone_id: parseInt(shippingZoneId, 10),
    };

    if (option) {
      // Editing: call onEdit
      newShippingOption.id = option.id;
      try {
        await onEdit(newShippingOption);
      } catch (error) {
        console.error("Error updating shipping option:", error);
        // Handle error display
      }
    } else {
      // Adding: call onAdd
      try {
        await onSave(newShippingOption);
      } catch (error) {
        console.error("Error adding shipping option:", error);
        // Handle error display
      }
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {option ? "Edit Shipping Option" : "Add Shipping Option"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="cost"
              className="block text-sm font-medium text-gray-700"
            >
              Cost
            </label>
            <input
              type="text"
              id="cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.cost && (
              <p className="text-red-500 text-sm mt-1">{errors.cost}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="deliveryDays" // Updated htmlFor
              className="block text-sm font-medium text-gray-700"
            >
              Delivery Days {/* Updated label */}
            </label>
            <input
              type="text"
              id="deliveryDays" // Updated id
              value={deliveryDays} // Updated value
              onChange={(e) => setDeliveryDays(e.target.value)} // Updated onChange
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.deliveryDays && ( // Updated error display
              <p className="text-red-500 text-sm mt-1">{errors.deliveryDays}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="active"
              className="block text-sm font-medium text-gray700"
            >
              Active
            </label>
            <input
              type="checkbox"
              id="active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="shippingZoneId"
              className="block text-sm font-medium text-gray-700"
            >
              Shipping Zone
            </label>
            <select
              id="shippingZoneId"
              value={shippingZoneId}
              onChange={(e) => setShippingZoneId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a Shipping Zone</option>
              {shippingZones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>
            {errors.shippingZoneId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.shippingZoneId}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {option ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ShippingOptionForm;
