import { useState, useEffect } from "react";

import { Mail, Phone } from "lucide-react";
import axiosSecure from "../Hooks/AsiosSecure";
import { useSweetAlert } from "../ContextProvider/SweetAlertContext";

export default function SiteInfoForm() {
  const { showAlert } = useSweetAlert();
  const [formData, setFormData] = useState({
    siteTitle: "",
    short_description: "",
    copy_right: "",
    address: "",
    map_link: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [siteInfo, setSiteInfo] = useState({});

  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const response = await axiosSecure.get("/site-info");
        const data = response.data || {};
        setSiteInfo(data);
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
  }, [showAlert]);

  useEffect(() => {
    document.title = siteInfo.siteTitle || "Default Site Title";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        siteInfo.short_description || "Default site description"
      );
    }
  }, [siteInfo]);

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

    if (!formData.copy_right) {
      newErrors.copy_right = "CopyRight is required";
      valid = false;
    }

    if (!formData.address) {
      newErrors.address = "Address is required";
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!formData.phone) {
      newErrors.phone = "Phone is required";
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
        setSiteInfo(formData);
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
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 bg-white rounded-lg shadow-md"
      >
        {[
          { label: "Site Title", name: "siteTitle", type: "text" },
          {
            label: "Short Description",
            name: "short_description",
            type: "textarea",
          },
          { label: "CopyRight", name: "copy_right", type: "text" },
          { label: "Address", name: "address", type: "text" },
          { label: "Address Map Link", name: "map_link", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Phone", name: "phone", type: "tel" },
        ].map((field, idx) => (
          <div key={idx}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700"
            >
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="mt-1 block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <div className="relative mt-1">
                {(field.name === "email" || field.name === "phone") &&
                  (field.name === "email" ? (
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  ) : (
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  ))}
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="pl-10 block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
