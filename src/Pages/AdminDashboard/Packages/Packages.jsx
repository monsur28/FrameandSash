import { useState, useEffect } from "react";
import { Check, X, Edit, Plus, Trash2 } from "lucide-react";
import { useLanguage } from "../../../ContextProvider/LanguageContext";
import axiosSecure from "../../../Hooks/AsiosSecure";
import useAuth from "../../../Hooks/UseAuth";
import Swal from "sweetalert2"; // SweetAlert2 import

export default function Packages() {
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [newFeature, setNewFeature] = useState(""); // For new feature input
  const { t } = useLanguage();
  const { user } = useAuth(); // User data including role
  const [packages, setPackages] = useState([]);

  // Fetch packages on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axiosSecure.get("/packages");
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
        Swal.fire({
          title: t("error"),
          text: t("fetchPackagesFailed"),
          icon: "error",
          confirmButtonText: t("ok"),
        });
      }
    };
    fetchPackages();
  }, [t]);

  // Add new package
  const handleAddPackage = async () => {
    const newPackage = {
      name: "New Package", // Default name; can be modified in modal
      price: "",
      duration: "",
      features: [],
    };
    setEditingPackage(newPackage);
    setShowModal(true);
  };

  // Edit package
  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setShowModal(true);
  };

  // Delete package
  const handleDeletePackage = async (id) => {
    const confirmDelete = await Swal.fire({
      title: t("confirmDelete"),
      text: t("areYouSure"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("yesDelete"),
      cancelButtonText: t("cancel"),
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axiosSecure.delete(`/packages/${id}`);
        setPackages((prevPackages) => prevPackages.filter((p) => p.id !== id));
        Swal.fire({
          title: t("success"),
          text: t("packageDeleted"),
          icon: "success",
          confirmButtonText: t("ok"),
        });
      } catch (error) {
        console.error("Error deleting package:", error);
        Swal.fire({
          title: t("error"),
          text: t("packageDeleteFailed"),
          icon: "error",
          confirmButtonText: t("ok"),
        });
      }
    }
  };

  // Update package
  const handleUpdate = async () => {
    try {
      if (editingPackage && editingPackage.id) {
        const { id, ...updatedData } = editingPackage;

        // Immediate state update before sending the PUT request
        setPackages((prevPackages) =>
          prevPackages.map((pkg) =>
            pkg.id === id ? { ...pkg, ...updatedData } : pkg
          )
        );

        // Sending the PUT request
        const response = await axiosSecure.put(`/packages/${id}`, updatedData);

        // Ensure the response contains updated package data
        if (response.data && response.data.id) {
          Swal.fire({
            title: t("success"),
            text: t("packageUpdated"),
            icon: "success",
            confirmButtonText: t("ok"),
          });
        } else {
          console.log("No updated package returned.");
        }
      } else {
        // Adding a new package
        const response = await axiosSecure.post("/packages", editingPackage);
        setPackages((prevPackages) => [...prevPackages, response.data]);
        Swal.fire({
          title: t("success"),
          text: t("packageAdded"),
          icon: "success",
          confirmButtonText: t("ok"),
        });
      }
    } catch (error) {
      console.error("Error updating package:", error?.response || error);
      Swal.fire({
        title: t("error"),
        text: t("packageUpdateFailed"),
        icon: "error",
        confirmButtonText: t("ok"),
      });
    }

    // Close modal and clear the editing state
    setShowModal(false);
    setEditingPackage(null);
  };

  // Toggle feature availability
  const toggleFeature = (index) => {
    if (!editingPackage) return;
    const features = [...editingPackage.features];
    const featureObj = { ...features[index] };
    featureObj.available = featureObj.available === 1 ? 0 : 1; // Toggle availability
    features[index] = featureObj;
    setEditingPackage({ ...editingPackage, features });
  };

  // Remove feature entirely
  const handleRemoveFeature = (index) => {
    if (!editingPackage) return;
    const updatedFeatures = [...editingPackage.features];
    updatedFeatures.splice(index, 1);
    setEditingPackage({ ...editingPackage, features: updatedFeatures });
  };

  // Add new feature
  const handleAddFeature = () => {
    if (newFeature.trim() === "") return; // Prevent adding empty features
    const updatedFeatures = [
      ...editingPackage.features,
      { name: newFeature, available: 1 },
    ];
    setEditingPackage({ ...editingPackage, features: updatedFeatures });
    setNewFeature(""); // Clear input field
  };

  // Check if the user is an admin
  const isAdmin = user?.role === "+admin$";

  return (
    <div className="p-4 space-y-8">
      {/* Title Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 p-6">
        <h1 className="text-2xl lg:text-3xl font-bold">
          {t("packagesDetails")}
        </h1>
        {isAdmin && (
          <button
            onClick={handleAddPackage}
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition"
          >
            <Plus className="w-4 h-4 inline mr-1" />
            {t("addPackage")}
          </button>
        )}
      </div>

      {/* Packages Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            // Added flex and flex-col so the card can stretch while keeping content stacked.
            className="bg-white50 backdrop-blur-16.5 rounded-lg shadow-lg overflow-hidden flex flex-col"
          >
            {/* Title Bar */}
            <div className="bg-primary text-white py-4 px-4 flex justify-between items-center">
              <h3 className="text-2xl font-semibold">{pkg.name}</h3>
              <div className="flex space-x-2">
                {isAdmin && (
                  <>
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
                  </>
                )}
              </div>
            </div>

            {/* Features + Price container */}
            {/* flex-grow pushes the next sibling (price) toward the bottom if card heights differ. */}
            <div className="p-6 flex flex-col flex-grow">
              {/* Feature List */}
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
              </div>
              {/* Price and Duration at the bottom */}
              <div className="mt-auto pt-4 text-center">
                <p className="text-2xl font-bold text-teal-500">
                  ${pkg.price}/{pkg.duration}
                </p>
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
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
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

              {/* Feature Editing: toggle availability and delete */}
              {editingPackage.features &&
                editingPackage.features.length > 0 && (
                  <div className="mt-4">
                    <label className="block font-semibold mb-2">
                      {t("features")}
                    </label>
                    <div className="space-y-2">
                      {editingPackage.features.map((featureObj, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={featureObj.available === 1}
                              onChange={() => toggleFeature(index)}
                            />
                            <span>{t(featureObj.name)}</span>
                          </label>
                          <button
                            onClick={() => handleRemoveFeature(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* New Feature Input */}
              <div className="mt-4">
                <label className="block font-semibold mb-1">
                  {t("addFeature")}
                </label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                />
                <button
                  onClick={handleAddFeature}
                  className="bg-teal-500 text-white px-4 py-2 rounded mt-2 hover:bg-teal-600 transition"
                >
                  {t("addFeature")}
                </button>
              </div>
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
