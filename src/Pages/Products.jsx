import { useEffect, useState } from "react";
import { FileEdit, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../ContextProvider/LanguageContext";
import axiosSecure from "../Hooks/AsiosSecure";
import Swal from "sweetalert2";
import { useSweetAlert } from "../ContextProvider/SweetAlertContext";

export default function Products() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useSweetAlert();

  useEffect(() => {
    // Fetch product categories from the API
    const fetchProducts = async () => {
      try {
        const response = await axiosSecure.get("/api/product-categories"); // Replace with your API endpoint
        const data = response.data || [];
        setProducts(data);
      } catch (error) {
        console.error("Error fetching product categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (productId) => {
    navigate(`/dashboard/products/edit/${productId}`);
  };

  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/api/product-categories/${productId}`);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
        showAlert("Deleted!", "Your product has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting product:", error);
        Swal.fire("Failed!", "Unable to delete the product.", "error");
      }
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center mb-8">
        <h1 className="text-xl lg:text-3xl font-bold text-gray-800">
          {t("productCategories")}
        </h1>
        <button
          onClick={() => navigate("/dashboard/products/create-product")}
          className="mt-4 sm:mt-0 bg-primary hover:bg-teal-600 text-white px-3 sm:px-2 lg:px-2 py-1 lg:py-2 rounded-full flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t("AddCategory")}
        </button>
      </div>

      {/* Product Table */}
      <div className="border-2 border-white bg-white50 backdrop-blur-16.5 rounded-lg shadow-sm overflow-x-auto">
        {loading ? (
          <p className="text-center p-4">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center p-4">No products available.</p>
        ) : (
          <table className="w-full text-gray-500 text-sm sm:text-base border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-4 border-b font-medium">Product Title</th>
                <th className="p-4 border-b font-medium">Accessories</th>
                <th className="p-4 border-b font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  onClick={() =>
                    navigate(`/dashboard/products/${product.category_name}`)
                  }
                  key={product.id}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={`${
                        import.meta.env.VITE_REACT_APP_API_BASE_URL
                      }/framesash/storage/app/public/${product.category_image}`}
                      alt={product.category_name}
                      className="w-6 h-6 object-contain"
                    />

                    <span className="font-medium text-gray-900">
                      {product.category_name}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          product.accessories_available
                            ? "bg-teal-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                      <span>
                        {product.accessories_available
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 flex gap-3">
                    <FileEdit
                      onClick={() => handleEdit(product.id)}
                      className="text-blue-500 hover:text-blue-600 cursor-pointer text-lg"
                      title="Edit"
                    />
                    <Trash2
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-600 cursor-pointer text-lg"
                      title="Delete"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
