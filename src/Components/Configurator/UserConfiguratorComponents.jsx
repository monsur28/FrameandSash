export function CustomerNotes({ notes, setNotes, savedNotes, handleSave }) {
  return (
    <div className="p-6 border rounded-lg mt-4 bg-white">
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
        * The contractual conditions of Frame and Sash remain unaffected by your
        note.
      </p>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          className="px-4 py-2 border border-gray-500 rounded-md text-gray-700 hover:bg-gray-200"
          onClick={() => setNotes("")}
        >
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
  );
}

import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export function OptionSwiper({
  items,
  selectedId,
  onSelect,
  renderItem,
  renderPrice,
  slidesPerView = 3,
  height = "h-64",
}) {
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

  return (
    <div className="relative">
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={slidesPerView}
        navigation={{
          nextEl: ".custom-swiper-button-next",
          prevEl: ".custom-swiper-button-prev",
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: slidesPerView },
        }}
        className="w-full"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className="flex justify-center">
            <div className="w-11/12">
              <button
                onClick={() => onSelect(item.id)}
                className={`relative border rounded-t-lg w-full ${height} overflow-hidden p-2 transition-all 
                ${
                  selectedId === item.id
                    ? "border-teal-500 border-2 shadow-md bg-gray-50"
                    : "border-gray-200 hover:shadow-sm"
                }`}
                aria-selected={selectedId === item.id}
              >
                {selectedId === item.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
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

                {renderItem(item)}
              </button>
              <div className="bg-gray-700 text-white w-full text-center p-2 flex justify-between items-center text-lg">
                <span>Price</span>
                <div className="font-bold text-lg">{renderPrice(item)}</div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation buttons */}
      <button
        className="custom-swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
        bg-white rounded-full shadow-md p-2 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      <button
        className="custom-swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
        bg-white rounded-full shadow-md p-2 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
}

import { X } from "lucide-react";
export function SectionDetails({
  title,
  description,
  formula,
  examples = [],
  images = [],
  onClose,
}) {
  return (
    <div className="mt-3 p-4 border border-gray-200 rounded-md bg-white">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
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

      {examples.length > 0 && (
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

      {images.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Illustrations:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div key={index} className="border rounded-md overflow-hidden">
                <img
                  src={image.src || "/placeholder.svg?height=200&width=300"}
                  alt={image.alt}
                  className="w-full h-auto object-contain"
                />
                <p className="text-sm text-center p-2 bg-gray-50">
                  {image.alt}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { ZoomIn } from "lucide-react";

export default function SidebarSummary({
  totalPrice,
  dimensions,
  selectedUnit,
  configData,
  selectedMaterial,
  selectedProfile,
  selectedColor,
  selectedType,
  selectedFanlight,
  selectedOpening,
  selectedGlazing,
  selectedGlassStructure,
  selectedHandle,
  getSelectedOptionName,
  scrollToSection,
  sizeRef,
  materialRef,
  profileRef,
  colorRef,
  typeRef,
  fanlightRef,
  openingRef,
  glazingRef,
  glassStructureRef,
  handleRef,
}) {
  return (
    <>
      <div className="flex flex-col mb-4">
        <div className="bg-gray-100 rounded-md p-6">
          {/* Image Section */}
          <div className="flex justify-center mb-4">
            <img
              src="/placeholder.svg?height=288&width=200"
              alt="Window Preview"
              className="w-auto h-72 object-contain"
            />
          </div>

          {/* Price & Zoom */}
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-gray-800">
              ${totalPrice.toFixed(2)}
            </div>
            <button
              type="button"
              className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-full focus:outline-none transition-colors"
            >
              <ZoomIn className="h-6 w-6" />
            </button>
          </div>
          {/* Description */}
          <p className="text-lg text-gray-700 mt-2 mb-6">
            Designed with smooth horizontal operation, they provide excellent
            ventilation, easy access, and a sleek, space-saving design.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm">
        <ul className="divide-y divide-gray-200">
          {/* SIZE */}
          <li
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
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
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
            onClick={() => scrollToSection(materialRef)}
          >
            <div>
              <span className="text-gray-700 font-semibold">Material: </span>
              <span className="text-gray-700">
                {getSelectedOptionName(configData.materials, selectedMaterial)}
              </span>
            </div>
            <div className="text-gray-400">{">"}</div>
          </li>

          {/* PROFILE */}
          <li
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
            onClick={() => scrollToSection(profileRef)}
          >
            <div>
              <span className="text-gray-700 font-semibold">Profile: </span>
              <span className="text-gray-700">
                {getSelectedOptionName(configData.profiles, selectedProfile)}
              </span>
            </div>
            <div className="text-gray-400">{">"}</div>
          </li>

          {/* COLOUR AND DECOR */}
          <li
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
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
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
            onClick={() => scrollToSection(typeRef)}
          >
            <div>
              <span className="text-gray-700 font-semibold">
                Type of Window:{" "}
              </span>
              <span className="text-gray-700">
                {getSelectedOptionName(configData.window_types, selectedType)}
              </span>
            </div>
            <div className="text-gray-400">{">"}</div>
          </li>

          {/* UPPER / LOWER FANLIGHT */}
          <li
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
            onClick={() => scrollToSection(fanlightRef)}
          >
            <div>
              <span className="text-gray-700 font-semibold">
                Upper / Lower Fanlight:{" "}
              </span>
              <span className="text-gray-700">
                {getSelectedOptionName(configData.fanlights, selectedFanlight)}
              </span>
            </div>
            <div className="text-gray-400">{">"}</div>
          </li>

          {/* OPENING SYSTEM */}
          <li
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
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
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
            onClick={() => scrollToSection(glazingRef)}
          >
            <div>
              <span className="text-gray-700 font-semibold">Glazing: </span>
              <span className="text-gray-700">
                {getSelectedOptionName(configData.glass_types, selectedGlazing)}
              </span>
            </div>
            <div className="text-gray-400">{">"}</div>
          </li>

          {/* GLASS STRUCTURE */}
          <li
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
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
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
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
    </>
  );
}
