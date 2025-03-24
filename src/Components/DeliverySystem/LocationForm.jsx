import { useState, useEffect } from "react";
import axiosSecure from "../../Hooks/AsiosSecure";
import { useSweetAlert } from "../../ContextProvider/SweetAlertContext";
import { useNavigate } from "react-router-dom";

function LocationForm({ onClose, onUpdate, location }) {
  const [name, setName] = useState("");
  const [isoCode, setIsoCode] = useState(""); // Only for country
  const [type, setType] = useState("country"); // Location type: country, region, city, area
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [locationsData, setLocationsData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [errors, setErrors] = useState({});
  const { showAlert } = useSweetAlert();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (location) {
      const editData = location.newLocation || location;
      setName(editData.name || "");
      setIsoCode(editData.iso_code || ""); // Ensure correct key
      setType(editData.type || "country");

      if (editData.type === "region") {
        setSelectedCountry(editData.country_id || null);
      } else if (editData.type === "city") {
        setSelectedRegion(editData.region_id || null);
        setSelectedCountry(editData.country_id || null);
      } else if (editData.type === "area") {
        setSelectedCity(editData.city_id || null);
        setSelectedRegion(editData.region_id || null);
        setSelectedCountry(editData.country_id || null);
      } else {
        setSelectedCountry(null);
        setSelectedRegion(null);
        setSelectedCity(null);
      }
    }
  }, [location]);

  const fetchLocations = async () => {
    try {
      const response = await axiosSecure.get("/admin/shipping/locations");
      setLocationsData(response.data);
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let locationData = { type, name };

    if (type === "country") {
      locationData.iso_code = isoCode;
    } else if (type === "region") {
      locationData.country_id = selectedCountry;
    } else if (type === "city") {
      locationData.region_id = selectedRegion;
    } else if (type === "area") {
      locationData.city_id = selectedCity;
    }

    const formErrors = {};
    if (!name) formErrors.name = "Name is required";
    if (type === "country" && !isoCode)
      formErrors.isoCode = "ISO Code is required";
    if (type === "region" && !selectedCountry)
      formErrors.country_id = "Country is required";
    if (type === "city" && !selectedRegion)
      formErrors.region_id = "Region is required";
    if (type === "area" && !selectedCity)
      formErrors.city_id = "City is required";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (location) {
      locationData.id = location.id;
      onUpdate(locationData);
    } else {
      const response = await axiosSecure.post(
        "/admin/shipping/locations",
        locationData
      );

      if (response.status === 201) {
        showAlert("Success", "Location added successfully.", "success");
        await fetchLocations();
        navigate("/adminDashboard/delivery-system");
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {location ? "Edit" : "Add"} Location
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Location Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={!!location} // Disable if editing
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="country">Country</option>
              <option value="region">Region</option>
              <option value="city">City</option>
              <option value="area">Area</option>
            </select>
          </div>

          {/* Country Selection */}
          {type === "region" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                value={selectedCountry || ""}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              >
                <option value="">Select Country</option>
                {locationsData.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Region Selection */}
          {type === "city" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Region
              </label>
              <select
                value={selectedRegion || ""}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              >
                <option value="">Select Region</option>
                {locationsData
                  .flatMap((country) => country.children || [])
                  .map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* City Selection */}
          {type === "area" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <select
                value={selectedCity || ""}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              >
                <option value="">Select City</option>
                {locationsData
                  .flatMap((country) =>
                    country.children?.flatMap((region) => region.children || [])
                  )
                  .map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          {/* ISO Code (Only for country) */}
          {type === "country" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                ISO Code
              </label>
              <input
                type="text"
                value={isoCode}
                onChange={(e) => setIsoCode(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="text-gray-500">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              {location ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LocationForm;
