import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Loader, ZoomIn, X } from "lucide-react";
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

  // Add state variables to track which sections have details shown
  const [showSizeDetails, setShowSizeDetails] = useState(false);
  const [showMaterialDetails, setShowMaterialDetails] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [showColorDetails, setShowColorDetails] = useState(false);
  const [showTypeDetails, setShowTypeDetails] = useState(false);
  const [showFanlightDetails, setShowFanlightDetails] = useState(false);
  const [showOpeningDetails, setShowOpeningDetails] = useState(false);
  const [showGlazingDetails, setShowGlazingDetails] = useState(false);
  const [showGlassStructureDetails, setShowGlassStructureDetails] =
    useState(false);
  const [showHandleDetails, setShowHandleDetails] = useState(false);

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

  // Details section component
  const DetailSection = ({
    title,
    description,
    formula,
    examples,
    onClose,
  }) => (
    <div className="mt-3 p-4 border border-gray-200 rounded-md bg-white">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      <p className="text-gray-700 mb-4">{description}</p>

      {formula && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Formula:</h4>
          <div className="p-3 bg-gray-100 rounded-md font-mono text-sm">
            {formula}
          </div>
        </div>
      )}

      {examples && examples.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Examples:</h4>
          <div className="space-y-3">
            {examples.map((example, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-md">
                <p className="font-medium">{example.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {example.calculation}
                </p>
                <p className="text-sm font-semibold mt-1">
                  Result: {example.result}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

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
            <div className="flex  justify-between items-center bg-teal-500 text-white p-2">
              <h2 className="text-xl font-semibold">Size</h2>
              <button
                className="text-lg hover:underline"
                onClick={() => setShowSizeDetails(!showSizeDetails)}
              >
                More Details
              </button>
            </div>

            {showSizeDetails && (
              <DetailSection
                title="Window Size Details"
                description="The size of your window affects both functionality and cost. Larger windows allow more light but may have structural limitations. All dimensions must be within the permissible ranges."
                formula="Window Area = Width × Height (used in price calculations)"
                examples={[
                  {
                    name: "Standard Window",
                    calculation: "Width: 1000mm × Height: 1200mm = 1.2m²",
                    result: "1.2 square meters",
                  },
                  {
                    name: "Large Window",
                    calculation: "Width: 1500mm × Height: 2000mm = 3.0m²",
                    result: "3.0 square meters",
                  },
                ]}
                onClose={() => setShowSizeDetails(false)}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
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
            <div className="flex justify-between items-center bg-teal-500 text-white p-2">
              <h2 className="text-xl font-semibold">Material</h2>
              <button
                className="text-lg hover:underline"
                onClick={() => setShowMaterialDetails(!showMaterialDetails)}
              >
                More Details
              </button>
            </div>

            {showMaterialDetails && (
              <DetailSection
                title="Material Details"
                description="The material of your window frame affects durability, insulation, maintenance requirements, and aesthetics. Different materials have different price points and benefits."
                formula="Frame Cost = Material Price per meter × Frame Perimeter"
                examples={[
                  {
                    name: "PVC Window (1.2m × 1.5m)",
                    calculation: "$15.00/m × (1.2m + 1.5m) × 2",
                    result: "$81.00",
                  },
                  {
                    name: "Aluminum Window (1.2m × 1.5m)",
                    calculation: "$25.00/m × (1.2m + 1.5m) × 2",
                    result: "$135.00",
                  },
                ]}
                onClose={() => setShowMaterialDetails(false)}
              />
            )}

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
                  320: { slidesPerView: 1 },
                  425: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 4 },
                }}
                className="w-full mt-4"
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
            <div className="flex justify-between items-center bg-teal-500 text-white p-2">
              <h2 className="text-xl font-semibold">Profile</h2>
              <button
                className="text-lg hover:underline"
                onClick={() => setShowProfileDetails(!showProfileDetails)}
              >
                More Details
              </button>
            </div>

            {showProfileDetails && (
              <DetailSection
                title="Profile Details"
                description="The profile determines the structural characteristics of your window frame. Different profiles offer varying levels of insulation, strength, and design options."
                formula="Profile Adjusted Cost = Base Frame Cost × Profile Multiplier"
                examples={[
                  {
                    name: "Standard Profile (Base frame cost: $100)",
                    calculation: "$100 × 1.0 multiplier",
                    result: "$100.00",
                  },
                  {
                    name: "Premium Profile (Base frame cost: $100)",
                    calculation: "$100 × 1.25 multiplier",
                    result: "$125.00",
                  },
                ]}
                onClose={() => setShowProfileDetails(false)}
              />
            )}

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
                  320: { slidesPerView: 1 },
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="w-full mt-4"
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
            <div className="flex justify-between items-center bg-teal-500 text-white p-2">
              <h2 className="text-xl font-semibold">Color</h2>
              <button
                className="text-lg hover:underline"
                onClick={() => setShowColorDetails(!showColorDetails)}
              >
                More Details
              </button>
            </div>

            {showColorDetails && (
              <DetailSection
                title="Color Details"
                description="The color of your window frame affects both aesthetics and price. Standard colors are typically less expensive, while specialty finishes and custom colors have premium pricing."
                formula="Color Adjusted Cost = Profile Adjusted Cost × Color Multiplier"
                examples={[
                  {
                    name: "Standard White (Profile adjusted cost: $125)",
                    calculation: "$125 × 1.0 multiplier",
                    result: "$125.00",
                  },
                  {
                    name: "Wood Grain Finish (Profile adjusted cost: $125)",
                    calculation: "$125 × 1.15 multiplier",
                    result: "$143.75",
                  },
                ]}
                onClose={() => setShowColorDetails(false)}
              />
            )}

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
                  320: { slidesPerView: 3 },
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 10 },
                }}
                className="w-full mt-4"
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
            <div className="flex justify-between items-center bg-teal-500 text-white p-3 rounded-md">
              <h2 className="text-xl font-semibold">Types of Window</h2>
              <button
                className="text-lg hover:underline"
                onClick={() => setShowTypeDetails(!showTypeDetails)}
              >
                More Details
              </button>
            </div>

            {showTypeDetails && (
              <DetailSection
                title="Window Type Details"
                description="The window type determines how the window operates and its overall design. Different types offer varying benefits in terms of ventilation, security, and aesthetics."
                formula="Window Type Adjusted Cost = Color Adjusted Cost × Window Type Multiplier"
                examples={[
                  {
                    name: "Fixed Window (Color adjusted cost: $150)",
                    calculation: "$150 × 0.9 multiplier (simpler construction)",
                    result: "$135.00",
                  },
                  {
                    name: "Single-Hung Window (Color adjusted cost: $150)",
                    calculation: "$150 × 1.0 multiplier",
                    result: "$150.00",
                  },
                ]}
                onClose={() => setShowTypeDetails(false)}
              />
            )}

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
                  320: { slidesPerView: 1 },
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="w-full mt-4"
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
              <button
                className="text-lg underline"
                onClick={() => setShowFanlightDetails(!showFanlightDetails)}
              >
                More Details
              </button>
            </div>

            <p className="text-gray-700 my-2">Please select your door Types</p>

            {showFanlightDetails && (
              <DetailSection
                title="Fanlight Details"
                description="Fanlights are fixed window sections positioned above or below the main window. They allow additional light to enter the room while maintaining the structural integrity of the window."
                formula="Fanlight Cost = Base Price of Selected Fanlight Option"
                examples={[
                  {
                    name: "Without Fanlight",
                    calculation: "Base Price = $0.00",
                    result: "$0.00",
                  },
                  {
                    name: "Lower Fanlight",
                    calculation: "Base Price = $20.00",
                    result: "$20.00",
                  },
                  {
                    name: "Upper Fanlight",
                    calculation: "Base Price = $30.00",
                    result: "$30.00",
                  },
                ]}
                onClose={() => setShowFanlightDetails(false)}
              />
            )}

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
                  320: { slidesPerView: 1 },
                  640: { slidesPerView: 1, spaceBetween: 10 },
                  1024: { slidesPerView: 3, spaceBetween: 15 },
                }}
                className="w-full mt-4"
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
              <button
                className="text-lg hover:underline"
                onClick={() => setShowOpeningDetails(!showOpeningDetails)}
              >
                More Details
              </button>
            </div>

            <p className="text-[#555454] text-lg my-4 px-4">
              Please select your door Opening System
            </p>

            {showOpeningDetails && (
              <DetailSection
                title="Opening System Details"
                description="The opening system determines how your window opens and closes. Different systems offer various benefits in terms of ventilation, accessibility, and space efficiency."
                formula="Opening System Cost = Base Price of Selected Opening System"
                examples={[
                  {
                    name: "Single Opening",
                    calculation: "Base Price = $20.00",
                    result: "$20.00",
                  },
                  {
                    name: "Double Opening",
                    calculation: "Base Price = $40.00",
                    result: "$40.00",
                  },
                  {
                    name: "Triple Opening",
                    calculation: "Base Price = $60.00",
                    result: "$60.00",
                  },
                ]}
                onClose={() => setShowOpeningDetails(false)}
              />
            )}

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
                  320: { slidesPerView: 1 },
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="w-full mt-4"
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
              <button
                className="text-lg hover:underline"
                onClick={() => setShowGlazingDetails(!showGlazingDetails)}
              >
                More Details
              </button>
            </div>
            <p className="text-[#555454] text-lg my-4 px-4">
              Please select your Glazing type
            </p>

            {showGlazingDetails && (
              <DetailSection
                title="Glazing Details"
                description="Glazing refers to the number of glass panes in your window. More panes generally provide better insulation and soundproofing but at a higher cost."
                formula="Glazing Cost = Base Price per m² × Window Area × Glazing Multiplier"
                examples={[
                  {
                    name: "Single Glazing (1.2m × 1.5m window)",
                    calculation: "$20.00/m² × 1.8m² × 1.2 multiplier",
                    result: "$43.20",
                  },
                  {
                    name: "Double Glazing (1.2m × 1.5m window)",
                    calculation: "$40.00/m² × 1.8m² × 1.4 multiplier",
                    result: "$100.80",
                  },
                ]}
                onClose={() => setShowGlazingDetails(false)}
              />
            )}

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
                  320: { slidesPerView: 1 },
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="w-full mt-4"
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
              <button
                className="text-lg hover:underline"
                onClick={() =>
                  setShowGlassStructureDetails(!showGlassStructureDetails)
                }
              >
                More Details
              </button>
            </div>
            <p className="text-[#555454] text-lg my-4 px-4">
              Please select your Glass Structure type
            </p>

            {showGlassStructureDetails && (
              <DetailSection
                title="Glass Structure Details"
                description="The glass structure determines the appearance and properties of your window glass. Different structures offer varying levels of privacy, light transmission, and aesthetic appeal."
                formula="Glass Structure Cost = Base Price + (Window Area × Base Glass Price × Glazing Multiplier × Structure Multiplier)"
                examples={[
                  {
                    name: "Clear Glass (1.2m × 1.5m window with Double Glazing)",
                    calculation: "$10.00 + (1.8m² × $40.00 × 1.4 × 1.1)",
                    result: "$120.88",
                  },
                  {
                    name: "Obscure Glass (1.2m × 1.5m window with Double Glazing)",
                    calculation: "$30.00 + (1.8m² × $40.00 × 1.4 × 1.2)",
                    result: "$150.96",
                  },
                ]}
                onClose={() => setShowGlassStructureDetails(false)}
              />
            )}

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
                  320: { slidesPerView: 1 },
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="w-full mt-4"
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
              <button
                className="text-lg hover:underline"
                onClick={() => setShowHandleDetails(!showHandleDetails)}
              >
                More Details
              </button>
            </div>

            <p className="text-[#555454] text-lg my-4 px-4">
              Please select your Handle & Lock
            </p>

            {showHandleDetails && (
              <DetailSection
                title="Handle & Lock Details"
                description="The handle and lock system affects both the security and ease of use of your window. Higher-end options offer enhanced security features and premium finishes."
                formula="Handle & Lock Cost = Base Price of Selected Handle"
                examples={[
                  {
                    name: "Simple Handle",
                    calculation: "Base Price = $20.00",
                    result: "$20.00",
                  },
                  {
                    name: "Handle with Lock",
                    calculation: "Base Price = $40.00",
                    result: "$40.00",
                  },
                  {
                    name: "Smart Lock Handle",
                    calculation: "Base Price = $60.00",
                    result: "$60.00",
                  },
                ]}
                onClose={() => setShowHandleDetails(false)}
              />
            )}

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
                  320: { slidesPerView: 1, spaceBetween: 15 },
                  480: { slidesPerView: 1, spaceBetween: 15 },
                  768: { slidesPerView: 2, spaceBetween: 20 },
                  1024: { slidesPerView: 3, spaceBetween: 25 },
                  1280: { slidesPerView: 4, spaceBetween: 25 },
                }}
                className="w-full mt-4"
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
