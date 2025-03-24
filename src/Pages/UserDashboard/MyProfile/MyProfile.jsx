import { useState } from "react";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../../Hooks/UseAuth";
import axiosSecure from "../../../Hooks/AsiosSecure";

export default function MyProfile() {
  const { user } = useAuth();
  console.log(user);
  const [selectedImg, setSelectedImg] = useState(user?.user_image || null);
  const [isManufacturer, setIsManufacturer] = useState(false);
  const [formData, setFormData] = useState({
    user_name: user?.user_name || "",
    user_image: null,
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    mobile_number: user?.mobile_number || "",
    language: user?.language || "",
    company_name: "",
    company_image: null,
    company_email: "",
    nid: null,
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    zip_code: user?.zip_code || "",
    country_region: user?.country_region || "",
  });

  // Function to handle text input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Function to handle file selection
  const handleFileChange = (event, key) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [key]: file,
      }));
      if (key === "user_image") {
        setSelectedImg(URL.createObjectURL(file));
      }
    }
  };

  // Function to save changes using axiosSecure
  const handleSaveChanges = async () => {
    const formDataToSend = new FormData();

    // If the user is not a manufacturer, set company_image and nid to null (or do not include them in formData)
    if (isManufacturer) {
      if (formData.company_image) {
        formDataToSend.append("company_image", formData.company_image);
      }
      if (formData.nid) {
        formDataToSend.append("nid", formData.nid);
      }
    }

    // Append all other form fields
    Object.keys(formData).forEach((key) => {
      // Don't append company_image and nid if they're not required
      if (key !== "company_image" && key !== "nid") {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axiosSecure.post("/profile", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2 text-sm">
        <Home className="w-4 h-4 text-teal-500" />
        <span>You are here:</span>
        <Link to="/" className="text-gray-500 hover:text-gray-700">
          Home
        </Link>
        <span className="text-gray-400">&gt;</span>
        <span className="text-teal-500">My Profile</span>
      </div>

      <div className="px-4 py-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">
          Profile Setting
        </h1>

        <div className="grid grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="border-l-4 border-teal-500 pl-4 py-2 text-teal-500">
                Edit Profile
              </div>
              <div className="pl-4 py-2 text-gray-500">Billing Information</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-3 bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-xl text-gray-800 mb-6">Edit Your Profile</h2>

            {/* Profile Image Upload */}
            <div className="flex items-center gap-8 mb-8">
              <div className="relative">
                <img
                  src={
                    selectedImg ||
                    `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${
                      user?.user_image
                    }`
                  }
                  alt="Profile"
                  width={120}
                  height={120}
                  className="rounded-full border border-gray-400"
                />
              </div>

              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, "user_image")}
              />
              <label
                htmlFor="imageUpload"
                className="px-4 py-2 border border-teal-500 text-teal-500 rounded-md hover:bg-teal-50 cursor-pointer"
              >
                Upload Image
              </label>
            </div>

            {/* User Information */}
            <div className="mb-8">
              <h3 className="text-lg text-teal-500 mb-4">User Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "user_name",
                  "first_name",
                  "last_name",
                  "email",
                  "mobile_number",
                  "language",
                  "address",
                  "city",
                  "state",
                  "zip_code",
                  "country_region",
                ].map((field) => (
                  <div key={field}>
                    <label className="block text-sm text-gray-600 mb-1">
                      {field.replace("_", " ")}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Manufacturer Registration */}
            <div className="mb-8">
              <h3 className="text-lg text-teal-500 mb-4">
                Manufacturer Registration
              </h3>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isManufacturer}
                  onChange={() => setIsManufacturer(!isManufacturer)}
                />
                <span>Register as a Manufacturer</span>
              </label>

              {isManufacturer && (
                <>
                  {["company_name", "company_email"].map((field) => (
                    <div key={field} className="mb-6">
                      <label className="block text-sm font-semibold mb-2">
                        {field.replace("_", " ")}
                      </label>
                      <input
                        type="text"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  ))}

                  {["company_image", "nid"].map((field) => (
                    <div key={field} className="mb-6">
                      <label className="block text-sm font-semibold mb-2">
                        {field.replace("_", " ")}
                      </label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, field)}
                        accept="image/*"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Save Changes Button */}
            <button
              onClick={handleSaveChanges}
              className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
