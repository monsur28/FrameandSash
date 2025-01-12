import { useState } from "react";

export default function CreateAccessories({ onNext, onPrevious }) {
  const [accessories, setAccessories] = useState([
    {
      name: "Handle",
      values: [
        "https://i.ibb.co/xqBcyrP/door-handle-svgrepo-com-7.png",
        "https://i.ibb.co/k0rvGdC/door-handle-svgrepo-com-6.png",
        "https://i.ibb.co/0s7b5N3/door-handle-svgrepo-com-5.png",
      ],
    },
    {
      name: "Frame",
      values: [
        "https://i.ibb.co/1fQLrbm/closed-filled-rectangular-door-5.png",
        "https://i.ibb.co/cv0PHtN/closed-filled-rectangular-door-4.png",
        "https://i.ibb.co/VxkCXdZ/closed-filled-rectangular-door-3.png",
      ],
    },
  ]);

  const [showAccessoryForm, setShowAccessoryForm] = useState(false);
  const [newAccessory, setNewAccessory] = useState({
    name: "",
    values: [],
  });

  const handleAddNewAccessoryClick = () => {
    setShowAccessoryForm(true);
  };

  const handleSaveAccessory = () => {
    if (newAccessory.name.trim()) {
      setAccessories((prev) => [...prev, newAccessory]);
      setNewAccessory({ name: "", values: [] });
      setShowAccessoryForm(false);
    }
  };

  const handleCancelAccessory = () => {
    setNewAccessory({ name: "", values: [] });
    setShowAccessoryForm(false);
  };

  const handleAddImageToNewAccessory = () => {
    const imageURL = prompt("Enter Image URL");
    if (imageURL) {
      setNewAccessory((prev) => ({
        ...prev,
        values: [...prev.values, imageURL],
      }));
    }
  };

  return (
    <div className=" p-6 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 shadow-lg">
      <div className="space-y-6">
        {/* Accessories Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <h3 className="text-lg font-medium mb-4">Accessories List</h3>
          <button
            className="px-4 py-2 bg-teal-500 text-white rounded-md"
            onClick={handleAddNewAccessoryClick}
          >
            + Add New Accessory
          </button>
        </div>

        {/* Accessories List */}
        {accessories.map((item, index) => (
          <div key={index} className="space-y-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-teal-100 px-4 py-2 rounded-md w-24 text-center">
                {item.name}
              </div>
              <div className="flex flex-wrap gap-4">
                {item.values.map((value, valueIndex) => (
                  <img
                    key={valueIndex}
                    src={value}
                    alt={`${item.name} ${valueIndex + 1}`}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                ))}
              </div>
              <button
                className="px-4 py-2 bg-teal-500 text-white rounded-md"
                onClick={() => {
                  const imageURL = prompt("Enter Image URL");
                  if (imageURL) {
                    setAccessories((prev) =>
                      prev.map((acc, i) =>
                        i === index
                          ? { ...acc, values: [...acc.values, imageURL] }
                          : acc
                      )
                    );
                  }
                }}
              >
                + Add Image
              </button>
            </div>
          </div>
        ))}

        {/* New Accessory Form */}
        {showAccessoryForm && (
          <div className="mt-8 space-y-6 p-6 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 shadow-lg">
            {/* Title */}
            <div className="flex flex-col lg:flex-row gap-6 justify-between">
              <div className="space-y-2 w-full lg:w-1/3">
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={newAccessory.name}
                  onChange={(e) =>
                    setNewAccessory((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter accessory name"
                  className="w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-teal-500"
                />
              </div>

              {/* Image Upload */}
              <div className="w-full lg:w-1/3">
                <label
                  htmlFor="fileInput"
                  className="block text-sm font-semibold mb-2"
                >
                  Image<span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 items-center rounded-[24px] border-2 border-primary bg-[#CDE8E9]/60">
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
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

              {/* Color Selection */}
              <div className="space-y-2 w-full lg:w-1/3">
                <label className="block text-sm font-medium">Color</label>
                <div className="flex gap-2">
                  {["black", "white", "blue", "red", "pink"].map(
                    (color, idx) => (
                      <div
                        key={idx}
                        className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
                          color === "black" ? "bg-black" : `bg-${color}`
                        }`}
                      ></div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Minimum Size & Unit */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="space-y-2 w-full lg:w-auto">
                <label className="block text-sm font-medium">
                  Minimum Size & Unit
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="1"
                    className="w-20 p-3 border border-gray-300 rounded-md bg-white focus:outline-teal-500"
                  />
                  <select className="p-3 border border-gray-300 rounded-md bg-white focus:outline-teal-500">
                    <option>cm</option>
                    <option>mm</option>
                    <option>in</option>
                  </select>
                </div>
              </div>
              <button className="flex justify-center items-center gap-1 bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors">
                <span>+</span>
                Add Size & Price
              </button>
            </div>

            {/* Pricing Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Manufacturing Cost",
                "Increasing Size",
                "Increasing Price",
              ].map((label, idx) => (
                <div key={idx} className="space-y-2">
                  <label className="block text-sm font-medium">{label}</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-teal-500"
                  />
                </div>
              ))}
            </div>

            {/* Wholesale & Market Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["Wholesale", "Market Price"].map((label, idx) => (
                <div key={idx} className="space-y-2">
                  <label className="block text-sm font-medium">{label}</label>
                  <input
                    type="number"
                    placeholder="$0"
                    className="w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-teal-500"
                  />
                </div>
              ))}
            </div>

            {/* Save & Cancel Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                onClick={handleCancelAccessory}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                onClick={handleSaveAccessory}
              >
                Save
              </button>
            </div>
          </div>
        )}

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
