import { useState, useEffect } from "react";
import { Check, X, Edit } from "lucide-react";
import { useLanguage } from "../ContextProvider/LanguageContext";
import axiosSecure from "../Hooks/AsiosSecure";

export default function PricingTable() {
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const { t } = useLanguage();
  const [packages, setPackages] = useState([]);

  // -------------------------------
  // Fetch packages on component mount
  // -------------------------------
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axiosSecure.get("/api/packages");
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    fetchPackages();
  }, []);

  // -------------------------------
  // EDIT: populate modal fields
  // -------------------------------
  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setShowModal(true);
  };

  // -------------------------------
  // DELETE: remove package
  // -------------------------------
  const handleDeletePackage = async (id) => {
    try {
      await axiosSecure.delete(`/api/packages/${id}`);
      setPackages(packages.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  // -------------------------------
  // UPDATE: save changes
  // -------------------------------
  const handleUpdate = async () => {
    try {
      if (editingPackage && editingPackage.id) {
        const { id, ...updatedData } = editingPackage;

        console.log("Sending PUT to:", `/api/packages/${id}`);
        console.log("Updated data:", updatedData);

        const response = await axiosSecure.put(
          `/api/packages/${id}`,
          updatedData
        );

        console.log("Update response data:", response.data);

        // Confirm the response actually contains the updated package
        if (response.data && response.data.id) {
          setPackages(
            packages.map((pkg) => (pkg.id === id ? response.data : pkg))
          );
        } else {
          // Optionally: refetch the entire packages list if the response doesn't include updated data
          // await fetchPackages();
        }
      }
    } catch (error) {
      console.error("Error updating package:", error?.response || error);
    }

    setShowModal(false);
    setEditingPackage(null);
  };

  // -------------------------------
  // Handle feature toggling for editing
  // -------------------------------
  const toggleFeature = (index) => {
    if (!editingPackage) return;
    const features = [...editingPackage.features];
    const featureObj = { ...features[index] };
    // Flip between 1 and 0 if it's numeric booleans
    featureObj.available = featureObj.available === 1 ? 0 : 1;
    features[index] = featureObj;
    setEditingPackage({ ...editingPackage, features });
  };

  return (
    <div className="p-4 space-y-8">
      {/* Title Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 p-6">
        <h1 className="text-2xl lg:text-3xl font-bold">
          {t("packagesDetails")}
        </h1>
      </div>

      {/* Packages Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white50 backdrop-blur-16.5 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="bg-primary text-white py-4 flex justify-between items-center px-4">
              <h3 className="text-2xl font-semibold">{pkg.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditPackage(pkg)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeletePackage(pkg.id)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pkg.features &&
                  pkg.features.map((featureObj, idx) => {
                    const isFeatureIncluded = featureObj.available === 1;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2 border-b"
                      >
                        <span className="font-medium">
                          {t(featureObj.name)}
                        </span>
                        {isFeatureIncluded ? (
                          <Check className="w-5 h-5 text-teal-500" />
                        ) : (
                          <X className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    );
                  })}
                <div className="pt-4 text-center">
                  <p className="text-2xl font-bold text-teal-500">
                    ${pkg.price}/{pkg.duration}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showModal && editingPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{t("editPackage")}</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingPackage(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">{t("name")}</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={editingPackage.name || ""}
                  onChange={(e) =>
                    setEditingPackage({
                      ...editingPackage,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">{t("price")}</label>
                <input
                  type="number"
                  className="border p-2 w-full rounded"
                  value={editingPackage.price || ""}
                  onChange={(e) =>
                    setEditingPackage({
                      ...editingPackage,
                      price: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  {t("duration")}
                </label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={editingPackage.duration || ""}
                  onChange={(e) =>
                    setEditingPackage({
                      ...editingPackage,
                      duration: e.target.value,
                    })
                  }
                />
              </div>

              {/* Feature Editing: toggle availability */}
              {editingPackage.features &&
                editingPackage.features.length > 0 && (
                  <div className="mt-4">
                    <label className="block font-semibold mb-2">
                      {t("features")}
                    </label>
                    <div className="space-y-2">
                      {editingPackage.features.map((featureObj, index) => (
                        <label
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={featureObj.available === 1}
                            onChange={() => toggleFeature(index)}
                          />
                          <span>{t(featureObj.name)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingPackage(null);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleUpdate}
                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition"
              >
                {t("saveChanges")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
