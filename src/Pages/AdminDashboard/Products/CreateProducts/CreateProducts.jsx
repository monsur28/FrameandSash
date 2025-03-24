import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Edit2, Trash2 } from "lucide-react";
import axiosSecure from "../../../../Hooks/AsiosSecure";
import ProductConfiguration from "../ProductConfigurator/ProductConfigurator";
import { useSweetAlert } from "../../../../ContextProvider/SweetAlertContext";

export default function CreateProducts() {
  const [isPreMade, setIsPreMade] = useState(true);
  const { showAlert } = useSweetAlert();
  const [categories, setCategories] = useState([]);
  const [dimensions, setDimensions] = useState([]);
  const [showDimensionForm, setShowDimensionForm] = useState(false);
  const [editingDimensionIndex, setEditingDimensionIndex] = useState(null);
  const [newDimension, setNewDimension] = useState({
    height: "",
    width: "",
    unit: "mm",
    price: "",
    wholesale_price: "",
  });
  const [workingHourData, setWorkingHourData] = useState({
    total_hour: "",
    fast_option: "Normal",
    extra_cost: "0",
  });
  const [showWorkingHourForm, setShowWorkingHourForm] = useState(false);
  const [workingHours, setWorkingHours] = useState([]);

  const generateUniqueSku = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `SKU-${timestamp}-${random}`;
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category_id: "",
      title: "",
      description: "",
      quantity: "",
      features: [],
      primary_image: null,
      images: [],
    },
  });

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control,
    name: "features",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosSecure.get("/product-categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleAddDimension = () => {
    const { height, width, unit } = newDimension;
    if (height.trim() && width.trim() && unit.trim()) {
      if (editingDimensionIndex === null) {
        setDimensions((prev) => [...prev, { ...newDimension }]);
      } else {
        const updatedDimensions = [...dimensions];
        updatedDimensions[editingDimensionIndex] = { ...newDimension };
        setDimensions(updatedDimensions);
        setEditingDimensionIndex(null);
      }
      setNewDimension({
        height: "",
        width: "",
        unit: "mm",
        price: "",
        wholesale_price: "",
      });
      setShowDimensionForm(false);
    }
  };

  const handleEditDimension = (index) => {
    setNewDimension(dimensions[index]);
    setEditingDimensionIndex(index);
    setShowDimensionForm(true);
  };

  const handleDeleteDimension = (index) => {
    setDimensions(dimensions.filter((_, i) => i !== index));
  };

  const handleWorkingHourChange = (e) => {
    const { name, value } = e.target;
    setWorkingHourData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWorkingHourSave = () => {
    if (!workingHourData.total_hour) {
      alert("Total hour is required");
      return;
    }

    setWorkingHours((prev) => [...prev, { ...workingHourData }]);
    setShowWorkingHourForm(false);
  };

  const handleDeleteWorkingHour = (index) => {
    setWorkingHours(workingHours.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      if (Object.keys(errors).length) {
        alert("Please fix the highlighted errors before submitting.");
        return; // Prevent form submission
      }

      // Basic fields
      formData.append("category_id", data.category_id);
      formData.append("title", data.title.trim());
      formData.append("description", data.description.trim());
      formData.append("quantity", data.quantity);
      formData.append("sku", generateUniqueSku());

      // Features
      const features = data.features.map((f) => f.value);
      features.forEach((feature, index) => {
        formData.append(`features[${index}]`, feature);
      });

      // Dimensions
      dimensions.forEach((dim, index) => {
        Object.entries(dim).forEach(([key, value]) => {
          formData.append(`dimensions[${index}][${key}]`, value);
        });
      });

      // Working Hours Data
      formData.append("total_hour", workingHourData.total_hour);
      formData.append("fast_option", workingHourData.fast_option);
      formData.append("extra_cost", workingHourData.extra_cost);

      // Images
      if (!data.primary_image?.[0]) {
        throw new Error("Primary image is required");
      }
      formData.append("primary_image", data.primary_image[0]);

      if (data.images?.length) {
        Array.from(data.images).forEach((file, index) => {
          formData.append(`images[${index}]`, file);
        });
      }

      const response = await axiosSecure.post("/admin/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      if (response.status === 201) {
        showAlert("Product created successfully", "success");
        navigator.vibrate(200);
        handleFormReset();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    console.error("Submission Error:", error);
    if (error.response?.data?.errors) {
      const messages = Object.values(error.response.data.errors).flat();
      alert(`Validation errors:\n${messages.join("\n")}`);
    } else if (error.message) {
      alert(error.message);
    } else {
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleFormReset = () => {
    reset();
    setWorkingHourData({
      total_hour: "",
      fast_option: "Normal",
      extra_cost: "0",
    });
    setDimensions([]);
    setWorkingHours([]);
  };

  return (
    <div className="p-6 border-2 border-white bg-white50 backdrop-blur-16.5 rounded-lg shadow-sm">
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-full p-1 inline-flex">
          <button
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              isPreMade
                ? "bg-[#00B5A5] text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setIsPreMade(true)}
          >
            Pre-Made Product
          </button>
          <button
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              !isPreMade
                ? "bg-[#00B5A5] text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setIsPreMade(false)}
          >
            Custom Configurator
          </button>
        </div>
      </div>

      {isPreMade ? (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Category
            </label>
            <select
              {...register("category_id", { required: "Category is required" })}
              className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00B5A5]"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.category_id.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Title
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00B5A5]"
              placeholder="Title"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              className="w-full border border-gray-200 rounded-lg p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#00B5A5]"
              placeholder="Description"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-700 text-sm font-medium">
                Key Feature
              </label>
              <button
                type="button"
                className="text-[#00B5A5] text-sm font-medium hover:text-[#009688]"
                onClick={() => appendFeature({ value: "" })}
              >
                + Add Feature
              </button>
            </div>
            {featureFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mb-2">
                <input
                  {...register(`features.${index}.value`, {
                    required: "Feature cannot be empty",
                  })}
                  className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00B5A5]"
                  placeholder="Enter a feature"
                />
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeFeature(index)}
                >
                  <Trash2 size={15} />
                </button>
                {errors.features?.[index]?.value && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.features[index].value.message}
                  </p>
                )}
              </div>
            ))}

            {errors.features && (
              <p className="text-red-500 text-xs mt-1">
                At least one feature is required
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                SKU
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                value={generateUniqueSku()}
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Quantity
              </label>
              <input
                type="number"
                {...register("quantity", { required: "Quantity is required" })}
                className="w-full border border-gray-200 rounded-lg p-3"
                placeholder="Quantity"
              />
              {errors.quantity && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.quantity.message}
                </p>
              )}
            </div>
          </div>

          <div className="w-full p-6 border border-white bg-white50 backdrop-blur-16.5 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Primary Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("primary_image", {
                    required: "Primary image is required",
                  })}
                  className="block w-full text-sm text-gray-500
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-full file:border-0
                             file:text-sm file:font-semibold
                             file:bg-violet-50 file:text-violet-700
                             hover:file:bg-violet-100"
                />
                {errors.primary_image && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.primary_image.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Gallery Images <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  {...register("images", {
                    required: "At least one gallery image is required",
                  })}
                  className="block w-full text-sm text-gray-500
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-full file:border-0
                             file:text-sm file:font-semibold
                             file:bg-violet-50 file:text-violet-700
                             hover:file:bg-violet-100"
                />
                {errors.images && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.images.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
              <label className="block text-lg font-medium">Dimensions</label>
              <button
                type="button"
                className="text-sm font-medium hover:text-[#009688]"
                onClick={() => {
                  setShowDimensionForm(true);
                  setEditingDimensionIndex(null);
                  setNewDimension({
                    height: "",
                    width: "",
                    unit: "mm",
                    price: "",
                    wholesale_price: "",
                  });
                }}
              >
                + Add Dimension
              </button>
            </div>

            {showDimensionForm && (
              <div className="border border-gray-200 p-4 rounded-md mb-4">
                <div className="grid grid-cols-5 gap-2 mb-2">
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700">
                      Height
                    </label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded p-2 focus:outline-none"
                      value={newDimension.height}
                      onChange={(e) =>
                        setNewDimension({
                          ...newDimension,
                          height: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700">
                      Width
                    </label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded p-2 focus:outline-none"
                      value={newDimension.width}
                      onChange={(e) =>
                        setNewDimension({
                          ...newDimension,
                          width: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700">
                      Unit
                    </label>
                    <select
                      className="border border-gray-300 rounded p-2 focus:outline-none"
                      value={newDimension.unit}
                      onChange={(e) =>
                        setNewDimension({
                          ...newDimension,
                          unit: e.target.value,
                        })
                      }
                    >
                      <option value="mm">mm</option>
                      <option value="cm">cm</option>
                      <option value="ft">ft</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700">
                      Price
                    </label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded p-2 focus:outline-none"
                      value={newDimension.price}
                      onChange={(e) =>
                        setNewDimension({
                          ...newDimension,
                          price: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700">
                      Wholesale Price
                    </label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded p-2 focus:outline-none"
                      value={newDimension.wholesale_price}
                      onChange={(e) =>
                        setNewDimension({
                          ...newDimension,
                          wholesale_price: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    onClick={() => setShowDimensionForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-[#20c997] rounded-md hover:bg-[#1ba883]"
                    onClick={handleAddDimension}
                  >
                    {editingDimensionIndex === null
                      ? "Save Dimension"
                      : "Update Dimension"}
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#E5F7F6]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Height
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Width
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Unit
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Wholesale Price
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dimensions.map((dim, index) => (
                    <tr key={index} className="bg-[#F5FCFB]">
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {dim.height}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {dim.width}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {dim.unit}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        ${dim.price}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        ${dim.wholesale_price}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <button
                          type="button"
                          className="mr-2 text-blue-500 hover:text-blue-700"
                          onClick={() => handleEditDimension(index)}
                        >
                          <Edit2 />
                        </button>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteDimension(index)}
                        >
                          <Trash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm mt-6">
            <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
              <h2 className="text-lg font-medium">Estimated Working Hour</h2>
              <button
                type="button"
                className="text-sm hover:underline"
                onClick={() => setShowWorkingHourForm(!showWorkingHourForm)}
              >
                {showWorkingHourForm ? "Hide" : "Show more"}
              </button>
            </div>
            {showWorkingHourForm && (
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Total Hour
                  </label>
                  <input
                    type="text"
                    name="total_hour"
                    value={workingHourData.total_hour}
                    onChange={handleWorkingHourChange}
                    placeholder="Total Hour"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#20c997]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Fast Option
                    </label>
                    <select
                      name="fast_option"
                      value={workingHourData.fast_option}
                      onChange={handleWorkingHourChange}
                      className="w-full pl-2 pr-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Express">Express</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Extra Cost
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="text"
                        name="extra_cost"
                        value={workingHourData.extra_cost}
                        onChange={handleWorkingHourChange}
                        placeholder="Extra Cost"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#20c997]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    onClick={() => {
                      setShowWorkingHourForm(false);
                      setWorkingHourData({
                        total_hour: "",
                        fast_option: "Normal",
                        extra_cost: "0",
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleWorkingHourSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#20c997] rounded-md hover:bg-[#1ba883]"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
            {workingHours.length > 0 && (
              <table className="w-full mt-4">
                <thead className="bg-[#E5F7F6]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Total Hour
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Fast Option
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Extra Cost
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {workingHours.map((wh, index) => (
                    <tr key={index} className="bg-[#F5FCFB]">
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {wh.total_hour}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {wh.fast_option}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        ${wh.extra_cost}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteWorkingHour(index)}
                        >
                          <Trash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-[#00B5A5] text-white rounded-lg hover:bg-[#009688] transition-colors"
            >
              Publish
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-12">
          <ProductConfiguration />
        </div>
      )}
    </div>
  );
}
