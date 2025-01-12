import { useState } from "react";
import {
  Building2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  UserCircle,
} from "lucide-react";
import SweetAlert from "../Shared/SweetAlert";
import { UseSweetAlert } from "../ContextProvider/SweetAlertContext";
import { useLanguage } from "../ContextProvider/LanguageContext";

export default function AddManufacturerForm() {
  const { showAlert } = UseSweetAlert();
  const { t } = useLanguage();
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    title: "",
    message: "",
    type: "success",
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    email: "",
    password: "",
    approved: false,
    companyLogo: null,
    uploadNID: null,
    userName: "",
    lastName: "",
    mobileNumber: "",
    country: "",
    language: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // const handleInputChange = (e) => {
  //   const { name, value, type } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === "checkbox" ? e.target.checked : value,
  //   }));
  // };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleFileChange = (e, fieldName) => {
  //   const file = e.target.files?.[0] || null;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [fieldName]: file,
  //   }));
  // };

  const handleNext = () => {
    if (currentStep === 2) {
      showAlert(
        "Congratulations!",
        "Your email has already been confirmed. You can now login to the application",
        "success"
      );
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
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
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="userId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("UserId")} *
                  </label>
                  <input
                    type="text"
                    id="userId"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="userName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("UserName")} *
                  </label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("FirstName")} *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("LastName")} *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-500  rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
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
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-500  rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-500  rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country / Region *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-500  rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-500  rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Zip Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        {
          /* second Step */
        }
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* User ID */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2" htmlFor="user-id">
                User Id *
              </label>
              <input
                type="text"
                id="user-id"
                placeholder="8erytwt345"
                className="w-full p-2 border border-gray-500  rounded-[18px] bg-[rgba(205,232,233,0.60)]"
              />
            </div>

            {/* Company Logo */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Company Logo<span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4 items-center rounded-[24px] border-2 border-primary bg-[#CDE8E9]/60">
                <button
                  type="button"
                  onClick={() => document.getElementById("fileInput")?.click()}
                  className="bg-teal-500 text-white px-6 py-3 rounded-[24px] hover:bg-teal-600 transition-colors"
                >
                  Choose File
                </button>
                <span className="text-gray-500">
                  {formData.selectedFile
                    ? formData.selectedFile.name
                    : "No File Chosen"}
                </span>
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>

            {/* First Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2" htmlFor="first-name">
                First Name
              </label>
              <input
                type="text"
                id="first-name"
                placeholder="John"
                className="w-full p-2 border border-gray-500  rounded-[18px] bg-[rgba(205,232,233,0.60)]"
              />
            </div>

            {/* Upload NID */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Upload NID<span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4 items-center rounded-[24px] border-2 border-primary bg-[#CDE8E9]/60">
                <button
                  type="button"
                  onClick={() => document.getElementById("fileInput")?.click()}
                  className="bg-teal-500 text-white px-6 py-3 rounded-[24px] hover:bg-teal-600 transition-colors"
                >
                  Choose File
                </button>
                <span className="text-gray-500">
                  {formData.selectedFile
                    ? formData.selectedFile.name
                    : "No File Chosen"}
                </span>
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2" htmlFor="email">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                placeholder="Jhon564@gmail.com"
                className="w-full p-2 border border-gray-500 rounded-[18px] bg-[rgba(205,232,233,0.60)]"
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
              <div className="flex  mt-3 gap-4">
                <label className="block font-medium text-gray-600">
                  Approved <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="approved"
                      checked={formData.approved}
                      onChange={handleChange}
                      className="w-5 h-5 text-teal-500 border-gray-300 focus:ring-teal-500"
                    />
                    <span className="text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="approved"
                      checked={!formData.approved}
                      onChange={handleChange}
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
                    value={formData.email}
                    onChange={handleChange}
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
                    onChange={handleChange}
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
    <div>
      <div className=" rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 p-6 md:p-8">
        <div className="flex  justify-between mb-8">
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
              <div
                key={index}
                className="flex items-center w-full justify-center"
              >
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
        </div>

        <form>
          {renderStep()}

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handlePrevious}
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                currentStep === 0 ? "invisible" : "bg-gray-200"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white"
            >
              {currentStep === 3 ? "Submit" : "Next"}
              {currentStep < 3 && <ChevronRight className="w-4 h-4" />}
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
    </div>
  );
}
