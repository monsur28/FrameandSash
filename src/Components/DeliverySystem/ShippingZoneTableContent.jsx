import { useEffect, useState } from "react";
import axiosSecure from "../../Hooks/AsiosSecure";
import { Delete, Edit3, Trash2 } from "lucide-react";
import { useSweetAlert } from "../../ContextProvider/SweetAlertContext";

const ShippingZoneTableContent = ({
  shippingZones,
  locations,
  fetchData,
  onDelete,
  handleEditShippingZone,
}) => {
  const [editingZoneId, setEditingZoneId] = useState(null);
  const [zoneStates, setZoneStates] = useState({});
  const [allLocations, setAllLocations] = useState({
    country: [],
    region: [],
    city: [],
    area: [],
  });
  const { showAlert } = useSweetAlert();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedZoneForView, setSelectedZoneForView] = useState(null);

  // Flatten the locations into separate arrays for each type
  useEffect(() => {
    const countries = [];
    const regions = [];
    const cities = [];
    const areas = [];

    const flattenLocations = (location) => {
      if (location.type === "country") {
        countries.push({ id: location.id, name: location.name });
      } else if (location.type === "region") {
        regions.push({ id: location.id, name: location.name });
      } else if (location.type === "city") {
        cities.push({ id: location.id, name: location.name });
      } else if (location.type === "area") {
        areas.push({ id: location.id, name: location.name });
      }

      if (location.children && Array.isArray(location.children)) {
        location.children.forEach(flattenLocations);
      }
    };

    locations.forEach(flattenLocations);

    setAllLocations({
      country: countries,
      region: regions,
      city: cities,
      area: areas,
    });
  }, [locations]);

  const fetchAssignedLocations = async (zoneId) => {
    try {
      const response = await axiosSecure.get(
        `/admin/shipping/shipping-zones/${zoneId}/locations`
      );
      const assignedLocs = response.data.locations || [];
      setZoneStates((prev) => ({
        ...prev,
        [zoneId]: {
          locationType: "", // Initialize
          selectedLocation: "",
          assignedLocations: assignedLocs, // Store the FULL location objects
        },
      }));
    } catch (error) {
      console.error(`Error fetching locations for zone ${zoneId}:`, error);
    }
  };

  // Fetch assigned locations on initial load AND whenever shippingZones changes
  useEffect(() => {
    shippingZones.forEach((zone) => {
      fetchAssignedLocations(zone.id);
    });
  }, [shippingZones]);

  const handleAssignLocations = (zoneId) => {
    setEditingZoneId(zoneId);
  };

  const handleLocationTypeChange = (zoneId, e) => {
    setZoneStates((prev) => ({
      ...prev,
      [zoneId]: {
        ...prev[zoneId], // Preserve existing assignedLocations
        locationType: e.target.value,
        selectedLocation: "", // Clear single selection
      },
    }));
  };

  const handleLocationChange = (zoneId, e) => {
    setZoneStates((prev) => ({
      ...prev,
      [zoneId]: {
        ...prev[zoneId],
        selectedLocation: e.target.value, // Store selected ID (string)
      },
    }));
  };

  const handleSubmitLocations = async (zoneId) => {
    const state = zoneStates[zoneId];
    if (!state || !state.locationType || !state.selectedLocation) {
      alert("Please select a location type and location.");
      return;
    }

    try {
      await axiosSecure.post(
        `/admin/shipping/shipping-zones/${zoneId}/locations`,
        {
          location_type: state.locationType,
          location_id: parseInt(state.selectedLocation, 10), // Parse here
        }
      );

      fetchData(); // Refresh the main table
      fetchAssignedLocations(zoneId); // Refresh assigned locations *after* adding
      showAlert("success", "Location assigned successfully!");
    } catch (error) {
      console.error(
        "Error assigning locations:",
        error.response?.data || error
      );
      showAlert(
        "error",
        `Error assigning location: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleRemoveLocation = async (zoneId, locationId) => {
    // Corrected parameters
    try {
      await axiosSecure.delete(
        `/admin/shipping/shipping-zones/${zoneId}/locations/${locationId}`
      );

      fetchData();
      fetchAssignedLocations(zoneId);
      showAlert("success", "Location removed successfully!");
    } catch (error) {
      console.error("Error removing location:", error);
      showAlert(
        "error",
        `Error removing location: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Get location options based on locationType
  const getLocationOptions = (zoneId) => {
    const state = zoneStates[zoneId] || {};
    if (!state.locationType) return [];

    return allLocations[state.locationType].map((loc) => (
      <option key={loc.id} value={loc.id}>
        {loc.name}
      </option>
    ));
  };

  const handleCancel = (zoneId) => {
    setEditingZoneId(null);
    setZoneStates((prev) => ({
      //reset the values on cancel
      ...prev,
      [zoneId]: {
        ...prev[zoneId], //Keep existing assigned locations
        locationType: "",
        selectedLocation: "",
      },
    }));
  };

  const openViewModal = (zone) => {
    setSelectedZoneForView(zone);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedZoneForView(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse rounded-lg shadow-md">
        <thead className="bg-[#00A99D] text-white">
          <tr>
            <th className="px-6 py-3 text-left">Zone ID</th>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Description</th>
            <th className="px-6 py-3 text-left">Assigned Locations</th>
            <th className="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {shippingZones.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No shipping zones available.
              </td>
            </tr>
          ) : (
            shippingZones.map((zone) => (
              <tr key={zone.id} className="hover:bg-gray-50">
                <td className="px-6 py-3">{zone.id}</td>
                <td className="px-6 py-3">{zone.name}</td>
                <td className="px-6 py-3">{zone.description}</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => openViewModal(zone)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded inline-flex items-center"
                  >
                    View Assigned Locations
                  </button>
                  {editingZoneId === zone.id ? (
                    <div className="mt-2 flex flex-col gap-2">
                      {/* Select Location Type */}
                      <select
                        value={zoneStates[zone.id]?.locationType || ""}
                        onChange={(e) => handleLocationTypeChange(zone.id, e)}
                        className="border p-2 rounded w-full"
                      >
                        <option value="">Select Location Type</option>
                        {/* <option value="country">Country</option>
                        <option value="region">Region</option>
                        <option value="city">City</option> */}
                        <option value="area">Area</option>
                      </select>

                      {/* Location Selection */}
                      <select
                        value={zoneStates[zone.id]?.selectedLocation || ""}
                        onChange={(e) => handleLocationChange(zone.id, e)}
                        className="border p-2 rounded w-full"
                        disabled={!zoneStates[zone.id]?.locationType}
                      >
                        <option value="">
                          Select {zoneStates[zone.id]?.locationType}
                        </option>
                        {getLocationOptions(zone.id)}
                      </select>

                      {/* Save Button */}
                      <button
                        onClick={() => handleSubmitLocations(zone.id)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Save Locations
                      </button>

                      {/* Cancel Button */}
                      <button
                        onClick={() => handleCancel(zone.id)}
                        className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAssignLocations(zone.id)}
                      className="bg-primary hover:bg-gray-400 text-white font-bold mt-2 py-1 px-2 rounded inline-flex items-center"
                    >
                      Assign Locations
                    </button>
                  )}
                </td>
                <td className="px-6 py-3 flex gap-2">
                  <Edit3
                    className="text-blue-500 cursor-pointer"
                    onClick={() => handleEditShippingZone(zone)}
                  />
                  <Trash2
                    className="text-red-500 cursor-pointer"
                    onClick={() => onDelete(zone.id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* View Assigned Locations Modal */}
      {viewModalOpen && selectedZoneForView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              Assigned Locations for {selectedZoneForView.name}
            </h2>
            {zoneStates[selectedZoneForView.id]?.assignedLocations?.length >
            0 ? (
              <ul className="list-disc pl-5">
                {zoneStates[selectedZoneForView.id].assignedLocations.map(
                  (loc) => (
                    <li
                      key={loc.id}
                      className="mb-1 flex items-center justify-between"
                    >
                      <span>
                        {loc.name} ({loc.type})
                      </span>
                      <Trash2
                        className="ml-2 text-red-500 cursor-pointer"
                        onClick={() =>
                          handleRemoveLocation(selectedZoneForView.id, loc.id)
                        }
                      />
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p>No locations assigned to this zone yet.</p>
            )}
            <button
              onClick={closeViewModal}
              className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              <Delete size={16} className="mr-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingZoneTableContent;
