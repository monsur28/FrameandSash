import { useState } from "react";
import { motion } from "framer-motion";
import { Edit3, Trash2, ChevronDown, ChevronRight, Search } from "lucide-react";
import axiosSecure from "../../Hooks/AsiosSecure";
import Swal from "sweetalert2";
import { useSweetAlert } from "../../ContextProvider/SweetAlertContext";

export default function LocationTableContent({
  locations = [],
  setLocations,
  onEditLocation,
}) {
  const [expanded, setExpanded] = useState({}); // Track expansion by location ID and level
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const { showAlert } = useSweetAlert();

  // Handle Expand/Collapse
  const toggleExpand = (id, level, hasChildren) => {
    if (!hasChildren) return;

    setExpanded((prev) => {
      const newExpanded = { ...prev };
      if (!newExpanded[level]) newExpanded[level] = [];

      const isExpanded = newExpanded[level].includes(id);

      if (isExpanded) {
        newExpanded[level] = newExpanded[level].filter(
          (itemId) => itemId !== id
        );
      } else {
        newExpanded[level] = [...newExpanded[level], id];
      }

      return newExpanded;
    });
  };

  // Handle edit button click
  const handleEditClick = (location) => {
    // Open the LocationForm with the selected location's data
    onEditLocation({
      id: location.id,
      type: "edit",
      newLocation: location,
      e: event,
    });
  };

  const handleDelete = async ({ id, type, e }) => {
    e.stopPropagation();

    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      alert("You must be logged in to delete locations.");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#d33",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);

        const response = await axiosSecure.delete(
          `/admin/shipping/locations/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            data: { type },
          }
        );

        if (response.status === 200) {
          showAlert("Success", "Location deleted successfully.", "success");

          setLocations((prevLocations) =>
            prevLocations.filter((location) => location.id !== id)
          );
        } else {
          throw new Error("Error deleting location");
        }
      } catch (error) {
        console.error("Error deleting location:", error);
        Swal.fire(
          "Error",
          error.message || "An error occurred while deleting the location.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // Recursive function to render locations with animation
  const renderLocationItem = (location, level = 0) => {
    const hasChildren = location.children?.length > 0;
    const isExpanded = expanded[level]?.includes(location.id) || false;
    const paddingLeft = level * 16 + 8;

    return (
      <div key={location.id} className={`mb-1 rounded border-l-4 shadow-sm`}>
        <div
          className="flex items-center justify-between p-2 cursor-pointer hover:bg-opacity-80"
          onClick={() => toggleExpand(location.id, level, hasChildren)}
        >
          <div
            className="flex items-center"
            style={{ paddingLeft: `${paddingLeft}px` }}
          >
            {hasChildren && (
              <span className="mr-2 text-gray-500">
                {isExpanded ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </span>
            )}
            <span className="font-medium">{location.name}</span>
            <span className="text-xs bg-white px-2 py-0.5 rounded-full ml-2 text-gray-600">
              {location.type}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
              onClick={() =>
                handleEditClick({ id: location.id, type: location.type })
              }
            >
              <Edit3 size={16} />
            </button>
            <button
              className="p-1 text-red-600 hover:bg-red-100 rounded-full"
              onClick={(e) =>
                handleDelete({ id: location.id, type: location.type, e })
              }
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Smooth Expansion Animation */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {isExpanded &&
            location.children?.map((child) =>
              renderLocationItem(child, level + 1)
            )}
        </motion.div>
      </div>
    );
  };

  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border rounded-lg shadow-md">
      <div className="p-3 border-b bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border rounded"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-3">
        {loading ? (
          <div className="text-center py-4 text-gray-500">Loading...</div>
        ) : filteredLocations.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No locations found.
          </div>
        ) : (
          filteredLocations.map((location) => renderLocationItem(location))
        )}
      </div>
    </div>
  );
}
