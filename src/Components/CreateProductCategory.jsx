import { useState } from "react";

export default function CreateProductCategory() {
  const [formState, setFormState] = useState({
    projectTitle: "",
    accessories: "available",
    workingHour: "available",
    wholesalePrice: "available",
    marketPrice: "available",
    selectedFile: null,
    accessoryFeatures: {
      minimumUnit: false,
      minimumSize: false,
      title: false,
      wholesale: false,
      image: false,
      marketPrice: false,
      colour: false,
      manufacturingCost: false,
      increasingSize: false,
      increasingPrize: false,
    },
    ingredientFeatures: {
      minimumUnit: false,
      minimumSize: false,
      title: false,
      wholesale: false,
      image: false,
      marketPrice: false,
      colour: false,
      manufacturingCost: false,
      increasingSize: false,
      increasingPrize: false,
    },
  });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormState((prev) => ({
        ...prev,
        selectedFile: e.target.files[0],
      }));
    }
  };

  const handleCheckboxChange = (section, feature) => {
    setFormState((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [feature]: !prev[section][feature],
      },
    }));
  };

  const handleRadioChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formState);
  };

  return (
    <div className="rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 p-6">
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center mb-8">
          {/* Project Title */}
          <div className="mb-6">
            <label className="block text-lg lg:text-xl font-semibold mb-2">
              Product Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formState.projectTitle}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  projectTitle: e.target.value,
                }))
              }
              className="w-full lg:w-96 p-3 bg-blue-50/50 rounded-lg"
              placeholder="Windows 12"
            />
          </div>

          {/* Product Image */}
          <div className="mb-6">
            <label className="block text-lg lg:text-xl font-semibold mb-2">
              Product Image<span className="text-red-500">*</span>
            </label>
            <div className="flex  gap-4 items-center rounded-[24px] border-2 border-primary bg-[#CDE8E9]/60">
              <button
                type="button"
                onClick={() => document.getElementById("fileInput")?.click()}
                className="bg-teal-500 text-white px-1 lg:px-6 py-1 lg:py-3 rounded-[24px] hover:bg-teal-600 transition-colors"
              >
                Choose File
              </button>
              <span className="text-gray-500 truncate">
                {formState.selectedFile
                  ? formState.selectedFile.name
                  : "No File Chossen"}
              </span>
              <input
                id="fileInput"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>
        </div>

        {/* Accessories */}
        <div className="mb-6">
          <label className="block text-lg lg:text-xl font-semibold mb-2">
            Accessories<span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6 flex-wrap">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formState.accessories === "available"}
                onChange={() => handleRadioChange("accessories", "available")}
                className="w-5 h-5 bg-teal-500"
              />
              <span>Available</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formState.accessories === "unavailable"}
                onChange={() => handleRadioChange("accessories", "unavailable")}
                className="w-5 h-5 bg-teal-500"
              />
              <span>Unavailable</span>
            </label>
          </div>
        </div>

        {/* Accessory Features */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {Object.entries(formState.accessoryFeatures).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={value}
                onChange={() => handleCheckboxChange("accessoryFeatures", key)}
                className="w-5 h-5 bg-teal-500"
              />
              <span className="capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </span>
            </label>
          ))}
        </div>

        {/* Ingredients Section */}
        <div className="mb-6">
          <label className="block text-lg lg:text-xl font-semibold mb-2">
            Ingredients<span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(formState.ingredientFeatures).map(
              ([key, value]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() =>
                      handleCheckboxChange("ingredientFeatures", key)
                    }
                    className="w-5 h-5 bg-teal-500"
                  />
                  <span className="capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
          {/* Working Hour */}
          <div>
            <label className="block text-lg lg:text-xl font-semibold mb-2">
              Working Hour<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6 flex-wrap">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formState.workingHour === "available"}
                  onChange={() => handleRadioChange("workingHour", "available")}
                  className="w-5 h-5 bg-teal-500"
                />
                <span>Available</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formState.workingHour === "unavailable"}
                  onChange={() =>
                    handleRadioChange("workingHour", "unavailable")
                  }
                  className="w-5 h-5 bg-teal-500"
                />
                <span>Unavailable</span>
              </label>
            </div>
          </div>

          {/* Wholesale Price */}
          <div>
            <label className="block text-lg lg:text-xl font-semibold mb-2">
              Wholesale Price<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6 flex-wrap">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formState.wholesalePrice === "available"}
                  onChange={() =>
                    handleRadioChange("wholesalePrice", "available")
                  }
                  className="w-5 h-5 bg-teal-500"
                />
                <span>Available</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formState.wholesalePrice === "unavailable"}
                  onChange={() =>
                    handleRadioChange("wholesalePrice", "unavailable")
                  }
                  className="w-5 h-5 bg-teal-500"
                />
                <span>Unavailable</span>
              </label>
            </div>
          </div>

          {/* Market Price */}
          <div>
            <label className="block text-lg lg:text-xl font-semibold mb-2">
              Market Price<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6 flex-wrap">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formState.marketPrice === "available"}
                  onChange={() => handleRadioChange("marketPrice", "available")}
                  className="w-5 h-5 bg-teal-500"
                />
                <span>Available</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formState.marketPrice === "unavailable"}
                  onChange={() =>
                    handleRadioChange("marketPrice", "unavailable")
                  }
                  className="w-5 h-5 bg-teal-500"
                />
                <span>Unavailable</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-teal-500 text-white px-8 lg:px-12 py-2 lg:py-3 rounded-full text-lg lg:text-xl hover:bg-teal-600 transition-colors"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
