"use client";

import { useState } from "react";
import { Check, X, Edit } from "lucide-react";

export default function PricingTable() {
  const [activeTab, setActiveTab] = useState("manufacturer");
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [packages, setPackages] = useState({
    manufacturer: [
      {
        name: "Gold",
        price: 200,
        features: {
          Manufacturer: true,
          "Re-Seller": true,
          "Image Upload": true,
          Products: true,
          Languages: true,
          Blogs: false,
          SEO: false,
          Discount: false,
        },
      },
      {
        name: "Platinum",
        price: 300,
        features: {
          Manufacturer: true,
          "Re-Seller": true,
          "Image Upload": true,
          Products: true,
          Languages: true,
          Blogs: false,
          SEO: true,
          Discount: false,
        },
      },
      {
        name: "Diamond",
        price: 500,
        features: {
          Manufacturer: true,
          "Re-Seller": true,
          "Image Upload": true,
          Products: true,
          Languages: true,
          Blogs: true,
          SEO: true,
          Discount: true,
        },
      },
    ],
    reseller: [
      {
        name: "Basic",
        price: 100,
        features: {
          "Re-Seller": true,
          "Image Upload": true,
          Products: true,
          Languages: false,
          Blogs: false,
          SEO: false,
          Discount: false,
        },
      },
      {
        name: "Pro",
        price: 250,
        features: {
          "Re-Seller": true,
          "Image Upload": true,
          Products: true,
          Languages: true,
          Blogs: true,
          SEO: true,
          Discount: false,
        },
      },
      {
        name: "Enterprise",
        price: 400,
        features: {
          "Re-Seller": true,
          "Image Upload": true,
          Products: true,
          Languages: true,
          Blogs: true,
          SEO: true,
          Discount: true,
        },
      },
    ],
  });

  const [currentPackage, setCurrentPackage] = useState({
    name: "",
    price: 0,
    features: {
      Manufacturer: activeTab === "manufacturer",
      "Re-Seller": true,
      "Image Upload": false,
      Products: false,
      Languages: false,
      Blogs: false,
      SEO: false,
      Discount: false,
    },
  });

  const handleOpenModal = (pkg, index) => {
    setEditingIndex(index ?? null);
    setCurrentPackage(
      pkg || {
        name: "",
        price: 0,
        features: {
          Manufacturer: activeTab === "manufacturer",
          "Re-Seller": true,
          "Image Upload": false,
          Products: false,
          Languages: false,
          Blogs: false,
          SEO: false,
          Discount: false,
        },
      }
    );
    setShowModal(true);
  };

  const handleSavePackage = (e) => {
    e.preventDefault();

    setPackages((prevPackages) => {
      const updatedPackages = { ...prevPackages };

      if (editingIndex !== null) {
        updatedPackages[activeTab][editingIndex] = currentPackage;
      } else {
        updatedPackages[activeTab] = [
          ...updatedPackages[activeTab],
          currentPackage,
        ];
      }

      return updatedPackages;
    });

    setShowModal(false);
    setEditingIndex(null);
  };

  return (
    <div className="p-4 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center mb-8 rounded-[24px] border-2 border-white bg-white/50 backdrop-blur-[16.5px] p-6">
        <h1 className="text-2xl lg:text-3xl font-bold">Packages Details</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#009DAA] mt-4 lg:mt-0 hover:bg-teal-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <span className="text-xl">+</span> Add Package
        </button>
      </div>

      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-[24px] overflow-hidden">
          <button
            onClick={() => setActiveTab("manufacturer")}
            className={`flex items-center gap-2 px-6 py-3 ${
              activeTab === "manufacturer"
                ? "bg-[#009DAA] text-white"
                : "bg-white border-2 border-gray-200 "
            } hover:bg-teal-600 hover:text-white transition-colors `}
          >
            Manufacturer
          </button>
          <button
            onClick={() => setActiveTab("reseller")}
            className={`flex items-center gap-2 px-6 py-3 ${
              activeTab === "reseller"
                ? "bg-[#009DAA] text-white"
                : "bg-white border-2 border-gray-200"
            } hover:bg-teal-600 hover:text-white transition-colors`}
          >
            Re-Seller
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {packages[activeTab].map((pkg, index) => (
          <div
            key={pkg.name}
            className=" bg-white/50 backdrop-blur-[16.5px] rounded-lg shadow-lg overflow-hidden"
          >
            <div className="bg-[#009DAA] text-white py-4 flex justify-between items-center px-4">
              <h3 className="text-2xl text-center font-semibold">{pkg.name}</h3>
              <button
                onClick={() => handleOpenModal(pkg, index)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {Object.entries(pkg.features).map(([feature, isIncluded]) => (
                  <div
                    key={feature}
                    className="flex items-center justify-between py-2 border-b"
                  >
                    <span className="font-medium">{feature}</span>
                    {isIncluded ? (
                      <Check className="w-5 h-5 text-teal-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                ))}
                <div className="pt-4 text-center">
                  <p className="text-2xl font-bold text-teal-500">
                    ${pkg.price}/year
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {editingIndex !== null ? "Edit Package" : "Add New Package"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSavePackage} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Package Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={currentPackage.name}
                  onChange={(e) =>
                    setCurrentPackage({
                      ...currentPackage,
                      name: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price (per year)
                </label>
                <input
                  type="number"
                  id="price"
                  value={currentPackage.price}
                  onChange={(e) =>
                    setCurrentPackage({
                      ...currentPackage,
                      price: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Features
                </h3>
                {Object.entries(currentPackage.features).map(
                  ([feature, isIncluded]) => (
                    <div key={feature} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={feature}
                        checked={isIncluded}
                        onChange={(e) =>
                          setCurrentPackage({
                            ...currentPackage,
                            features: {
                              ...currentPackage.features,
                              [feature]: e.target.checked,
                            },
                          })
                        }
                        className="mr-2"
                        disabled={
                          feature === "Manufacturer" || feature === "Re-Seller"
                        }
                      />
                      <label
                        htmlFor={feature}
                        className="text-sm text-gray-700"
                      >
                        {feature}
                      </label>
                    </div>
                  )
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-[#009DAA] text-white py-2 px-4 rounded-md hover:bg-teal-600 transition-colors"
              >
                {editingIndex !== null ? "Save Changes" : "Add Package"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
