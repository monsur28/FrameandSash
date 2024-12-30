import { useState } from "react";

export default function CreateWindows({ onNext }) {
  const [manufacture, setManufacture] = useState("");
  const [dimensions, setDimensions] = useState({ width: "1", height: "1" });
  const [unit, setUnit] = useState("1");
  const [windowType, setWindowType] = useState("Windows 08");
  const [ingredients, setIngredients] = useState([
    { name: "Frame", minSize: "4m", minCost: "$250" },
    { name: "Sash", minSize: "4m", minCost: "$250" },
    { name: "Glass", minSize: "1m", minCost: "$250" },
    { name: "Set Of Hardware", minSize: "1 Set", minCost: "$250" },
  ]);

  return (
    <div className=" p-6 rounded-[24px] border-2 border-white bg-white/50 backdrop-blur-[16.5px]  shadow">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Manufacture
          </label>
          <select
            value={manufacture}
            onChange={(e) => setManufacture(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select...</option>
            <option value="manufacture1">Manufacture 1</option>
            <option value="manufacture2">Manufacture 2</option>
          </select>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Width
            </label>
            <input
              type="number"
              value={dimensions.width}
              onChange={(e) =>
                setDimensions((prev) => ({ ...prev, width: e.target.value }))
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-end">
            <span className="text-xl">×</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Height
            </label>
            <input
              type="number"
              value={dimensions.height}
              onChange={(e) =>
                setDimensions((prev) => ({ ...prev, height: e.target.value }))
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unit
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Windows Type
          </label>
          <input
            type="text"
            value={windowType}
            onChange={(e) => setWindowType(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Ingredients List</h3>
            <button
              onClick={() =>
                setIngredients([
                  ...ingredients,
                  { name: "New Ingredient", minSize: "1m", minCost: "$100" },
                ])
              }
              className="px-4 py-2 bg-teal-500 text-white rounded-md"
            >
              + Add New Ingredient
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Minimum Size
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Minimum Cost
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ingredient, index) => (
                  <tr key={index} className="bg-teal-50">
                    <td className="px-6 py-4">{ingredient.name}</td>
                    <td className="px-6 py-4">{ingredient.minSize}</td>
                    <td className="px-6 py-4">{ingredient.minCost}</td>
                    <td className="px-6 py-4">
                      <button className="text-teal-500 mr-2">Edit</button>
                      <button className="text-red-500">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button className="px-4 py-2 border border-gray-300 rounded-md">
            Cancel
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
