import { useState } from "react";

const ShippingStandardForm = ({ onAddShippingStandard }) => {
  const [name, setName] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  const [cost, setCost] = useState("");
  const [active, setActive] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newShippingStandard = {
      id: Date.now(),
      name,
      delivery_days: deliveryDays,
      cost: parseFloat(cost),
      active,
    };
    onAddShippingStandard(newShippingStandard);
    setName("");
    setDeliveryDays("");
    setCost("");
    setActive(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Shipping Standard Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Delivery Days
        </label>
        <input
          type="number"
          value={deliveryDays}
          onChange={(e) => setDeliveryDays(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cost ($)
        </label>
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Active
        </label>
        <input
          type="checkbox"
          checked={active}
          onChange={() => setActive((prev) => !prev)}
          className="mt-1"
        />
      </div>
      <button
        type="submit"
        className="bg-[#00A99D] text-white py-2 px-4 rounded-md mt-4"
      >
        Add Shipping Standard
      </button>
    </form>
  );
};

export default ShippingStandardForm;
