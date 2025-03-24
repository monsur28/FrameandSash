/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axiosSecure from "../../../Hooks/AsiosSecure";
import CheckoutForm from "../../../Components/CheckoutForm";
import useAuth from "../../../Hooks/UseAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { Edit2, Trash2 } from "lucide-react";
import { useSweetAlert } from "../../../ContextProvider/SweetAlertContext";

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_GATEWAY);

export default function Checkout() {
  // Checkout steps
  const steps = ["Delivery Details", "Shipping", "Review Order", "Payment"];
  const [currentStep, setCurrentStep] = useState(1);
  const [editingStep, setEditingStep] = useState(null);
  const { showAlert } = useSweetAlert();
  const navigate = useNavigate();

  const { user } = useAuth();

  // Delivery details state
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [selectedPostalCode, setSelectedPostOffice] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(user?.mobile_number || "");
  const [name, setName] = useState(`${user?.first_name} ${user?.last_name}`);
  const [addressType, setAddressType] = useState("home");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);

  // Location data state (country → region → city → area)
  const [locationData, setLocationData] = useState({
    countries: [],
    regions: [],
    cities: [],
    areas: [],
  });

  // Shipping options state
  const [availableShippingOptions, setAvailableShippingOptions] = useState([]);
  const [selectedShippingOption, setSelectedShippingOption] = useState("");
  const [loadingShippingOptions, setLoadingShippingOptions] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [estimatedDeliveryDays, setEstimatedDeliveryDays] = useState(null);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentFee, setPaymentFee] = useState(35); // Default for credit card

  // Order summary state
  const location = useLocation();
  const { cartTotal } = location.state || {
    cartTotal: 0,
  };
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // Initialize subtotal from cart total
  useEffect(() => {
    setSubtotal(cartTotal);
  }, [cartTotal]);

  // Fetch countries on initial load
  useEffect(() => {
    axiosSecure
      .get("/checkout/available-locations")
      .then((response) => {
        setLocationData((prevState) => ({
          ...prevState,
          countries: response.data.countries,
        }));
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
        setErrorMessage("Error fetching locations. Please try again.");
      });
  }, []);

  // Fetch regions when country changes
  useEffect(() => {
    if (selectedCountryId) {
      const country = locationData.countries.find(
        (c) => c.id === Number.parseInt(selectedCountryId, 10)
      );
      setLocationData((prevState) => ({
        ...prevState,
        regions: country?.regions || [],
        cities: [],
        areas: [],
      }));
      setSelectedRegionId("");
      setSelectedCityId("");
      setSelectedAreaId("");
    } else {
      setLocationData((prevState) => ({
        ...prevState,
        regions: [],
        cities: [],
        areas: [],
      }));
    }
  }, [selectedCountryId, locationData.countries]);

  // Fetch cities when region changes
  useEffect(() => {
    if (selectedCountryId && selectedRegionId) {
      const country = locationData.countries.find(
        (c) => c.id === Number.parseInt(selectedCountryId, 10)
      );
      const region = country?.regions.find(
        (r) => r.id === Number.parseInt(selectedRegionId, 10)
      );
      setLocationData((prevState) => ({
        ...prevState,
        cities: region?.cities || [],
        areas: [],
      }));
      setSelectedCityId("");
      setSelectedAreaId("");
    } else {
      setLocationData((prevState) => ({
        ...prevState,
        cities: [],
        areas: [],
      }));
    }
  }, [selectedCountryId, selectedRegionId, locationData.countries]);

  // Fetch areas when city changes
  useEffect(() => {
    if (selectedCountryId && selectedRegionId && selectedCityId) {
      const country = locationData.countries.find(
        (c) => c.id === Number.parseInt(selectedCountryId, 10)
      );
      const region = country?.regions.find(
        (r) => r.id === Number.parseInt(selectedRegionId, 10)
      );
      const city = region?.cities.find(
        (c) => c.id === Number.parseInt(selectedCityId, 10)
      );
      setLocationData((prevState) => ({
        ...prevState,
        areas: city?.areas || [],
      }));
      setSelectedAreaId("");
    } else {
      setLocationData((prevState) => ({
        ...prevState,
        areas: [],
      }));
    }
  }, [
    selectedCountryId,
    selectedRegionId,
    selectedCityId,
    locationData.countries,
  ]);

  // Fetch shipping options when a shipping address is selected
  useEffect(() => {
    const fetchShippingOptions = async () => {
      if (selectedAddress?.id) {
        setAvailableShippingOptions([]);
        setLoadingShippingOptions(true);

        try {
          const response = await axiosSecure.get("/checkout/shipping-options", {
            params: { shipping_address_id: selectedAddress.id },
          });

          setAvailableShippingOptions(response.data.shipping_options);
          if (response.data.shipping_options.length > 0) {
            const firstOption = response.data.shipping_options[0];
            setSelectedShippingOption(firstOption.id);
            setShippingCost(firstOption.cost);
            setEstimatedDelivery(firstOption.days);
            fetchEstimatedDeliveryDays(firstOption.id);
          }
        } catch (error) {
          console.error("Shipping options error:", error);
          setErrorMessage("Error loading shipping options");
        } finally {
          setLoadingShippingOptions(false);
        }
      }
    };

    fetchShippingOptions();
  }, [selectedAddress]);

  // Calculate total when subtotal or shipping changes
  useEffect(() => {
    const parsedSubtotal = parseFloat(subtotal);
    const parsedShippingCost = parseFloat(shippingCost);
    const calculatedTotal = parsedSubtotal + parsedShippingCost;
    setTotal(calculatedTotal);
  }, [subtotal, shippingCost, paymentFee]);

  // Fetch saved addresses
  useEffect(() => {
    setLoadingAddresses(true);
    axiosSecure
      .get("/checkout/shipping-address")
      .then((response) => {
        if (response.data.shipping_address?.length > 0) {
          setSavedAddresses(response.data.shipping_address);
          setShowAddressForm(false);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingAddresses(false));
  }, []);

  // Mark address as default
  const setAddressAsDefault = (addressId) => {
    axiosSecure
      .put(`/checkout/shipping-address/${addressId}`, { is_default: true })
      .then(() => {
        setSavedAddresses((prevAddresses) =>
          prevAddresses.map((address) =>
            address.id === addressId
              ? { ...address, is_default: true }
              : { ...address, is_default: false }
          )
        );
      })
      .catch((error) => {
        console.error("Error setting default address:", error);
        setErrorMessage("Error setting default address. Please try again.");
      });
  };

  // Simulate API call for estimated delivery
  const fetchEstimatedDeliveryDays = (optionId) => {
    axiosSecure
      .get("/checkout/estimated-shipping-days", {
        params: { shipping_option_id: optionId },
      })
      .then((response) => {
        setEstimatedDeliveryDays(response.data.estimated_delivery_date);
      })
      .catch((error) => {
        console.error("Error fetching delivery estimate:", error);
        setErrorMessage("Error fetching delivery estimate.");
      });
  };

  // Change shipping
  const handleShippingOptionChange = (optionId) => {
    const option = availableShippingOptions.find((opt) => opt.id === optionId);
    if (option) {
      setSelectedShippingOption(optionId);
      setShippingCost(option.cost);
      setEstimatedDelivery(option.days);
      fetchEstimatedDeliveryDays(optionId);
    }
  };

  // Change payment method
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === "credit-card") {
      setPaymentFee(0);
    } else if (method === "Cash-on-Delivery") {
      setPaymentFee(0);
    }
  };

  // Save a new or updated address
  const saveAddress = () => {
    const country = locationData.countries.find(
      (c) => c.id === Number.parseInt(selectedCountryId, 10)
    );
    const region = country?.regions.find(
      (r) => r.id === Number.parseInt(selectedRegionId, 10)
    );
    const city = region?.cities.find(
      (c) => c.id === Number.parseInt(selectedCityId, 10)
    );
    const area = city?.areas.find(
      (a) => a.id === Number.parseInt(selectedAreaId, 10)
    );

    const newAddress = {
      name,
      phone_number: phoneNumber,
      country_id: selectedCountryId,
      region_id: selectedRegionId,
      city_id: selectedCityId,
      area_id: selectedAreaId,
      postal_code: selectedPostalCode,
      address: detailedAddress,
      is_default: isDefaultAddress,
      type: addressType,
      countryName: country?.name || "",
      regionName: region?.name || "",
      cityName: city?.name || "",
      areaName: area?.name || "",
    };

    axiosSecure
      .post("/checkout/shipping-address", newAddress)
      .then(() => axiosSecure.get("/checkout/shipping-address"))
      .then((response) => {
        if (response.data.shipping_address) {
          setSavedAddresses(response.data.shipping_address);
          // Find the newly added address
          const addedAddress =
            response.data.shipping_address.find(
              (addr) =>
                addr.name === name &&
                addr.address === detailedAddress &&
                addr.country_id == selectedCountryId
            ) ||
            response.data.shipping_address[
              response.data.shipping_address.length - 1
            ];

          setSelectedAddress(addedAddress);
          setShowAddressForm(false);

          // Move to next step if we're on Step 1
          if (currentStep === 1) {
            setCurrentStep(2);
          }
        }
      })
      .catch((error) => {
        console.error("Error saving address:", error);
        setErrorMessage("Error saving address. Please try again.");
      });
  };

  // Add a new address form
  const addNewAddress = () => {
    setShowAddressForm(true);
    setSelectedAddress(null);
    setIsDefaultAddress(false);
    setAddressType("home");
    setSelectedCountryId("");
    setSelectedRegionId("");
    setSelectedCityId("");
    setSelectedAreaId("");
    setSelectedPostOffice("");
    setDetailedAddress("");
    setPhoneNumber("");
    setName("");
  };

  // Select an existing address
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setSelectedCountryId(address.country_id);
    setSelectedRegionId(address.region_id);
    setSelectedCityId(address.city_id);
    setSelectedAreaId(address.area_id);
    setSelectedPostOffice(address.post_office || "");
    setDetailedAddress(address.address);
    setPhoneNumber(address.phone);
    setName(address.name);
    setAddressType(address.type || "home");
  };

  // Delete address
  const handleDeleteAddress = async (addressId) => {
    try {
      await axiosSecure.delete(`/checkout/shipping-address/${addressId}`);
      setSavedAddresses((prev) => prev.filter((addr) => addr.id !== addressId));

      if (selectedAddress?.id === addressId) {
        setSelectedAddress(null);
        setShowAddressForm(true);
      }
    } catch (error) {
      console.error("Delete address error:", error);
      setErrorMessage("Failed to delete address. Please try again.");
    }
  };

  // Update address form
  const handleUpdateAddress = (address) => {
    setSelectedCountryId(address.country_id);
    setSelectedRegionId(address.region_id);
    setSelectedCityId(address.city_id);
    setSelectedAreaId(address.area_id);
    setSelectedPostOffice(address.postal_code);
    setDetailedAddress(address.address);
    setPhoneNumber(address.phone_number);
    setName(address.name);
    setAddressType(address.type);
    setIsDefaultAddress(address.is_default);
    setShowAddressForm(true);
  };

  // Step Navigation
  const goToStep = (step) => {
    if (step <= currentStep) {
      setCurrentStep(step);
      setEditingStep(step);
    }
  };

  const continueToNextStep = () => {
    // Step 1 (Delivery) → Step 2 (Shipping)
    if (currentStep === 1) {
      if (!selectedAddress && !showAddressForm) {
        setCurrentStep(2);
        return;
      }
      if (selectedAddress) {
        setCurrentStep(2);
        return;
      }
      if (
        !name ||
        !selectedCountryId ||
        !selectedRegionId ||
        !selectedCityId ||
        !selectedAreaId ||
        !phoneNumber ||
        !detailedAddress
      ) {
        setErrorMessage("Please fill in all required delivery details.");
        return;
      }
      saveAddress();
      setCurrentStep(2);
      return;
    }

    // Step 2 (Shipping) → Step 3 (Review)
    if (currentStep === 2) {
      if (!selectedShippingOption) {
        setErrorMessage("Please select a shipping option.");
        return;
      }
      setErrorMessage("");
    }

    // Step 3 (Review) → Step 4 (Payment)
    if (currentStep === 3) {
      // No special checks here. If you want to check something before Payment, do so.
      setErrorMessage("");
    }

    // Move to next step
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setEditingStep(null);
    }
  };

  // Handle Cash on Delivery
  const handleCODSubmit = () => {
    const orderData = {
      shipping_address_id: selectedAddress.id,
      shipping_option_id: selectedShippingOption,
    };

    axiosSecure
      .post("/checkout/cod", orderData)
      .then((response) => {
        console.log("COD Order Response:", response);
        showAlert(
          `Order placed successfully! Order ID: ${response.data.order_number}`
        );
        setTimeout(() => {
          navigate("/my-orders");
        }, 3000);
      })
      .catch((error) => {
        console.error("Error placing order for COD:", error);
        setErrorMessage("Error placing order. Please try again.");
      });
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Checkout Title and Progress Bar */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Checkout</h2>

          {/* Progress Bar */}
          <div className="relative">
            <div className="flex mb-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex-1 text-center ${
                    index + 1 <= currentStep
                      ? "text-primary font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {index + 1}. {step}
                </div>
              ))}
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div
                className="h-2 bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Main Checkout Content */}
        <div className="space-y-8">
          {/* 1. Delivery Details Section */}
          {loadingAddresses ? (
            <div className="text-center py-8">
              <svg
                className="animate-spin h-8 w-8 text-primary mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="mt-2 text-gray-500">Loading delivery details...</p>
            </div>
          ) : (
            <div
              className={`border rounded-lg overflow-hidden ${
                currentStep === 1 || editingStep === 1
                  ? "border-primary"
                  : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
                <h3 className="text-lg font-medium">1. Delivery Details</h3>
                {currentStep > 1 && editingStep !== 1 && (
                  <button
                    onClick={() => goToStep(1)}
                    className="text-primary text-sm font-medium hover:underline flex items-center"
                  >
                    Edit
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      ></path>
                    </svg>
                  </button>
                )}
              </div>

              {currentStep === 1 || editingStep === 1 ? (
                <div className="p-6 space-y-6">
                  {showAddressForm ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="your_name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Your Name*
                          </label>
                          <input
                            type="text"
                            id="your_name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary focus:ring-primary"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Phone Number*
                          </label>
                          <input
                            type="text"
                            id="phone"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary focus:ring-primary"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Country*
                          </label>
                          <select
                            id="country"
                            value={selectedCountryId}
                            onChange={(e) =>
                              setSelectedCountryId(e.target.value)
                            }
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary focus:ring-primary"
                            required
                          >
                            <option value="">Select country</option>
                            {locationData.countries.map((country) => (
                              <option key={country.id} value={country.id}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="region"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Region*
                          </label>
                          <select
                            id="region"
                            value={selectedRegionId}
                            onChange={(e) =>
                              setSelectedRegionId(e.target.value)
                            }
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary focus:ring-primary"
                            required
                            disabled={!selectedCountryId}
                          >
                            <option value="">Select region</option>
                            {locationData.regions.map((region) => (
                              <option key={region.id} value={region.id}>
                                {region.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            City*
                          </label>
                          <select
                            id="city"
                            value={selectedCityId}
                            onChange={(e) => setSelectedCityId(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary focus:ring-primary"
                            required
                            disabled={!selectedRegionId}
                          >
                            <option value="">Select city</option>
                            {locationData.cities.map((city) => (
                              <option key={city.id} value={city.id}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="area"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Area*
                          </label>
                          <select
                            id="area"
                            value={selectedAreaId}
                            onChange={(e) => setSelectedAreaId(e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary focus:ring-primary"
                            required
                            disabled={!selectedCityId}
                          >
                            <option value="">Select area</option>
                            {locationData.areas.map((area) => (
                              <option key={area.id} value={area.id}>
                                {area.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="post-office"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Post Code
                          </label>
                          <input
                            type="text"
                            id="post-office"
                            value={selectedPostalCode}
                            onChange={(e) =>
                              setSelectedPostOffice(e.target.value)
                            }
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Address*
                        </label>
                        <textarea
                          id="address"
                          value={detailedAddress}
                          onChange={(e) => setDetailedAddress(e.target.value)}
                          rows={3}
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary focus:ring-primary"
                          required
                        ></textarea>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="default-address"
                          type="checkbox"
                          checked={isDefaultAddress}
                          onChange={(e) =>
                            setIsDefaultAddress(e.target.checked)
                          }
                          className="h-4 w-4 border-gray-300 rounded text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor="default-address"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Set as default address
                        </label>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={saveAddress}
                          disabled={
                            !name ||
                            !selectedCountryId ||
                            !selectedRegionId ||
                            !selectedCityId ||
                            !selectedAreaId ||
                            !phoneNumber ||
                            !detailedAddress
                          }
                          className="bg-primary text-white py-2.5 px-5 rounded-lg text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Save Address & Continue
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedAddresses.map((address) => {
                        const country = locationData.countries.find(
                          (c) => c.id === Number(address.country_id)
                        );
                        const region = country?.regions.find(
                          (r) => r.id === Number(address.region_id)
                        );
                        const city = region?.cities.find(
                          (c) => c.id === Number(address.city_id)
                        );
                        const area = city?.areas?.find(
                          (a) => a.id === Number(address.area_id)
                        );

                        return (
                          <div
                            key={address.id}
                            className={`border rounded-lg p-4 cursor-pointer ${
                              selectedAddress?.id === address.id
                                ? "border-primary bg-primary/5"
                                : "border-gray-200"
                            }`}
                            onClick={() => handleSelectAddress(address)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center">
                                  <p className="font-medium">{address.name}</p>
                                  {address.is_default && (
                                    <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                      Default
                                    </span>
                                  )}
                                </div>

                                <p className="text-sm text-gray-600">
                                  {address.phone}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {address.address}, {area?.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {city?.name}, {region?.name}, {country?.name}
                                </p>
                                {address.post_office && (
                                  <p className="text-sm text-gray-600">
                                    Post Office: {address.post_office}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                {selectedAddress?.id === address.id && (
                                  <div className="bg-primary text-white p-1 rounded-full">
                                    <svg
                                      className="h-4 w-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                )}
                                {!address.is_default && (
                                  <button
                                    onClick={() =>
                                      setAddressAsDefault(address.id)
                                    }
                                    className="text-xs text-primary hover:underline"
                                  >
                                    Set as default
                                  </button>
                                )}
                                <button
                                  onClick={() => handleUpdateAddress(address)}
                                  className="text-xs text-primary hover:underline"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteAddress(address.id)
                                  }
                                  className="text-xs text-primary hover:underline"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="flex justify-between">
                        <button
                          onClick={addNewAddress}
                          className="text-primary text-sm font-medium hover:underline flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Add New Address
                        </button>

                        <button
                          onClick={continueToNextStep}
                          disabled={!selectedAddress}
                          className="bg-primary text-white py-2.5 px-5 rounded-lg text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Continue to Shipping
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                selectedAddress && (
                  <div className="p-6">
                    <div className="text-sm text-gray-600">
                      {(() => {
                        const country = locationData.countries.find(
                          (c) => c.id === Number(selectedAddress.country_id)
                        );
                        const region = country?.regions.find(
                          (r) => r.id === Number(selectedAddress.region_id)
                        );
                        const city = region?.cities.find(
                          (c) => c.id === Number(selectedAddress.city_id)
                        );
                        const area = city?.areas?.find(
                          (a) => a.id === Number(selectedAddress.area_id)
                        );

                        return (
                          <>
                            <div className="flex items-center">
                              <p className="font-medium text-gray-900">
                                {selectedAddress.name}
                              </p>
                              {selectedAddress.is_default && (
                                <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p>
                              {selectedAddress.address}, {area?.name}
                            </p>
                            <p>
                              {city?.name}, {region?.name}, {country?.name}
                            </p>
                            <p>{selectedAddress.phone}</p>
                            {selectedAddress.post_office && (
                              <p>Post Office: {selectedAddress.post_office}</p>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* 2. Shipping Options Section */}
          <div
            className={`border rounded-lg overflow-hidden ${
              currentStep === 2 || editingStep === 2
                ? "border-primary"
                : "border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
              <h3 className="text-lg font-medium">2. Shipping Options</h3>
              {currentStep > 2 && editingStep !== 2 && (
                <button
                  onClick={() => goToStep(2)}
                  className="text-primary text-sm font-medium hover:underline flex items-center"
                >
                  Edit
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    ></path>
                  </svg>
                </button>
              )}
            </div>

            {currentStep === 2 || editingStep === 2 ? (
              <div className="p-6 space-y-6">
                <h4 className="font-medium">Choose your shipping method:</h4>

                {loadingShippingOptions ? (
                  <div className="text-center py-8">
                    <svg
                      className="animate-spin h-8 w-8 text-primary mx-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p className="mt-2 text-gray-500">
                      Loading shipping options...
                    </p>
                  </div>
                ) : availableShippingOptions.length > 0 ? (
                  <div className="space-y-4">
                    {availableShippingOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedShippingOption === option.id
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-gray-200 hover:border-primary/40"
                        }`}
                        onClick={() => handleShippingOptionChange(option.id)}
                      >
                        <div className="flex items-start">
                          <div className="flex h-5 items-center mt-0.5">
                            <input
                              id={option.id}
                              type="radio"
                              name="shipping-option"
                              className="h-4 w-4 border-gray-300 bg-white text-primary focus:ring-2"
                              checked={selectedShippingOption === option.id}
                              onChange={() =>
                                handleShippingOptionChange(option.id)
                              }
                            />
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <label
                                  htmlFor={option.id}
                                  className="font-medium text-gray-900"
                                >
                                  {option.name}
                                </label>
                                <p className="text-sm text-gray-500 mt-1">
                                  Estimated Delivery: {option.days} business
                                  days
                                </p>
                              </div>
                              <span className="text-lg font-semibold">
                                ${option.cost}
                              </span>
                            </div>

                            {selectedShippingOption === option.id && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                {estimatedDeliveryDays ? (
                                  <div className="flex items-center text-sm text-primary">
                                    <svg
                                      className="w-5 h-5 mr-2"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                    Expected by {estimatedDeliveryDays}
                                  </div>
                                ) : (
                                  <div className="flex items-center text-sm text-gray-500">
                                    <svg
                                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      />
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      />
                                    </svg>
                                    Calculating delivery date...
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={continueToNextStep}
                        disabled={!selectedShippingOption}
                        className="bg-primary text-white py-2.5 px-5 rounded-lg text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Continue to Review
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No shipping options available
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Please try a different address or contact support
                    </p>
                  </div>
                )}
              </div>
            ) : (
              selectedShippingOption && (
                <div className="p-6">
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>
                        {
                          availableShippingOptions.find(
                            (opt) => opt.id === selectedShippingOption
                          )?.name
                        }
                      </span>
                      <span className="font-semibold">
                        $
                        {
                          availableShippingOptions.find(
                            (opt) => opt.id === selectedShippingOption
                          )?.cost
                        }
                      </span>
                    </div>
                    {estimatedDeliveryDays && (
                      <div className="mt-2 flex items-center text-primary">
                        <svg
                          className="w-5 h-5 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Expected by {estimatedDeliveryDays}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          {/* 3. Review Order Section */}
          <div
            className={`border rounded-lg overflow-hidden ${
              currentStep === 3 || editingStep === 3
                ? "border-primary"
                : "border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
              <h3 className="text-lg font-medium">3. Review</h3>
              {currentStep > 3 && editingStep !== 3 && (
                <button
                  onClick={() => goToStep(3)}
                  className="text-primary text-sm font-medium hover:underline flex items-center"
                >
                  Edit
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    ></path>
                  </svg>
                </button>
              )}
            </div>

            {(currentStep === 3 || editingStep === 3) && (
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Order Summary:</h4>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>${subtotal}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span>${shippingCost}</span>
                    </div>

                    <div className="flex justify-between pt-2 border-t font-medium">
                      <span>Total:</span>
                      <span>${total}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Shipping To:</h4>
                    {selectedAddress && (
                      <div className="text-sm text-gray-600">
                        {(() => {
                          const country = locationData.countries.find(
                            (c) => c.id === Number(selectedAddress.country_id)
                          );
                          const region = country?.regions.find(
                            (r) => r.id === Number(selectedAddress.region_id)
                          );
                          const city = region?.cities.find(
                            (c) => c.id === Number(selectedAddress.city_id)
                          );
                          const area = city?.areas?.find(
                            (a) => a.id === Number(selectedAddress.area_id)
                          );

                          return (
                            <>
                              <p>{selectedAddress.name}</p>
                              <p>
                                {selectedAddress.address}, {area?.name}
                              </p>
                              <p>
                                {city?.name}, {region?.name}, {country?.name}
                              </p>
                              <p>{selectedAddress.phone}</p>
                              {selectedAddress.post_office && (
                                <p>
                                  Post Office: {selectedAddress.post_office}
                                </p>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Estimated Delivery:</h4>
                    <p className="text-sm text-gray-600">{estimatedDelivery}</p>
                    {estimatedDeliveryDays && (
                      <p className="text-sm text-primary">
                        Expected delivery by: {estimatedDeliveryDays}
                      </p>
                    )}
                  </div>

                  {/* No "Place Order" or "Terms" here anymore; it’s moved to Payment */}
                  <div className="flex justify-end">
                    <button
                      onClick={continueToNextStep}
                      className="bg-primary text-white py-2.5 px-5 rounded-lg text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Payment Section */}
          <div
            className={`border rounded-lg overflow-hidden ${
              currentStep === 4 || editingStep === 4
                ? "border-primary"
                : "border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b">
              <h3 className="text-lg font-medium">4. Payment</h3>
              {currentStep > 4 && editingStep !== 4 && (
                <button
                  onClick={() => goToStep(4)}
                  className="text-primary text-sm font-medium hover:underline flex items-center"
                >
                  Edit
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    ></path>
                  </svg>
                </button>
              )}
            </div>

            {(currentStep === 4 || editingStep === 4) && (
              <div className="p-6 space-y-6">
                <h4 className="font-medium">Choose your payment method:</h4>
                <div className="space-y-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer ${
                      paymentMethod === "credit-card"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200"
                    }`}
                    onClick={() => handlePaymentMethodChange("credit-card")}
                  >
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="credit-card"
                          type="radio"
                          name="payment-method"
                          className="h-4 w-4 border-gray-300 bg-white text-primary focus:ring-2"
                          checked={paymentMethod === "credit-card"}
                          onChange={() =>
                            handlePaymentMethodChange("credit-card")
                          }
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="credit-card"
                          className="font-medium text-gray-900"
                        >
                          Credit Card
                        </label>
                        <p className="text-gray-500">
                          Secure payment via Stripe
                        </p>
                      </div>
                    </div>

                    {paymentMethod === "credit-card" && (
                      <div className="mt-4 border-t pt-4">
                        <Elements stripe={stripePromise}>
                          <CheckoutForm
                            shipping_address={selectedAddress.id}
                            shipping_option={selectedShippingOption}
                            total={total}
                            onSuccess={() => setPaymentComplete(true)}
                          />
                        </Elements>
                      </div>
                    )}
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer ${
                      paymentMethod === "Cash-on-Delivery"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200"
                    }`}
                    onClick={() =>
                      handlePaymentMethodChange("Cash-on-Delivery")
                    }
                  >
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="Cash-on-Delivery"
                          type="radio"
                          name="payment-method"
                          className="h-4 w-4 border-gray-300 bg-white text-primary focus:ring-2"
                          checked={paymentMethod === "Cash-on-Delivery"}
                          onChange={() =>
                            handlePaymentMethodChange("Cash-on-Delivery")
                          }
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="Cash-on-Delivery"
                          className="font-medium text-gray-900"
                        >
                          Cash on Delivery
                        </label>
                        <p className="text-gray-500">
                          Pay cash or card upon delivery
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Display "Place Order" button only for Cash on Delivery */}
                {paymentMethod === "Cash-on-Delivery" && (
                  <div className="pt-4 space-y-4">
                    <button
                      onClick={handleCODSubmit}
                      disabled={!selectedAddress || !selectedShippingOption}
                      className="w-full bg-primary text-white py-3 px-5 rounded-lg text-base font-medium hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Place Order
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
