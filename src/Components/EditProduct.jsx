import { useState } from "react";
import { Edit, DoorOpen, DoorClosed, ZoomIn, ZoomOut } from "lucide-react";

export default function EditProduct() {
  const [selectedHandle, setSelectedHandle] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // Tracks open/close state
  const [zoomLevel, setZoomLevel] = useState(1); // Tracks zoom level

  const handleOptions = [
    {
      id: 1,
      name: "Handle A",
      image: "https://i.ibb.co/xqBcyrP/door-handle-svgrepo-com-7.png",
    },
    {
      id: 2,
      name: "Handle B",
      image: "https://i.ibb.co/k0rvGdC/door-handle-svgrepo-com-6.png",
    },
    {
      id: 3,
      name: "Handle C",
      image: "https://i.ibb.co/0s7b5N3/door-handle-svgrepo-com-5.png",
    },
  ];

  const frameOptions = [
    {
      id: 1,
      name: "Frame A",
      image:
        "https://i.ibb.co.com/cv0PHtN/closed-filled-rectangular-door-4.png",
    },
    {
      id: 2,
      name: "Frame B",
      image:
        "https://i.ibb.co.com/1fQLrbm/closed-filled-rectangular-door-5.png",
    },
    {
      id: 3,
      name: "Frame C",
      image:
        "https://i.ibb.co.com/VxkCXdZ/closed-filled-rectangular-door-3.png",
    },
  ];

  // Handle open/close state
  const toggleOpen = () => setIsOpen((prev) => !prev);

  // Handle zoom
  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 2)); // Limit max zoom to 2x
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5)); // Limit min zoom to 0.5x

  return (
    <div className="p-6 border-2 border-white bg-white/50 backdrop-blur-[16.5px] rounded-3xl shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,120px] xl:grid-cols-[1fr,300px] gap-6">
        {/* Left side - Product image and selections */}
        <div className="space-y-8">
          {/* Product Image with Overlays */}
          <div
            className={`relative bg-gray-100 p-4 rounded-lg ${
              isOpen ? "border-teal-500" : "border-gray-200"
            } border-4`}
          >
            {/* Main Door Image */}
            <img
              src={
                isOpen
                  ? "https://i.ibb.co/0QgPgW8/open-exit-door-svgrepo-com-7.png"
                  : "https://i.ibb.co/rZ5BRwy/closed-filled-rectangular-door-2.png"
              }
              alt={isOpen ? "Open Door" : "Closed Door"}
              style={{ transform: `scale(${zoomLevel})` }}
              width={250}
              height={250}
              className="mx-auto max-w-full transition-transform"
            />

            {/* Overlay: Selected Frame */}
            {selectedFrame && (
              <img
                src={frameOptions.find((f) => f.id === selectedFrame)?.image}
                alt="Selected Frame"
                className="absolute inset-0 mx-auto w-full h-full object-contain pointer-events-none"
              />
            )}

            {/* Overlay: Selected Handle */}
            {selectedHandle && (
              <img
                src={handleOptions.find((h) => h.id === selectedHandle)?.image}
                alt="Selected Handle"
                className="absolute left-[80px] lg:left-96 top-32 lg:top-36 transform -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] object-contain pointer-events-none"
              />
            )}
          </div>

          {/* Handle Selection */}
          <div className="space-y-2 rounded-2xl border-2 border-white bg-white/50 backdrop-blur-[16.5px] p-6 shadow-sm">
            <div className="text-xl font-medium">Handle:</div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {handleOptions.map((handle) => (
                <button
                  key={handle.id}
                  onClick={() => setSelectedHandle(handle.id)}
                  className={`w-16 h-16 rounded-lg border-2 flex-shrink-0 ${
                    selectedHandle === handle.id
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 bg-gray-100"
                  }`}
                >
                  <img
                    src={handle.image}
                    alt={handle.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Frame Selection */}
          <div className="space-y-2 rounded-2xl border-2 border-white bg-white/50 backdrop-blur-[16.5px] p-6 shadow-sm">
            <div className="text-xl font-medium">Frames:</div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {frameOptions.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => setSelectedFrame(frame.id)}
                  className={`w-16 h-16 rounded-lg border-2 flex-shrink-0 ${
                    selectedFrame === frame.id
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 bg-gray-100"
                  }`}
                >
                  <img
                    src={frame.image}
                    alt={frame.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="space-y-4 flex flex-col sm:flex-row sm:space-y-0 sm:space-x-4 lg:flex-col lg:space-y-4 lg:space-x-0">
          <button
            className="w-full max-w-[420px] bg-teal-500 text-white rounded-lg p-4 flex items-center justify-center gap-2 hover:bg-teal-600 transition-colors"
            onClick={() => console.log("Edit action")}
          >
            <Edit className="w-5 h-5" />
            <span>Edit</span>
          </button>
          <button
            className="w-full max-w-[420px] bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            onClick={toggleOpen}
          >
            {isOpen ? (
              <DoorClosed className="w-5 h-5" />
            ) : (
              <DoorOpen className="w-5 h-5" />
            )}
            <span>{isOpen ? "Close" : "Open"}</span>
          </button>
          <button
            className="w-full max-w-[420px] bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            onClick={zoomIn}
          >
            <ZoomIn className="w-5 h-5" />
            <span>Zoom In</span>
          </button>
          <button
            className="w-full max-w-[420px] bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            onClick={zoomOut}
          >
            <ZoomOut className="w-5 h-5" />
            <span>Zoom Out</span>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-6">
        {selectedHandle && (
          <div className="text-gray-600 mt-9">
            Selected Handle:{" "}
            {handleOptions.find((h) => h.id === selectedHandle)?.name}
          </div>
        )}
        {selectedFrame && (
          <div className="text-gray-600">
            Selected Frame:{" "}
            {frameOptions.find((f) => f.id === selectedFrame)?.name}
          </div>
        )}
      </div>
      {/* Product Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
        {/* Ingredient */}
        <div className="flex flex-col justify-center items-center space-y-4 rounded-2xl border-2 border-white bg-white/50 backdrop-blur-[16.5px] ">
          <h3 className="text-xl text-gray-500">Ingredient</h3>
          <div className="rounded-lg p-6 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span>1×1m Contains</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span>4m of frame</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span>4m of frame</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span>1m² of glass</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span>1 set of hardware</span>
            </div>
          </div>
        </div>

        {/* Working Hour */}
        <div className="flex flex-col justify-center items-center space-y-4 rounded-2xl border-2 border-white bg-white/50 backdrop-blur-[16.5px] p-4">
          <h3 className="text-xl text-gray-500">Working Hour</h3>
          <div>
            <div className="text-4xl font-medium text-center">05</div>
          </div>
        </div>

        {/* Wholesale Price */}
        <div className="flex flex-col justify-center items-center space-y-4 rounded-2xl border-2 border-white bg-white/50 backdrop-blur-[16.5px] p-4">
          <h3 className="text-xl text-gray-500">Wholesale Price</h3>
          <div>
            <div className="text-4xl font-medium text-center">$80</div>
          </div>
        </div>

        {/* Market Price */}
        <div className="flex flex-col justify-center items-center space-y-4 rounded-2xl border-2 border-white bg-white/50 backdrop-blur-[16.5px] p-4">
          <h3 className="text-xl text-gray-500">Market Price</h3>
          <div>
            <div className="text-4xl font-medium text-center">$100</div>
          </div>
        </div>
      </div>
    </div>
  );
}
