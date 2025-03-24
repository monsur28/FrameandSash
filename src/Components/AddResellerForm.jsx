import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  UserCircle,
} from "lucide-react";
import { useSweetAlert } from "../ContextProvider/SweetAlertContext";
import { useLanguage } from "../ContextProvider/LanguageContext";
import axiosSecure from "../Hooks/AsiosSecure";
import SweetAlert from "../Shared/SweetAlert";

export default function AddManufacturerForm() {
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

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const handleCountryChange = async (e) => {
    const selectedCountry = e.target.value;
    setFormData((prev) => ({
      ...prev,
      country_region: selectedCountry,
      state: "",
      city: "",
    }));
    setStates([]);
    setCities([]);

    try {
      const response = await axiosSecure.get(
        `https://api.locationiq.com/v1/autocomplete.php`,
        {
          params: {
            key: import.meta.env.VITE_LOCATIONIQ_API_KEY,
            q: selectedCountry,
            format: "json",
          },
        }
      );

      // Extract states for the selected country
      if (response.data.length > 0) {
        const uniqueStates = [
          ...new Set(
            response.data.map((item) => item.address.state).filter(Boolean)
          ),
        ];
        setStates(uniqueStates);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const handleStateChange = async (e) => {
    const selectedState = e.target.value;
    setFormData((prev) => ({ ...prev, state: selectedState, city: "" }));
    setCities([]);

    try {
      const response = await axiosSecure.get(
        `https://api.locationiq.com/v1/autocomplete.php`,
        {
          params: {
            key: import.meta.env.VITE_LOCATIONIQ_API_KEY,
            q: `${selectedState}, ${formData.country_region}`,
            format: "json",
          },
        }
      );

      // Extract cities for the selected state
      if (response.data.length > 0) {
        const uniqueCities = [
          ...new Set(
            response.data.map((item) => item.address.city).filter(Boolean)
          ),
        ];
        setCities(uniqueCities);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    const randomId = Math.floor(Math.random() * 1000000);
    setFormData((prevData) => ({
      ...prevData,
      user_id: randomId.toString(),
    }));
  }, []);

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
      fields: ["company_name", "company_image", "company_email", "nid"],
    },
    {
      title: "Final Steps",
      icon: <CheckCircle className="w-6 h-6" />,
      fields: ["approved", "password"],
    },
  ];

  const validateFields = () => {
    const currentFields = steps[currentStep].fields;
    for (const field of currentFields) {
      if (
        !formData[field] ||
        (field === "company_image" && !formData[field]?.name)
      ) {
        return false;
      }
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };

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
    if (!validateFields()) {
      alert("Please fill in all required fields before proceeding.");
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

      const payload = {
        ...formData,
        approved: formData.approved === "true" ? 0 : 1,
      };

      console.log(payload);

      const response = await axiosSecure.post("/resellers/store", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        showAlert(
          "Congratulations!",
          "Your email has already been confirmed. You can now login to the application.",
          "success"
        );
        resetForm();
      } else {
        setAlertConfig({
          show: true,
          title: "Error",
          message: "An error occurred. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
      approved: "false",
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
                    placeholder="john_doe"
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
                    className="w-full px-4 py-2 border border-gray-500  rounded-[18px] bg-[rgba(205,232,233,0.60)]"
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
                    id="user_email"
                    name="user_email"
                    placeholder="jhondoe@gmail.com"
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
                    placeholder="0171***********"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500  rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Country / Region */}
                <div>
                  <label
                    htmlFor="country_region"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country / Region *
                  </label>
                  <select
                    id="country_region"
                    name="country_region"
                    value={formData.country_region}
                    onChange={handleCountryChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  >
                    <option value="" disabled>
                      Select a country
                    </option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="India">India</option>
                    <option value="Canada">Canada</option>
                    {/* Add more countries as needed */}
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label
                    htmlFor="language"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Language *
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  >
                    <option value="" disabled>
                      Select a language
                    </option>
                    <option value="English">English</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    {/* Add more languages as needed */}
                  </select>
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
                {/* City */}
                <div>
                  <label htmlFor="city">City</label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                    disabled={!cities.length}
                  >
                    <option value="" disabled>
                      Select a city
                    </option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                {/* State */}
                <div>
                  <label htmlFor="state">State</label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleStateChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                    disabled={!states.length}
                  >
                    <option value="" disabled>
                      Select a state
                    </option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Zip Code */}
                <div>
                  <label htmlFor="zip_code">Zip Code</label>
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
