import { useState, useEffect } from "react";
import { Mail, Phone } from "lucide-react";
import { Helmet } from "react-helmet";
import { useSiteInfo } from "../../../ContextProvider/SiteInfoContext";
import axiosSecure from "../../../Hooks/AsiosSecure";
import { useSweetAlert } from "../../../ContextProvider/SweetAlertContext";

export default function SiteInfoForm() {
  const { siteInfo, setSiteInfo } = useSiteInfo();
  const { showAlert } = useSweetAlert();

  const [formData, setFormData] = useState({
    siteTitle: siteInfo.siteTitle || "",
    short_description: siteInfo.short_description || "",
    copy_right: "",
    address: "",
    map_link: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const response = await axiosSecure.get("/site-info");
        const data = response.data || {};
        setSiteInfo(data); // Update global state
        setFormData({
          siteTitle: data.siteTitle || "",
          short_description: data.short_description || "",
          copy_right: data.copy_right || "",
          address: data.address || "",
          map_link: data.map_link || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      } catch (error) {
        console.error("Error fetching site info:", error);
        showAlert("Error!", "Failed to fetch site information.", "error", "OK");
      }
    };

    fetchSiteInfo();
  }, []);

  const validate = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.siteTitle) {
      newErrors.siteTitle = "Site title is required";
      valid = false;
    }

    if (!formData.short_description) {
      newErrors.short_description = "Short description is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        if (siteInfo.id) {
          // Update existing site info
          await axiosSecure.put("/site-info", formData);
          showAlert(
            "Success!",
            "Site information updated successfully!",
            "success",
            "OK"
          );
        } else {
          // Create new site info
          await axiosSecure.post("/site-info", formData);
          showAlert(
            "Success!",
            "Site information created successfully!",
            "success",
            "OK"
          );
        }
        setSiteInfo(formData); // Update global state
      } catch (error) {
        showAlert(
          "Error!",
          `${error.response?.data?.message || "An error occurred."}`,
          "error",
          "OK"
        );
      }
    } else {
      showAlert(
        "Error!",
        "Please fill in all required fields correctly.",
        "error",
        "OK"
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5">
      <Helmet>
        <title>{siteInfo.siteTitle || "Default Site Title"}</title>
        <meta
          name="description"
          content={siteInfo.short_description || "Default Site Description"}
        />
      </Helmet>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 bg-white rounded-lg shadow-md"
      >
        {/* Site Title */}
        <div>
          <label
            htmlFor="siteTitle"
            className="block text-sm font-medium text-gray-700"
          >
            Site Title
          </label>
          <input
            id="siteTitle"
            name="siteTitle"
            type="text"
            value={formData.siteTitle}
            onChange={handleChange}
            className="mt-1 block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.siteTitle && (
            <p className="text-red-500 text-sm mt-1">{errors.siteTitle}</p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <label
            htmlFor="short_description"
            className="block text-sm font-medium text-gray-700"
          >
            Short Description
          </label>
          <textarea
            id="short_description"
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            className="mt-1 block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.short_description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.short_description}
            </p>
          )}
        </div>

        {/* CopyRight */}
        <div>
          <label
            htmlFor="copy_right"
            className="block text-sm font-medium text-gray-700"
          >
            CopyRight
          </label>
          <input
            id="copy_right"
            name="copy_right"
            type="text"
            value={formData.copy_right}
            onChange={handleChange}
            className="mt-1 block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.copy_right && (
            <p className="text-red-500 text-sm mt-1">{errors.copy_right}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        {/* Address Map Link */}
        <div>
          <label
            htmlFor="map_link"
            className="block text-sm font-medium text-gray-700"
          >
            Address Map Link
          </label>
          <input
            id="map_link"
            name="map_link"
            type="text"
            value={formData.map_link}
            onChange={handleChange}
            className="mt-1 block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.map_link && (
            <p className="text-red-500 text-sm mt-1">{errors.map_link}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="pl-10 block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <div className="relative mt-1">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="pl-10 block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full text-white bg-primary hover:bg-primary/80 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
