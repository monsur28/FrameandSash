import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  // Upload,
} from "lucide-react";
import { useLanguage } from "../ContextProvider/LanguageContext";
import axiosSecure from "../Hooks/AsiosSecure";
import { UseSweetAlert } from "../ContextProvider/SweetAlertContext";
import SweetAlert from "../Shared/SweetAlert";

export default function AddManufacturerForm() {
  const { showAlert } = UseSweetAlert();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    title: "",
    message: "",
    type: "success",
  });

  const [formData, setFormData] = useState({
    user_id: "",
    user_name: "",
    first_name: "",
    last_name: "",
    user_email: "",
    password: "",
    mobile_number: "",
    language: "",
    company_name: "",
    company_image: null,
    company_email: "",
    nid: null,
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country_region: "",
    approved: "false",
  });

  // Generate a random user_id when the component mounts
  useEffect(() => {
    const randomId = Math.floor(Math.random() * 1000000); // Random 6-digit number
    setFormData((prevData) => ({
      ...prevData,
      user_id: randomId.toString(), // Set it as a string if needed
    }));
  }, []); // Empty array ensures this only runs once when the component mounts

  const steps = [
    {
      title: "Personal Information",
      icon: <UserCircle className="w-6 h-6" />,
      fields: [
        "user_id",
        "user_name",
        "first_name",
        "last_name",
        "user_email",
        "mobile_number",
        "country_region",
        "language",
        "address",
        "city",
        "state",
        "zip_code",
      ],
    },
    {
      title: "Company Details",
      icon: <Building2 className="w-6 h-6" />,
      fields: ["company_name", "companyLogo", "company_email", "nid"],
    },
    {
      title: "Final Steps",
      icon: <CheckCircle className="w-6 h-6" />,
      fields: ["approved", "email", "password"],
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };

      // Automatically set user_name from first_name andlast_name
      if (name === "first_name" || name === "last_name") {
        updatedData.user_name =
          `${updatedData.first_name}${updatedData.last_name}`.toLowerCase();
      }

      return updatedData;
    });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [field]: file,
      }));
    }
  };

  const handleNext = async () => {
    if (!formData) {
      alert("Please fill in all required fields");
      return;
    }

    if (currentStep === steps.length - 1) {
      await handleSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Prepare payload and convert `approved` to 1 or 0
      const payload = {
        ...formData,
      };

      console.log(payload); // Check the transformed payload before submission

      try {
        const response = await axiosSecure.post(
          "/manufacturers/store",
          payload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          showAlert(
            "Congratulations!",
            "Your email has already been confirmed. You can now login to the application",
            "success"
          );
        } else {
          setCurrentStep((prev) => Math.min(prev + 1, 3));
        }

        console.log("Success:", response);
        resetForm();
      } catch (error) {
        if (error.response) {
          console.log("Backend Error:", error.response.data.errors); // Show backend validation errors
        } else {
          console.log("Request Error:", error);
        }
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAlert = () => {
    setAlertConfig((prev) => ({ ...prev, show: false }));
  };

  const resetForm = () => {
    setFormData({
      user_id: "",
      user_name: "",
      first_name: "",
      last_name: "",
      user_email: "",
      password: "",
      language: "",
      zip_code: "",
      mobile_number: "",
      company_name: "",
      company_image: null,
      company_email: "",
      nid: null,
      address: "",
      city: "",
      state: "",
      country_region: "",
      approved: false,
    });
    setCurrentStep(0);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            {/* Form */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="user_id"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("user_id")} *
                  </label>
                  <input
                    type="text"
                    id="user_id"
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="user_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("user_name")} *
                  </label>
                  <input
                    type="text"
                    id="user_name"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("first_name")} *
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("LastName")} *
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500  rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="user_email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="user_email"
                    name="user_email"
                    value={formData.user_email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500  rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="mobile_number"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    id="mobile_number"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500  rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="country_region"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    country_region / Region *
                  </label>
                  <input
                    type="text"
                    id="country_region"
                    name="country_region"
                    value={formData.country_region}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500  rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="language"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Language *
                  </label>
                  <input
                    type="text"
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500  rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-500  rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500  rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500  rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="zip_code"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Zip Code
                  </label>
                  <input
                    type="text"
                    id="zip_code"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      /* Secound Step */

      case 1:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User ID */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2" htmlFor="user-id">
                User Id *
              </label>
              <input
                type="text"
                id="user_id"
                name="user_id"
                placeholder="8erytwt345"
                value={formData.user_id}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-500  rounded-[18px] bg-[rgba(205,232,233,0.60)]"
              />
            </div>

            {/* Company Logo */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Company Logo
                <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4 items-center rounded-[24px] border-2 border-primary bg-[#CDE8E9]/60">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("company_imageInput")?.click()
                  }
                  className="bg-teal-500 text-white px-4 lg:px-6 py-1 lg:py-3 rounded-[24px] hover:bg-teal-600 transition-colors"
                >
                  Choose File
                </button>
                <span className="text-gray-500">
                  {formData.company_image
                    ? formData.company_image.name.slice(0, 10)
                    : "No File Chosen"}
                </span>
                <input
                  id="company_imageInput"
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "company_image")}
                  accept="image/*"
                />
              </div>
            </div>

            {/* First Name */}
            <div className="flex flex-col">
              <label
                className="text-sm font-medium mb-2"
                htmlFor="company_name"
              >
                Company Name *
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                placeholder="company Name"
                value={formData.company_name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-500  rounded-[18px] bg-[rgba(205,232,233,0.60)]"
              />
            </div>

            {/* Upload NID */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Upload NID
                <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4 items-center rounded-[24px] border-2 border-primary bg-[#CDE8E9]/60">
                <button
                  type="button"
                  onClick={() => document.getElementById("nidInput")?.click()}
                  className="bg-teal-500 text-white px-4 lg:px-6 py-1 lg:py-3 rounded-[24px] hover:bg-teal-600 transition-colors"
                >
                  Choose File
                </button>
                <span className="text-gray-500">
                  {formData.nid
                    ? formData.nid.name.slice(0, 10)
                    : "No File Chosen"}
                </span>
                <input
                  id="nidInput"
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "nid")}
                  accept="image/*"
                />
              </div>
            </div>

            {/* Company Email Address */}
            <div>
              <label
                htmlFor="company_email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Email *
              </label>
              <input
                type="email"
                id="company_email"
                name="company_email"
                value={formData.company_email}
                onChange={handleInputChange}
                placeholder="Enter your company email"
                className="w-full px-4 py-2 border border-gray-500  rounded-[18px] bg-[rgba(205,232,233,0.60)]"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6">
            {/* User Management Section */}
            <div className="col-span-1">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                User Management
              </h2>
              <div className="flex mt-3 gap-4">
                <label className="block font-medium text-gray-600">
                  Approved <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="approved"
                      value={true}
                      checked={formData.approved === true}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          approved: true,
                        })
                      }
                      className="w-5 h-5 text-teal-500 border-gray-300 focus:ring-teal-500"
                    />
                    <span className="text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="approved"
                      value={false}
                      checked={formData.approved === false}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          approved: false,
                        })
                      }
                      className="w-5 h-5 text-teal-500 border-gray-300 focus:ring-teal-500"
                    />
                    <span className="text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </div>

            {/* User Setup Section */}
            <div className="col-span-2">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                User Setup
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block font-medium text-gray-600 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.user_email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-600 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className=" p-6 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 shadow-lg">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 w-full">
        {[
          {
            label: "Basic Information",
            icon: <UserCircle className="w-6 h-6" />,
            color: "teal-500",
            completed: currentStep >= 0,
          },
          {
            label: "Company Information",
            icon: <Building2 className="w-6 h-6" />,
            color: "gray-400",
            completed: currentStep >= 1,
          },
          {
            label: "Confirmation",
            icon: <CheckCircle className="w-6 h-6" />,
            color: "gray-400",
            completed: currentStep >= 2,
          },
        ].map((step, index, array) => (
          <div key={index} className="flex items-center w-full justify-center">
            <div className="flex flex-col lg items-center text-center">
              {/* Step Icon */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full ${
                  step.completed
                    ? "bg-teal-500 text-white"
                    : "bg-white border-2 border-gray-200 text-" + step.color
                }`}
              >
                {step.icon}
              </div>
              {/* Step Label */}
              <span
                className={`mt-2 text-xs lg:text-sm ${
                  step.completed ? "text-teal-500" : "text-gray-500"
                } font-medium`}
              >
                {step.label}
              </span>
            </div>
            {/* Horizontal Line */}
            {index < array.length - 1 && (
              <div
                className={`flex-grow justify-center items-center h-[4px] w-2 lg:w-56 xl:w-96 ${
                  step.completed ? "bg-teal-500" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Form Fields */}
      <form className="mt-8" onSubmit={(e) => e.preventDefault()}>
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className={`px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 ${
              currentStep === 0 ? "invisible" : ""
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting
              ? "Submitting..."
              : currentStep === steps.length - 1
              ? "Submit"
              : "Next"}
            {currentStep < steps.length - 1 && (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
      <SweetAlert
        show={alertConfig.show}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={handleCloseAlert}
      />
    </div>
  );
}
