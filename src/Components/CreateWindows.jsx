import { useState } from "react";

export default function CreateWindows({ onNext }) {
  const [manufacture, setManufacture] = useState("");
  const [dimensions, setDimensions] = useState({ width: "1", height: "1" });
  const [windowType, setWindowType] = useState("Windows 08");
  const [ingredients, setIngredients] = useState([
    { id: "1", name: "Frame", minSize: "4m", minCost: "250" },
    { id: "2", name: "Sash", minSize: "4m", minCost: "250" },
    { id: "3", name: "Glass", minSize: "1m", minCost: "250" },
    { id: "4", name: "Set Of Hardware", minSize: "1 Set", minCost: "$250" },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: "Windows 08",
    minSize: "1",
    minCost: "",
    manufacturingCost: "210",
    increasingSizes: ["50", "70"],
    wholesale: "250",
    marketPrice: "300",
    unit: "cm",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIngredients([
      ...ingredients,
      {
        id: Date.now().toString(), // Generate a unique id
        ...newIngredient,
      },
    ]);
    setNewIngredient({
      name: "Windows 08",
      minSize: "1",
      minCost: "",
      manufacturingCost: "250",
      increasingSizes: ["20", "25"],
      wholesale: "250",
      marketPrice: "300",
      unit: "cm",
    });
    setIsFormOpen(false);
  };

  const deleteIngredient = (id) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  return (
    <div className="p-6 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 shadow">
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="windowType"
              className="text-sm font-medium text-gray-700"
            >
              Windows Type
            </label>
            <input
              type="text"
              id="windowType"
              value={windowType}
              onChange={(e) => setWindowType(e.target.value)}
              placeholder="Enter window type"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Image Upload Field */}
          <div>
            <label
              htmlFor="fileInput"
              className="block text-sm font-semibold mb-2"
            >
              Image<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4 items-center rounded-[24px] border-2 border-primary bg-[#CDE8E9]/60">
              <button
                type="button"
                onClick={() => document.getElementById("fileInput")?.click()}
                className="bg-teal-500 text-white px-6 py-3 rounded-[24px] hover:bg-teal-600 transition-colors"
              >
                Choose File
              </button>
              <span className="text-gray-500">No File Chosen</span>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>
        </div>

        <form className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr_1fr] items-center">
          {/* Dimensions Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="dimensions"
              className="block text-sm font-medium text-gray-700"
            >
              Dimensions
            </label>
            <div className="flex gap-2 items-center">
              <input
                id="width"
                type="text"
                value={dimensions.width}
                onChange={(e) =>
                  setDimensions({ ...dimensions, width: e.target.value })
                }
                placeholder="Width"
                className="w-full p-2 border border-gray-300 rounded-md text-center focus:ring-teal-500 focus:border-teal-500"
              />
              <span className="font-semibold text-gray-600">x</span>
              <input
                id="height"
                type="text"
                value={dimensions.height}
                onChange={(e) =>
                  setDimensions({ ...dimensions, height: e.target.value })
                }
                placeholder="Height"
                className="w-full p-2 border border-gray-300 rounded-md text-center focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Unit Dropdown */}
          <div>
            <label
              htmlFor="unit"
              className="block text-sm font-medium text-gray-700"
            >
              Unit
            </label>
            <select
              id="unit"
              value={dimensions.unit}
              onChange={(e) =>
                setDimensions({ ...dimensions, unit: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="m">m</option>
              <option value="cm">cm</option>
              <option value="mm">mm</option>
            </select>
          </div>

          {/* Event Date Added */}
          <div>
            <label
              htmlFor="event-date"
              className="block text-sm font-medium text-gray-700"
            >
              Event Date added
            </label>
            <input
              id="event-date"
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Event Update Added */}
          <div>
            <label
              htmlFor="event-update"
              className="block text-sm font-medium text-gray-700"
            >
              Event Update added
            </label>
            <input
              id="event-update"
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </form>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Ingredients List</h3>
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
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
                    <td className="px-6 py-4">${ingredient.minCost}</td>
                    <td className="px-6 py-4">
                      <button className="text-teal-500 mr-2">Edit</button>
                      <button
                        onClick={() => deleteIngredient(ingredient.id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out ${
            isFormOpen ? "max-h-[1000px]" : "max-h-0"
          }`}
        >
          <form onSubmit={handleSubmit} className="bg-teal-50 p-6 rounded-md">
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={newIngredient.name}
                  onChange={(e) =>
                    setNewIngredient({ ...newIngredient, name: e.target.value })
                  }
                  className="w-full p-3 rounded-md bg-[#f8fffe] border border-[#e5e7eb]"
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-2">
                  Minimum Size & Unit
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newIngredient.minSize}
                    onChange={(e) =>
                      setNewIngredient({
                        ...newIngredient,
                        minSize: e.target.value,
                      })
                    }
                    className="w-24 p-3 rounded-md bg-[#f8fffe] border border-[#e5e7eb]"
                  />
                  <select
                    value={newIngredient.unit}
                    onChange={(e) =>
                      setNewIngredient({
                        ...newIngredient,
                        unit: e.target.value,
                      })
                    }
                    className="w-32 p-3 rounded-md bg-[#f8fffe] border border-[#e5e7eb]"
                  >
                    <option value="cm">cm</option>
                    <option value="inch">inch</option>
                    <option value="m">m</option>
                  </select>
                </div>
                <button className="flex items-center gap-1 bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors mt-6">
                  <span>+</span>
                  Add Size & Price
                </button>
              </div>

              <div>
                <label className="block text-lg font-medium mb-2">
                  Minimum Cost
                </label>
                <input
                  type="text"
                  value={newIngredient.minCost}
                  onChange={(e) =>
                    setNewIngredient({
                      ...newIngredient,
                      minCost: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-md bg-[#f8fffe] border border-[#e5e7eb]"
                  placeholder="Enter minimum cost"
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-2">
                  Manufacturing Cost
                </label>
                <input
                  type="text"
                  value={newIngredient.manufacturingCost}
                  onChange={(e) =>
                    setNewIngredient({
                      ...newIngredient,
                      manufacturingCost: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-md bg-[#f8fffe] border border-[#e5e7eb]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {newIngredient.increasingSizes?.map((size, index) => (
                  <div key={index}>
                    <label className="block text-lg font-medium mb-2">
                      Increasing Size
                    </label>
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => {
                        const newSizes = [
                          ...(newIngredient.increasingSizes || []),
                        ];
                        newSizes[index] = e.target.value;
                        setNewIngredient({
                          ...newIngredient,
                          increasingSizes: newSizes,
                        });
                      }}
                      className="w-full p-3 rounded-md bg-[#f8fffe] border border-[#e5e7eb]"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-medium mb-2">
                    Wholesale
                  </label>
                  <input
                    type="text"
                    value={newIngredient.wholesale}
                    onChange={(e) =>
                      setNewIngredient({
                        ...newIngredient,
                        wholesale: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-md bg-[#f8fffe] border border-[#e5e7eb]"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2">
                    Market Price
                  </label>
                  <input
                    type="text"
                    value={newIngredient.marketPrice}
                    onChange={(e) =>
                      setNewIngredient({
                        ...newIngredient,
                        marketPrice: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-md bg-[#f8fffe] border border-[#e5e7eb]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#00b5b7] text-white rounded-md hover:bg-[#009b9d]"
              >
                Save
              </button>
            </div>
          </form>
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
