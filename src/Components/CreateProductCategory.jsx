import { useState } from "react";
import { useSweetAlert } from "../ContextProvider/SweetAlertContext";
import axiosSecure from "../Hooks/AsiosSecure";
import { useNavigate } from "react-router-dom";

export default function CreateProductCategory() {
  const { showAlert } = useSweetAlert();
  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append all string and boolean values
    formData.append("category_name", formState.category_name);
    formData.append(
      "accessories_available",
      formState.accessories_available ? "1" : "0"
    );
    formData.append(
      "working_hour_available",
      formState.working_hour_available ? "1" : "0"
    );
    formData.append(
      "wholesale_price_available",
      formState.wholesale_price_available ? "1" : "0"
    );
    formData.append(
      "market_price_available",
      formState.market_price_available ? "1" : "0"
    );

    // Append file input
    if (formState.category_image) {
      formData.append("category_image", formState.category_image);
    }

    // Append nested objects (e.g., accessories_attributes)
    Object.entries(formState.accessories_attributes).forEach(([key, value]) => {
      formData.append(`accessories_attributes[${key}]`, value ? "1" : "0");
    });

    Object.entries(formState.ingredients_attributes).forEach(([key, value]) => {
      formData.append(`ingredients_attributes[${key}]`, value ? "1" : "0");
    });

    // Debugging: Log all FormData entries
    console.log("Form Data:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Submit FormData
    try {
      await axiosSecure.post("/product-categories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showAlert(
        "Success!",
        "Product category created successfully.",
        "success"
      );
      navigate("/adminDashboard/products"); // Redirect after success
    } catch (error) {
      console.error("Error creating product category:", error);
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
        {/* Category Name */}
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
              placeholder="Windows"
              required
            />
          </div>

          {/* Category Image */}
          <div className="mb-6">
            <label className="block text-lg lg:text-xl font-semibold mb-2">
              Category Image<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4 items-center rounded-[24px] border-2 border-primary bg-[#CDE8E9]/60">
              <button
                type="button"
                onClick={() => document.getElementById("fileInput").click()}
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
