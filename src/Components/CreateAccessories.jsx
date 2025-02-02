import { useState, useRef, useCallback, useEffect, memo } from "react";
import PropTypes from "prop-types";

const ResizeHandles = memo(function ResizeHandles({
  onResizeStart,
  handleId,
  disabled,
}) {
  if (disabled) return null;

  return (
    <>
      {["top-left", "top-right", "bottom-left", "bottom-right"].map(
        (corner) => (
          <div
            key={corner}
            role="button"
            tabIndex={0}
            aria-label={`Resize handle ${corner}`}
            className={`absolute w-4 h-4 bg-white border rounded-full cursor-${corner}-resize 
            hover:bg-gray-200 transition-colors`}
            style={{
              [corner.split("-")[0]]: "-2px",
              [corner.split("-")[1]]: "-2px",
            }}
            onMouseDown={(e) => onResizeStart(corner, e, handleId)}
            onTouchStart={(e) => onResizeStart(corner, e, handleId)}
          />
        )
      )}
    </>
  );
});

const AccessoryForm = memo(function AccessoryForm({
  ingredient,
  onSubmit,
  onCancel,
  initialData,
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || ingredient.name || "",
    minSize: initialData?.minSize || ingredient.minSize || "",
    unit: initialData?.unit || ingredient.unit || "cm",
    manufacturingCost:
      initialData?.manufacturingCost || ingredient.manufacturingCost || "",
    wholesale: initialData?.wholesale || ingredient.wholesale || "",
    marketPrice: initialData?.marketPrice || ingredient.marketPrice || "",
  });

  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!imageFile && !initialData?.imageUrl)
      newErrors.image = "Image is required";
    if (!formData.minSize) newErrors.minSize = "Minimum size is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      onSubmit({ ...formData, image: imageFile });
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 p-4 border rounded-md bg-gray-50"
    >
      <div>
        <label className="block text-sm font-semibold mb-1">
          Accessories Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="border p-2 w-full rounded-md"
          placeholder="e.g. Handle or Frame"
        />
        {errors.title && <span className="text-red-500">{errors.title}</span>}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">
          Minimum Size &amp; Unit
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={formData.minSize}
            onChange={(e) =>
              setFormData({ ...formData, minSize: e.target.value })
            }
            className="border p-2 w-20 rounded-md"
            placeholder="1"
          />
          <select
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="border p-2 rounded-md"
          >
            <option value="cm">cm</option>
            <option value="inch">inch</option>
            <option value="m">m</option>
          </select>
        </div>
        {errors.minSize && (
          <span className="text-red-500">{errors.minSize}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">
          Upload Image<span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() =>
              document.getElementById(`fileinput-${ingredient.name}`)?.click()
            }
            className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
          >
            Choose File
          </button>
          <input
            id={`fileinput-${ingredient.name}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
        {errors.image && <span className="text-red-500">{errors.image}</span>}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">
          Manufacturing Cost
        </label>
        <input
          type="number"
          value={formData.manufacturingCost}
          onChange={(e) =>
            setFormData({ ...formData, manufacturingCost: e.target.value })
          }
          className="border p-2 w-full rounded-md"
          placeholder="$250"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Wholesale</label>
        <input
          type="number"
          value={formData.wholesale}
          onChange={(e) =>
            setFormData({ ...formData, wholesale: e.target.value })
          }
          className="border p-2 w-full rounded-md"
          placeholder="$100"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Market Price</label>
        <input
          type="number"
          value={formData.marketPrice}
          onChange={(e) =>
            setFormData({ ...formData, marketPrice: e.target.value })
          }
          className="border p-2 w-full rounded-md"
          placeholder="$120"
        />
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
        >
          Save
        </button>
      </div>
    </form>
  );
});

const CreateAccessories = ({ windowsData, onPrev, onNext }) => {
  const { images = [], ingredients = [] } = windowsData;
  const containerRef = useRef(null);

  const [handleOptions, setHandleOptions] = useState([]);
  const [selectedHandle, setSelectedHandle] = useState(null);
  const [activeHandles, setActiveHandles] = useState({});
  const [isFormOpen, setIsFormOpen] = useState({});
  const [dragState, setDragState] = useState({
    isDragging: false,
    isResizing: false,
    currentId: null,
    isFixed: false,
  });

  const handleFormSubmit = useCallback((idx, formData) => {
    const handleId = `handle-${Date.now()}`;
    const imageUrl = formData.image
      ? URL.createObjectURL(formData.image)
      : null;

    const newHandle = {
      id: handleId,
      name: formData.title,
      image: imageUrl,
      data: formData,
      ingredientIndex: idx,
    };

    setHandleOptions((prev) => [...prev, newHandle]);

    setActiveHandles((prev) => ({
      ...prev,
      [handleId]: {
        position: { x: 50, y: 50 },
        size: { width: 48, height: 48 },
        ...newHandle,
      },
    }));

    setIsFormOpen((prev) => ({ ...prev, [idx]: false }));
  }, []);

  const handleDragStart = useCallback(
    (handleId, e) => {
      if (dragState.isFixed) return;
      e.preventDefault();
      setDragState((prev) => ({
        ...prev,
        isDragging: true,
        currentId: handleId,
      }));
    },
    [dragState.isFixed]
  );

  const handleDragMove = useCallback(
    (e) => {
      if (!dragState.isDragging || !containerRef.current) return;

      requestAnimationFrame(() => {
        const rect = containerRef.current.getBoundingClientRect();
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
          [dragState.currentId]: {
            ...prev[dragState.currentId],
            position: { x: xPct, y: yPct },
          },
        }));
      });
    },
    [dragState.isDragging, dragState.currentId]
  );

  const handleDragEnd = useCallback(() => {
    setDragState((prev) => ({
      ...prev,
      isDragging: false,
      currentId: null,
    }));
  }, []);

  useEffect(() => {
    if (dragState.isDragging) {
      window.addEventListener("mousemove", handleDragMove, { passive: true });
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleDragMove, { passive: false });
      window.addEventListener("touchend", handleDragEnd);

      return () => {
        window.removeEventListener("mousemove", handleDragMove);
        window.removeEventListener("mouseup", handleDragEnd);
        window.removeEventListener("touchmove", handleDragMove);
        window.removeEventListener("touchend", handleDragEnd);
      };
    }
  }, [dragState.isDragging, handleDragMove, handleDragEnd]);

  const handleResizeStart = useCallback(
    (corner, e, handleId) => {
      if (dragState.isFixed) return;
      e.preventDefault();
      e.stopPropagation();

      setDragState((prev) => ({
        ...prev,
        isResizing: true,
        currentId: handleId,
      }));
    },
    [dragState.isFixed]
  );

  return (
    <div className="p-4">
      <div
        ref={containerRef}
        className="relative border rounded-md bg-gray-100 min-h-[300px]"
      >
        {Object.entries(activeHandles).map(([handleId, handle]) => (
          <div
            key={handleId}
            className={`absolute transition-all ${
              dragState.isFixed ? "" : "cursor-move"
            }`}
            style={{
              left: `${handle.position.x}%`,
              top: `${handle.position.y}%`,
              transform: "translate(-50%, -50%)",
              width: `${handle.size.width}px`,
              height: `${handle.size.height}px`,
            }}
            onMouseDown={(e) => handleDragStart(handleId, e)}
            onTouchStart={(e) => handleDragStart(handleId, e)}
          >
            <img
              src={handle.image}
              alt={handle.name}
              className="w-full h-full object-contain"
            />
            <ResizeHandles
              onResizeStart={handleResizeStart}
              handleId={handleId}
              disabled={dragState.isFixed}
            />
          </div>
        ))}
      </div>

      {ingredients.map((ingredient, idx) => (
        <div key={idx} className="mt-6 border rounded-md p-4">
          <button
            onClick={() =>
              setIsFormOpen((prev) => ({ ...prev, [idx]: !prev[idx] }))
            }
            className="mt-3 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
          >
            {isFormOpen[idx] ? "Close" : `+ Add ${ingredient.name || "Item"}`}
          </button>

          {isFormOpen[idx] && (
            <AccessoryForm
              ingredient={ingredient}
              onSubmit={(formData) => handleFormSubmit(idx, formData)}
              onCancel={() =>
                setIsFormOpen((prev) => ({ ...prev, [idx]: false }))
              }
            />
          )}
        </div>
      ))}

      <div className="flex justify-end space-x-4 mt-4">
        <button
          onClick={onPrev}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-teal-500 text-white rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

CreateAccessories.propTypes = {
  windowsData: PropTypes.shape({
    images: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        url: PropTypes.string.isRequired,
      })
    ),
    ingredients: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        minSize: PropTypes.number,
        unit: PropTypes.string,
        manufacturingCost: PropTypes.number,
        wholesale: PropTypes.number,
        marketPrice: PropTypes.number,
      })
    ),
  }).isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default memo(CreateAccessories);
