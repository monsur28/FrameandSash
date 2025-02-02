import { useState } from "react"; // Import useState from React

export default function CreateAccessories({ onNext, onPrevious }) {
  const [accessories, setAccessories] = useState([
    // Initialize an array of accessories
    {
      name: "Handle",
      values: [
        "https://i.ibb.co/xqBcyrP/door-handle-svgrepo-com-7.png",
        "https://i.ibb.co/k0rvGdC/door-handle-svgrepo-com-6.png",
        "https://i.ibb.co/0s7b5N3/door-handle-svgrepo-com-5.png",
      ],
      prices: [10, 15, 20], // Example prices for each image
    },
    {
      name: "Frame",
      values: [
        "https://i.ibb.co/1fQLrbm/closed-filled-rectangular-door-5.png",
        "https://i.ibb.co/cv0PHtN/closed-filled-rectangular-door-4.png",
        "https://i.ibb.co/VxkCXdZ/closed-filled-rectangular-door-3.png",
      ],
      prices: [25, 30, 35], // Example prices for each image
    },
  ]);

  const [showAccessoryForm, setShowAccessoryForm] = useState(false);
  const [openAccessoryIndex, setOpenAccessoryIndex] = useState(null); // Track which accessory form is open
  const [newAccessory, setNewAccessory] = useState({
    name: "",
    values: [],
    prices: [],
    imageFile: null, // Store the selected image file
    marketPrice: 0, // Store the market price from the form
    wholesalePrice: 0,
    manufacturingCost: 0,
    increasingSizes: [],
    increasingPrices: [],
    minimumUnit: false,
    minimumSize: false,
    title: false,
    totalSales: 0,
  });

  const [errors, setErrors] = useState({
    name: "",
    imageFile: "",
    marketPrice: "",
    wholesalePrice: "",
    manufacturingCost: "",
    increasingSizes: "",
    increasingPrices: "",
    minimumUnit: "",
    minimumSize: "",
    title: "",
  });

  const handleAddNewAccessoryClick = () => {
    setShowAccessoryForm(true);
    setOpenAccessoryIndex(null); // Reset to indicate a new accessory is being added
    setNewAccessory({
      name: "",
      values: [],
      prices: [],
      imageFile: null,
      marketPrice: 0,
      wholesalePrice: 0,
    }); // Reset form
  };

  const handleSaveAccessory = () => {
    // Reset errors
    setErrors({ name: "", imageFile: "", marketPrice: "" });

    // Validate form fields
    let isValid = true;
    if (!newAccessory.name.trim()) {
      setErrors((prev) => ({
        ...prev,
        name: "Please enter a name for the accessory.",
      }));
      isValid = false;
    }

    if (!newAccessory.imageFile) {
      setErrors((prev) => ({
        ...prev,
        imageFile: "Please select an image file.",
      }));
      isValid = false;
    }

    if (newAccessory.marketPrice <= 0) {
      setErrors((prev) => ({
        ...prev,
        marketPrice: "Please enter a valid market price.",
      }));
      isValid = false;
    }

    if (!isValid) return;

    const imageURL = URL.createObjectURL(newAccessory.imageFile); // Create a URL for the selected file

    if (openAccessoryIndex !== null) {
      // Update existing accessory
      setAccessories((prev) =>
        prev.map((acc, i) =>
          i === openAccessoryIndex
            ? {
                ...acc,
                values: [...acc.values, imageURL],
                prices: [...acc.prices, newAccessory.marketPrice],
              }
            : acc
        )
      );
    } else {
      // Add new accessory
      setAccessories((prev) => [
        ...prev,
        {
          name: newAccessory.name,
          values: [imageURL],
          prices: [newAccessory.marketPrice],
          wholesalePrice: newAccessory.wholesalePrice,
          manufacturingCost: newAccessory.manufacturingCost,
          increasingSizes: newAccessory.increasingSizes,
          increasingPrices: newAccessory.increasingPrices,
          minimumUnit: newAccessory.minimumUnit,
          minimumSize: newAccessory.minimumSize,
          title: newAccessory.title,
          totalSales: newAccessory.totalSales,
        },
      ]);
    }

    // Reset form
    setNewAccessory({
      name: "",
      values: [],
      prices: [],
      imageFile: null,
      marketPrice: 0,
      wholesalePrice: 0,
      manufacturingCost: 0,
      increasingSizes: [],
      increasingPrices: [],
      minimumUnit: false,
      minimumSize: false,
      title: false,
      totalSales: 0,
    });
    setShowAccessoryForm(false);
  };

  const handleCancelAccessory = () => {
    setNewAccessory({
      name: "",
      values: [],
      prices: [],
      imageFile: null,
      marketPrice: 0,
      wholesalePrice: 0,
      manufacturingCost: 0,
      increasingSizes: [],
      increasingPrices: [],
      minimumUnit: false,
      minimumSize: false,
      title: false, // Set title to false to hide the title field
      totalSales: 0,
    });
    setShowAccessoryForm(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAccessory((prev) => ({
        ...prev,
        imageFile: file,
      }));
    }
  };

  const handleEditAccessory = (index) => {
    setOpenAccessoryIndex(index);
    setShowAccessoryForm(true);
    // Populate the form with the existing accessory's name
    setNewAccessory((prev) => ({
      ...prev,
      name: accessories[index].name,
    }));
  };

  return (
    <div className="p-6 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 shadow-lg">
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
                  <div key={valueIndex} className="relative">
                    <img
                      src={value}
                      alt={`${item.name} ${valueIndex + 1}`}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <span className="absolute bottom-0 right-0 bg-black/50 text-white text-xs px-1 rounded">
                      ${item.prices[valueIndex]}
                    </span>
                  </div>
                ))}
              </div>
              <button
                className="px-4 py-2 bg-teal-500 text-white rounded-md"
                onClick={() => handleEditAccessory(index)}
              >
                + Add New
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
                {errors.name && (
                  <span className="text-red-500 text-xs">{errors.name}</span>
                )}
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
                  <span className="text-gray-500">
                    {newAccessory.imageFile
                      ? newAccessory.imageFile.name
                      : "No File Chosen"}
                  </span>
                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                {errors.imageFile && (
                  <span className="text-red-500 text-xs">
                    {errors.imageFile}
                  </span>
                )}
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
                  {errors.minimumSize && (
                    <span className="text-red-500 text-xs">
                      {errors.minimumSize}
                    </span>
                  )}
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
                  {errors.increasingPrices && (
                    <span className="text-red-500 text-xs">
                      {errors.increasingPrices}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Wholesale & Market Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Wholesale</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={newAccessory.wholesalePrice}
                  onChange={(e) =>
                    setNewAccessory((prev) => ({
                      ...prev,
                      wholesalePrice: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-teal-500"
                  {...(errors.wholesalePrice && {
                    className: "border-red-500",
                  })}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Market Price
                </label>
                <input
                  type="number"
                  placeholder="$0"
                  value={newAccessory.marketPrice}
                  onChange={(e) =>
                    setNewAccessory((prev) => ({
                      ...prev,
                      marketPrice: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-teal-500"
                />
                {errors.marketPrice && (
                  <span className="text-red-500 text-xs">
                    {errors.marketPrice}
                  </span>
                )}
              </div>
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
