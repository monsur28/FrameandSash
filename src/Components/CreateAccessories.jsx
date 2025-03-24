/* eslint-disable no-unused-vars */
import { useState, useRef, useCallback, useEffect } from "react";

export default function CreateAccessories({ windowsData, onPrev, onNext }) {
  const { images = [], ingredients = [] } = windowsData;
  const containerRefs = useRef([]); // Array of refs for each image container

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const [isDragging, setIsDragging] = useState(false);
  const [isResizingMode, setIsResizingMode] = useState(false);
  const [isHandleFixed, setIsHandleFixed] = useState(false);
  const [resizingStartCoords, setResizingStartCoords] = useState(null);
  const [resizedSize, setResizedSize] = useState(null);
  const [resizeCorner, setResizeCorner] = useState(null);
  const [zoomLevel] = useState(1);

  const [selectedHandleId, setSelectedHandleId] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState({});
  const [tempImages, setTempImages] = useState({});
  const [savedImages, setSavedImages] = useState({});

  const [activeHandles, setActiveHandles] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const bringHandleToFront = useCallback((imageIndex, handleId) => {
    setActiveHandles((prev) => {
      const maxZ = Math.max(
        0,
        ...Object.values(prev[imageIndex] || {}).map((h) => h.zIndex || 0)
      );
      const updated = {
        ...prev[imageIndex],
        [handleId]: { ...prev[imageIndex][handleId], zIndex: maxZ + 1 },
      };
      return { ...prev, [imageIndex]: updated };
    });
  }, []);

  const handleSelect = useCallback(
    (imageIndex, handleId) => {
      setSelectedHandleId(handleId);
      bringHandleToFront(imageIndex, handleId);
    },
    [bringHandleToFront]
  );

  const handleDragStart = useCallback(
    (imageIndex, handleId, e) => {
      if (isHandleFixed || isResizingMode) return;
      e.preventDefault();
      setIsDragging(true);
      setCurrentImageIndex(imageIndex);
      handleSelect(imageIndex, handleId);
    },
    [isHandleFixed, isResizingMode, handleSelect]
  );

  const handleDragMove = useCallback(
    (e) => {
      if (!isDragging || currentImageIndex === null || !selectedHandleId)
        return;

      const containerRef = containerRefs.current[currentImageIndex];
      if (!containerRef) return;

      const rect = containerRef.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const xPct = Math.min(
        Math.max(((clientX - rect.left) / rect.width) * 100, 0),
        100
      );
      const yPct = Math.min(
        Math.max(((clientY - rect.top) / rect.height) * 100, 0),
        100
      );

      setActiveHandles((prev) => ({
        ...prev,
        [currentImageIndex]: {
          ...prev[currentImageIndex],
          [selectedHandleId]: {
            ...prev[currentImageIndex][selectedHandleId],
            position: { x: xPct, y: yPct },
          },
        },
      }));
    },
    [isDragging, currentImageIndex, selectedHandleId]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setCurrentImageIndex(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleDragMove, { passive: false });
      window.addEventListener("touchend", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const handleResizeStart = useCallback(
    (imageIndex, corner, e) => {
      if (isHandleFixed) return;
      e.preventDefault();
      e.stopPropagation();

      setIsResizingMode(true);
      setResizeCorner(corner);

      const containerRef = containerRefs.current[imageIndex];
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const current = selectedHandleId
        ? activeHandles[imageIndex][selectedHandleId]
        : null;
      if (!current) return;

      setResizingStartCoords({
        x: clientX,
        y: clientY,
        initialWidth: current.size.width,
        initialHeight: current.size.height,
        initialX: current.position.x,
        initialY: current.position.y,
      });

      handleSelect(imageIndex, selectedHandleId);
    },
    [isHandleFixed, selectedHandleId, activeHandles, handleSelect]
  );

  const handleResizeMove = useCallback(
    (e) => {
      if (
        !isResizingMode ||
        !resizingStartCoords ||
        currentImageIndex === null
      ) {
        return;
      }
      const containerRef = containerRefs.current[currentImageIndex];
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
            (deltaX / containerRef.offsetWidth) * 100;
          newY =
            resizingStartCoords.initialY +
            (deltaY / containerRef.offsetHeight) * 100;
          break;

        case "top-right":
          newWidth = Math.max(resizingStartCoords.initialWidth + deltaX, 24);
          newHeight = Math.max(resizingStartCoords.initialHeight - deltaY, 24);
          newY =
            resizingStartCoords.initialY +
            (deltaY / containerRef.offsetHeight) * 100;
          break;

        case "bottom-left":
          newWidth = Math.max(resizingStartCoords.initialWidth - deltaX, 24);
          newHeight = Math.max(resizingStartCoords.initialHeight + deltaY, 24);
          newX =
            resizingStartCoords.initialX +
            (deltaX / containerRef.offsetWidth) * 100;
          break;

        case "bottom-right":
          newWidth = Math.max(resizingStartCoords.initialWidth + deltaX, 24);
          newHeight = Math.max(resizingStartCoords.initialHeight + deltaY, 24);
          break;

        default:
          return;
      }

      setResizedSize({ width: newWidth, height: newHeight });

      setActiveHandles((prev) => ({
        ...prev,
        [currentImageIndex]: {
          ...prev[currentImageIndex],
          [selectedHandleId]: {
            ...prev[currentImageIndex][selectedHandleId],
            position: {
              x: newX ?? prev[currentImageIndex][selectedHandleId].position.x,
              y: newY ?? prev[currentImageIndex][selectedHandleId].position.y,
            },
          },
        },
      }));
    },
    [
      isResizingMode,
      resizingStartCoords,
      containerRefs,
      zoomLevel,
      resizeCorner,
      currentImageIndex,
      selectedHandleId,
    ]
  );

  const confirmResize = useCallback(() => {
    if (resizedSize && currentImageIndex !== null && selectedHandleId) {
      setActiveHandles((prev) => ({
        ...prev,
        [currentImageIndex]: {
          ...prev[currentImageIndex],
          [selectedHandleId]: {
            ...prev[currentImageIndex][selectedHandleId],
            size: resizedSize,
          },
        },
      }));
      setIsResizingMode(false);
      setResizingStartCoords(null);
      setResizedSize(null);
      setResizeCorner(null);
    }
  }, [resizedSize, currentImageIndex, selectedHandleId]);

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

  const fixHandlePosition = () => {
    setIsHandleFixed((prev) => {
      if (!prev) {
        setIsResizingMode(false);
      }
      return !prev;
    });
  };

  const handleOpenForm = (idx) => {
    setIsFormOpen((prev) => ({ ...prev, [idx]: true }));
  };

  const handleCloseForm = (idx) => {
    setIsFormOpen((prev) => ({ ...prev, [idx]: false }));
    setTempImages((prev) => ({ ...prev, [idx]: [] }));
  };

  const handleImageUpload = (idx, e) => {
    const newFiles = Array.from(e.target.files);
    const fileObjects = newFiles.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file,
    }));

    setTempImages((prev) => {
      const existing = prev[idx] || [];
      return { ...prev, [idx]: [...existing, ...fileObjects] };
    });
  };

  const handleSave = (idx) => {
    const handleId = `handle-${Date.now()}-${Math.random()}`;

    const updatedHandles = images.reduce(
      (acc, _, imageIndex) => {
        const highestZ =
          Math.max(
            0,
            ...Object.values(acc[imageIndex] || {}).map((h) => h.zIndex || 0)
          ) + 1;

        acc[imageIndex] = {
          ...acc[imageIndex],
          [handleId]: {
            position: { x: 50, y: 50 },
            size: { width: 48, height: 48 },
            image: tempImages[idx]?.[0] || null,
            imageIndex: idx,
            zIndex: highestZ,
          },
        };
        return acc;
      },
      { ...activeHandles }
    );

    setActiveHandles(updatedHandles);

    setSavedImages((prev) => {
      const existing = prev[idx] || [];
      const newlyUploaded = tempImages[idx] || [];
      return { ...prev, [idx]: [...existing, ...newlyUploaded] };
    });

    handleCloseForm(idx);
  };

  const handleActivateHandle = (handleObj, ingredientIndex) => {
    setActiveHandles((prev) => {
      const updated = { ...prev };
      images.forEach((_, imgIdx) => {
        updated[imgIdx] = updated[imgIdx] || {};

        // Remove existing handle for this ingredient from all images
        Object.entries(updated[imgIdx]).forEach(([id, handle]) => {
          if (handle.imageIndex === ingredientIndex) {
            delete updated[imgIdx][id];
          }
        });

        const highestZ =
          Math.max(
            0,
            ...Object.values(updated[imgIdx]).map((h) => h.zIndex || 0)
          ) + 1;

        const newHandleId = `handle-${Date.now()}-${Math.random()}`;

        updated[imgIdx][newHandleId] = {
          position: { x: 50, y: 50 },
          size: { width: 48, height: 48 },
          image: handleObj,
          imageIndex: ingredientIndex,
          zIndex: highestZ,
        };
      });

      return updated;
    });
  };

  const handleNext = () => {
    const updatedWindowsData = {
      ...windowsData,
      images: images.map((img, idx) => ({
        ...img,
        handles: Object.entries(activeHandles[idx] || {}).map(
          ([id, handle]) => ({
            id,
            position: handle.position,
            size: handle.size,
            image: handle.image,
            ingredientIndex: handle.imageIndex,
          })
        ),
      })),
      ingredients: ingredients.map((ingredient, idx) => ({
        ...ingredient,
        handles: savedImages[idx] || [],
      })),
    };

    onNext(updatedWindowsData);
  };

  return (
    <div className="p-4">
      <div className="flex gap-4 justify-center items-center p-2">
        {images.map((img, idx) => (
          <div
            key={`${img.id}-${idx}`}
            ref={(el) => (containerRefs.current[idx] = el)}
            className="relative w-48 h-48 border rounded bg-gray-100"
            style={{ touchAction: "none" }}
          >
            <img
              src={img.url}
              alt={`Image #${idx + 1}`}
              className="w-full h-full object-cover"
            />

            {Object.entries(activeHandles[idx] || {}).map(
              ([handleId, handle]) => (
                <div
                  key={handleId}
                  className={`absolute transition-all ${
                    isHandleFixed ? "" : "cursor-pointer touch-pan-y"
                  }`}
                  style={{
                    left: `${handle.position.x}%`,
                    top: `${handle.position.y}%`,
                    transform: "translate(-50%, -50%)",
                    width: `${handle.size.width}px`,
                    height: `${handle.size.height}px`,
                    zIndex: handle.zIndex || 1,
                    outline:
                      selectedHandleId === handleId
                        ? "2px solid rgba(0, 200, 255, 0.8)"
                        : "none",
                  }}
                  onMouseDown={(e) => handleDragStart(idx, handleId, e)}
                  onTouchStart={(e) => handleDragStart(idx, handleId, e)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isDragging) {
                      handleSelect(idx, handleId);
                    }
                  }}
                >
                  {handle.image && (
                    <img
                      src={handle.image.url}
                      alt="Handle"
                      className="w-full h-full object-contain"
                    />
                  )}

                  {!isHandleFixed && selectedHandleId === handleId && (
                    <>
                      <div
                        className="absolute top-0 left-0 w-1 h-1 bg-white rounded-full cursor-nw-resize hover:bg-gray-300 transition-colors"
                        onMouseDown={(e) =>
                          handleResizeStart(idx, "top-left", e)
                        }
                        onTouchStart={(e) =>
                          handleResizeStart(idx, "top-left", e)
                        }
                      />
                      <div
                        className="absolute top-0 right-0 w-1 h-1 bg-white rounded-full cursor-ne-resize hover:bg-gray-300 transition-colors"
                        onMouseDown={(e) =>
                          handleResizeStart(idx, "top-right", e)
                        }
                        onTouchStart={(e) =>
                          handleResizeStart(idx, "top-right", e)
                        }
                      />
                      <div
                        className="absolute bottom-0 left-0 w-1 h-1 bg-white rounded-full cursor-sw-resize hover:bg-gray-300 transition-colors"
                        onMouseDown={(e) =>
                          handleResizeStart(idx, "bottom-left", e)
                        }
                        onTouchStart={(e) =>
                          handleResizeStart(idx, "bottom-left", e)
                        }
                      />
                      <div
                        className="absolute bottom-0 right-0 w-1 h-1 bg-white rounded-full cursor-se-resize hover:bg-gray-300 transition-colors"
                        onMouseDown={(e) =>
                          handleResizeStart(idx, "bottom-right", e)
                        }
                        onTouchStart={(e) =>
                          handleResizeStart(idx, "bottom-right", e)
                        }
                      />
                    </>
                  )}

                  {isResizingMode &&
                    currentImageIndex === idx &&
                    selectedHandleId === handleId && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        Press Enter/Space to confirm, Escape to cancel
                      </div>
                    )}
                </div>
              )
            )}
          </div>
        ))}
      </div>

      {ingredients.map((ingredient, idx) => {
        const openForm = isFormOpen[idx] || false;
        const currentTemp = tempImages[idx] || [];

        return (
          <div
            key={idx}
            className="mt-6 p-4 border rounded-md bg-white shadow-sm"
          >
            <button
              onClick={fixHandlePosition}
              className={`px-4 py-2 rounded-lg ${
                isHandleFixed ? "bg-red-500" : "bg-teal-500"
              } text-white transition-colors`}
            >
              {isHandleFixed ? "Enable Handle Editing" : "Lock Handle Position"}
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">
                  {ingredient.name || `Accessory #${idx + 1}`}
                </h2>

                <div className="flex items-center gap-2">
                  {(savedImages[idx] || []).map((imgObj) => (
                    <img
                      key={imgObj.id}
                      src={imgObj.url}
                      alt="Saved Handle"
                      className="w-12 h-12 object-cover border rounded cursor-pointer"
                      onClick={() => handleActivateHandle(imgObj, idx)}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleOpenForm(idx)}
                className="mt-3 sm:mt-0 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
              >
                + Add {ingredient.name || "Item"}
              </button>
            </div>

            {openForm && (
              <div className="mt-4 p-4 border rounded-md bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Accessories Title
                    </label>
                    <input
                      type="text"
                      className="border p-2 w-full rounded-md"
                      defaultValue={ingredient.name || ""}
                      placeholder="e.g. Handle or Frame"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Minimum Size &amp; Unit
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="border p-2 w-20 rounded-md"
                        placeholder="1"
                        defaultValue={ingredient.minSize || ""}
                      />
                      <select
                        className="border p-2 rounded-md"
                        defaultValue={ingredient.unit || "cm"}
                      >
                        <option value="cm">cm</option>
                        <option value="inch">inch</option>
                        <option value="m">m</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Upload Image<span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 items-center">
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById(`fileinput-${idx}`)?.click()
                        }
                        className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
                      >
                        Choose File
                      </button>
                      <span className="text-gray-600">
                        {currentTemp.length} File(s) Added
                      </span>
                      <input
                        id={`fileinput-${idx}`}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(idx, e)}
                      />
                    </div>
                    {currentTemp.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {currentTemp.map((imgObj) => (
                          <div
                            key={imgObj.id}
                            className="w-16 h-16 border rounded relative"
                          >
                            <img
                              src={imgObj.url}
                              alt="Temp"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Color Family
                    </label>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-black border rounded cursor-pointer" />
                      <div className="w-6 h-6 bg-green-700 border rounded cursor-pointer" />
                      <div className="w-6 h-6 bg-white border rounded cursor-pointer" />
                      <div className="w-6 h-6 bg-red-600 border rounded cursor-pointer" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Manufacturing Cost
                    </label>
                    <input
                      type="number"
                      className="border p-2 w-full rounded-md"
                      placeholder="$250"
                      defaultValue={ingredient.manufacturingCost || ""}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Wholesale
                    </label>
                    <input
                      type="number"
                      className="border p-2 w-full rounded-md"
                      placeholder="$100"
                      defaultValue={ingredient.wholesale || ""}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Market Price
                    </label>
                    <input
                      type="number"
                      className="border p-2 w-full rounded-md"
                      placeholder="$120"
                      defaultValue={ingredient.marketPrice || ""}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => handleCloseForm(idx)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave(idx)}
                    className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="flex justify-end space-x-4 mt-4">
        <button
          onClick={onPrev}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-teal-500 text-white rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
}
