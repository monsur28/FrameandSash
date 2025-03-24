import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosSecure from "../Hooks/AsiosSecure";
import Loader from "../Shared/Loader";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    category_name: "",
    category_image: "", // Initialize as empty string
  });
  const [nameError, setNameError] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null); // **DEFINE selectedImageFile STATE HERE**

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axiosSecure.get(`/product-categories/${id}`);
        console.log("Fetched category:", response.data);
        setFormData({
          category_name: response.data.category_name || "",
          category_image: response.data.category_image || "",
        });
        if (response.data.category_image) {
          setImagePreview(response.data.category_image);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching category:", err);
        setError(err.message || "Failed to fetch category");
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (name === "category_name") {
      setNameError("");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("New file selected:", file.name);
      setImagePreview(URL.createObjectURL(file));
      setSelectedImageFile(file); // **SET selectedImageFile STATE HERE**
    } else {
      setImagePreview(null);
      setSelectedImageFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameError("");

    if (formData.category_name.trim().length < 3) {
      setNameError("Category name must be at least 3 characters long.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const data = new FormData();
    data.append("category_name", formData.category_name.trim());

    // **APPEND the selected image FILE to FormData (if a new file was selected):**
    if (selectedImageFile) {
      data.append("category_image", selectedImageFile); // Append the File object
    }

    console.log("FormData contents (before update category):");
    for (let pair of data.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      const response = await axiosSecure.post(
        `/product-categories/${id}`,
        data,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data", // **MAKE SURE Content-Type IS multipart/form-data**
          },
        }
      );
      console.log("Category update response:", response);
      navigate("/adminDashboard/categories");
    } catch (err) {
      console.error("Category update error:", err);
      if (err.response && err.response.status === 422) {
        const validationErrors = err.response.data;
        let errorMessage = "";
        for (const field in validationErrors) {
          errorMessage += `${validationErrors[field].join(", ")} `;
        }
        setError(errorMessage || "Validation error");
      } else {
        setError(err.message || "Failed to update category");
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Edit Category</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Category Name
          </label>
          <input
            type="text"
            name="category_name"
            value={formData.category_name}
            onChange={handleInputChange}
            className="px-4 py-2 border border-gray-300 rounded-md w-full"
            required
          />
          {nameError && (
            <p className="text-red-500 text-sm mt-1">{nameError}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Category Image
          </label>
          <input
            type="file"
            name="category_image"
            onChange={handleImageChange}
            className="px-4 py-2 border border-gray-300 rounded-md w-full"
            accept="image/*"
          />
          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">
                Current Image Preview:
              </p>
              <img
                src={imagePreview}
                alt="Category preview"
                className="h-32 object-contain border border-gray-200 rounded p-1"
              />
            </div>
          )}
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting || loading}
            className="px-4 py-2 bg-[#00A99D] text-white rounded-md hover:bg-[#00A99D]/90 disabled:opacity-50 flex items-center justify-center min-w-[120px]"
          >
            {submitting
              ? "Saving Category..."
              : loading
              ? "Uploading Image..."
              : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/adminDashboard/categories")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
