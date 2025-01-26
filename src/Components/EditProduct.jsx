import { useState, useEffect, useRef, useCallback } from "react";
import { Edit, DoorOpen, DoorClosed, ZoomIn, ZoomOut } from "lucide-react";

export default function EditProduct() {
  const [selectedHandle, setSelectedHandle] = useState(1);
  const [selectedFrame, setSelectedFrame] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [handlePosition, setHandlePosition] = useState({ x: 33.33, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [closedHandleX, setClosedHandleX] = useState(33.33);
  const [draggingHandleId, setDraggingHandleId] = useState(null); // Track which handle is being dragged
  const containerRef = useRef(null);

  // Check if handle is at the opposite position (69.66%)
  const isHandleAtOppositePosition =
    handlePosition.x === 69.66 && handlePosition.y === 50;

  useEffect(() => {
    if (isHandleAtOppositePosition) {
      console.log("Handle is at the opposite position (69.66%, 50%)");
      // Add any additional logic you want to trigger here
    }
  }, [handlePosition, isHandleAtOppositePosition]);

  // Handle options
  const handleOptions = [
    {
      id: 1,
      name: "Handle A",
      image: "https://i.ibb.co.com/0c4mrzG/door-handle-svgrepo-com-3.png",
    },
    {
      id: 2,
      name: "Handle B",
      image: "https://i.ibb.co/xqBcyrP/door-handle-svgrepo-com-7.png",
    },
    {
      id: 3,
      name: "Handle C",
      image: "https://i.ibb.co/k0rvGdC/door-handle-svgrepo-com-6.png",
    },
    {
      id: 4,
      name: "Handle D",
      image: "https://i.ibb.co.com/0s7b5N3/door-handle-svgrepo-com-5.png",
    },
  ];

  // Frame options with open/closed images
  const frameOptions = [
    {
      id: 1,
      name: "Frame A",
      closedImage:
        "https://i.ibb.co.com/rZ5BRwy/closed-filled-rectangular-door-2.png",
      openImage:
        "https://i.ibb.co.com/0QgPgW8/open-exit-door-svgrepo-com-7.png",
    },
    {
      id: 2,
      name: "Frame A",
      closedImage:
        "https://i.ibb.co.com/cv0PHtN/closed-filled-rectangular-door-4.png",
      openImage:
        "https://i.ibb.co.com/ssD0DjW/open-exit-door-svgrepo-com-4.png",
    },
    {
      id: 3,
      name: "Frame B",
      closedImage:
        "https://i.ibb.co.com/1fQLrbm/closed-filled-rectangular-door-5.png",
      openImage:
        "https://i.ibb.co.com/Xzzdykn/open-exit-door-svgrepo-com-3.png",
    },
    {
      id: 4,
      name: "Frame C",
      closedImage:
        "https://i.ibb.co.com/VxkCXdZ/closed-filled-rectangular-door-3.png",
      openImage:
        "https://i.ibb.co.com/8xrD9wp/open-exit-door-svgrepo-com-1.png",
    },
  ];

  // Dragging logic
  const handleDragStart = (e, handleId) => {
    if (isOpen) return; // Disable dragging when door is open
    e.preventDefault();
    setIsDragging(true);
    setDraggingHandleId(handleId); // Track which handle is being dragged
  };

  const handleDragMove = useCallback(
    (e) => {
      if (isOpen || !isDragging || !containerRef.current) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const containerRect = containerRef.current.getBoundingClientRect();
      const zoom = zoomLevel;
      const rawX = (clientX - containerRect.left) / zoom;
      const xPercentage = (rawX / containerRect.width) * 100;

      // Constrain to middle third (33.33% to 66.66%)
      const constrainedX = Math.min(Math.max(xPercentage, 33.33), 69.66);

      setClosedHandleX(constrainedX); // Save the closed position
      setHandlePosition({
        x: constrainedX,
        y: 50,
      });
    },
    [isOpen, isDragging, containerRef, zoomLevel]
  );

  const handleDragEnd = useCallback(() => {
    if (draggingHandleId) {
      setSelectedHandle(draggingHandleId); // Set the selected handle after dropping
    }
    setIsDragging(false);
    setDraggingHandleId(null); // Reset dragging handle
  }, [draggingHandleId]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleDragMove);
      window.addEventListener("touchend", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [handleDragEnd, handleDragMove, isDragging]);

  // Toggle door state with position handling
  const toggleOpen = () => {
    setIsOpen((prev) => {
      if (!prev) {
        setHandlePosition({ x: 50.8333, y: 50 }); // Open position
      } else {
        setHandlePosition({ x: closedHandleX, y: 50 }); // Restore closed position
      }
      return !prev;
    });
  };

  // Handle frame selection
  const handleFrameSelection = (frameId) => {
    setSelectedFrame(frameId);
    setIsOpen(false); // Reset to closed state
    setHandlePosition({ x: 33.33, y: 50 }); // Reset handle to original closed position
    setClosedHandleX(33.33); // Reset saved closed position
  };

  // Zoom controls
  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));

  return (
    <div className="p-6 border-2 border-white bg-white/50 backdrop-blur-lg rounded-3xl shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,120px] xl:grid-cols-[1fr,300px] gap-6">
        {/* Left side */}
        <div className="space-y-8">
          {/* Door Container */}
          <div
            ref={containerRef}
            className={`relative bg-gray-100 p-4 sm:p-6 rounded-lg ${
              isOpen ? "border-teal-500" : "border-gray-200"
            } border-4 aspect-[3/4] w-full lg:w-72 h-72 lg:h-96`}
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Door Images */}
            {selectedFrame && (
              <img
                src={
                  isOpen
                    ? frameOptions.find((f) => f.id === selectedFrame).openImage
                    : frameOptions.find((f) => f.id === selectedFrame)
                        .closedImage
                }
                alt="Door"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />
            )}

            {/* Handle */}
            {selectedHandle && (
              <img
                src={handleOptions.find((h) => h.id === selectedHandle).image}
                alt="Handle"
                className={`absolute w-12 h-12 sm:w-14 sm:h-14 object-contain transition-all ${
                  isOpen ? "" : "cursor-move touch-pan-y"
                }`}
                style={{
                  left: `${handlePosition.x}%`,
                  top: `${handlePosition.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseDown={(e) => handleDragStart(e, selectedHandle)}
                onTouchStart={(e) => handleDragStart(e, selectedHandle)}
              />
            )}
          </div>

          {/* Handle Selection */}
          <div className="space-y-2 rounded-2xl border-2 border-white bg-white/50 backdrop-blur-lg p-6 shadow-sm">
            <div className="text-xl font-medium">Handle:</div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {handleOptions.map((handle) => (
                <div
                  key={handle.id}
                  onMouseDown={(e) => handleDragStart(e, handle.id)}
                  onTouchStart={(e) => handleDragStart(e, handle.id)}
                  className={`w-12 h-12 rounded-lg border-2 flex-shrink-0 ${
                    selectedHandle === handle.id
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 bg-gray-100"
                  }`}
                >
                  <img
                    src={handle.image}
                    alt={handle.name}
                    className="w-full h-full object-cover rounded-md pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Frame Selection */}
          <div className="space-y-2 rounded-2xl border-2 border-white bg-white/50 backdrop-blur-lg p-6 shadow-sm">
            <div className="text-xl font-medium">Frames:</div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {frameOptions.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => handleFrameSelection(frame.id)}
                  className={`w-16 h-16 rounded-lg border-2 flex-shrink-0 ${
                    selectedFrame === frame.id
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 bg-gray-100"
                  }`}
                >
                  <img
                    src={frame.closedImage}
                    alt={frame.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Controls */}
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
            disabled={!selectedFrame}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
        <div className="flex flex-col justify-center items-center space-y-4 rounded-2xl border-2 border-white bg-white/50 backdrop-blur-lg p-4">
          <h3 className="text-xl text-gray-500">Ingredient</h3>
          <div className="space-y-2 w-full">
            <div className="flex items-center gap-2 p-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span>1×1m Contains</span>
            </div>
            <div className="flex items-center gap-2 p-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span>4m of frame</span>
            </div>
            <div className="flex items-center gap-2 p-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span>1m² of glass</span>
            </div>
            <div className="flex items-center gap-2 p-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span>1 set of hardware</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center space-y-4 rounded-2xl border-2 border-white bg-white/50 backdrop-blur-lg p-4">
          <h3 className="text-xl text-gray-500">Working Hour</h3>
          <div className="text-4xl font-medium">05</div>
        </div>
        <div className="flex flex-col justify-center items-center space-y-4 rounded-2xl border-2 border-white bg-white/50 backdrop-blur-lg p-4">
          <h3 className="text-xl text-gray-500">Wholesale Price</h3>
          <div className="text-4xl font-medium">$80</div>
        </div>
        <div className="flex flex-col justify-center items-center space-y-4 rounded-2xl border-2 border-white bg-white/50 backdrop-blur-lg p-4">
          <h3 className="text-xl text-gray-500">Market Price</h3>
          <div className="text-4xl font-medium">$100</div>
        </div>
      </div>
    </div>
  );
}
