import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Loader, ZoomIn } from "lucide-react";
import axiosSecure from "../../../Hooks/AsiosSecure";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const convertToMeters = (value, unit) => {
  switch (unit) {
    case "cm":
      return value / 100; // Convert cm to meters
    case "m":
      return value; // Already in meters
    case "mm":
    default:
      return value / 1000; // Convert mm to meters
  }
};

// Update toDisplayUnit to convert to mm
const toDisplayUnit = (value, unit) => {
  switch (unit) {
    case "cm":
      return value * 10; // Convert meters to mm
    case "m":
      return value * 1000; // Convert meters to mm
    case "mm":
    default:
      return value; // Already in mm
  }
};

export default function WindowConfigurator() {
  const [isLoading, setIsLoading] = useState(false);
  const { company_slug } = useParams();
  const [dimensions, setDimensions] = useState({});
  const [selectedMaterial, setSelectedMaterial] = useState(""); // Store material name
  const [selectedProfile, setSelectedProfile] = useState(""); // Store profile name
  const [selectedColor, setSelectedColor] = useState(""); // Store color name
  const [selectedType, setSelectedType] = useState(""); // Store window type name
  const [selectedFanlight, setSelectedFanlight] = useState(""); // Store fanlight name
  const [selectedOpening, setSelectedOpening] = useState(""); // Store opening name
  const [selectedGlazing, setSelectedGlazing] = useState(""); // Store glazing name
  const [selectedGlassStructure, setSelectedGlassStructure] = useState(""); // Store glass structure name
  const [selectedHandle, setSelectedHandle] = useState(""); // Store handle name
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("mm");
  const [configData, setConfigData] = useState(null);
  const swiperRef = useRef(null);
  const navigate = useNavigate();
  // Create refs for each section
  const sizeRef = useRef(null);
  const materialRef = useRef(null);
  const profileRef = useRef(null);
  const colorRef = useRef(null);
  const typeRef = useRef(null);
  const fanlightRef = useRef(null);
  const openingRef = useRef(null);
  const glazingRef = useRef(null);
  const glassStructureRef = useRef(null);
  const handleRef = useRef(null);

  useEffect(() => {
    const fetchConfiguratorData = async () => {
      try {
        const response = await axiosSecure.get(
          `/manufacturer/${company_slug}/configurator-products`
        );
        if (response.data.status === "success") {
          const productData = response.data.configurator_products[0];
          setConfigData(productData);

          // Set default selections
          setSelectedMaterial(productData.materials[0]?.id || null);
          setSelectedProfile(productData.profiles[0]?.id || null);
          setSelectedColor(productData.colors[0]?.id || null);
          setSelectedType(productData.window_types[0]?.id || null);
          setSelectedFanlight(productData.fanlights[0]?.id || null);
          setSelectedOpening(productData.opening_systems[0]?.id || null);
          setSelectedGlazing(productData.glass_types[0]?.id || null);
          setSelectedGlassStructure(
            productData.glass_structures[0]?.id || null
          );
          setSelectedHandle(productData.handles[0]?.id || null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load configuration data");
      }
    };

    fetchConfiguratorData();
  }, []);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;
      swiper.params.navigation.prevEl = ".custom-swiper-button-prev";
      swiper.params.navigation.nextEl = ".custom-swiper-button-next";
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, []);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const calculatePrice = () => {
    try {
      if (!validateDimensions(dimensions)) {
        setError("Please set the dimensions first");
        return;
      }
      setError("");

      // Convert dimensions to meters for calculations
      const widthM = convertToMeters(dimensions.width, selectedUnit);
      const heightM = convertToMeters(dimensions.height, selectedUnit);

      // Frame Cost
      const materialObj = configData.materials.find(
        (m) => m.id === selectedMaterial
      );
      const framePricePerM = materialObj ? parseFloat(materialObj.price) : 0;
      const framePerimeter = (widthM + heightM) * 2;
      const frameCost = framePerimeter * framePricePerM;

      // Sash Cost Calculation based on window type
      const typeObj = configData.window_types.find(
        (t) => t.id === selectedType
      );
      const sashPricePerM = framePricePerM; // Assuming sash price is the same as frame price
      let sashCost = 0;

      // Determine sash cost based on window type
      if (typeObj) {
        const typeName = typeObj.type.toLowerCase(); // Assuming type has a 'type' property
        if (typeName.includes("single")) {
          sashCost = (widthM + heightM) * 2 * sashPricePerM;
        } else if (typeName.includes("double")) {
          sashCost = (widthM * 2 + heightM * 4) * sashPricePerM;
        } else if (typeName.includes("triple")) {
          sashCost = (widthM * 2 + heightM * 6) * sashPricePerM;
        } else {
          // Default case or other types
          sashCost = (widthM + heightM) * 2 * sashPricePerM; // Fallback to single sash cost
        }
      }

      // Combined Frame & Sash with Profile
      const profileObj = configData.profiles.find(
        (p) => p.id === selectedProfile
      );
      const profileMultiplier = profileObj
        ? parseFloat(profileObj.profile_multiplier)
        : 1.0;
      const combinedFrameSashCost = (frameCost + sashCost) * profileMultiplier;

      // Apply Color Multiplier
      const colorObj = configData.colors.find((c) => c.id === selectedColor);
      const colorMultiplier = colorObj
        ? parseFloat(colorObj.color_multiplier)
        : 1.0;
      const adjustedCost = combinedFrameSashCost * colorMultiplier;

      // Apply Window Type Factor
      const typeFactor = typeObj
        ? parseFloat(typeObj.window_type_multiplier)
        : 1.0;
      const finalCost = adjustedCost * typeFactor;

      // Glass Cost
      const glazingObj = configData.glass_types.find(
        (g) => g.id === selectedGlazing
      );
      const baseGlassPricePerSqM = glazingObj
        ? parseFloat(glazingObj.price)
        : 0;
      const glazingMultiplier = glazingObj
        ? parseFloat(glazingObj.glazing_multiplier)
        : 1.0;

      const glassObj = configData.glass_structures.find(
        (g) => g.id === selectedGlassStructure
      );
      const glassStructurePrice = glassObj ? parseFloat(glassObj.price) : 0;
      const glassTypeMultiplier = glassObj
        ? parseFloat(glassObj.structure_multiplier)
        : 1.0;

      const areaSqM = widthM * heightM;
      const glassCost =
        areaSqM *
          baseGlassPricePerSqM *
          glazingMultiplier *
          glassTypeMultiplier +
        glassStructurePrice;

      // Fanlight Cost
      const fanlightObj = configData.fanlights.find(
        (f) => f.id === selectedFanlight
      );
      const fanlightCost = fanlightObj ? parseFloat(fanlightObj.price) : 0;

      // Opening System Cost
      const openingObj = configData.opening_systems.find(
        (o) => o.id === selectedOpening
      );
      const openingCost = openingObj ? parseFloat(openingObj.price) : 0;

      // Handle & Lock Cost
      const handleObj = configData.handles.find((h) => h.id === selectedHandle);
      const handleCost = handleObj ? parseFloat(handleObj.price) : 0;

      // Calculate Total
      const total =
        finalCost + glassCost + fanlightCost + openingCost + handleCost;

      setTotalPrice(Number(total.toFixed(2)));
    } catch (e) {
      console.error("Price calculation error:", e);
      setError("Error calculating price");
      setTotalPrice(0);
    }
  };

  const validateDimensions = (dim) => {
    if (!configData) return false;

    const dimensionLimits = configData.dimensions[0];
    const minHeightMM = parseFloat(dimensionLimits.min_height); // mm
    const minWidthMM = parseFloat(dimensionLimits.min_width); // mm
    const maxHeightMM = parseFloat(dimensionLimits.max_height); // mm
    const maxWidthMM = parseFloat(dimensionLimits.max_width); // mm

    // Convert user inputs to mm for validation
    const heightInMM = toDisplayUnit(dim.height, selectedUnit); // Convert input height to mm
    const widthInMM = toDisplayUnit(dim.width, selectedUnit); // Convert input width to mm

    return (
      heightInMM >= minHeightMM &&
      heightInMM <= maxHeightMM &&
      widthInMM >= minWidthMM &&
      widthInMM <= maxWidthMM
    );
  };

  useEffect(() => {
    if (configData) {
      calculatePrice(); // Calculate price whenever selections change
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dimensions,
    selectedMaterial,
    selectedProfile,
    selectedColor,
    selectedType,
    selectedFanlight,
    selectedOpening,
    selectedGlazing,
    selectedGlassStructure,
    selectedHandle,
  ]);

  const handleSave = () => {
    setSavedNotes(notes);
  };

  const toggleSelection = (setter, value) => {
    setter((prev) => {
      const newValue = prev === value ? null : value;
      calculatePrice(); // Ensure price is recalculated
      return newValue;
    });
  };

  const getSelectedOptionName = (options, selectedId) => {
    const selectedOption = options.find((option) => option.id === selectedId);
    return selectedOption
      ? selectedOption.name ||
          selectedOption.type ||
          selectedOption.profile_name ||
          selectedOption.color_name ||
          selectedOption.availability ||
          "Not selected"
      : "Not selected";
  };

  const handleAddToCart = async () => {
    if (isLoading) return;

    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      toast.warning("Please login to add items to cart");
      navigate("/register");
      return;
    }

    setIsLoading(true);

    // Validate dimensions
    if (!validateDimensions(dimensions)) {
      toast.warning("Please set valid dimensions first");
      setIsLoading(false);
      return;
    }

    // Validate all required selections
    if (!selectedMaterial) {
      toast.warning("Please select a material");
      setIsLoading(false);
      return;
    }
    if (!selectedProfile) {
      toast.warning("Please select a profile");
      setIsLoading(false);
      return;
    }
    if (!selectedColor) {
      toast.warning("Please select a color");
      setIsLoading(false);
      return;
    }
    if (!selectedType) {
      toast.warning("Please select a window type");
      setIsLoading(false);
      return;
    }
    if (!selectedFanlight) {
      toast.warning("Please select a fanlight option");
      setIsLoading(false);
      return;
    }
    if (!selectedOpening) {
      toast.warning("Please select an opening system");
      setIsLoading(false);
      return;
    }
    if (!selectedGlazing) {
      toast.warning("Please select a glazing option");
      setIsLoading(false);
      return;
    }
    if (!selectedGlassStructure) {
      toast.warning("Please select a glass structure");
      setIsLoading(false);
      return;
    }
    if (!selectedHandle) {
      toast.warning("Please select a handle");
      setIsLoading(false);
      return;
    }

    // Prepare the payload
    const payload = {
      product_type: "custom", // or 'pre-made', depending on your logic
      quantity: 1,
      configurator_product_id: configData.id, // Use the configurator product ID
      options: JSON.stringify({
        dimensions: {
          height: dimensions.height,
          width: dimensions.width,
          unit: selectedUnit,
        },
        material: selectedMaterial,
        profile: selectedProfile,
        color: selectedColor,
        type: selectedType,
        fanlight: selectedFanlight,
        opening: selectedOpening,
        glazing: selectedGlazing,
        glass_structure: selectedGlassStructure,
        handle: selectedHandle,
      }),
      price: totalPrice, // Optional, include if needed
    };

    try {
      const response = await axiosSecure.post(`/cart`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "success") {
        toast.success("Custom window added to cart successfully!");
        // Reset selections if necessary
        setSelectedMaterial(null);
        setSelectedProfile(null);
        setSelectedColor(null);
        setSelectedType(null);
        setSelectedFanlight(null);
        setSelectedOpening(null);
        setSelectedGlazing(null);
        setSelectedGlassStructure(null);
        setSelectedHandle(null);
        setDimensions({ height: "", width: "" }); // Reset dimensions
      }
    } catch (error) {
      console.error("Cart addition error:", error);
      toast.error(error.response?.data?.error || "Failed to add item to cart");
    } finally {
      setIsLoading(false);
    }
  };

  if (!configData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    ); // Show loading state while fetching data
  }

  const dimensionLimits = configData.dimensions[0];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Window Configurator</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Fixed Column */}
        <div className="p-4 block lg:sticky top-4 h-screen overflow-y-auto scrollbar-hide">
          <div className="flex flex-col mb-4">
            <div className="bg-[#F6F6F6] rounded-md shadow-md p-6">
              {/* Image Section */}
              <div className="flex justify-center mb-4">
                <img
                  src="https://i.ibb.co.com/Y762vTcM/image-45-1.png"
                  alt="Window Preview"
                  className="w-auto h-72 object-contain"
                />
              </div>

              {/* Price & Zoom */}
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-800">
                  ${totalPrice}
                </div>
                <button
                  type="button"
                  className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-full focus:outline-none transition-colors"
                >
                  <ZoomIn className="h-6 w-6" />
                </button>
              </div>
              {/* Description */}
              <p className="text-lg text-gray-70 mt-2 text-wrap mb-6">
                Designed with smooth horizontal operation, they provide
                excellent ventilation, easy access, and a sleek, space-saving
                design.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-md">
            <ul className="divide-y divide-gray-200">
              {/* SIZE */}
              <li
                className="flex items-center justify-between px-4 py-3 cursor-pointer"
                onClick={() => scrollToSection(sizeRef)}
              >
                <div>
                  <span className="text-gray-700 font-semibold">Size: </span>
                  <span className="text-gray-700">
                    {dimensions.height && dimensions.width
                      ? `${dimensions.height.toFixed(
                          2
                        )} ${selectedUnit} x ${dimensions.width.toFixed(
                          2
                        )} ${selectedUnit}`
                      : "Not specified"}
                  </span>
                </div>
                <div className="text-gray-400">{">"}</div>
              </li>

              {/* MATERIAL */}
              <li
                className="flex items-center justify-between px-4 py-3 cursor-pointer"
                onClick={() => scrollToSection(materialRef)}
              >
                <div>
                  <span className="text-gray-700 font-semibold">
                    Material:{" "}
                  </span>
                  <span className="text-gray-700">
                    {getSelectedOptionName(
                      configData.materials,
                      selectedMaterial
                    )}
                  </span>
                </div>
                <div className="text-gray-400">{">"}</div>
              </li>

              {/* PROFILE */}
              <li
                className="flex items-center justify-between px-4 py-3 cursor-pointer"
                onClick={() => scrollToSection(profileRef)}
              >
                <div>
                  <span className="text-gray-700 font-semibold">Profile: </span>
                  <span className="text-gray-700">
                    {getSelectedOptionName(
                      configData.profiles,
                      selectedProfile
                    )}
                  </span>
                </div>
                <div className="text-gray-400">{">"}</div>
              </li>

              {/* COLOUR AND DECOR */}
              <li
                className="flex items-center justify-between px-4 py-3 cursor-pointer"
                onClick={() => scrollToSection(colorRef)}
              >
                <div>
                  <span className="text-gray-700 font-semibold">
                    Colour and Decor:{" "}
                  </span>
                  <span className="text-gray-700">
                    {getSelectedOptionName(configData.colors, selectedColor)}
                  </span>
                </div>
                <div className="text-gray-400">{">"}</div>
              </li>

              {/* TYPE OF WINDOW */}
              <li
                className="flex items-center justify-between px-4 py-3 cursor-pointer"
                onClick={() => scrollToSection(typeRef)}
              >
                <div>
                  <span className="text-gray-700 font-semibold">
                    Type of Window:{" "}
                  </span>
                  <span className="text-gray-700">
                    {getSelectedOptionName(
                      configData.window_types,
                      selectedType
                    )}
                  </span>
                </div>
                <div className="text-gray-400">{">"}</div>
              </li>

              {/* UPPER / LOWER FANLIGHT */}
              <li
                className="flex items-center justify-between px-4 py-3 cursor-pointer"
                onClick={() => scrollToSection(fanlightRef)}
              >
                <div>
                  <span className="text-gray-700 font-semibold">
                    Upper / Lower Fanlight:{" "}
                  </span>
                  <span className="text-gray-700">
                    {getSelectedOptionName(
                      configData.fanlights,
                      selectedFanlight
                    )}
                  </span>
                </div>
                <div className="text-gray-400">{">"}</div>
              </li>

              {/* OPENING SYSTEM */}
              <li
                className="flex items-center justify-between px-4 py-3 cursor-pointer"
                onClick={() => scrollToSection(openingRef)}
              >
                <div>
                  <span className="text-gray-700 font-semibold">
                    Opening System:{" "}
                  </span>
                  <span className="text-gray-700">
                    {getSelectedOptionName(
                      configData.opening_systems,
                      selectedOpening
                    )}
                  </span>
                </div>
                <div className="text-gray-400">{">"}</div>
              </li>

              {/* GLAZING */}
              <li
                className="flex items-center justify-between px-4 py-3 cursor-pointer"
                onClick={() => scrollToSection(glazingRef)}
              >
                <div>
                  <span className="text-gray-700 font-semibold">Glazing: </span>
                  <span className="text-gray-700">
                    {getSelectedOptionName(
                      configData.glass_types,
                      selectedGlazing
                    )}
                  </span>
                </div>
                <div className="text-gray-400">{">"}</div>
              </li>

              {/* GLASS STRUCTURE */}
              <li
                className="flex items-center justify-between px-4 py-3 cursor-pointer"
                onClick={() => scrollToSection(glassStructureRef)}
              >
                <div>
                  <span className="text-gray-700 font-semibold">
                    Glass Structure:{" "}
                  </span>
                  <span className="text-gray-700">
                    {getSelectedOptionName(
                      configData.glass_structures,
                      selectedGlassStructure
                    )}
                  </span>
                </div>
                <div className="text-gray-400">{">"}</div>
              </li>

              {/* HANDLE */}
              <li
                className="flex items-center justify-between px-4 py-3 cursor-pointer"
                onClick={() => scrollToSection(handleRef)}
              >
                <div>
                  <span className="text-gray-700 font-semibold">Handle: </span>
                  <span className="text-gray-700">
                    {getSelectedOptionName(configData.handles, selectedHandle)}
                  </span>
                </div>
                <div className="text-gray-400">{">"}</div>
              </li>
            </ul>
          </div>

          <div className="p-6 border rounded-lg mt-4">
            {/* Title */}
            <h2 className="text-2xl font-bold mb-2">Customer Notes</h2>

            {/* Subtitle */}
            <p className="text-gray-600 mb-3">
              Here you will find space for Personal Notes
            </p>

            {/* Textarea Input */}
            {!savedNotes ? (
              <textarea
                className="w-full h-32 p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            ) : (
              <p className="w-full h-auto p-3 border border-gray-400 rounded-md">
                {savedNotes}
              </p>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-gray-500 mt-2">
              * The contractual conditions of Frame and Sash remain unaffected
              by your note.
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button className="px-4 py-2 border border-gray-500 rounded-md text-gray-700 hover:bg-gray-200">
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-gray-800 text-white rounded-md hover:bg-black"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Column */}
        <div className="space-y-8 col-span-2 overflow-y-auto h-screen scrollbar-hide">
          {/* Size */}
          <section ref={sizeRef} className="w-full">
            <h2 className="text-xl font-semibold mb-4 bg-teal-500 text-white p-2">
              Size
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {/* Total Height Input */}
              <div>
                <label className="block text-lg mb-1">Total Height</label>
                <input
                  type="number"
                  step="0.01" // Allow decimal values for meters
                  value={dimensions.height}
                  onChange={(e) => {
                    const newHeight = Number.parseFloat(e.target.value);
                    setDimensions({ ...dimensions, height: newHeight });
                    if (
                      !validateDimensions({ ...dimensions, height: newHeight })
                    ) {
                      setError("Height must be within the valid range.");
                    } else {
                      setError(""); // Clear error if valid
                    }
                  }}
                  className="w-full border rounded-t p-2"
                  placeholder="Enter height"
                />
                <div className="flex flex-col items-center justify-center px-1 text-center bg-gray-300 rounded-b-md">
                  <p className="text-base text-black font-semibold mt-1">
                    Permissible Height :
                    {selectedUnit === "m"
                      ? `${(dimensionLimits.min_height / 1000).toFixed(2)} m`
                      : selectedUnit === "mm"
                      ? `${dimensionLimits.min_height} mm`
                      : `${(dimensionLimits.min_height / 10).toFixed(2)} cm`}
                    -
                    {selectedUnit === "m"
                      ? `${(dimensionLimits.max_height / 1000).toFixed(2)} m`
                      : selectedUnit === "mm"
                      ? `${dimensionLimits.max_height} mm`
                      : `${(dimensionLimits.max_height / 10).toFixed(2)} cm`}
                  </p>
                  <p className="text-lg text-black font-semibold mt-1"></p>
                </div>
              </div>

              {/* Total Width Input */}
              <div>
                <label className="block text-lg mb-1">Total Width</label>
                <input
                  type="number"
                  step="0.01" // Allow decimal values for meters
                  value={dimensions.width}
                  onChange={(e) => {
                    const newWidth = Number.parseFloat(e.target.value);
                    setDimensions({ ...dimensions, width: newWidth });
                    if (
                      !validateDimensions({ ...dimensions, width: newWidth })
                    ) {
                      setError("Width must be within the valid range.");
                    } else {
                      setError(""); // Clear error if valid
                    }
                  }}
                  className="w-full border rounded-t p-2"
                  placeholder="Enter width"
                />
                <div className="flex items-center justify-center  px-1 text-center bg-gray-300 rounded-b-md">
                  <p className="text-base text-black font-semibold mt-1">
                    Permissible Width :
                    {selectedUnit === "m"
                      ? `${(dimensionLimits.min_width / 1000).toFixed(2)} m`
                      : selectedUnit === "mm"
                      ? `${dimensionLimits.min_width} mm`
                      : `${(dimensionLimits.min_width / 10).toFixed(2)} cm`}
                    -{" "}
                    {selectedUnit === "m"
                      ? `${(dimensionLimits.max_width / 1000).toFixed(2)} m`
                      : selectedUnit === "mm"
                      ? `${dimensionLimits.max_width} mm`
                      : `${(dimensionLimits.max_width / 10).toFixed(2)} cm`}
                  </p>
                </div>
              </div>

              {/* Unit Dropdown */}
              <div>
                <label className="block text-lg mb-1">Unit</label>
                <select
                  value={selectedUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    setSelectedUnit(newUnit);
                    const newHeight = toDisplayUnit(dimensions.height, newUnit);
                    const newWidth = toDisplayUnit(dimensions.width, newUnit);
                    setDimensions({ height: newHeight, width: newWidth });
                  }}
                  className="w-full border rounded p-2"
                >
                  <option value="mm">mm</option>
                  <option value="cm">cm</option>
                  <option value="m">meters</option>
                </select>
              </div>
            </div>
          </section>

          {/* Material */}
          <section ref={materialRef} className="w-full relative">
            <h2 className="text-xl font-semibold mb-4 bg-teal-500 text-white p-2">
              Material
            </h2>
            <div className="relative">
              <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                slidesPerView={4}
                navigation={{
                  nextEl: ".custom-swiper-button-next",
                  prevEl: ".custom-swiper-button-prev",
                }}
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 4 },
                }}
                className="w-full"
              >
                {configData.materials.map((material) => (
                  <SwiperSlide
                    key={material.id}
                    className="flex justify-center"
                  >
                    <div className="w-11/12">
                      <button
                        onClick={() =>
                          toggleSelection(setSelectedMaterial, material.id)
                        }
                        className={`relative border rounded-t-lg w-full h-64 overflow-hidden p-2 transition-all 
                ${
                  selectedMaterial === material.id
                    ? "border-primary border-2 shadow-md bg-gray-50"
                    : "border-gray-200 hover:shadow-sm"
                }`}
                        aria-selected={selectedMaterial === material.id}
                      >
                        {selectedMaterial === material.id && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
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

                        <img
                          src={`${
                            import.meta.env.VITE_REACT_APP_API_BASE_URL
                          }/${material.image}`}
                          alt={material.name}
                          className="w-full h-40 object-contain"
                          loading="lazy"
                        />

                        <div className="text-lg font-semibold text-center p-2">
                          {material.name}
                        </div>
                      </button>
                      <div className="bg-[#555454] text-white w-full text-center p-2 flex justify-between items-center text-lg">
                        <span>Price</span>
                        <div className="font-bold text-lg">
                          ${parseFloat(material.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation buttons */}
              <button
                className="custom-swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
               transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Previous slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <circle
                    cx="17"
                    cy="17"
                    r="17"
                    transform="matrix(-1 0 0 1 34 0)"
                    fill="#F2F2F2"
                  />
                  <path
                    d="M15.3658 22.23L10.4619 17.6531M10.4619 17.6531L15.3658 13.0762M10.4619 17.6531H22.2311"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                className="custom-swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
               transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Next slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <circle cx="17" cy="17" r="17" fill="#F2F2F2" />
                  <path
                    d="M18.6342 11.77L23.5381 16.3469M23.5381 16.3469L18.6342 20.9238M23.5381 16.3469H11.7689"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </section>

          {/* Profile */}
          <section ref={profileRef} className="w-full relative">
            <h2 className="text-xl font-semibold mb-4 bg-teal-500 text-white p-2">
              Profile
            </h2>
            <div className="relative">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                slidesPerView={3}
                navigation={{
                  prevEl: ".custom-swiper-button-prev",
                  nextEl: ".custom-swiper-button-next",
                }}
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  1024: { slidesPerView: 3 },
                }}
                className="w-full"
              >
                {configData.profiles.map((profile) => (
                  <SwiperSlide key={profile.id} className="flex justify-center">
                    <div className="w-11/12">
                      <button
                        onClick={() =>
                          toggleSelection(setSelectedProfile, profile.id)
                        }
                        className={`relative border rounded-t-lg w-full h-96 overflow-hidden p-2 transition-all 
                ${
                  selectedProfile === profile.id
                    ? "border-primary border-2 shadow-md bg-gray-50"
                    : "border-gray-200 hover:shadow-sm"
                }`}
                        aria-selected={selectedProfile === profile.id}
                      >
                        <img
                          src={`${
                            import.meta.env.VITE_REACT_APP_API_BASE_URL
                          }/${profile.profile_image}`}
                          alt={profile.profile_name}
                          className="w-full h-48 object-contain rounded-md"
                          loading="lazy"
                        />
                        <div className="text-lg font-bold text-center p-2">
                          {profile.profile_name}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600 p-2">
                          {profile.profile_features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <svg
                                className="w-4 h-4 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              {feature.features}
                            </div>
                          ))}
                        </div>
                      </button>
                      <div className="bg-[#555454] text-white w-full text-center p-2 flex justify-between items-center text-lg">
                        <span>Price Increment</span>
                        <div className="font-bold text-lg">
                          {Math.round((profile.profile_multiplier - 1) * 100)}%
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation buttons */}
              <button
                className="custom-swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
             transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Previous slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <circle
                    cx="17"
                    cy="17"
                    r="17"
                    transform="matrix(-1 0 0 1 34 0)"
                    fill="#F2F2F2"
                  />
                  <path
                    d="M15.3658 22.23L10.4619 17.6531M10.4619 17.6531L15.3658 13.0762M10.4619 17.6531H22.2311"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                className="custom-swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
             transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Next slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <circle cx="17" cy="17" r="17" fill="#F2F2F2" />
                  <path
                    d="M18.6342 11.77L23.5381 16.3469M23.5381 16.3469L18.6342 20.9238M23.5381 16.3469H11.7689"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </section>

          {/* Color */}
          <section ref={colorRef} className="w-full relative">
            <h2 className="text-xl font-semibold mb-4 bg-teal-500 text-white p-2">
              Color
            </h2>
            <div className="relative">
              <Swiper
                modules={[Navigation]}
                spaceBetween={2}
                slidesPerView={10}
                navigation={{
                  nextEl: ".custom-swiper-button-next",
                  prevEl: ".custom-swiper-button-prev",
                }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 10 },
                }}
                className="w-full"
              >
                {configData.colors.map((color) => (
                  <SwiperSlide
                    key={color.id}
                    className="flex flex-col items-center"
                  >
                    {/* Color Selection Button */}
                    <button
                      onClick={() => setSelectedColor(color.id)}
                      className={`relative w-20 h-20 rounded-t-md border-2 flex items-center justify-center transition-all ${
                        selectedColor === color.id
                          ? "border-primary"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color.color_name }}
                      aria-label={`Select ${color.color_name} color`}
                      aria-selected={selectedColor === color.id}
                    >
                      {/* Checkmark for Selected Color */}
                      {selectedColor === color.id && (
                        <div className="absolute top-1 right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
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
                    </button>

                    {/* Price Box (Aligned with Color Box) */}
                    <div className="bg-gray-700 text-white text-lg w-20 text-center py-1 rounded-b-md">
                      {Math.round((color.color_multiplier - 1) * 100)}%
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation Buttons */}
              <button
                className="custom-swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
               transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Previous slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <circle
                    cx="17"
                    cy="17"
                    r="17"
                    transform="matrix(-1 0 0 1 34 0)"
                    fill="#F2F2F2"
                  />
                  <path
                    d="M15.3658 22.23L10.4619 17.6531M10.4619 17.6531L15.3658 13.0762M10.4619 17.6531H22.2311"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                className="custom-swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
               transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Next slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <circle cx="17" cy="17" r="17" fill="#F2F2F2" />
                  <path
                    d="M18.6342 11.77L23.5381 16.3469M23.5381 16.3469L18.6342 20.9238M23.5381 16.3469H11.7689"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </section>

          {/* Types of Window */}
          <section ref={typeRef} className="w-full relative">
            <h2 className="text-xl font-semibold mb-6 bg-teal-500 text-white p-3 rounded-md">
              Types of Window
            </h2>
            <div className="relative px-6">
              <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                slidesPerView={3}
                navigation={{
                  nextEl: ".custom-swiper-button-next",
                  prevEl: ".custom-swiper-button-prev",
                }}
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="w-full"
              >
                {configData.window_types.map((type) => (
                  <SwiperSlide key={type.id} className="flex justify-center">
                    <div className="w-11/12">
                      <button
                        onClick={() => setSelectedType(type.id)}
                        className={`relative border rounded-t-lg w-full h-56 overflow-hidden p-4 flex flex-col justify-between items-center text-center transition-all 
                ${
                  selectedType === type.id
                    ? "border-primary border-2 bg-gray-100 shadow-md"
                    : "border-gray-300 hover:shadow-md"
                }`}
                        aria-selected={selectedType === type.id}
                      >
                        {selectedType === type.id && (
                          <div className="absolute top-2 right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                        <img
                          src={`${
                            import.meta.env.VITE_REACT_APP_API_BASE_URL
                          }/${type.type_image}`}
                          alt={type.type}
                          className="w-full h-28 object-contain mb-2"
                          loading="lazy"
                        />
                        <div className="text-lg font-semibold">{type.type}</div>
                      </button>
                      <div className="bg-[#555454] text-white w-full text-center p-2 flex justify-between items-center text-lg">
                        <span>Price Increment</span>
                        <div className="font-bold text-lg">
                          {Math.round((type.window_type_multiplier - 1) * 100)}%
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Navigation Buttons */}
              <button
                className="custom-swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
               transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Previous slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <circle
                    cx="17"
                    cy="17"
                    r="17"
                    transform="matrix(-1 0 0 1 34 0)"
                    fill="#F2F2F2"
                  />
                  <path
                    d="M15.3658 22.23L10.4619 17.6531M10.4619 17.6531L15.3658 13.0762M10.4619 17.6531H22.2311"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className="custom-swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
               transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Next slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <circle cx="17" cy="17" r="17" fill="#F2F2F2" />
                  <path
                    d="M18.6342 11.77L23.5381 16.3469M23.5381 16.3469L18.6342 20.9238M23.5381 16.3469H11.7689"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </section>

          {/* Upper / Lower Fanlight */}
          <section ref={fanlightRef} className="w-full relative">
            <div className="flex justify-between items-center bg-teal-500 text-white p-3">
              <h2 className="text-xl font-semibold">Upper / Lower Fanlight</h2>
              <button className="text-lg underline">More Details</button>
            </div>

            <p className="text-gray-700 my-2">Please select your door Types</p>

            <div className="relative px-6">
              <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination]}
                spaceBetween={15}
                slidesPerView={3}
                navigation={{
                  nextEl: ".custom-swiper-button-next",
                  prevEl: ".custom-swiper-button-prev",
                }}
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 1, spaceBetween: 10 },
                  1024: { slidesPerView: 3, spaceBetween: 15 },
                }}
                className="w-full"
              >
                {configData.fanlights.map((option) => (
                  <SwiperSlide key={option.id} className="flex justify-center">
                    <div className="w-11/12">
                      <button
                        onClick={() =>
                          toggleSelection(setSelectedFanlight, option.id)
                        }
                        className={`relative border rounded-t-lg w-full h-56 p-2 transition-all flex flex-col items-center justify-between 
    ${
      selectedFanlight === option.id
        ? "border-teal-500 border-2 bg-gray-50"
        : "border-gray-300"
    }`}
                        aria-selected={selectedFanlight === option.id}
                      >
                        {selectedFanlight === option.id && (
                          <div className="absolute top-2 right-2 bg-teal-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            ✔
                          </div>
                        )}

                        <img
                          src={`${
                            import.meta.env.VITE_REACT_APP_API_BASE_URL
                          }/${option.fanlight_image}`}
                          alt={option.availability}
                          className="w-20 h-28 object-contain"
                          loading="lazy"
                        />
                        <div className="text-lg font-semibold">
                          {option.availability}
                        </div>
                      </button>
                      <div className="bg-[#555454] text-white w-full py-2 text-center font-bold text-lg -mt-[1px]">
                        ${parseFloat(option.price).toFixed(2)}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Navigation Buttons */}
              <button
                className="custom-swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
     transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Previous slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <circle
                    cx="17"
                    cy="17"
                    r="17"
                    transform="matrix(-1 0 0 1 34 0)"
                    fill="#F2F2F2"
                  />
                  <path
                    d="M15.3658 22.23L10.4619 17.6531M10.4619 17.6531L15.3658 13.0762M10.4619 17.6531H22.2311"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className="custom-swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
     transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Next slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <circle cx="17" cy="17" r="17" fill="#F2F2F2" />
                  <path
                    d="M18.6342 11.77L23.5381 16.3469M23.5381 16.3469L18.6342 20.9238M23.5381 16.3469H11.7689"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </section>

          {/* Opening System */}
          <section ref={openingRef} className="w-full relative">
            <div className="flex justify-between items-center bg-teal-500 text-white p-4">
              <h2 className="text-2xl">Opening System</h2>
              <button className="text-lg hover:underline">More Details</button>
            </div>

            <p className="text-[#555454] text-lg my-4 px-4">
              Please select your door Opening System
            </p>

            <div className="relative px-6">
              <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={3}
                navigation={{
                  nextEl: ".custom-swiper-button-next",
                  prevEl: ".custom-swiper-button-prev",
                }}
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="w-full"
              >
                {configData.opening_systems.map((option) => (
                  <SwiperSlide
                    key={option.id}
                    className="flex justify-center py-4"
                  >
                    <div className="w-11/12">
                      <button
                        onClick={() =>
                          toggleSelection(setSelectedOpening, option.id)
                        }
                        className={`relative border rounded-t-lg w-full p-6 text-center flex flex-col justify-between shadow-sm transition-all 
    ${
      selectedOpening === option.id
        ? "border-primary border-2 bg-gray-100 shadow-md"
        : "border-gray-200 hover:shadow-md"
    }`}
                        aria-selected={selectedOpening === option.id}
                      >
                        {selectedOpening === option.id && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}

                        <div className="flex justify-center items-center h-48 mb-4">
                          <img
                            src={`${
                              import.meta.env.VITE_REACT_APP_API_BASE_URL
                            }/${option.opening_image}`}
                            alt={option.name}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>

                        <div className="text-lg font-semibold text-center mt-1">
                          {option.name}
                        </div>
                      </button>
                      <div className="bg-[#555454] text-white text-center py-2 text-lg font-bold w-full mt-auto">
                        ${parseFloat(option.price).toFixed(2)}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Navigation Buttons */}
              <button
                className="custom-swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
     transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Previous slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <circle
                    cx="17"
                    cy="17"
                    r="17"
                    transform="matrix(-1 0 0 1 34 0)"
                    fill="#F2F2F2"
                  />
                  <path
                    d="M15.3658 22.23L10.4619 17.6531M10.4619 17.6531L15.3658 13.0762M10.4619 17.6531H22.2311"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className="custom-swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
     transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Next slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <circle cx="17" cy="17" r="17" fill="#F2F2F2" />
                  <path
                    d="M18.6342 11.77L23.5381 16.3469M23.5381 16.3469L18.6342 20.9238M23.5381 16.3469H11.7689"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </section>

          {/* Glazing */}
          <section ref={glazingRef} className="w-full relative">
            <div className="flex justify-between items-center bg-teal-500 text-white p-4">
              <h2 className="text-2xl">Glazing</h2>
              <button className="text-lg hover:underline">More Details</button>
            </div>
            <p className="text-[#555454] text-lg my-4 px-4">
              Please select your Glazing type
            </p>

            <div className="relative px-6">
              <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={3}
                navigation={{
                  nextEl: ".custom-swiper-button-next",
                  prevEl: ".custom-swiper-button-prev",
                }}
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="w-full"
              >
                {configData.glass_types.map((option) => (
                  <SwiperSlide
                    key={option.id}
                    className="flex justify-center py-4"
                  >
                    <div className="w-11/12">
                      <button
                        onClick={() =>
                          toggleSelection(setSelectedGlazing, option.id)
                        }
                        className={`relative border rounded-t-lg w-full p-6 text-center flex flex-col justify-between transition-all 
    ${
      selectedGlazing === option.id
        ? "border-primary border-2"
        : "border-gray-200 hover:shadow-md"
    }`}
                        aria-selected={selectedGlazing === option.id}
                      >
                        {selectedGlazing === option.id && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
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
                        <div className="flex justify-center items-center h-48 mb-4">
                          <img
                            src={`${
                              import.meta.env.VITE_REACT_APP_API_BASE_URL
                            }/${option.glass_image}`}
                            alt={option.type}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>
                        <h2 className="font-bold py-4">{option.type}</h2>
                      </button>
                      <div className="bg-[#555454] w-full text-center text-white py-2 text-lg font-bold -mt-[1px]">
                        <div className="bg-[#555454] text-white w-full text-center p-2 flex justify-between items-center text-lg">
                          <span>Price Increment</span>
                          <div className="font-bold text-lg">
                            {Math.round((option.glazing_multiplier - 1) * 100)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Navigation Buttons */}
              <button
                className="custom-swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
     transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Previous slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <circle
                    cx="17"
                    cy="17"
                    r="17"
                    transform="matrix(-1 0 0 1 34 0)"
                    fill="#F2F2F2"
                  />
                  <path
                    d="M15.3658 22.23L10.4619 17.6531M10.4619 17.6531L15.3658 13.0762M10.4619 17.6531H22.2311"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className="custom-swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
     transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Next slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <circle cx="17" cy="17" r="17" fill="#F2F2F2" />
                  <path
                    d="M18.6342 11.77L23.5381 16.3469M23.5381 16.3469L18.6342 20.9238M23.5381 16.3469H11.7689"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </section>

          {/* Glass */}
          <section ref={glassStructureRef} className="w-full relative">
            <div className="flex justify-between items-center bg-teal-500 text-white p-4">
              <h2 className="text-2xl">Glass Structure</h2>
              <button className="text-lg hover:underline">More Details</button>
            </div>
            <p className="text-[#555454] text-lg my-4 px-4">
              Please select your Glass Structure type
            </p>

            <div className="relative px-6">
              <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={3}
                navigation={{
                  nextEl: ".custom-swiper-button-next",
                  prevEl: ".custom-swiper-button-prev",
                }}
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="w-full"
              >
                {configData.glass_structures.map((option) => (
                  <SwiperSlide
                    key={option.id}
                    className="flex justify-center py-4"
                  >
                    <div className="w-11/12">
                      <button
                        onClick={() =>
                          toggleSelection(setSelectedGlassStructure, option.id)
                        }
                        className={`relative border rounded-t-lg w-full p-6 text-center flex flex-col justify-between transition-all 
    ${
      selectedGlassStructure === option.id
        ? "border-primary border-2"
        : "border-gray-200 hover:shadow-md"
    }`}
                        aria-selected={selectedGlassStructure === option.id}
                      >
                        {selectedGlassStructure === option.id && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
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
                        <div className="flex justify-center items-center h-48 mb-4">
                          <img
                            src={`${
                              import.meta.env.VITE_REACT_APP_API_BASE_URL
                            }/${option.glass_image}`}
                            alt={option.type}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>
                        <h2 className="font-bold py-4">{option.type}</h2>
                      </button>
                      <div className="bg-[#555454] text-white w-full text-center p-2 flex justify-between items-center text-lg">
                        <span>Price Increment</span>
                        <div className="font-bold text-lg">
                          {Math.round((option.structure_multiplier - 1) * 100)}%
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Navigation Buttons */}
              <button
                className="custom-swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
     transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Previous slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <circle
                    cx="17"
                    cy="17"
                    r="17"
                    transform="matrix(-1 0 0 1 34 0)"
                    fill="#F2F2F2"
                  />
                  <path
                    d="M15.3658 22.23L10.4619 17.6531M10.4619 17.6531L15.3658 13.0762M10.4619 17.6531H22.2311"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className="custom-swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
     transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Next slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <circle cx="17" cy="17" r="17" fill="#F2F2F2" />
                  <path
                    d="M18.6342 11.77L23.5381 16.3469M23.5381 16.3469L18.6342 20.9238M23.5381 16.3469H11.7689"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </section>

          {/* Handle & Locks */}
          <section ref={handleRef} className="w-full relative">
            <div className="flex justify-between items-center bg-teal-500 text-white p-4">
              <h2 className="text-2xl">Handle & Locks</h2>
              <button className="text-lg hover:underline">More Details</button>
            </div>

            <p className="text-[#555454] text-lg my-4 px-4">
              Please select your Handle & Lock
            </p>

            <div className="relative px-6">
              <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                slidesPerView={4}
                navigation={{
                  nextEl: ".custom-swiper-button-next",
                  prevEl: ".custom-swiper-button-prev",
                }}
                pagination={{ clickable: true }}
                breakpoints={{
                  480: { slidesPerView: 1, spaceBetween: 15 },
                  768: { slidesPerView: 2, spaceBetween: 20 },
                  1024: { slidesPerView: 3, spaceBetween: 25 },
                  1280: { slidesPerView: 4, spaceBetween: 25 },
                }}
                className="w-full"
              >
                {configData.handles.map((option) => (
                  <SwiperSlide
                    key={option.id}
                    className="flex justify-center py-4"
                  >
                    <div className="w-11/12">
                      <div
                        onClick={() =>
                          toggleSelection(setSelectedHandle, option.id)
                        }
                        className={`relative border rounded-t-lg w-full h-80 p-6 bg-gray-100 text-center flex flex-col justify-between transition-all cursor-pointer 
    ${
      selectedHandle === option.id
        ? "border-primary border-2 bg-gray-50 shadow-md"
        : "border-gray-200 hover:shadow-lg"
    }`}
                        aria-selected={selectedHandle === option.id}
                      >
                        {selectedHandle === option.id && (
                          <div className="absolute -top-4 left-48 transform -translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
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

                        <div className="flex justify-center items-center h-48 mb-4 border-2 rounded-md p-2 bg-white">
                          <img
                            src={`${
                              import.meta.env.VITE_REACT_APP_API_BASE_URL
                            }/${option.handle_image}`}
                            alt={option.type}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>

                        <div className="text-lg font-semibold mb-3">
                          {option.type}
                        </div>
                      </div>

                      <div className="bg-[#555454] text-white py-2 text-lg font-bold flex justify-between px-4 w-full mt-2">
                        <span>Price</span>
                        <span>${parseFloat(option.price).toFixed(2)}</span>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation Buttons */}
              <button
                className="custom-swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
     transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Previous slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <circle
                    cx="17"
                    cy="17"
                    r="17"
                    transform="matrix(-1 0 0 1 34 0)"
                    fill="#F2F2F2"
                  />
                  <path
                    d="M15.3658 22.23L10.4619 17.6531M10.4619 17.6531L15.3658 13.0762M10.4619 17.6531H22.2311"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                className="custom-swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
     transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
                aria-label="Next slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                >
                  <circle cx="17" cy="17" r="17" fill="#F2F2F2" />
                  <path
                    d="M18.6342 11.77L23.5381 16.3469M23.5381 16.3469L18.6342 20.9238M23.5381 16.3469H11.7689"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </section>

          <div className="flex justify-center mt-8">
            <button
              onClick={handleAddToCart}
              className="px-4 bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 transition-colors"
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
