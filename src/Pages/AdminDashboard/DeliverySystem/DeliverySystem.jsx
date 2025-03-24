import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import axiosSecure from "../../../Hooks/AsiosSecure";
import Loader from "../../../Shared/Loader";
import LocationTableContent from "../../../Components/DeliverySystem/LocationTableContent";
import ShippingZoneTableContent from "../../../Components/DeliverySystem/ShippingZoneTableContent";
import ShippingOptionTableContent from "../../../Components/DeliverySystem/ShippingOptionTableContent";
import LocationForm from "../../../Components/DeliverySystem/LocationForm";
import ShippingZoneForm from "../../../Components/DeliverySystem/ShippingZoneForm";
import ShippingOptionForm from "../../../Components/DeliverySystem/ShippingOptionForm";
import Swal from "sweetalert2";
import { useSweetAlert } from "../../../ContextProvider/SweetAlertContext";
import CodConditionTableContent from "../../../Components/DeliverySystem/CODConditionTable"; // Import the new component
import CodConditionForm from "../../../Components/DeliverySystem/CodConditionForm"; // Import the new component

const DeliverySystem = () => {
  const [locations, setLocations] = useState([]);
  const [shippingZones, setShippingZones] = useState([]);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [codConditions, setCodConditions] = useState([]); // State for COD conditions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("location");
  const [showModal, setShowModal] = useState(false);
  const [showShippingZoneModal, setShowShippingZoneModal] = useState(false);
  const [showShippingOptionModal, setShowShippingOptionModal] = useState(false);
  const [showCodConditionModal, setShowCodConditionModal] = useState(false); // Modal state
  const [locationToEdit, setLocationToEdit] = useState(null);
  const [zoneToEdit, setZoneToEdit] = useState(null);
  const [optionToEdit, setOptionToEdit] = useState(null);
  const [codConditionToEdit, setCodConditionToEdit] = useState(null); // State for editing
  const [expanded, setExpanded] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [formErrors, setFormErrors] = useState({});
  const { showAlert } = useSweetAlert();

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        locationsResponse,
        shippingZonesResponse,
        shippingOptionsResponse,
        codConditionsResponse, // Fetch COD conditions
      ] = await Promise.all([
        axiosSecure.get("/admin/shipping/locations"),
        axiosSecure.get("/admin/shipping/shipping-zones"),
        axiosSecure.get("/admin/shipping/shipping-options"),
        axiosSecure.get("/admin/shipping/cod-conditions"), // Fetch from the new endpoint
      ]);
      setLocations(locationsResponse.data);
      setShippingZones(shippingZonesResponse.data);
      setShippingOptions(shippingOptionsResponse.data);
      setCodConditions(codConditionsResponse.data.data); // Set the state
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [id]: !prevExpanded[id],
    }));
  };

  const handleUpdateLocation = async ({ id, type, newLocation, e = null }) => {
    if (e) e.stopPropagation(); // ✅ Will only call stopPropagation if 'e' exists

    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      alert("You must be logged in to update locations.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosSecure.put(
        `/admin/shipping/locations/${id}`,
        newLocation,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: { type },
        }
      );

      if (response.status === 200) {
        showAlert("Success", "Location updated successfully.", "success");
        setLocations((prevLocations) =>
          prevLocations.map((location) =>
            location.id === id ? { ...location, ...newLocation } : location
          )
        );
      } else {
        throw new Error("Error updating location");
      }
    } catch (error) {
      console.error("Error updating location:", error);
      Swal.fire(
        "Error",
        error.message || "An error occurred while updating the location.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle CRUD operations for Shipping Zones
  const handleAddShippingZone = async (newShippingZone) => {
    try {
      if (zoneToEdit) {
        await axiosSecure.put(
          `/admin/shipping/shipping-zones/${zoneToEdit.id}`,
          newShippingZone
        );
        setZoneToEdit(null);
      } else {
        await axiosSecure.post(
          "/admin/shipping/shipping-zones",
          newShippingZone
        );
      }
      setShowShippingZoneModal(false);
      fetchData();
    } catch (err) {
      setError(err.message || "Failed to add shipping zone");
    }
  };

  const handleEditLocation = (location) => {
    setLocationToEdit(location);
    setShowModal(true);
  };

  const handleEditShippingZone = (zone) => {
    setZoneToEdit(zone);
    setShowShippingZoneModal(true);
  };

  const handleDeleteShippingZone = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        confirmButtonColor: "#d33",
        cancelButtonText: "No, cancel!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axiosSecure.delete(`/admin/shipping/shipping-zones/${id}`);
            showAlert(
              "Success",
              "Shipping zone deleted successfully.",
              "success"
            );
            fetchData();
          } catch (err) {
            setError(err.message || "Failed to delete shipping zone");
          }
        }
      });
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  // Handle CRUD operations for Shipping Options
  const handleAddShippingOption = async (newShippingOption) => {
    console.log(
      "handleAddShippingOption - newShippingOption:",
      newShippingOption
    );
    try {
      await axiosSecure.post(
        "/admin/shipping/shipping-options",
        newShippingOption
      );
      setShowShippingOptionModal(false);
      fetchData();
      showAlert("Success", "Shipping option added successfully.", "success");
    } catch (err) {
      setError(err.message || "Failed to add shipping option");
      showAlert(
        "Error",
        err.message || "Failed to add shipping option.",
        "error"
      );
    }
  };

  const handleEditShippingOption = (option) => {
    console.log("handleEditShippingOption - Editing shipping option:", option);
    setOptionToEdit(option);
    setShowShippingOptionModal(true);
  };

  const handleUpdateShippingOption = async (updatedShippingOption) => {
    console.log(
      "handleUpdateShippingOption - updatedShippingOption:",
      updatedShippingOption
    );
    try {
      const response = await axiosSecure.put(
        `/admin/shipping/shipping-options/${updatedShippingOption.id}`,
        updatedShippingOption
      );
      console.log("handleUpdateShippingOption - response:", response);
      if (response.status === 200) {
        setShowShippingOptionModal(false);
        setOptionToEdit(null);
        fetchData();
        showAlert(
          "Success",
          "Shipping option updated successfully.",
          "success"
        );
      } else {
        showAlert("Error", "Failed to update shipping option.", "error");
        console.error("Failed to update shipping option:", response);
      }
    } catch (err) {
      setError(err.message || "Failed to update shipping option");
      showAlert(
        "Error",
        err.message || "Failed to update shipping option.",
        "error"
      );
      console.error("Error updating shipping option:", err);
    }
  };

  const handleDeleteShippingOption = async (id) => {
    try {
      await axiosSecure.delete(`/admin/shipping/shipping-options/${id}`);
      fetchData();
      showAlert("Success", "Shipping option deleted successfully.", "success");
    } catch (err) {
      setError(err.message || "Failed to delete shipping option");
      showAlert(
        "Error",
        err.message || "Failed to delete shipping option.",
        "error"
      );
    }
  };

  // COD Condition Handlers
  const handleAddCodCondition = async (newCodCondition) => {
    try {
      if (codConditionToEdit) {
        // Update
        await axiosSecure.put(
          `/admin/shipping/cod-conditions/${codConditionToEdit.id}`,
          newCodCondition
        );
        setCodConditionToEdit(null); // Clear editing state
      } else {
        // Create
        await axiosSecure.post(
          "/admin/shipping/cod-conditions",
          newCodCondition
        );
      }
      setShowCodConditionModal(false);
      fetchData(); // Refresh data
      showAlert(
        "Success",
        `COD Condition ${
          codConditionToEdit ? "updated" : "added"
        } successfully.`,
        "success"
      );
    } catch (err) {
      setError(err.message || "Failed to process COD Condition");
      showAlert(
        "Error",
        err.message || "Failed to process COD Condition",
        "error"
      );
    }
  };

  const handleEditCodCondition = (condition) => {
    setCodConditionToEdit(condition);
    setShowCodConditionModal(true);
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 shadow-lg rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 min-h-screen">
      <div className="flex justify-between mb-6 border-b-2 border-gray-300">
        <div>
          <button
            className={`px-6 py-2 transition-colors duration-300 border-b-4 ${
              activeTab === "location"
                ? "border-[#00A99D] text-[#00A99D]"
                : "border-transparent text-gray-500 hover:text-[#00A99D]"
            }`}
            onClick={() => setActiveTab("location")}
          >
            Location
          </button>
          <button
            className={`px-6 py-2 transition-colors duration-300 border-b-4 ${
              activeTab === "shipping_zones"
                ? "border-[#00A99D] text-[#00A99D]"
                : "border-transparent text-gray-500 hover:text-[#00A99D]"
            }`}
            onClick={() => setActiveTab("shipping_zones")}
          >
            Shipping Zones
          </button>
          <button
            className={`px-6 py-2 transition-colors duration-300 border-b-4 ${
              activeTab === "shipping_options"
                ? "border-[#00A99D] text-[#00A99D]"
                : "border-transparent text-gray-500 hover:text-[#00A99D]"
            }`}
            onClick={() => setActiveTab("shipping_options")}
          >
            Shipping Options
          </button>
          <button
            className={`px-6 py-2 transition-colors duration-300 border-b-4 ${
              activeTab === "cod_conditions"
                ? "border-[#00A99D] text-[#00A99D]"
                : "border-transparent text-gray-500 hover:text-[#00A99D]"
            }`}
            onClick={() => setActiveTab("cod_conditions")}
          >
            COD Condition
          </button>
        </div>
        <div>
          {activeTab === "location" && (
            <button
              className="flex items-center bg-[#00A99D] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#008a80]"
              onClick={() => {
                setLocationToEdit(null);
                setShowModal(true);
              }}
            >
              <Plus className="mr-2" /> Create Location
            </button>
          )}
          {activeTab === "shipping_zones" && (
            <button
              className="flex items-center bg-[#00A99D] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#008a80]"
              onClick={() => {
                setZoneToEdit(null);
                setShowShippingZoneModal(true);
              }}
            >
              <Plus className="mr-2" /> Create Shipping Zone
            </button>
          )}
          {activeTab === "shipping_options" && (
            <button
              className="flex items-center bg-[#00A99D] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#008a80]"
              onClick={() => {
                setOptionToEdit(null);
                setShowShippingOptionModal(true);
              }}
            >
              <Plus className="mr-2" /> Create Shipping Option
            </button>
          )}
          {activeTab === "cod_conditions" && (
            <button
              className="flex items-center bg-[#00A99D] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#008a80]"
              onClick={() => {
                setCodConditionToEdit(null); // Clear any existing edit state
                setShowCodConditionModal(true);
              }}
            >
              <Plus className="mr-2" /> Create COD Condition
            </button>
          )}
        </div>
      </div>
      {activeTab === "location" && (
        <LocationTableContent
          locations={locations}
          setLocations={setLocations}
          expanded={expanded}
          onEditLocation={handleEditLocation} // Pass edit handler
          toggleExpand={toggleExpand}
        />
      )}
      {activeTab === "shipping_zones" && (
        <ShippingZoneTableContent
          shippingZones={shippingZones}
          locations={locations}
          fetchData={fetchData}
          onEdit={handleEditShippingZone}
          onDelete={handleDeleteShippingZone}
          closeModal={() => setShowShippingZoneModal(false)}
        />
      )}
      {activeTab === "shipping_options" && (
        <ShippingOptionTableContent
          shippingOptions={shippingOptions}
          onEdit={handleEditShippingOption}
          fetchData={fetchData}
          onDelete={handleDeleteShippingOption}
          expanded={expanded}
          toggleExpand={toggleExpand}
        />
      )}

      {/* COD Condition Table */}
      {activeTab === "cod_conditions" && (
        <CodConditionTableContent
          codConditions={codConditions}
          onEdit={handleEditCodCondition}
          fetchData={fetchData}
          setError={setError}
        />
      )}

      {/* Modals */}
      {showModal && (
        <LocationForm
          location={locationToEdit} // Pass selected location for editing
          onUpdate={handleUpdateLocation}
          onClose={() => {
            setShowModal(false);
            setLocationToEdit(null); // Reset after closing
          }}
          errors={formErrors}
        />
      )}

      {showShippingZoneModal && (
        <ShippingZoneForm
          locations={locations}
          zoneToEdit={zoneToEdit} // Corrected prop name
          onAddShippingZone={handleAddShippingZone}
          onClose={() => setShowShippingZoneModal(false)}
          errors={formErrors}
        />
      )}

      {showShippingOptionModal && (
        <ShippingOptionForm
          option={optionToEdit}
          shippingZones={shippingZones}
          onEdit={handleUpdateShippingOption} // Corrected prop name
          onSave={handleAddShippingOption}
          onClose={() => {
            setShowShippingOptionModal(false);
            setOptionToEdit(null);
          }}
          errors={formErrors}
        />
      )}

      {/* COD Condition Modal */}
      {showCodConditionModal && (
        <CodConditionForm
          codCondition={codConditionToEdit}
          shippingZones={shippingZones}
          onSave={handleAddCodCondition}
          closeModal={() => {
            setShowCodConditionModal(false);
            setCodConditionToEdit(null); // Clear edit state on close
          }}
          errors={formErrors}
        />
      )}
    </div>
  );
};

export default DeliverySystem;
