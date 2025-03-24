import { useEffect, useState } from "react";
import {
  Edit,
  Save,
  X,
  Camera,
  Building,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Lock,
} from "lucide-react";
import useAuth from "../../../Hooks/UseAuth";
import { useLanguage } from "../../../ContextProvider/LanguageContext";
import { useSweetAlert } from "../../../ContextProvider/SweetAlertContext";
import axiosSecure from "../../../Hooks/AsiosSecure";

export default function AdminProfile() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showAlert } = useSweetAlert();

  const [admin, setAdmin] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const [formErrors, setFormErrors] = useState({}); // Add state for form errors

  const [formData, setFormData] = useState({
    user_name: "",
    current_password: "",
    new_password: "",
    first_name: "",
    last_name: "",
    mobile_number: "",
    country_region: "",
    language: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    company_name: "",
    company_email: "",
    role: "",
    user_image: null,
    company_image: null,
    nid: null,
  });

  const [userImagePreview, setUserImagePreview] = useState(null);
  const [companyImagePreview, setCompanyImagePreview] = useState(null);
  const [nidPreview, setNidPreview] = useState(null);

  const API_BASE_URL = `${
    import.meta.env.VITE_REACT_LOCAL_APP_API_BASE_URL
  }/public`;

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axiosSecure.get("/profile");
        const data = response.data.user;
        setAdmin(data);

        // Initialize formData with existing data
        setFormData({
          user_name: data.user_name || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          mobile_number: data.mobile_number || "",
          country_region: data.country_region || "",
          language: data.language || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          zip_code: data.zip_code || "",
          company_name: data.company_name || "",
          company_email: data.company_email || "",
          role: data.role || "",
          // Keep initial values as null, don't overwrite with paths
          user_image: null,
          company_image: null,
          nid: null,
        });

        //Set image previews using the database paths
        setUserImagePreview(
          data.user_image
            ? `${API_BASE_URL}/${response.data.user.user_image}`
            : null
        );
        setCompanyImagePreview(
          data.company_image
            ? `${API_BASE_URL}/${response.data.user.company_image}`
            : null
        );
        setNidPreview(
          data.nid ? `${API_BASE_URL}/${response.data.user.nid}` : null
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        if (error.response) {
          console.error("Server responded with:", error.response.data);
          showAlert(
            "error",
            `Failed to load profile data: ${
              error.response.data.message || error.response.statusText
            }`
          );
        } else {
          showAlert(
            "error",
            "Failed to load profile data: No response from server."
          );
        }
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear validation errors when input changes
    setFormErrors({
      ...formErrors,
      [name]: null,
    });
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];

      if (!file.type.startsWith("image/")) {
        showAlert("error", "The selected file must be an image.");
        return;
      }

      // Update preview immediately.  This is *local* preview, not from server.
      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === "user_image") {
          setUserImagePreview(reader.result);
        } else if (name === "company_image") {
          setCompanyImagePreview(reader.result);
        } else if (name === "nid") {
          setNidPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);

      // Set the file in formData *immediately*.  We'll handle replacing
      // this with the URL *after* the upload succeeds.
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: file, // Store the *File object* temporarily
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({}); // Reset errors at the start of submission
    const updateData = new FormData();

    // Only append changed fields.  Crucial for not overwriting images.
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        if (key === "user_image" || key === "company_image" || key === "nid") {
          //If it is file, append it directly.
          if (formData[key] instanceof File) {
            updateData.append(key, formData[key]);
          }
        } else {
          updateData.append(key, formData[key]);
        }
      }
    }

    // Add current_password only if new_password is provided
    if (formData.new_password) {
      if (!formData.current_password) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          current_password: "Current password is required to change password.",
        }));
        return; // Stop the submission
      }
    }

    try {
      const response = await axiosSecure.post("/profile", updateData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        showAlert("success", "Profile updated successfully");
        setAdmin(response.data.user); // Update the local admin state.
        setIsEditing(false);

        // Reset file inputs and previews.  *Important* for UX.
        setUserImagePreview(
          response.data.user.user_image
            ? `${API_BASE_URL}/${response.data.user.user_image}`
            : null
        );
        setCompanyImagePreview(
          response.data.user.company_image
            ? `${API_BASE_URL}/${response.data.user.company_image}`
            : null
        );
        setNidPreview(
          response.data.user.nid
            ? `${API_BASE_URL}/${response.data.user.nid}`
            : null
        );

        // Reset file input fields
        if (document.getElementById("user_image")) {
          document.getElementById("user_image").value = "";
        }
        if (document.getElementById("company_image")) {
          document.getElementById("company_image").value = "";
        }
        if (document.getElementById("nid")) {
          document.getElementById("nid").value = "";
        }
        // Reset the temporary File objects in formData
        setFormData((prev) => ({
          ...prev,
          user_image: null,
          company_image: null,
          nid: null,
          current_password: "", // Clear password fields
          new_password: "",
        }));
      } else {
        // This "else" is likely unnecessary if you use proper error handling
        // with `catch`.  The `catch` block should handle *all* errors.
        console.error("Update failed:", response);
        showAlert(
          "error",
          `Update failed: ${response.data.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response) {
        // Handle validation errors from the backend
        if (error.response.status === 422 && error.response.data.errors) {
          setFormErrors(error.response.data.errors);
        } else {
          // Other server errors
          showAlert(
            "error",
            `Error updating profile: ${
              error.response.data.message || "Unknown server error"
            }`
          );
        }
      } else {
        showAlert("error", `Error updating profile: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="relative">
          {/* Banner Background */}
          <div className="h-48 bg-gradient-to-r from-cyan-500 to-blue-600"></div>

          {/* Profile Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 px-6 flex flex-col md:flex-row items-center md:items-end gap-4">
            {/* Profile Image */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                <img
                  src={
                    userImagePreview || "/placeholder.svg?height=128&width=128"
                  }
                  alt="Admin Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <label
                  htmlFor="user_image"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full border-4 border-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-8 h-8 text-white" />
                  <input
                    type="file"
                    id="user_image"
                    name="user_image"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              )}
            </div>

            {/* Profile Text */}
            <div className="text-center md:text-left md:mb-4 bg-white md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none shadow-md md:shadow-none">
              <h1 className="text-2xl font-bold text-gray-800">
                {formData.first_name} {formData.last_name}
              </h1>
              <p className="text-blue-600 font-medium">{formData.role}</p>
              <p className="text-gray-500 text-sm">{formData.company_email}</p>
            </div>

            {/* Edit Button */}
            <div className="md:ml-auto mb-4 md:mb-6">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isEditing
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }`}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <>
                    <X size={18} />
                    <span>{t("Cancel")}</span>
                  </>
                ) : (
                  <>
                    <Edit size={18} />
                    <span>{t("EditProfile")}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content Section with spacing for profile overlay */}
        <div className="pt-20 pb-8 px-4 md:px-8">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="mt-6">
              {/* Tabs for form sections */}
              <div className="flex border-b mb-6">
                <button
                  type="button"
                  className={`px-4 py-2 font-medium ${
                    activeTab === "personal"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("personal")}
                >
                  <User size={16} className="inline mr-2" />
                  {t("PersonalInfo")}
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 font-medium ${
                    activeTab === "company"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("company")}
                >
                  <Building size={16} className="inline mr-2" />
                  {t("CompanyInfo")}
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 font-medium ${
                    activeTab === "security"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("security")}
                >
                  <Lock size={16} className="inline mr-2" />
                  {t("Security")}
                </button>
              </div>

              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="user_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        <User size={16} className="inline mr-2" />
                        {t("UserName")}
                      </label>
                      <input
                        type="text"
                        name="user_name"
                        id="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focusfocus:border-blue-500"
                        placeholder={t("EnterUserName")}
                      />
                      {formErrors.user_name && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.user_name[0]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="first_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {t("FirstName")}
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t("EnterFirstName")}
                      />
                      {formErrors.first_name && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.first_name[0]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="last_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {t("LastName")}
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t("EnterLastName")}
                      />
                      {formErrors.last_name && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.last_name[0]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="mobile_number"
                        className="block text-sm font-medium text-gray-700"
                      >
                        <Phone size={16} className="inline mr-2" />
                        {t("MobileNumber")}
                      </label>
                      <input
                        type="tel"
                        name="mobile_number"
                        id="mobile_number"
                        value={formData.mobile_number}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t("EnterMobileNumber")}
                      />
                      {formErrors.mobile_number && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.mobile_number[0]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="country_region"
                        className="block text-sm font-medium text-gray-700"
                      >
                        <Globe size={16} className="inline mr-2" />
                        {t("CountryRegion")}
                      </label>
                      <select
                        name="country_region"
                        id="country_region"
                        value={formData.country_region}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">{t("SelectCountry")}</option>
                        <option value="USA">United States</option>
                        <option value="Canada">Canada</option>
                        {/* Add more countries as needed */}
                      </select>
                      {formErrors.country_region && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.country_region[0]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="language"
                        className="block text-sm font-medium text-gray-700"
                      >
                        <Globe size={16} className="inline mr-2" />
                        {t("Language")}
                      </label>
                      <select
                        name="language"
                        id="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">{t("SelectLanguage")}</option>
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        {/* Add more languages as needed */}
                      </select>
                      {formErrors.language && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.language[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      <MapPin size={16} className="inline mr-2" />
                      {t("Address")}
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t("EnterAddress")}
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.address[0]}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {t("City")}
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t("EnterCity")}
                      />
                      {formErrors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.city[0]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {t("State")}
                      </label>
                      <input
                        type="text"
                        name="state"
                        id="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t("EnterState")}
                      />
                      {formErrors.state && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.state[0]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="zip_code"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {t("ZipCode")}
                      </label>
                      <input
                        type="text"
                        name="zip_code"
                        id="zip_code"
                        value={formData.zip_code}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t("EnterZipCode")}
                      />
                      {formErrors.zip_code && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.zip_code[0]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Company Info Tab */}
              {activeTab === "company" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="company_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        <Building size={16} className="inline mr-2" />
                        {t("CompanyName")}
                      </label>
                      <input
                        type="text"
                        name="company_name"
                        id="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t("EnterCompanyName")}
                      />
                      {formErrors.company_name && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.company_name[0]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="company_email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        <Mail size={16} className="inline mr-2" />
                        {t("CompanyEmail")}
                      </label>
                      <input
                        type="email"
                        name="company_email"
                        id="company_email"
                        value={formData.company_email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t("EnterCompanyEmail")}
                      />
                      {formErrors.company_email && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.company_email[0]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="role"
                        className="block text-sm font-medium text-gray-700"
                      >
                        <User size={16} className="inline mr-2" />
                        {t("Role")}
                      </label>
                      <input
                        type="text"
                        name="role"
                        id="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t("EnterRole")}
                      />
                      {formErrors.role && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.role[0]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="company_image"
                        className="block text-sm font-medium text-gray-700"
                      >
                        <Building size={16} className="inline mr-2" />
                        {t("CompanyImage")}
                      </label>
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-gray-300 bg-gray-100 shadow-lg overflow-hidden">
                          <img
                            src={
                              companyImagePreview ||
                              "/placeholder.svg?height=128&width=128"
                            }
                            alt="Company Image"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <label
                          htmlFor="company_image"
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full border-4 border-gray-300 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Camera className="w-8 h-8 text-white" />
                          <input
                            type="file"
                            id="company_image"
                            name="company_image"
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      </div>
                      {formErrors.company_image && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.company_image[0]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="nid"
                        className="block text-sm font-medium text-gray-700"
                      >
                        <CreditCard size={16} className="inline mr-2" />
                        {t("Nid")}
                      </label>
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-gray-300 bg-gray-100 shadow-lg overflow-hidden">
                          <img
                            src={
                              nidPreview ||
                              "/placeholder.svg?height=128&width=128"
                            }
                            alt="NID"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <label
                          htmlFor="nid"
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full border-4 border-gray-300 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Camera className="w-8 h-8 text-white" />
                          <input
                            type="file"
                            id="nid"
                            name="nid"
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      </div>
                      {formErrors.nid && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.nid[0]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="current_password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      <Lock size={16} className="inline mr-2" />
                      {t("CurrentPassword")}
                    </label>
                    <input
                      type="password"
                      name="current_password"
                      id="current_password"
                      value={formData.current_password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t("EnterCurrentPassword")}
                    />
                    {formErrors.current_password && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.current_password}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="new_password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      <Lock size={16} className="inline mr-2" />
                      {t("NewPassword")}
                    </label>
                    <input
                      type="password"
                      name="new_password"
                      id="new_password"
                      value={formData.new_password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t("EnterNewPassword")}
                    />
                    {formErrors.new_password && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.new_password[0]}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  <Save size={18} />
                  <span>{t("SaveChanges")}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Display Mode - Personal Info */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  <User size={20} className="inline mr-2" />
                  {t("PersonalInfo")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-600">{t("UserName")}</p>
                    <p className="font-medium">{formData.user_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t("FirstName")}</p>
                    <p className="font-medium">{formData.first_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t("LastName")}</p>
                    <p className="font-medium">{formData.last_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t("MobileNumber")}</p>
                    <p className="font-medium">{formData.mobile_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t("CountryRegion")}</p>
                    <p className="font-medium">{formData.country_region}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t("Language")}</p>
                    <p className="font-medium">{formData.language}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-600">{t("Address")}</p>
                  <p className="font-medium">{formData.address}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div>
                    <p className="text-gray-600">{t("City")}</p>
                    <p className="font-medium">{formData.city}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t("State")}</p>
                    <p className="font-medium">{formData.state}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t("ZipCode")}</p>
                    <p className="font-medium">{formData.zip_code}</p>
                  </div>
                </div>
              </div>

              {/* Display Mode - Company Info */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  <Building size={20} className="inline mr-2" />
                  {t("CompanyInfo")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600">{t("CompanyName")}</p>
                    <p className="font-medium">{formData.company_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t("CompanyEmail")}</p>
                    <p className="font-medium">{formData.company_email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t("Role")}</p>
                    <p className="font-medium">{formData.role}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t("CompanyImage")}</p>
                    <div className="w-32 h-32 rounded-full border-4 border-gray-300 bg-gray-100 shadow-lg overflow-hidden">
                      <img
                        src={
                          companyImagePreview ||
                          "/placeholder.svg?height=128&width=128"
                        }
                        alt="Company"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600">{t("Nid")}</p>
                    <div className="w-32 h-32 rounded-full border-4 border-gray-300 bg-gray-100 shadow-lg overflow-hidden">
                      <img
                        src={
                          nidPreview || "/placeholder.svg?height=128&width=128"
                        }
                        alt="NID"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
