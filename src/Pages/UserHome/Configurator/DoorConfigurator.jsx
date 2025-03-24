import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ZoomIn } from "lucide-react";

export default function DoorConfigurator() {
  const [dimensions, setDimensions] = useState({ height: 500, width: 500 });
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedDoorForm, setSelectedDoorForm] = useState(null);
  const [selectedOpening, setSelectedOpening] = useState(null);
  const [selectedGlazing, setSelectedGlazing] = useState(null);
  const [selectedGlass, setSelectedGlass] = useState(null);
  const [selectedHandle, setSelectedHandle] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [selectedType, setSelectedType] = useState("single");
  const [totalPrice, setTotalPrice] = useState(100);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("mm");
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;
      swiper.params.navigation.prevEl = ".custom-swiper-button-prev";
      swiper.params.navigation.nextEl = ".custom-swiper-button-next";
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, []);

  const basePrice = 100;

  const materials = [
    {
      id: "upvc",
      name: "UPVC-Aluminum",
      price: 30.0,
      image: "https://i.ibb.co/RGJmdGPY/u-PVC-Aluminium.png",
    },
    {
      id: "steel",
      name: "Steel Material",
      price: 40.0,
      image: "https://i.ibb.co/4nkRHgT0/Steel-Material.png",
    },
    {
      id: "wood",
      name: "Wood-Aluminum",
      price: 50.0,
      image: "https://i.ibb.co/C3fsv8sy/Wood-Aluminium.png",
    },
    {
      id: "upvc-material",
      name: "uPVC Material",
      price: 60.0,
      image: "https://i.ibb.co.com/DHYDXw5D/image-50.png",
    },
  ];

  const profileMultipliers = {
    "ht4000-basic": 1.0,
    "htplus-advanced": 1.1,
    "ht5000-premium": 1.2,
  };

  const profileOptions = [
    {
      id: "ht4000-basic",
      name: "HT 4000 Basic",
      price: 29.99,
      image: "https://i.ibb.co.com/m5T1yHXT/image-104.png",
      features: [
        "4-5 Chamber System",
        "Steel Reinforced Frame",
        "Frame Width: 80mm",
      ],
    },
    {
      id: "htplus-advanced",
      name: "HT PLUS Advanced",
      price: 39.99,
      image: "https://i.ibb.co.com/m5T1yHXT/image-104.png",
      features: [
        "5-6 Chamber System",
        "Construction Depth: 85mm",
        "Triple Glazing Compatible",
      ],
    },
    {
      id: "ht5000-premium",
      name: "HT 5000 Premium",
      price: 49.99,
      image: "https://i.ibb.co.com/m5T1yHXT/image-104.png",
      features: [
        "High Thermal Insulation",
        "6-Chamber System",
        "Frame Depth: 90mm",
      ],
    },
  ];

  const colorMultipliers = {
    grey: 1.1,
    black: 1.2,
    beige: 1.0,
    "light-oak": 1.05,
    walnut: 1.15,
    mahogany: 1.25,
    cherry: 1.18,
    ebony: 1.3,
    maple: 1.1,
    rosewood: 1.35,
  };

  const colors = [
    { id: "beige", name: "Beige", color: "#F5F5DC", price: 0 },
    { id: "grey", name: "Grey", color: "#808080", price: 10.0 },
    { id: "black", name: "Black", color: "#000000", price: 20.0 },
    { id: "light-oak", name: "Light-oak", color: "#D2B48C", price: 15.0 },
    { id: "walnut", name: "Walnut", color: "#5D3A1A", price: 25.0 },
    { id: "mahogany", name: "Mahogany", color: "#C04000", price: 30.0 },
    { id: "cherry", name: "Cherry", color: "#8B322C", price: 28.0 },
    { id: "ebony", name: "Ebony", color: "#555D50", price: 35.0 },
    { id: "maple", name: "Maple", color: "#CDAA7D", price: 18.0 },
    { id: "rosewood", name: "Rosewood", color: "#65000B", price: 40.0 },
  ];

  const doorModelFactors = {
    central: 1.0,
    panel: 1.2,
    kitchener: 1.5,
  };

  const modelOptions = [
    {
      id: "central-divider",
      name: "Central Divider",
      price: 28.0,
      image: "https://i.ibb.co.com/KBNg9Ww/image-106.png",
    },
    {
      id: "panel",
      name: "Panel",
      price: 48.0,
      image: "https://i.ibb.co.com/1YGXQfqK/image-107.png",
    },
    {
      id: "kitchener",
      name: "Kitchener",
      price: 68.0,
      image: "https://i.ibb.co.com/bMDQ7pkK/image-108.png",
    },
  ];

  const doorFormOptions = [
    {
      id: "no-panels",
      name: "Without Side Panels Without Fanlight",
      price: 28.0,
      image: "https://i.ibb.co.com/s9H3mHxz/image-112.png",
    },
    {
      id: "left-panel",
      name: "Side Panel Left Without Fanlight",
      price: 38.0,
      image: "https://i.ibb.co.com/99dxQWgz/image-113.png",
    },
    {
      id: "right-panel",
      name: "Side Panel Right Without Fanlight",
      price: 40.0,
      image: "https://i.ibb.co.com/Lh0c9SPs/image-114.png",
    },
  ];

  const openingOptions = [
    {
      id: "single",
      name: "Single Opening",
      price: 49.99,
      image: "https://i.ibb.co.com/chKCtgsK/image-109.png",
    },
    {
      id: "double",
      name: "Double Opening",
      price: 69.99,
      image: "https://i.ibb.co.com/NnLHZwD7/image-111.png",
    },
    {
      id: "triple",
      name: "Triple Opening",
      price: 89.99,
      image: "https://i.ibb.co.com/Tq2PyLWw/image-110.png",
    },
  ];

  const glazingMultipliers = {
    single: 1.0,
    double: 1.5,
    triple: 2.0,
  };

  const glazingOptions = [
    {
      id: "single",
      name: "Single Glazing",
      price: 0,
      image: "https://i.ibb.co/q3zjCF7M/image-69.png",
    },
    {
      id: "double",
      name: "Double Glazing",
      price: 50.0,
      image: "https://i.ibb.co/q3zjCF7M/image-69.png",
    },
    {
      id: "triple",
      name: "Triple Glazing",
      price: 100.0,
      image: "https://i.ibb.co/q3zjCF7M/image-69.png",
    },
  ];

  const glassTypeMultipliers = {
    obscure: 1.2,
    clear: 1.0,
    reflecting: 1.3,
    ultra: 1.4,
  };

  const glassOptions = [
    {
      id: "clear",
      name: "Clear Glass",
      price: 0,
      image: "https://i.ibb.co/TBzbbZKw/Clear-glass.png",
    },
    {
      id: "obscure",
      name: "Obscure Glass",
      price: 20.0,
      image: "https://i.ibb.co/0pGfs6yL/Obscure-glass.png",
    },
    {
      id: "reflecting",
      name: "Reflecting Glass",
      price: 30.0,
      image: "https://i.ibb.co/Jwz6xz0k/Reflecting-glass.png",
    },
    {
      id: "ultra",
      name: "Ultra-light Glass",
      price: 40.0,
      image: "https://i.ibb.co/H5Jtpff/Extra-light-glass.png",
    },
  ];

  const handleOptions = [
    {
      id: "simple",
      name: "Backplate White",
      price: 19.99,
      image: "https://i.ibb.co.com/JjnHFsNm/image-118.png",
    },
    {
      id: "lock",
      name: "Backplate Brown",
      price: 29.99,
      image: "https://i.ibb.co.com/zVxLk52n/image-115.png",
    },
    {
      id: "security",
      name: "Backplate Titanium",
      price: 39.99,
      image: "https://i.ibb.co.com/WpgLFY1W/image-116.png",
    },
    {
      id: "smart",
      name: "3 Point Hook Locking (2 Point Locking)",
      price: 59.99,
      image: "https://i.ibb.co.com/9Hpk29pK/image-119.png",
    },
  ];

  const calculatePrice = () => {
    try {
      if (!validateDimensions(dimensions)) {
        setError("Invalid dimensions");
        return;
      }
      setError("");

      const widthM = dimensions.width / 1000;
      const heightM = dimensions.height / 1000;

      // 1. Frame Cost
      const materialObj = materials.find((m) => m.id === selectedMaterial);
      const framePricePerM = materialObj ? materialObj.price : 0;
      const framePerimeter = (widthM + heightM) * 2;
      const frameCost = framePerimeter * framePricePerM;

      // 2. Sash Cost
      let sashPerimeter = 0;
      switch (selectedModel) {
        case "double":
          sashPerimeter = widthM * 2 + heightM * 4;
          break;
        case "triple":
          sashPerimeter = widthM * 2 + heightM * 6;
          break;
        default: // single or not selected
          sashPerimeter = (widthM + heightM) * 2;
      }
      const sashCost = sashPerimeter * framePricePerM;

      // 3. Combined Frame & Sash with Profile
      const profileMultiplier = profileMultipliers[selectedProfile] || 1.0;
      let combinedFrameSashCost = (frameCost + sashCost) * profileMultiplier;

      // 4. Apply Color Multiplier
      const colorMultiplier = colorMultipliers[selectedColor] || 1.0;
      combinedFrameSashCost *= colorMultiplier;

      // 5. Apply door Model Factor
      const modelFactor = doorModelFactors[selectedModel] || 1.0;
      combinedFrameSashCost *= modelFactor;

      // 6. Glass Cost
      const baseGlassPricePerSqM = 50;
      const areaSqM = widthM * heightM;
      const glazingMultiplier = glazingMultipliers[selectedGlazing] || 1.0;
      const glassTypeMultiplier = glassTypeMultipliers[selectedGlass] || 1.0;
      const glassCost =
        areaSqM *
        baseGlassPricePerSqM *
        glazingMultiplier *
        glassTypeMultiplier;

      // 7. Opening System Cost
      const openingObj = openingOptions.find((o) => o.id === selectedOpening);
      const openingCost = openingObj ? openingObj.price : 0;

      // 8. Handle & Lock Cost
      const handleObj = handleOptions.find((h) => h.id === selectedHandle);
      const handleCost = handleObj ? handleObj.price : 0;

      // Calculate Total
      const total =
        basePrice + // Ensure the base price is always included
        combinedFrameSashCost +
        glassCost +
        openingCost +
        handleCost;

      setTotalPrice(Number(total.toFixed(2)));
    } catch (e) {
      console.error("Price calculation error:", e);
      setError("Error calculating price");
      setTotalPrice(basePrice);
    }
  };

  const validateDimensions = (dim) => {
    return (
      dim.height > 0 && dim.height <= 3000 && dim.width > 0 && dim.width <= 3000
    );
  };

  useEffect(() => {
    calculatePrice();
  }, [
    dimensions,
    selectedMaterial,
    selectedProfile,
    selectedColor,
    selectedModel,
    selectedOpening,
    selectedGlazing,
    selectedGlass,
    selectedHandle,
  ]);

  const handleSave = () => {
    setSavedNotes(notes);
  };

  const toggleSelection = (setter, value) => {
    setter((prev) => (prev === value ? null : value));
  };

  const getSelectedOptionName = (options, selectedId) => {
    return (
      options.find((option) => option.id === selectedId)?.name || "Not selected"
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Door Configurator</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Fixed Column */}
        <div className="border rounded-lg p-4 sticky top-4 h-screen overflow-y-auto scrollbar-hide">
          <div className="flex flex-col mb-4">
            <div className="flex flex-col items-center mb-4">
              <img
                src="https://i.imgur.com/mMNJt5C.png"
                alt="door Preview"
                className="w-64 h-auto mb-2"
              />
              <img
                src="https://i.imgur.com/ISXBitw.png"
                alt="door Preview"
                className="w-64 h-auto mb-2"
              />
            </div>
            <div className="text-4xl font-bold flex justify-between items-center mb-2">
              <span>${totalPrice}</span>
              <span>
                <ZoomIn />
              </span>
            </div>
            <p className="text-lg mb-4">
              Designed with smooth horizontal operation, they provide excellent
              ventilation, easy access, and a sleek, space-saving design.
            </p>
            <h3 className="text-lg font-medium mb-2">Selected Options:</h3>
            <ul className="list-disc list-inside text-lg space-y-1">
              <li>
                <span>Material: </span>
                {getSelectedOptionName(materials, selectedMaterial)}
              </li>
              <li>
                <span>Profile: </span>
                {getSelectedOptionName(profileOptions, selectedProfile)}
              </li>
              <li>
                <span>Color: </span>
                {getSelectedOptionName(colors, selectedColor)}
              </li>
              <li>
                <span>Type: </span>
                {getSelectedOptionName(modelOptions, selectedType)}
              </li>
              <li>
                <span>Fanlight: </span>
                {getSelectedOptionName(doorFormOptions, setSelectedDoorForm)}
              </li>
              <li>
                <span>Opening: </span>
                {getSelectedOptionName(openingOptions, selectedOpening)}
              </li>
              <li>
                <span>Glazing: </span>
                {getSelectedOptionName(glazingOptions, selectedGlazing)}
              </li>
              <li>
                <span>Glass: </span>
                {getSelectedOptionName(glassOptions, selectedGlass)}
              </li>
              <li>
                <span>Handle: </span>
                {getSelectedOptionName(handleOptions, selectedHandle)}
              </li>
            </ul>
          </div>
          <div className="p-6 border rounded-lg ">
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
          <section className="w-full">
            <h2 className="text-xl font-semibold mb-4 bg-teal-500 text-white p-2">
              Size
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {/* Total Height Input */}
              <div>
                <label className="block text-lg mb-1">Total Height</label>
                <input
                  type="number"
                  value={dimensions.height}
                  onChange={(e) =>
                    setDimensions({
                      ...dimensions,
                      height: Number.parseInt(e.target.value),
                    })
                  }
                  className="w-full border rounded p-2"
                  placeholder="Enter height"
                />
              </div>

              {/* Total Width Input */}
              <div>
                <label className="block text-lg mb-1">Total Width</label>
                <input
                  type="number"
                  value={dimensions.width}
                  onChange={(e) =>
                    setDimensions({
                      ...dimensions,
                      width: Number.parseInt(e.target.value),
                    })
                  }
                  className="w-full border rounded p-2"
                  placeholder="Enter width"
                />
              </div>

              {/* Unit Dropdown */}
              <div>
                <label className="block text-lg mb-1">Unit</label>
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="mm">mm</option>
                  <option value="cm">cm</option>
                  <option value="in">inches</option>
                </select>
              </div>
            </div>
          </section>

          {/* Material */}
          <section className="w-full relative">
            <h2 className="text-xl font-semibold mb-4 bg-teal-500 text-white p-2">
              Material
            </h2>
            <div className="relative">
              <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination]}
                spaceBetween={10} // Adjusted for smaller cards
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
                {materials.map((material) => (
                  <SwiperSlide
                    key={material.id}
                    className="flex justify-center"
                  >
                    <div className="w-11/12">
                      {/* Slightly smaller card */}
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
                          src={material.image || "/placeholder.svg"}
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
                          ${material.price}
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
          <section className="w-full relative">
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
                {profileOptions.map((profile) => (
                  <SwiperSlide key={profile.id} className="flex justify-center">
                    <div className="w-11/12">
                      {" "}
                      {/* Slightly smaller card */}
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
                          src={profile.image || "/placeholder.svg"}
                          alt={profile.name}
                          className="w-full h-48 object-contain rounded-md"
                          loading="lazy"
                        />
                        <div className="text-lg font-bold text-center p-2">
                          {profile.name}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600 p-2">
                          {profile.features.map((feature, index) => (
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
                              {feature}
                            </div>
                          ))}
                        </div>
                      </button>
                      <div className="bg-[#555454] text-white w-full text-center p-2 flex justify-between items-center text-lg">
                        <span>Price</span>
                        <div className="font-bold text-lg">
                          ${profile.price.toFixed(2)}
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
          <section className="w-full relative">
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
                {colors.map((color) => (
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
                      style={{ backgroundColor: color.color }}
                      aria-label={`Select ${color.name} color`}
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
                      ${color.price.toFixed(2)}
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

          {/* Model*/}
          <section className="w-full relative">
            <div className="flex justify-between items-center bg-teal-500 text-white p-4">
              <h2 className="text-2xl">Model</h2>
              <button className="text-lg hover:underline">More Details</button>
            </div>

            <div className="relative px-6 mt-4">
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
                {modelOptions.map((model) => (
                  <SwiperSlide key={model.id} className="flex justify-center">
                    <div className="w-11/12">
                      <button
                        onClick={() => setSelectedModel(model.id)}
                        className={`relative border rounded-t-lg w-full h-64 overflow-hidden p-4 
                flex flex-col justify-between items-center text-center transition-all
                ${
                  selectedModel === model.id
                    ? "border-primary border-2 bg-gray-100 shadow-md"
                    : "border-gray-300 hover:shadow-md"
                }`}
                        aria-selected={selectedModel === model.id}
                      >
                        {selectedModel === model.id && (
                          <div
                            className="absolute top-2 right-2 bg-primary text-white 
                  rounded-full w-6 h-6 flex items-center justify-center"
                          >
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

                        <div className="relative w-full h-40 mb-4">
                          <img
                            src={model.image}
                            alt={model.name}
                            className="w-full h-full object-contain"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg";
                            }}
                          />
                        </div>

                        <div className="text-lg font-semibold">
                          {model.name}
                        </div>
                      </button>

                      <div
                        className="bg-[#555454] text-white w-full text-center py-2 
              text-lg font-bold flex justify-between px-4"
                      >
                        <span>Price</span>
                        <span>${model.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation Buttons */}
              <button
                className="custom-swiper-button-prev absolute left-0 top-1/2 transform 
        -translate-y-1/2 z-10 transition-all duration-300 hover:scale-110 
        active:scale-95 focus:outline-none"
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
                    d="M15.3658 22.23L10.4619 17.6531M10.4619 17.6531L15.3658 
          13.0762M10.4619 17.6531H22.2311"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                className="custom-swiper-button-next absolute right-0 top-1/2 transform 
        -translate-y-1/2 z-10 transition-all duration-300 hover:scale-110 
        active:scale-95 focus:outline-none"
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
                    d="M18.6342 11.77L23.5381 16.3469M23.5381 16.3469L18.6342 
          20.9238M23.5381 16.3469H11.7689"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </section>

          {/* // Door Form  */}
          <section className="w-full relative">
            {/* Header */}
            <div className="flex justify-between items-center bg-teal-500 text-white p-4">
              <h2 className="text-xl font-semibold">Door Form</h2>
              <button className="text-lg hover:underline">More Details</button>
            </div>

            {/* Subtitle */}
            <p className="text-gray-600 my-4 px-4">
              Please select your Door form
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
                {doorFormOptions.map((option) => (
                  <SwiperSlide key={option.id} className="flex justify-center">
                    <div className="w-11/12">
                      <button
                        onClick={() => setSelectedDoorForm(option.id)}
                        className={`relative border rounded-t-lg w-full h-64 p-4 
                flex flex-col justify-between items-center transition-all
                ${
                  selectedDoorForm === option.id
                    ? "border-teal-500 border-2 bg-gray-50"
                    : "border-gray-200 hover:shadow-md"
                }`}
                        aria-selected={selectedDoorForm === option.id}
                      >
                        {selectedDoorForm === option.id && (
                          <div
                            className="absolute -top-2 -right-2 bg-blue-500 text-white 
                  rounded-full w-8 h-8 flex items-center justify-center"
                          >
                            <svg
                              className="w-5 h-5"
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

                        <div className="w-full h-40 flex items-center justify-center">
                          <img
                            src={option.image}
                            alt={option.name}
                            className="h-full object-contain"
                            loading="lazy"
                          />
                        </div>

                        <div className="text-lg font-semibold text-center mt-4">
                          {option.name}
                        </div>
                      </button>

                      <div
                        className="bg-[#555454] text-white w-full py-2 px-4
              flex justify-between items-center text-lg font-bold"
                      >
                        <span>Price</span>
                        <span>${option.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation Buttons */}
              <button
                className="custom-swiper-button-prev absolute left-0 top-1/2 transform 
        -translate-y-1/2 z-10 transition-all duration-300 hover:scale-110 
        active:scale-95 focus:outline-none"
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
                    d="M15.3658 22.23L10.4619 17.6531M10.4619 17.6531L15.3658 
          13.0762M10.4619 17.6531H22.2311"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                className="custom-swiper-button-next absolute right-0 top-1/2 transform 
        -translate-y-1/2 z-10 transition-all duration-300 hover:scale-110 
        active:scale-95 focus:outline-none"
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
                    d="M18.6342 11.77L23.5381 16.3469M23.5381 16.3469L18.6342 
          20.9238M23.5381 16.3469H11.7689"
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
          <section className="w-full relative">
            {/* Header */}
            <div className="flex justify-between items-center bg-teal-500 text-white p-4">
              <h2 className="text-2xl">Opening System</h2>
              <button className="text-lg hover:underline">More Details</button>
            </div>

            {/* Tagline */}
            <p className="text-[#555454] text-lg my-4 px-4">
              Please select your door Opening System
            </p>

            <div className="relative px-6">
              {" "}
              {/* Container with padding for navigation */}
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
                {openingOptions.map((option) => (
                  <SwiperSlide
                    key={option.id}
                    className="flex justify-center py-4"
                  >
                    <div className="w-11/12">
                      {" "}
                      {/* Card width control */}
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
                            src={option.image || "/placeholder.svg"}
                            alt={option.name}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>

                        <div className="text-lg font-semibold text-center mt-1">
                          {option.name}
                        </div>
                      </button>
                      <div className="bg-[#555454] text-center text-white py-2 text-lg font-bold w-full mt-auto">
                        ${option.price.toFixed(2)}
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
          <section className="w-full relative">
            <div className="flex justify-between items-center bg-teal-500 text-white p-4">
              <h2 className="text-2xl">Glazing</h2>
              <button className="text-lg hover:underline">More Details</button>
            </div>
            <p className="text-[#555454] text-lg my-4 px-4">
              Please select your Glazing type
            </p>

            <div className="relative px-6">
              {" "}
              {/* Container with padding for navigation */}
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
                {glazingOptions.map((option) => (
                  <SwiperSlide
                    key={option.id}
                    className="flex justify-center py-4"
                  >
                    <div className="w-11/12">
                      {" "}
                      {/* Card width control */}
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
                            src={option.image || "/placeholder.svg"}
                            alt={option.name}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>
                        <h2 className="font-bold py-4">{option.name}</h2>
                      </button>
                      <div className="bg-[#555454] w-full text-center text-white py-2 text-lg font-bold -mt-[1px]">
                        Price: ${option.price.toFixed(2)}
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
          {/* Structured Glass */}
          <section className="w-full relative">
            {/* Header */}
            <div className="flex justify-between items-center bg-teal-500 text-white p-4">
              <h2 className="text-2xl">Structured Glass</h2>
              <button className="text-lg hover:underline">More Details</button>
            </div>

            {/* Tagline */}
            <p className="text-[#555454] text-lg my-4 px-4">
              Please select your glass type
            </p>

            {/* Swiper Container with Navigation Space */}
            <div className="relative px-6">
              <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination]}
                spaceBetween={20}
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
                {glassOptions.map((option) => (
                  <SwiperSlide key={option.id} className="flex justify-center">
                    <div className="w-11/12">
                      {" "}
                      {/* Relative card sizing */}
                      <button
                        onClick={() =>
                          toggleSelection(setSelectedGlass, option.id)
                        }
                        className={`relative border rounded-t-lg w-full h-[250px] p-2 text-center flex flex-col justify-between transition-all 
                ${
                  selectedGlass === option.id
                    ? "border-primary border-2 bg-gray-50"
                    : "border-gray-200 hover:shadow-md"
                }`}
                        aria-selected={selectedGlass === option.id}
                      >
                        {/* Selection Indicator */}
                        {selectedGlass === option.id && (
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

                        {/* Image Container */}
                        <div className="flex justify-center items-center h-48 mb-4">
                          <img
                            src={option.image || "/placeholder.svg"}
                            alt={option.name}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>

                        {/* Option Name */}
                        <div className="text-lg font-semibold mb-2">
                          {option.name}
                        </div>
                      </button>
                      {/* Price Section */}
                      <div className="bg-[#555454] w-full text-white text-lg font-bold py-2 text-center flex justify-between px-2 -mt-[1px]">
                        <span>Price</span>${option.price.toFixed(2)}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons */}
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
          <section className="w-full relative">
            {/* Header Bar */}
            <div className="flex justify-between items-center bg-teal-500 text-white p-4">
              <h2 className="text-2xl">Handle & Locks</h2>
              <button className="text-lg hover:underline">More Details</button>
            </div>

            {/* Tagline */}
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
                {handleOptions.map((option) => (
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
                            src={option.image || "/placeholder.svg"}
                            alt={option.name}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>

                        <div className="text-lg font-semibold mb-3">
                          {option.name}
                        </div>
                      </div>

                      <div className="bg-[#555454] text-white py-2 text-lg font-bold flex justify-between px-4 w-full mt-2">
                        <span>Price</span>
                        <span>${option.price.toFixed(2)}</span>
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
            <button className="px-4 bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 transition-colors">
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
