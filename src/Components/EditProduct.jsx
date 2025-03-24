import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Trash2, Edit2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axiosSecure from "../Hooks/AsiosSecure";
import Loader from "../Shared/Loader";
import { useSweetAlert } from "../ContextProvider/SweetAlertContext";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const [workingHours, setWorkingHours] = useState([]);
  const [showWorkingHourForm, setShowWorkingHourForm] = useState(false);
  const [editingWorkingHourIndex, setEditingWorkingHourIndex] = useState(null);
  const [workingHourData, setWorkingHourData] = useState({
    total_hour: "",
    fast_option: "Normal",
    extra_cost: "0",
  });
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryImagesPreview, setGalleryImagesPreview] = useState([]);
  const [primaryImagePreview, setPrimaryImagePreview] = useState(null);
  const { showAlert } = useSweetAlert();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      sku: "",
      quantity: "",
      category_id: "",
      description: "",
      features: [],
      primary_image: null,
      images: [],
    },
  });

  const {
    fields: featureFields = [], // Default to an empty array to avoid null error
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control,
    name: "features",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const [productRes, categoriesRes] = await Promise.all([
          axiosSecure.get(`/admin/products/${id}`),
          axiosSecure.get("/product-categories"),
        ]);
        const product = productRes.data.product;
        setCategories(categoriesRes.data);

        const formattedFeatures = product.features.map((feature) => ({
          value: feature,
        }));

        const initialWorkingHours = [
          {
            total_hour: product.total_hour,
            fast_option: product.fast_option,
            extra_cost: product.extra_cost,
          },
        ];

        reset({
          title: product.title,
          sku: product.sku,
          quantity: product.quantity,
          category_id: product.category_id,
          description: product.description,
          features: formattedFeatures,
        });

        setDimensions(product.dimensions || []);
        setWorkingHours(initialWorkingHours);
        handleImagePreviews(product);
      } catch (err) {
        setError(err.message || "Failed to fetch product data");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, reset]);

  const handleImagePreviews = (product) => {
    setPrimaryImagePreview(
      `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${product.primary_image}`
    );

    const formattedGalleryImages = product.images || [];
    setGalleryImages(formattedGalleryImages);
    setGalleryImagesPreview(
      formattedGalleryImages.map(
        (img) => `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${img}`
      )
    );
  };

  const handleDeletePrimaryImage = () => {
    setPrimaryImagePreview(null);
    // Additional backend deletion logic can be added here if necessary
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImages((prev) => [...prev, ...files]);
    setGalleryImagesPreview((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleDeleteGalleryImage = (index) => {
    const newGalleryImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(newGalleryImages);
    setGalleryImagesPreview(
      newGalleryImages.map((file) =>
        typeof file === "string"
          ? `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${file}`
          : URL.createObjectURL(file)
      )
    );
  };

  const handleWorkingHourChange = (e) => {
    const { name, value } = e.target;
    setWorkingHourData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDimension = () => {
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
  };

  const handleEditDimension = (index) => {
    setNewDimension(dimensions[index]);
    setEditingDimensionIndex(index);
    setShowDimensionForm(true);
  };

  const handleDeleteDimension = (index) => {
    setDimensions(dimensions.filter((_, i) => i !== index));
  };

  const handleEditWorkingHour = (index) => {
    setEditingWorkingHourIndex(index);
    setWorkingHourData(workingHours[index]);
    setShowWorkingHourForm(true);
  };

  const handleDeleteWorkingHour = (index) => {
    setWorkingHours(workingHours.filter((_, i) => i !== index));
  };

  const handleWorkingHourSave = () => {
    if (!workingHourData.total_hour) {
      showAlert("Error", "Total hour is required", "error");
      return;
    }

    if (editingWorkingHourIndex !== null) {
      const updatedHours = [...workingHours];
      updatedHours[editingWorkingHourIndex] = { ...workingHourData };
      setWorkingHours(updatedHours);
    } else {
      setWorkingHours((prev) => [...prev, { ...workingHourData }]);
    }

    setShowWorkingHourForm(false);
    setEditingWorkingHourIndex(null);
    setWorkingHourData({
      total_hour: "",
      fast_option: "Normal",
      extra_cost: "0",
    });
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title.trim());
      formData.append("category_id", data.category_id);
      formData.append("quantity", data.quantity);
      formData.append("sku", data.sku);
      formData.append("description", data.description);

      data.features.forEach((feature, index) => {
        formData.append(`features[${index}]`, feature.value);
      });

      workingHours.forEach((workHour, index) => {
        formData.append(
          `working_hours[${index}][total_hour]`,
          workHour.total_hour
        );
        formData.append(
          `working_hours[${index}][fast_option]`,
          workHour.fast_option
        );
        formData.append(
          `working_hours[${index}][extra_cost]`,
          workHour.extra_cost
        );
      });

      if (data.primary_image?.[0]) {
        formData.append("primary_image", data.primary_image[0]);
      }

      galleryImages.forEach((file, index) => {
        if (typeof file === "string") {
          formData.append(`existing_images[${index}]`, file);
        } else {
          formData.append(`new_images[${index}]`, file);
        }
      });

      const response = await axiosSecure.post(
        `/admin/products/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200) {
        showAlert("Success!", "Product updated successfully.", "success");
        navigate("/adminDashboard/products");
      }
    } catch (error) {
      showAlert(
        "Error",
        error.response?.data?.message || "Failed to update product",
        "error"
      );
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 border-2 border-white bg-white50 backdrop-blur-16.5 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Title
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00B5A5]"
              placeholder="Product Title"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              SKU
            </label>
            <input
              type="text"
              {...register("sku")}
              className="w-full border border-gray-200 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Quantity
            </label>
            <input
              type="number"
              {...register("quantity", { required: "Quantity is required" })}
              className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00B5A5]"
              placeholder="Quantity"
            />
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">
                {errors.quantity.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Category
            </label>
            <select
              {...register("category_id", { required: "Category is required" })}
              className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00B5A5]"
            >
              <option value="">Select Category</option>
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
            placeholder="Product Description"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm mt-6">
          <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
            <h2 className="text-lg font-medium">Features</h2>
            <button
              type="button"
              className="text-sm font-medium hover:text-black"
              onClick={() => appendFeature({ value: "" })}
            >
              + Add Feature
            </button>
          </div>
          <div className="p-4 space-y-2">
            {featureFields.length > 0 ? (
              featureFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <input
                    {...register(`features.${index}.value`, {
                      required: "Feature cannot be empty.",
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
              ))
            ) : (
              <p className="text-gray-500 text-xs mt-1">
                No features added yet.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Primary Image
            </label>
            <input
              type="file"
              {...register("primary_image")}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setPrimaryImagePreview(URL.createObjectURL(file));
                }
              }}
              className="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-violet-50 file:text-violet-700
               hover:file:bg-violet-100"
            />
            {primaryImagePreview && (
              <div className="relative mt-2 inline-block">
                <img
                  src={primaryImagePreview}
                  alt="Primary Preview"
                  className="max-h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleDeletePrimaryImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 
                   transition-opacity duration-200 hover:opacity-75"
                  aria-label="Delete primary image"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Gallery Images
            </label>
            <input
              type="file"
              multiple
              onChange={handleGalleryImagesChange}
              className="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-violet-50 file:text-violet-700
               hover:file:bg-violet-100"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {galleryImagesPreview.map((src, index) => (
                <div
                  key={index}
                  className="relative w-32 h-40 rounded-lg overflow-hidden"
                >
                  <img
                    src={src}
                    alt={`Gallery Preview ${index}`}
                    className="w-full h-full rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteGalleryImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 
         hover:bg-red-600 transition-all duration-200 
         shadow-sm hover:shadow-md"
                    aria-label={`Delete gallery image ${index + 1}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center mt-6">
          <label className="block text-lg font-medium">Dimensions</label>
          <button
            type="button"
            className="text-sm font-medium hover:text-black"
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
                  {editingWorkingHourIndex === null ? "Save" : "Update"}
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
                        className="mr-2 text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditWorkingHour(index)}
                      >
                        <Edit2 />
                      </button>
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
            className="px-6 py-2 bg-[#00B5A5] text-white rounded-lg hover:bg-black transition-colors"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}
