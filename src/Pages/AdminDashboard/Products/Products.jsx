import { useEffect, useState, useMemo } from "react";
import { Edit3, Eye, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import axiosSecure from "../../../Hooks/AsiosSecure";
import Loader from "../../../Shared/Loader";
import { useSweetAlert } from "../../../ContextProvider/SweetAlertContext";
import Swal from "sweetalert2";

export default function ProductTable() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [configurators, setConfigurators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const { showAlert } = useSweetAlert();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes, configuratorsRes] =
          await Promise.all([
            axiosSecure.get("/admin/products"),
            axiosSecure.get("/product-categories"),
            axiosSecure.get("/admin/window-configurator"),
          ]);
        setProducts(productsRes.data.products || []);
        setCategories(categoriesRes.data || []);
        setConfigurators(configuratorsRes.data.configurator_products || []);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const category = categories.find((c) => c.id === product.category_id);
      const categoryName = category ? category.category_name : "N/A";

      return (
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [products, categories, searchTerm]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Get products for current page
  const currentProducts = useMemo(() => {
    return filteredProducts.slice(
      (currentPage - 1) * productsPerPage,
      currentPage * productsPerPage
    );
  }, [filteredProducts, currentPage, productsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const handleDelete = async (id, type) => {
    const endpointMap = {
      product: "products",
      category: "categories",
      configurator: "window-configurator",
    };

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.delete(`/admin/${endpointMap[type]}/delete/${id}`);
      showAlert(
        "Success!",
        `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`,
        "success"
      );

      if (type === "product") {
        setProducts(products.filter((p) => p.id !== id));
      } else if (type === "category") {
        setCategories(categories.filter((c) => c.id !== id));
      } else {
        setConfigurators(configurators.filter((c) => c.id !== id));
      }
    } catch {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete item.",
        icon: "error",
      });
    }
  };

  return (
    <div className="p-6 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-1.5 rounded-md transition-colors ${
              activeTab === "products"
                ? "bg-[#00A99D] text-white"
                : "bg-gray-200 text-gray-600 border border-gray-300"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-1.5 rounded-md transition-colors ${
              activeTab === "categories"
                ? "bg-[#00A99D] text-white"
                : "bg-gray-200 text-gray-600 border border-gray-300"
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab("customConfigurator")}
            className={`px-4 py-1.5 rounded-md transition-colors ${
              activeTab === "customConfigurator"
                ? "bg-[#00A99D] text-white"
                : "bg-gray-200 text-gray-600 border border-gray-300"
            }`}
          >
            Custom Configurator
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by name, SKU, or category"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
          <Link
            to={
              activeTab === "products"
                ? "/adminDashboard/products/create-product"
                : activeTab === "categories"
                ? "/adminDashboard/categories/create-category"
                : "/adminDashboard/products/create-product"
            }
            className="px-4 py-2 bg-[#00A99D] text-white rounded-md hover:bg-[#00A99D]/90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {activeTab === "products"
              ? "Create Product"
              : activeTab === "categories"
              ? "Create Category"
              : "Create Configurator"}
          </Link>
        </div>
      </div>

      {activeTab === "products" ? (
        <>
          <ProductTableContent
            products={currentProducts}
            categories={categories}
            handleDelete={handleDelete}
            currentPage={currentPage}
            productsPerPage={productsPerPage}
          />
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : activeTab === "categories" ? (
        <CategoryTableContent
          categories={categories}
          handleDelete={handleDelete}
        />
      ) : (
        <CustomConfiguratorContent
          configurators={configurators}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}

function ProductTableContent({
  products,
  categories,
  handleDelete,
  currentPage,
  productsPerPage,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 overflow-hidden">
        <thead className="bg-[#00A99D] text-white">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Image</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-left">SKU</th>
            <th className="px-4 py-3 text-left">Quantity</th>
            <th className="px-4 py-3 text-left">Preview</th>
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                No products available.
              </td>
            </tr>
          ) : (
            products.map((product, index) => {
              const rowNumber = (currentPage - 1) * productsPerPage + index + 1;
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{rowNumber}</td>
                  <td className="px-4 py-3">
                    {product.primary_image ? (
                      <img
                        src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${
                          product.primary_image
                        }`}
                        alt={product.title}
                        className="w-12 h-12 rounded"
                      />
                    ) : (
                      <div className="bg-gray-100 w-12 h-12 rounded flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">{product.title}</td>
                  <td className="px-4 py-3">
                    {categories.find((c) => c.id === product.category_id)
                      ?.category_name || "N/A"}
                  </td>
                  <td className="px-4 py-3">{product.sku}</td>
                  <td className="px-4 py-3">{product.quantity}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/adminDashboard/productPreview/${product.id}`}
                      className="text-[#00A99D] hover:underline inline-flex items-center gap-1"
                    >
                      Preview
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/adminDashboard/product/edit-product/${product.id}`}
                        className="text-[#00A99D] hover:underline"
                      >
                        <Edit3 className="w-6 h-6" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, "product")}
                        className="text-red-500 hover:underline"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

function CategoryTableContent({ categories, handleDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 overflow-hidden">
        <thead className="bg-[#00A99D] text-white">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Image</th>
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">{category.id}</td>
              <td className="px-4 py-3">{category.category_name}</td>
              <td className="px-4 py-3">
                {category.category_image ? (
                  <img
                    src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${
                      category.category_image
                    }`}
                    alt={category.category_name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="bg-gray-100 w-12 h-12 rounded flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Link
                    to={`edit-category/${category.id}`}
                    className="text-[#00A99D] hover:underline"
                  >
                    <Edit3 className="w-6 h-6" />
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id, "category")}
                    className="text-red-500 hover:underline"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CustomConfiguratorContent({ configurators, handleDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 overflow-hidden">
        <thead className="bg-[#00A99D] text-white">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Name</th>

            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {configurators.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No configurators available.
              </td>
            </tr>
          ) : (
            configurators.map((configurator) => (
              <tr key={configurator.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{configurator.id}</td>
                <td className="px-4 py-3">{configurator.name}</td>

                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      to={`/adminDashboard/product/edit-cofigurator/${configurator.id}`}
                      className="text-[#00A99D] hover:underline"
                    >
                      <Edit3 className="w-6 h-6" />
                    </Link>
                    <button
                      onClick={() =>
                        handleDelete(configurator.id, "configurator")
                      }
                      className="text-red-500 hover:underline"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function PaginationControls({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center mt-6">
      <nav className="inline-flex -space-x-px">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 border ${
                currentPage === page
                  ? "bg-[#00A99D] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {page}
            </button>
          )
        )}
      </nav>
    </div>
  );
}
