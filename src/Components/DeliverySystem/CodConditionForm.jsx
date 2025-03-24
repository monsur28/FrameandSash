import { useState, useEffect } from "react";

function CodConditionForm({ closeModal, onSave, shippingZones, codCondition }) {
  const [minQuantity, setMinQuantity] = useState("");
  const [minTotalPrice, setMinTotalPrice] = useState("");
  const [codFee, setCodFee] = useState(""); // New state for COD fee
  const [shippingZoneId, setShippingZoneId] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (codCondition) {
      setMinQuantity(codCondition.min_quantity ?? "");
      setMinTotalPrice(codCondition.min_total_price ?? "");
      setCodFee(codCondition.cod_fee ?? ""); // Initialize codFee
      setShippingZoneId(codCondition.shipping_zone_id?.toString() || "");
      setIsEnabled(
        codCondition.is_enabled === undefined ? true : codCondition.is_enabled
      );
    } else {
      // Reset form when creating a new condition
      setMinQuantity("");
      setMinTotalPrice("");
      setCodFee(""); // Reset codFee
      setShippingZoneId("");
      setIsEnabled(true);
    }
  }, [codCondition]);

  const validateForm = () => {
    const newErrors = {};

    if (
      minQuantity &&
      (isNaN(parseFloat(minQuantity)) || parseFloat(minQuantity) < 0)
    ) {
      newErrors.minQuantity = "Minimum Quantity must be a non-negative number";
    }

    if (
      minTotalPrice &&
      (isNaN(parseFloat(minTotalPrice)) || parseFloat(minTotalPrice) < 0)
    ) {
      newErrors.minTotalPrice =
        "Minimum Total Price must be a non-negative number";
    }

    // Validate cod_fee (optional, but must be a non-negative number if provided)
    if (codFee && (isNaN(parseFloat(codFee)) || parseFloat(codFee) < 0)) {
      newErrors.codFee = "COD Fee must be a non-negative number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newCodCondition = {
      min_quantity: minQuantity ? parseFloat(minQuantity) : null,
      min_total_price: minTotalPrice ? parseFloat(minTotalPrice) : null,
      cod_fee: codFee ? parseFloat(codFee) : null, // Include cod_fee
      shipping_zone_id: shippingZoneId ? parseInt(shippingZoneId, 10) : null,
      is_enabled: isEnabled,
    };

    console.log(newCodCondition);

    try {
      await onSave(newCodCondition);
    } catch (error) {
      console.error("Error:", error);
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {codCondition ? "Edit COD Condition" : "Add COD Condition"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="minQuantity"
              className="block text-sm font-medium text-gray-700"
            >
              Minimum Quantity
            </label>
            <input
              type="number"
              id="minQuantity"
              value={minQuantity}
              onChange={(e) => setMinQuantity(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter minimum quantity"
            />
            {errors.minQuantity && (
              <p className="text-red-500 text-sm mt-1">{errors.minQuantity}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="minTotalPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Minimum Total Price
            </label>
            <input
              type="number"
              id="minTotalPrice"
              value={minTotalPrice}
              onChange={(e) => setMinTotalPrice(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter minimum total price"
            />
            {errors.minTotalPrice && (
              <p className="text-red-500 text-sm mt-1">
                {errors.minTotalPrice}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="codFee"
              className="block text-sm font-medium text-gray-700"
            >
              COD Fee
            </label>
            <input
              type="number"
              id="codFee"
              value={codFee}
              onChange={(e) => setCodFee(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter COD fee"
            />
            {errors.codFee && (
              <p className="text-red-500 text-sm mt-1">{errors.codFee}</p>
            )}
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

          <div className="mb-4">
            <label
              htmlFor="isEnabled"
              className="block text-sm font-medium text-gray-700"
            >
              Enabled
            </label>
            <input
              type="checkbox"
              id="isEnabled"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              className="mt-1"
            />
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
              {codCondition ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CodConditionForm;
