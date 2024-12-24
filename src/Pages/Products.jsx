import { useState } from "react";
import { Plus, AppWindowIcon as Window } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([
    {
      id: 1,
      title: "Windows",
      icon: (
        <img
          src="https://www.clipartmax.com/png/small/227-2276307_window-glass-mirror-home-safety-icon-glass-window-icon-png-white.png"
          className="w-6 h-6 text-gray-600 object-contain"
          alt="Window"
        />
      ),
      types: 11,
      available: true,
    },
    {
      id: 2,
      title: "Doors",
      icon: (
        <img
          src="https://www.clipartmax.com/png/middle/12-128373_clipart-of-door-best-18332-clipartion-com-colouring-picture-of-door.png"
          alt="Door"
          className="w-6 h-6 text-gray-600 object-co"
        />
      ),
      types: 11,
      available: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    types: 0,
    available: true,
  });

  const handleAddProduct = () => {
    if (newProduct.title && newProduct.types) {
      setProducts([
        ...products,
        {
          id: products.length + 1,
          title: newProduct.title,
          icon: <Window className="w-6 h-6 text-gray-600" />,
          types: Number(newProduct.types),
          available: newProduct.available,
        },
      ]);
      setNewProduct({ title: "", types: 0, available: true });
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center mb-8">
        <h1 className="text-xl lg:text-3xl  font-bold text-gray-800">
          Product List
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 sm:mt-0 bg-bg-[#009DAA] hover:bg-teal-600 text-white px-3 sm:px-2 lg:px-2 py-1 lg:py-2 rounded-full flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Product
        </button>
      </div>

      {/* Product Table */}
      <div className="border-2 border-white bg-white/50 backdrop-blur-[16.5px] rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-gray-500 text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-4 border-b font-medium">Product Title</th>
              <th className="p-4 border-b font-medium">Types</th>
              <th className="p-4 border-b font-medium">Accessories</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                onClick={() => navigate(`/dashboard/products/${product.title}`)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="p-4 flex items-center gap-3">
                  {product.icon}
                  <span className="font-medium text-gray-900">
                    {product.title}
                  </span>
                </td>
                <td className="p-4 text-teal-500">{product.types}</td>
                <td className="p-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                  <span>Available</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  value={newProduct.title}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, title: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Types
                </label>
                <input
                  type="number"
                  value={newProduct.types || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      types: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newProduct.available}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      available: e.target.checked,
                    })
                  }
                  className="rounded text-teal-500 focus:ring-teal-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Available
                </label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
