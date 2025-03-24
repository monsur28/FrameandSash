import { useState } from "react";
import {
  Building2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  UserCircle,
} from "lucide-react";
import { useSweetAlert } from "../../../ContextProvider/SweetAlertContext";
import { useLanguage } from "../../../ContextProvider/LanguageContext";
import axiosSecure from "../../../Hooks/AsiosSecure";
import SweetAlert from "../../../Shared/SweetAlert";

export default function WantToSell() {
  const { showAlert } = useSweetAlert();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    title: "",
    message: "",
    type: "success",
  });
  // const [userNameError, setUserNameError] = useState("");
  // const [emailError, setEmailError] = useState("");
  const [formData, setFormData] = useState({
    user_name: "",
    user_image: null,
    first_name: "",
    last_name: "",
    email: "",
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
    role: "manufacturer",
  });

  const steps = [
    {
      title: "Personal Information",
      icon: <UserCircle className="w-6 h-6" />,
      fields: [
        "user_name",
        "first_name",
        "last_name",
        "email",
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
      fields: ["company_name", "company_email"],
    },
    {
      title: "Final Steps",
      icon: <CheckCircle className="w-6 h-6" />,
      fields: ["password"],
    },
  ];

  const validateFields = () => {
    const currentFields = steps[currentStep].fields;
    let isValid = true;
    const errors = [];

    currentFields.forEach((field) => {
      if (
        field === "user_image" ||
        field === "company_image" ||
        field === "nid"
      ) {
        return; // Skip optional file fields
      }

      const value = formData[field];
      if (!value || value.toString().trim() === "") {
        isValid = false;
        errors.push(`${field.replace("_", " ")} is required`);
      }

      if ((field === "email" || field === "company_email") && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          errors.push(`Invalid ${field.replace("_", " ")} format`);
        }
      }

      if (field === "password" && currentStep === 2) {
        if (value.length < 6) {
          isValid = false;
          errors.push("Password must be at least 6 characters long");
        }
      }
    });

    if (!isValid) {
      setAlertConfig({
        show: true,
        title: "Validation Error",
        message: errors.join("\n"),
        type: "error",
      });
    }

    return isValid;
  };

  const handleNext = async () => {
    if (!validateFields()) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [field]: file,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value && typeof value !== "object") {
          formDataToSend.append(key, value.trim());
        }
      });

      if (formData.user_image) {
        formDataToSend.append("user_image", formData.user_image);
      }
      if (formData.company_image) {
        formDataToSend.append("company_image", formData.company_image);
      }
      if (formData.nid) {
        formDataToSend.append("nid", formData.nid);
      }

      const response = await axiosSecure.post("/register", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      if (response.status === 201) {
        showAlert("Success!", "Registration completed successfully", "success");
        resetForm();
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join("\n");
        setAlertConfig({
          show: true,
          title: "Validation Error",
          message: errorMessages,
          type: "error",
        });
      } else {
        setAlertConfig({
          show: true,
          title: "Error",
          message: "Registration failed. Please try again.",
          type: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      user_name: "",
      user_image: null,
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      language: "",
      mobile_number: "",
      company_name: "",
      company_image: null,
      company_email: "",
      nid: null,
      address: "",
      city: "",
      state: "",
      zip_code: "",
      country_region: "",
      role: "manufacturer",
    });
    setCurrentStep(0);
  };

  const handleCloseAlert = () => {
    setAlertConfig((prev) => ({ ...prev, show: false }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-6">
              {/* {userNameError && (
                <div className="text-red-500 text-sm">{userNameError}</div>
              )}
              {emailError && (
                <div className="text-red-500 text-sm">{emailError}</div>
              )} */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    placeholder="john_doe"
                    value={formData.user_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User Image
                  </label>
                  <div className="flex gap-4 items-center rounded-[24px] border-2 border-primary bg-[#CDE8E9]/60">
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("user_imageInput")?.click()
                      }
                      className="bg-teal-500 text-white px-4 lg:px-6 py-1 lg:py-3 rounded-[24px] hover:bg-teal-600 transition-colors"
                    >
                      Choose File
                    </button>
                    <span className="text-gray-500">
                      {formData.user_image
                        ? formData.user_image.name.slice(0, 10)
                        : "No File Chosen"}
                    </span>
                    <input
                      id="user_imageInput"
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "user_image")}
                      accept="image/*"
                    />
                  </div>
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
                    placeholder="John"
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
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="johndoe@gmail.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
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
                    placeholder="0171***********"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="country_region"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country / Region *
                  </label>
                  <input
                    type="text"
                    id="country_region"
                    name="country_region"
                    placeholder="Enter your country/region"
                    value={formData.country_region}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
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
                    placeholder="Enter your preferred language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
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
                  placeholder="123 Main Street"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="zip_code"
                    className="block text-sm font-medium"
                  >
                    Zip Code
                  </label>
                  <input
                    type="text"
                    id="zip_code"
                    name="zip_code"
                    placeholder="Enter zip code"
                    value={formData.zip_code}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Company Logo
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
                placeholder="Company Name"
                value={formData.company_name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Upload NID
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
                className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6">
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
                    value={formData.email}
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
    <div className="p-6 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5">
      <div className="flex items-center justify-between w-full">
        {[
          {
            label: "Basic Information",
            icon: <UserCircle className="w-8 h-8" />,
            completed: currentStep >= 0,
          },
          {
            label: "Company Information",
            icon: <Building2 className="w-8 h-8" />,
            completed: currentStep >= 1,
          },
          {
            label: "Confirmation",
            icon: <CheckCircle className="w-8 h-8" />,
            completed: currentStep >= 2,
          },
        ].map((step, index) => (
          <li
            key={index}
            className={`flex justify-center w-full relative ${
              step.completed ? "text-primary" : "text-gray-900"
            } after:content-[''] after:w-full after:h-0.5 ${
              step.completed ? "after:bg-primary" : "after:bg-gray-200"
            } after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4`}
          >
            <div className="block whitespace-nowrap z-10">
              <span
                className={`w-10 h-10 flex justify-center items-center mx-auto mb-3 text-sm lg:w-10 lg:h-10 rounded-full border-2 ${
                  step.completed
                    ? "bg-primary border-transparent text-white"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              >
                {step.icon}
              </span>
              {step.label}
            </div>
          </li>
        ))}
      </div>

      <form className="mt-8" onSubmit={(e) => e.preventDefault()}>
        {renderStep()}
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
            className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
