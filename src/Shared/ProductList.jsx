"use client";

import { useState } from "react";
import { Plus, AppWindowIcon as Window, Edit, Trash } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function ProductList() {
  const location = useLocation();

  const [windowProducts, setWindowProducts] = useState([
    {
      id: 1,
      type: "Windows 1",
      workingHour: "04",
      wholesellPrice: 250,
      marketPrice: 300,
    },
    {
      id: 2,
      type: "Windows 2",
      workingHour: "04",
      wholesellPrice: 350,
      marketPrice: 400,
    },
    {
      id: 3,
      type: "Windows 3",
      workingHour: "04",
      wholesellPrice: 350,
      marketPrice: 400,
    },
    {
      id: 4,
      type: "Windows 4",
      workingHour: "04",
      wholesellPrice: 350,
      marketPrice: 400,
    },
    {
      id: 5,
      type: "Windows 5",
      workingHour: "04",
      wholesellPrice: 350,
      marketPrice: 400,
    },
  ]);

  const [doorProducts, setDoorProducts] = useState([
    {
      id: 1,
      type: "Door 1",
      workingHour: "04",
      wholesellPrice: 250,
      marketPrice: 300,
    },
    {
      id: 2,
      type: "Door 2",
      workingHour: "04",
      wholesellPrice: 350,
      marketPrice: 400,
    },
    {
      id: 3,
      type: "Door 3",
      workingHour: "04",
      wholesellPrice: 350,
      marketPrice: 400,
    },
    {
      id: 3,
      type: "Door 3",
      workingHour: "04",
      wholesellPrice: 350,
      marketPrice: 400,
    },
    // ... Add more products
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    type: "",
    wholesellPrice: 0,
    marketPrice: 0,
    available: true,
  });

  const products = location.pathname.includes("Doors")
    ? doorProducts
    : windowProducts;

  const setProducts = location.pathname.includes("Doors")
    ? setDoorProducts
    : setWindowProducts;

  const handleAddProduct = () => {
    if (
      newProduct.type &&
      newProduct.wholesellPrice &&
      newProduct.marketPrice
    ) {
      const newProducts = [
        ...products,
        {
          id: products.length + 1,
          type: newProduct.type,
          workingHour: "04",
          wholesellPrice: newProduct.wholesellPrice,
          marketPrice: newProduct.marketPrice,
          available: newProduct.available,
        },
      ];

      setProducts(newProducts);
      setNewProduct({
        type: "",
        wholesellPrice: 0,
        marketPrice: 0,
        available: true,
      });
      setShowAddModal(false);
    }
  };

  const handleDeleteProduct = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
  };

  const handleEditProduct = () => {
    const updatedProducts = products.map((product) =>
      product.id === selectedProduct.id ? selectedProduct : product
    );
    setProducts(updatedProducts);
    setShowEditModal(false);
  };

  const productName = location.pathname.includes("Doors") ? "Doors" : "Windows";

  return (
    <div className="h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Product: {productName}
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Product
        </button>
      </div>

      {/* Product Table */}
      <div className="border-2 border-white bg-white/50 backdrop-blur-[16.5px] rounded-lg shadow-sm">
        <div className="grid grid-cols-5 p-4 border-b text-gray-500">
          <div>Product Type</div>
          <div>Working Hour</div>
          <div>Wholesell Price</div>
          <div>Market Price</div>
          <div className="text-center">Actions</div>
        </div>

        {products.map((product) => (
          <div
            key={product.id}
            className="grid grid-cols-5 p-4 border-b hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Window className="w-6 h-6 text-gray-600" />
              <span className="font-medium text-gray-900">{product.type}</span>
            </div>
            <div>{product.workingHour}</div>
            <div className="text-teal-500">{product.wholesellPrice}</div>
            <div className="text-teal-500">{product.marketPrice}</div>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => {
                  setSelectedProduct(product);
                  setShowEditModal(true);
                }}
                className="p-2 text-blue-500 hover:bg-blue-100 rounded-full"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="p-2 text-red-500 hover:bg-red-100 rounded-full"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <Modal
          title="Add New Product"
          product={newProduct}
          setProduct={setNewProduct}
          onSave={handleAddProduct}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <Modal
          title="Edit Product"
          product={selectedProduct}
          setProduct={setSelectedProduct}
          onSave={handleEditProduct}
          onCancel={() => setShowEditModal(false)}
        />
      )}
    </div>
  );

  function Modal({ title, product, setProduct, onSave, onCancel }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Type
              </label>
              <input
                type="text"
                value={product.type}
                onChange={(e) =>
                  setProduct({ ...product, type: e.target.value })
                }
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wholesell Price
              </label>
              <input
                type="number"
                value={product.wholesellPrice || ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    wholesellPrice: Number(e.target.value),
                  })
                }
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Market Price
              </label>
              <input
                type="number"
                value={product.marketPrice || ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    marketPrice: Number(e.target.value),
                  })
                }
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={product.available}
                onChange={(e) =>
                  setProduct({
                    ...product,
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
                onClick={onCancel}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
