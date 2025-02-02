import { useState, useEffect, useRef, useCallback } from "react";
import { Edit, DoorOpen, DoorClosed, ZoomIn, ZoomOut } from "lucide-react";

export default function EditProduct() {
  // ---------------------------------------------------------------------------
  // 1. Monitor Window Width
  // ---------------------------------------------------------------------------
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---------------------------------------------------------------------------
  // 2. State Variables
  // ---------------------------------------------------------------------------
  const [selectedHandle, setSelectedHandle] = useState(1);
  const [selectedFrame, setSelectedFrame] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const [handlePosition, setHandlePosition] = useState({ x: 33.33, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [closedHandleX, setClosedHandleX] = useState(33.33);

  const [handleSize, setHandleSize] = useState({ width: 48, height: 48 });
  const [isResizingMode, setIsResizingMode] = useState(false);
  const [resizingStartCoords, setResizingStartCoords] = useState(null);
  const [resizedSize, setResizedSize] = useState(null);

  const [resizeCorner, setResizeCorner] = useState(null); // Tracks which corner is being resized

  const containerRef = useRef(null);
  const [isHandleFixed, setIsHandleFixed] = useState(false);

  // ---------------------------------------------------------------------------
  // 3. Handle & Frame Data
  // ---------------------------------------------------------------------------
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
      name: "Frame B",
      closedImage:
        "https://i.ibb.co.com/cv0PHtN/closed-filled-rectangular-door-4.png",
      openImage:
        "https://i.ibb.co.com/ssD0DjW/open-exit-door-svgrepo-com-4.png",
    },
    {
      id: 3,
      name: "Frame C",
      closedImage:
        "https://i.ibb.co.com/1fQLrbm/closed-filled-rectangular-door-5.png",
      openImage:
        "https://i.ibb.co.com/Xzzdykn/open-exit-door-svgrepo-com-3.png",
    },
  ];

  // ---------------------------------------------------------------------------
  // 4. Drag Logic
  // ---------------------------------------------------------------------------
  const handleDragStart = useCallback(
    (e) => {
      if (isHandleFixed || isOpen || isResizingMode) return;
      e.preventDefault();
      setIsDragging(true);
    },
    [isHandleFixed, isOpen, isResizingMode]
  );

  const handleDragMove = useCallback(
    (e) => {
      if (
        !isDragging ||
        !containerRef.current ||
        isHandleFixed ||
        isResizingMode ||
        isOpen
      ) {
        return;
      }
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const containerRect = containerRef.current.getBoundingClientRect();
      const zoom = zoomLevel;

      const rawX = (clientX - containerRect.left) / zoom;
      const rawY = (clientY - containerRect.top) / zoom;

      const xPercentage = (rawX / containerRect.width) * 100;
      const yPercentage = (rawY / containerRect.height) * 100;

      const constrainedX = Math.min(Math.max(xPercentage, 0), 100);
      const constrainedY = Math.min(Math.max(yPercentage, 0), 100);

      setClosedHandleX(constrainedX);
      setHandlePosition({ x: constrainedX, y: constrainedY });
    },
    [isDragging, containerRef, isHandleFixed, isResizingMode, isOpen, zoomLevel]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // ---------------------------------------------------------------------------
  // 5. Corner-Based Resize Logic
  // ---------------------------------------------------------------------------
  const handleResizeStart = useCallback(
    (corner, e) => {
      if (isHandleFixed) return;
      e.preventDefault();
      e.stopPropagation();

      setIsResizingMode(true);
      setResizeCorner(corner);

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      setResizingStartCoords({
        x: clientX,
        y: clientY,
        initialWidth: handleSize.width,
        initialHeight: handleSize.height,
        initialX: handlePosition.x,
        initialY: handlePosition.y,
      });
    },
    [handleSize, handlePosition, isHandleFixed]
  );

  const handleResizeMove = useCallback(
    (e) => {
      if (!isResizingMode || !resizingStartCoords || !containerRef.current) {
        return;
      }

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const zoom = zoomLevel;

      const deltaX = (clientX - resizingStartCoords.x) / zoom;
      const deltaY = (clientY - resizingStartCoords.y) / zoom;

      let newWidth, newHeight, newX, newY;

      switch (resizeCorner) {
        case "top-left":
          newWidth = Math.max(resizingStartCoords.initialWidth - deltaX, 24);
          newHeight = Math.max(resizingStartCoords.initialHeight - deltaY, 24);
          newX =
            resizingStartCoords.initialX +
            (deltaX / containerRef.current.offsetWidth) * 100;
          newY =
            resizingStartCoords.initialY +
            (deltaY / containerRef.current.offsetHeight) * 100;
          break;

        case "top-right":
          newWidth = Math.max(resizingStartCoords.initialWidth + deltaX, 24);
          newHeight = Math.max(resizingStartCoords.initialHeight - deltaY, 24);
          newY =
            resizingStartCoords.initialY +
            (deltaY / containerRef.current.offsetHeight) * 100;
          break;

        case "bottom-left":
          newWidth = Math.max(resizingStartCoords.initialWidth - deltaX, 24);
          newHeight = Math.max(resizingStartCoords.initialHeight + deltaY, 24);
          newX =
            resizingStartCoords.initialX +
            (deltaX / containerRef.current.offsetWidth) * 100;
          break;

        case "bottom-right":
          newWidth = Math.max(resizingStartCoords.initialWidth + deltaX, 24);
          newHeight = Math.max(resizingStartCoords.initialHeight + deltaY, 24);
          break;

        default:
          return;
      }

      setResizedSize({ width: newWidth, height: newHeight });
      setHandlePosition({
        x: newX ?? handlePosition.x,
        y: newY ?? handlePosition.y,
      });
    },
    [
      isResizingMode,
      resizingStartCoords,
      containerRef,
      zoomLevel,
      resizeCorner,
      handlePosition,
    ]
  );

  const confirmResize = useCallback(() => {
    if (resizedSize) {
      setHandleSize(resizedSize);
      setIsResizingMode(false);
      setResizingStartCoords(null);
      setResizedSize(null);
      setResizeCorner(null);
    }
  }, [resizedSize]);

  // ---------------------------------------------------------------------------
  // 6. Event Listeners
  // ---------------------------------------------------------------------------
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
  }, [isDragging, handleDragMove, handleDragEnd]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === "Enter" || e.key === " ") && isResizingMode) {
        confirmResize();
      }
      if (e.key === "Escape" && isResizingMode) {
        setIsResizingMode(false);
        setResizingStartCoords(null);
        setResizedSize(null);
        setResizeCorner(null);
      }
    };

    const handleMouseUp = (e) => {
      if (e.button === 0 && isResizingMode) {
        confirmResize();
      }
    };

    if (isResizingMode) {
      window.addEventListener("mousemove", handleResizeMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("touchmove", handleResizeMove);
    }
    return () => {
      window.removeEventListener("mousemove", handleResizeMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchmove", handleResizeMove);
    };
  }, [isResizingMode, handleResizeMove, confirmResize]);

  // ---------------------------------------------------------------------------
  // 7. Door Controls
  // ---------------------------------------------------------------------------
  const toggleOpen = () => {
    setIsOpen((prev) => {
      if (!prev) {
        setHandlePosition({ x: 50.8333, y: 50 });
      } else {
        setHandlePosition({ x: closedHandleX, y: 50 });
      }
      return !prev;
    });
  };

  const handleFrameSelection = (frameId) => {
    setSelectedFrame(frameId);
    setIsOpen(false);
    setHandlePosition({ x: 33.33, y: 50 });
    setClosedHandleX(33.33);
    setHandleSize({ width: 48, height: 48 });
  };

  const handleHandleSelection = (handleId) => {
    setSelectedHandle(handleId);
    setHandleSize({ width: 48, height: 48 });
  };

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));

  const fixHandlePosition = () => {
    setIsHandleFixed((prev) => {
      if (!prev) {
        setIsResizingMode(false);
      }
      return !prev;
    });
  };

  // ---------------------------------------------------------------------------
  // 8. Final Render
  // ---------------------------------------------------------------------------
  const getHandleStyle = () => {
    return {
      left: `${handlePosition.x}%`,
      top: `${handlePosition.y}%`,
      transform: "translate(-50%, -50%)",
      width: `${
        isResizingMode && resizedSize ? resizedSize.width : handleSize.width
      }px`,
      height: `${
        isResizingMode && resizedSize ? resizedSize.height : handleSize.height
      }px`,
    };
  };

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
            {/* Door Image */}
            {selectedFrame && (
              <>
                {/* Closed Door Image */}
                <img
                  src={
                    frameOptions.find((f) => f.id === selectedFrame)
                      ?.closedImage
                  }
                  alt="Door (Closed)"
                  className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-500 ease-in-out ${
                    isOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                {/* Open Door Image */}
                <img
                  src={
                    frameOptions.find((f) => f.id === selectedFrame)?.openImage
                  }
                  alt="Door (Open)"
                  className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-500 ease-in-out ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                />
              </>
            )}
            {/* Handle */}
            {selectedHandle && (
              <div
                className={`absolute transition-all ${
                  isOpen || isHandleFixed ? "" : "cursor-move touch-pan-y"
                }`}
                style={getHandleStyle()}
              >
                {/* Handle Image */}
                <img
                  src={handleOptions.find((h) => h.id === selectedHandle).image}
                  alt="Handle"
                  className="w-full h-full object-contain"
                  onMouseDown={handleDragStart}
                  onTouchStart={handleDragStart}
                />
                {/* Resize Handles */}
                {!isHandleFixed && (
                  <>
                    {/* Top-left Corner */}
                    <div
                      className="absolute top-0 left-0 w-1 h-1 bg-white rounded-full cursor-nw-resize hover:bg-gray-200 transition-colors"
                      onMouseDown={(e) => handleResizeStart("top-left", e)}
                      onTouchStart={(e) => handleResizeStart("top-left", e)}
                    />
                    {/* Top-right Corner */}
                    <div
                      className="absolute top-0 right-0 w-1 h-1 bg-white rounded-full cursor-ne-resize hover:bg-gray-200 transition-colors"
                      onMouseDown={(e) => handleResizeStart("top-right", e)}
                      onTouchStart={(e) => handleResizeStart("top-right", e)}
                    />
                    {/* Bottom-left Corner */}
                    <div
                      className="absolute bottom-0 left-0 w-1 h-1 bg-white rounded-full cursor-sw-resize hover:bg-gray-200 transition-colors"
                      onMouseDown={(e) => handleResizeStart("bottom-left", e)}
                      onTouchStart={(e) => handleResizeStart("bottom-left", e)}
                    />
                    {/* Bottom-right Corner */}
                    <div
                      className="absolute bottom-0 right-0 w-1 h-1 bg-white rounded-full cursor-se-resize hover:bg-gray-200 transition-colors"
                      onMouseDown={(e) => handleResizeStart("bottom-right", e)}
                      onTouchStart={(e) => handleResizeStart("bottom-right", e)}
                    />
                  </>
                )}
                {/* Instructions during active resize */}
                {isResizingMode && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    Press Enter/Space to confirm, Escape to cancel
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Fix Handle Button */}
          <button
            onClick={fixHandlePosition}
            className={`px-4 py-2 rounded-lg ${
              isHandleFixed ? "bg-red-500" : "bg-teal-500"
            } text-white transition-colors`}
          >
            {isHandleFixed ? "Enable Handle Editing" : "Lock Handle Position"}
          </button>
          {/* Handle Selection */}
          <div className="space-y-2 rounded-2xl border-2 border-white bg-white/50 backdrop-blur-lg p-6 shadow-sm">
            <div className="text-xl font-medium">Handle:</div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {handleOptions.map((handle) => (
                <div
                  key={handle.id}
                  onClick={() => handleHandleSelection(handle.id)}
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
