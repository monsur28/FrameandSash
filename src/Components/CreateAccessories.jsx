import { useState } from "react";

export default function CreateAccessories({ onNext, onPrevious }) {
  const [accessories, setAccessories] = useState([
    { name: "Handle", values: Array(5).fill("") },
    { name: "Frame", values: Array(5).fill("") },
  ]);

  const [formData, setFormData] = useState({
    title: "Windows 08",
    minSize: "1",
    minUnit: "cm",
    manufacturingCost: "Windows 08",
    increasingSize: "Windows 08",
    wholesale: "Windows 08",
    marketPrice: "Windows 08",
  });

  return (
    <div className="p-6 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 shadow">
      <div className="space-y-6">
        {/* Accessories List */}
        <div>
          <h3 className="text-lg font-medium mb-4">Ingredients List</h3>
          <button
            className="px-4 py-2 bg-teal-500 text-white rounded-md mb-4"
            onClick={() =>
              setAccessories((prev) => [
                ...prev,
                { name: "New Accessory", values: Array(7).fill("") },
              ])
            }
          >
            + Add New Ingredient
          </button>

          {accessories.map((item, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <div className="bg-teal-100 px-4 py-2 rounded-md w-24 text-center">
                {item.name}
              </div>
              <div className="flex flex-col lg:flex-row gap-5">
                {item.values.map((_, valueIndex) => (
                  <input
                    key={valueIndex}
                    type="text"
                    className="p-2 border border-gray-300 rounded-md w-full"
                  />
                ))}
              </div>
              <button className="mt-2 md:mt-0 px-4 py-2 bg-teal-500 text-white rounded-md">
                + Add
              </button>
            </div>
          ))}
        </div>

        {/* Form Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex flex-wrap lg:flex-nowrap space-y-4 lg:space-y-0 lg:space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Size & Unit
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.minSize}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      minSize: e.target.value,
                    }))
                  }
                  className="mt-1 block w-20 p-2 border border-gray-300 rounded-md"
                />
                <select
                  value={formData.minUnit}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      minUnit: e.target.value,
                    }))
                  }
                  className="mt-1 block w-24 p-2 border border-gray-300 rounded-md"
                >
                  <option value="cm">cm</option>
                  <option value="inch">inch</option>
                </select>
              </div>
            </div>
            <button className="mt-4 lg:mt-6 px-4 py-2 bg-teal-500 text-white rounded-md">
              + Add Size & Price
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Manufacturing Cost
              </label>
              <input
                type="text"
                value={formData.manufacturingCost}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    manufacturingCost: e.target.value,
                  }))
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Increasing Size
              </label>
              <input
                type="text"
                value={formData.increasingSize}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    increasingSize: e.target.value,
                  }))
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Wholesale
              </label>
              <input
                type="text"
                value={formData.wholesale}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    wholesale: e.target.value,
                  }))
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap justify-end space-y-2 md:space-y-0 md:space-x-4">
          <button
            onClick={onPrevious}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            Previous
          </button>
          <button
            onClick={onNext}
            className="px-4 py-2 bg-teal-500 text-white rounded-md"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
