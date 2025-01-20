import { useState } from "react";
import axiosSecure from "../Hooks/AsiosSecure";
import { useSweetAlert } from "../ContextProvider/SweetAlertContext";

export default function CreateProductCategory() {
  const { showAlert } = useSweetAlert();
  const [formState, setFormState] = useState({
    category_name: "",
    category_image: null,
    accessories_available: false,
    accessories_attributes: {
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
    ingredients_attributes: {
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
    working_hour_available: false,
    wholesale_price_available: false,
    market_price_available: false,
  });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormState((prev) => ({
        ...prev,
        category_image: e.target.files[0],
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
    const booleanValue = value === "true";
    setFormState((prev) => ({
      ...prev,
      [field]: booleanValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category_name", formState.category_name);

    // Convert boolean values to 1 or 0 before appending
    formData.append(
      "accessories_available",
      formState.accessories_available ? 1 : 0
    );
    formData.append(
      "working_hour_available",
      formState.working_hour_available ? 1 : 0
    );
    formData.append(
      "wholesale_price_available",
      formState.wholesale_price_available ? 1 : 0
    );
    formData.append(
      "market_price_available",
      formState.market_price_available ? 1 : 0
    );

    if (formState.category_image) {
      formData.append("category_image", formState.category_image);
    }

    Object.entries(formState.accessories_attributes).forEach(
      ([key, value]) =>
        formData.append(`accessories_attributes[${key}]`, value ? 1 : 0) // Converting  boolean attributes to 0 or 1
    );
    Object.entries(formState.ingredients_attributes).forEach(
      ([key, value]) =>
        formData.append(`ingredients_attributes[${key}]`, value ? 1 : 0) // Converting  boolean attributes to 0 or 1
    );

    // Log the formData for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      await axiosSecure.post("/api/product-categories", formData);
      showAlert(
        "Success!",
        "Product category created successfully.",
        "success"
      );
    } catch (error) {
      showAlert(
        "Error!",
        `${error.response?.data?.message || "An error occurred."}`,
        "error"
      );
    }
  };

  return (
    <div className="rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 p-6">
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center mb-8">
          <div className="mb-6">
            <label className="block text-lg lg:text-xl font-semibold mb-2">
              Category Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formState.category_name}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  category_name: e.target.value,
                }))
              }
              className="w-full lg:w-96 p-3 bg-blue-50/50 rounded-lg"
              placeholder="Windows 12"
              required // Make sure this field is required
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg lg:text-xl font-semibold mb-2">
              Category Image<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4 items-center rounded-[24px] border-2 border-primary bg-[#CDE8E9]/60">
              <button
                type="button"
                onClick={() => document.getElementById("fileInput")?.click()}
                className="bg-teal-500 text-white px-1 lg:px-6 py-1 lg:py-3 rounded-[24px] hover:bg-teal-600 transition-colors"
              >
                Choose File
              </button>
              <span className="text-gray-500 truncate">
                {formState.category_image
                  ? formState.category_image.name
                  : "No File Chosen"}
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

        <div className="mb-6">
          <label className="block text-lg lg:text-xl font-semibold mb-2">
            Accessories Availability<span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6 flex-wrap">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formState.accessories_available === true}
                onChange={() =>
                  handleRadioChange("accessories_available", "true")
                }
                className="w-5 h-5 bg-teal-500"
                value="true"
              />
              <span>Available</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formState.accessories_available === false}
                onChange={() =>
                  handleRadioChange("accessories_available", "false")
                }
                className="w-5 h-5 bg-teal-500"
                value="false"
              />
              <span>Unavailable</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {Object.entries(formState.accessories_attributes).map(
            ([key, value]) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() =>
                    handleCheckboxChange("accessories_attributes", key)
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

        <div className="mb-6">
          <label className="block text-lg lg:text-xl font-semibold mb-2">
            Ingredients<span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(formState.ingredients_attributes).map(
              ([key, value]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() =>
                      handleCheckboxChange("ingredients_attributes", key)
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
          <div className="mb-6">
            <label className="block text-lg lg:text-xl font-semibold mb-2">
              Working Hour Availability<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6 flex-wrap">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formState.working_hour_available === true}
                  onChange={() =>
                    handleRadioChange("working_hour_available", "true")
                  }
                  className="w-5 h-5 bg-teal-500"
                  value="true"
                />
                <span>Available</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formState.working_hour_available === false}
                  onChange={() =>
                    handleRadioChange("working_hour_available", "false")
                  }
                  className="w-5 h-5 bg-teal-500"
                  value="false"
                />
                <span>Unavailable</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-lg lg:text-xl font-semibold mb-2">
              Wholesale Price Availability
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6 flex-wrap">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formState.wholesale_price_available === true}
                  onChange={() =>
                    handleRadioChange("wholesale_price_available", "true")
                  }
                  className="w-5 h-5 bg-teal-500"
                  value="true"
                />
                <span>Available</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formState.wholesale_price_available === false}
                  onChange={() =>
                    handleRadioChange("wholesale_price_available", "false")
                  }
                  className="w-5 h-5 bg-teal-500"
                  value="false"
                />
                <span>Unavailable</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-lg lg:text-xl font-semibold mb-2">
              Market Price Availability<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6 flex-wrap">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formState.market_price_available === true}
                  onChange={() =>
                    handleRadioChange("market_price_available", "true")
                  }
                  className="w-5 h-5 bg-teal-500"
                  value="true"
                />
                <span>Available</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formState.market_price_available === false}
                  onChange={() =>
                    handleRadioChange("market_price_available", "false")
                  }
                  className="w-5 h-5 bg-teal-500"
                  value="false"
                />
                <span>Unavailable</span>
              </label>
            </div>
          </div>
        </div>

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
