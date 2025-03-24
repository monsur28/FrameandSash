// ShippingRuleForm.jsx
import { useState, useEffect } from "react";

function ShippingRuleForm({
  closeModal,
  onAddShippingRule,
  shippingOptions,
  ruleToEdit,
}) {
  const [type, setType] = useState("");
  const [conditionOperator, setConditionOperator] = useState("");
  const [conditionValue, setConditionValue] = useState("");
  const [actionType, setActionType] = useState("");
  const [modifierValue, setModifierValue] = useState("");
  const [active, setActive] = useState(true);
  const [shippingOptionId, setShippingOptionId] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (ruleToEdit) {
      setType(ruleToEdit.type || "");
      //Handle potentially missing condition object
      setConditionOperator(ruleToEdit.condition?.operator || "");
      setConditionValue(ruleToEdit.condition?.value || "");
      setActionType(ruleToEdit.actionType || "");
      setModifierValue(ruleToEdit.modifierValue || "");
      setActive(ruleToEdit.active);
      setShippingOptionId(ruleToEdit.shippingOptionId || "");
    }
  }, [ruleToEdit]);

  const validateForm = () => {
    const newErrors = {};

    if (!type.trim()) newErrors.type = "Type is required";
    if (!conditionOperator.trim())
      newErrors.conditionOperator = "Condition operator is required";
    if (!conditionValue.trim() || isNaN(parseFloat(conditionValue))) {
      newErrors.conditionValue =
        "Condition value is required and must be a number";
    }
    if (!actionType.trim()) newErrors.actionType = "Action type is required";
    if (!modifierValue.trim() || isNaN(parseFloat(modifierValue))) {
      newErrors.modifierValue =
        "Modifier value is required and must be a number";
    }
    if (!shippingOptionId)
      newErrors.shippingOptionId = "Shipping Option is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newShippingRule = {
      type: type,
      condition: {
        operator: conditionOperator,
        value: parseFloat(conditionValue), // Ensure it's a number
      },
      actionType: actionType,
      modifierValue: parseFloat(modifierValue), // Ensure it's a number
      active: active,
      shippingOptionId: parseInt(shippingOptionId, 10), // Send as a number
    };

    if (ruleToEdit) {
      newShippingRule.id = ruleToEdit.id;
    }

    try {
      if (ruleToEdit) {
        //Put Request
      } else {
        await onAddShippingRule(newShippingRule);
      }
      closeModal();
    } catch (error) {
      console.error("Error adding shipping rule:", error);
      // Display a user-friendly error message
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {ruleToEdit ? "Edit Shipping Rule" : "Add Shipping Rule"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Type
            </label>
            <input
              type="text"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Condition
            </label>
            <div className="flex gap-2">
              <select
                value={conditionOperator}
                onChange={(e) => setConditionOperator(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Operator</option>
                <option value=">">Greater Than</option>
                <option value="<">Less Than</option>
                <option value="=">Equals</option>
                {/* Add more operators as needed */}
              </select>
              <input
                type="text"
                value={conditionValue}
                onChange={(e) => setConditionValue(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Value"
              />
            </div>
            {errors.conditionOperator && (
              <p className="text-red-500 text-sm mt-1">
                {errors.conditionOperator}
              </p>
            )}
            {errors.conditionValue && (
              <p className="text-red-500 text-sm mt-1">
                {errors.conditionValue}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="actionType"
              className="block text-sm font-medium text-gray-700"
            >
              Action Type
            </label>
            <input
              type="text"
              id="actionType"
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.actionType && (
              <p className="text-red-500 text-sm mt-1">{errors.actionType}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="modifierValue"
              className="block text-sm font-medium text-gray-700"
            >
              Modifier Value
            </label>
            <input
              type="text"
              id="modifierValue"
              value={modifierValue}
              onChange={(e) => setModifierValue(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.modifierValue && (
              <p className="text-red-500 text-sm mt-1">
                {errors.modifierValue}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="active"
              className="block text-sm font-medium text-gray-700"
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
              htmlFor="shippingOptionId"
              className="block text-sm font-medium text-gray-700"
            >
              Shipping Option
            </label>
            <select
              id="shippingOptionId"
              value={shippingOptionId}
              onChange={(e) => setShippingOptionId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a Shipping Option</option>
              {shippingOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            {errors.shippingOptionId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.shippingOptionId}
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
              {ruleToEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ShippingRuleForm;
