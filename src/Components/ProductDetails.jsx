import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function ProductDetails({
  windowsData = {}, // Default empty object
  setWindowsData,
  onNext,
}) {
  // Track validation errors
  const [errors, setErrors] = useState({});

  // Dimensions for width and height minCost
  const [dimensions, setDimensions] = useState({
    length: "",
    width: "",
    height: "",
    unit: "m",
  });

  // Local list of dimensions (width & height combos)
  const [dimensionList, setDimensionList] = useState(
    windowsData.dimensions || []
  );

  // Product Title (empty string if not in windowsData)
  const [productTitle, setProductTitle] = useState(
    windowsData.productTitle || ""
  );

  // Ingredient list
  const [ingredients, setIngredients] = useState(windowsData.ingredients || []);

  // Controls the add/edit ingredient form’s open/closed state
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Track whether we’re currently editing an existing ingredient
  const [editingIngredientId, setEditingIngredientId] = useState(null);

  // newIngredient has blank fields by default
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    minSize: "",
    manufacturingCost: "",
    increasingSizes: [],
    wholesale: "",
    marketPrice: "",
    unit: "",
  });

  // ======================
  //  CHANGED: IMAGES NOW
  //  STORE LABELS DIRECTLY
  // ======================
  const [images, setImages] = useState(() => {
    const initialImages = windowsData.images || [];
    // If there's a labels object from windowsData, map it into each image
    return initialImages.map((img) => ({
      ...img,
      label: windowsData.labels?.[img.id] || "",
    }));
  });

  // REMOVED: No separate labels state
  // const [labels, setLabels] = useState(windowsData.labels || {});

  // =========================
  //        VALIDATION
  // =========================

  /**
   * Validates the main ProductDetails form fields before moving on.
   * Returns an object with any errors found. If empty, no errors were found.
   */
  const validateMainForm = () => {
    const newErrors = {};

    // Required: Product Title
    if (!productTitle.trim()) {
      newErrors.productTitle = "Product Title is required.";
    }
    // At least one image must be uploaded
    if (images.length === 0) {
      newErrors.images = "Please upload at least one image.";
    }
    // At least one dimension must be added
    if (dimensionList.length === 0) {
      newErrors.dimensions = "Please add at least one set of dimensions.";
    }

    return newErrors;
  };

  /**
   * Validates the ingredient form fields. Returns an object with any issues found.
   */
  const validateIngredient = (ingredient) => {
    const newErrors = {};

    if (!ingredient.name.trim()) {
      newErrors.name = "Ingredient title is required.";
    }
    if (!ingredient.minSize) {
      newErrors.minSize = "Minimum size is required.";
    }
    if (!ingredient.manufacturingCost) {
      newErrors.manufacturingCost = "Manufacturing cost is required.";
    }
    return newErrors;
  };

  // =========================
  //    MAIN FORM HANDLERS
  // =========================

  // Handle selecting images from file input
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // Add label property to new images
    const newImages = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file,
      label: "", // CHANGED: default label is empty
    }));
    setImages((old) => [...old, ...newImages]);
  };

  // CHANGED: Ensure only one image can have a given label at a time by updating images
  const handleLabelChange = (imageId, newLabel) => {
    setImages((prevImages) => {
      return prevImages.map((img) => {
        // If newLabel is already set on a different image, clear that image's label
        if (img.label === newLabel && img.id !== imageId) {
          return { ...img, label: "" };
        }
        // If this is the chosen image, update its label
        if (img.id === imageId) {
          return { ...img, label: newLabel };
        }
        return img;
      });
    });
  };

  // Add dimension to the dimensionList
  const handleAddDimension = () => {
    if (!dimensions.width || !dimensions.height) return;

    setDimensionList((prev) => [...prev, dimensions]);
    // Clear width & height, but keep the current unit
    setDimensions((prev) => ({
      ...prev,
      width: "",
      height: "",
    }));
  };

  // Handler for removing a dimension by its list index
  const handleRemoveDimension = (indexToRemove) => {
    setDimensionList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Save local data to the parent-level state and proceed
  const handleNextClick = () => {
    const formValidationErrors = validateMainForm();
    if (Object.keys(formValidationErrors).length > 0) {
      setErrors(formValidationErrors);
      return;
    }
    // Clear errors if all validations pass
    setErrors({});

    // CHANGED: No separate labels to save. Now each image includes its label.
    setWindowsData((prev) => ({
      ...prev,
      productTitle,
      dimensions: dimensionList,
      images,
      // Convert each image’s label to an object keyed by ID if you still need that structure
      labels: images.reduce((acc, img) => {
        acc[img.id] = img.label;
        return acc;
      }, {}),
      ingredients,
    }));

    onNext(); // Move to the next step
  };

  // =========================
  //    INGREDIENT HANDLERS
  // =========================

  // Opens the form in “add” mode
  const handleOpenFormForNew = () => {
    setIsFormOpen(true);
    setEditingIngredientId(null);
    // Reset newIngredient
    setNewIngredient({
      name: "",
      minSize: "",
      minCost: "",
      manufacturingCost: "",
      increasingSizes: [],
      wholesale: "",
      marketPrice: "",
      unit: "",
    });
    setErrors({});
  };

  // Handle editing an existing ingredient
  const handleEdit = (ingredient) => {
    setIsFormOpen(true);
    setEditingIngredientId(ingredient.id);
    setNewIngredient({ ...ingredient });
    setErrors({});
  };

  // Delete ingredient by its ID
  const deleteIngredient = (id) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  // Save the ingredient form (handles both add and edit)
  const handleSubmit = (e) => {
    e.preventDefault();

    const ingredientErrors = validateIngredient(newIngredient);
    if (Object.keys(ingredientErrors).length > 0) {
      setErrors(ingredientErrors);
      return;
    }
    setErrors({});

    if (editingIngredientId) {
      // Update existing ingredient
      setIngredients((prev) =>
        prev.map((ing) =>
          ing.id === editingIngredientId ? { ...ing, ...newIngredient } : ing
        )
      );
    } else {
      // Add a new ingredient
      setIngredients((prev) => [
        ...prev,
        { ...newIngredient, id: Date.now().toString() },
      ]);
    }

    // Reset form
    setIsFormOpen(false);
    setEditingIngredientId(null);
    setNewIngredient({
      name: "",
      size: "",
      cost: "",
      manufacturingCost: "",
      increasingSizes: [],
      wholesale: "",
      marketPrice: "",
      unit: "",
    });
  };

  // =========================
  //       RENDER
  // =========================

  return (
    <div className="p-6 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 shadow">
      <div className="space-y-6">
        {/* Image Preview + Label Selection */}
        <div className="flex flex-wrap justify-center items-center gap-6">
          {images.map((image) => {
            return (
              <div
                key={image.id}
                className={`relative p-2 rounded-md ${
                  image.label ? "border-2 border-blue-500" : ""
                }`}
              >
                <img
                  src={image.url}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-md"
                />
                <div className="flex flex-col justify-center items-center mt-2">
                  <label
                    htmlFor={`label-select-${image.id}`}
                    className="text-sm"
                  >
                    Choose a label:
                  </label>
                  <select
                    id={`label-select-${image.id}`}
                    value={image.label}
                    onChange={(e) =>
                      handleLabelChange(image.id, e.target.value)
                    }
                    className="mt-1 p-1 border rounded"
                  >
                    <option value="">No Label</option>
                    <option value="primary">Primary</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                  <p className="mt-1 text-sm">
                    Current Label: {image.label || "None"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Product Title & Image Upload */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="productTitle"
              className="text-sm font-medium text-gray-700"
            >
              Product Title *
            </label>
            <input
              type="text"
              id="productTitle"
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
              placeholder="Enter product title"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            />
            {errors.productTitle && (
              <p className="text-red-500 text-sm">{errors.productTitle}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="fileInput"
              className="block text-sm font-semibold mb-2"
            >
              Image<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4 items-center rounded-[24px] border-2 border-primary bg-[#CDE8E9]/60">
              <button
                type="button"
                onClick={() => document.getElementById("fileInput")?.click()}
                className="bg-teal-500 text-white px-6 py-3 rounded-[24px] hover:bg-teal-600 transition-colors"
              >
                Choose File
              </button>
              <span className="text-gray-500">No File Chosen</span>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </div>
            {errors.images && (
              <p className="text-red-500 text-sm">{errors.images}</p>
            )}
          </div>
        </div>

        {/* Dimension Form */}
        <div className="flex items-start gap-4 flex-wrap">
          <form className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="dimensions"
                className="block text-sm font-medium text-gray-700"
              >
                Dimensions
              </label>
              <div className="flex gap-2 items-center mt-1">
                <input
                  id="width"
                  type="number"
                  value={dimensions.width}
                  onChange={(e) =>
                    setDimensions({ ...dimensions, width: e.target.value })
                  }
                  placeholder="Width"
                  className="w-20 p-2 border border-gray-300 rounded-md text-center focus:ring-teal-500 focus:border-teal-500"
                />
                <span className="font-semibold text-gray-600">x</span>
                <input
                  id="height"
                  type="number"
                  value={dimensions.height}
                  onChange={(e) =>
                    setDimensions({ ...dimensions, height: e.target.value })
                  }
                  placeholder="Height"
                  className="w-20 p-2 border border-gray-300 rounded-md text-center focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            {/* Unit Selection */}
            <div className="flex flex-col">
              <label
                htmlFor="unit"
                className="block text-sm font-medium text-gray-700"
              >
                Unit
              </label>
              <select
                id="unit"
                value={dimensions.unit}
                onChange={(e) =>
                  setDimensions({ ...dimensions, unit: e.target.value })
                }
                className="w-20 mt-1 p-2 border border-gray-300 rounded-md bg-white focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="m">m</option>
                <option value="cm">cm</option>
                <option value="mm">mm</option>
              </select>
            </div>

            {/* Add Dimension Button */}
            <div>
              <button
                type="button"
                onClick={handleAddDimension}
                className="mt-5 p-2 bg-teal-500 text-white font-medium rounded hover:bg-teal-600"
              >
                Add Dimension
              </button>
            </div>
          </form>

          {/* Display Existing Dimensions */}
          {dimensionList.length > 0 && (
            <div>
              <h2 className="text-sm text-center font-medium text-gray-700 mb-2">
                Dimensions
              </h2>
              <div className="flex flex-wrap gap-4">
                {dimensionList.map((item, idx) => (
                  <div
                    key={idx}
                    className="relative p-2 border rounded-md bg-gray-50 w-24 text-center flex flex-col items-center"
                  >
                    <p className="text-sm">
                      {item.width} &times; {item.height} {item.unit}
                    </p>
                    <button
                      onClick={() => handleRemoveDimension(idx)}
                      className="absolute top-1 right-1 text-red-500 text-xs hover:underline"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {errors.dimensions && (
          <p className="text-red-500 text-sm">{errors.dimensions}</p>
        )}

        {/* Ingredients List + Form Toggle */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Ingredients List</h3>
            <button
              onClick={handleOpenFormForNew}
              className="px-4 py-2 bg-teal-500 text-white rounded-md"
            >
              + Add New Ingredient
            </button>
          </div>
          <div className="overflow-x-auto">
            {ingredients.length === 0 ? (
              <p className="text-gray-500">No ingredients yet.</p>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Cost
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((ingredient) => (
                    <tr key={ingredient.id} className="bg-teal-50">
                      <td className="px-6 py-4">{ingredient.name}</td>
                      <td className="px-6 py-4">
                        {ingredient.minSize} {ingredient.unit}
                      </td>
                      <td className="px-6 py-4">${ingredient.marketPrice}</td>
                      <td className="px-6 py-4">
                        <button
                          className="text-teal-500 mr-2"
                          onClick={() => handleEdit(ingredient)}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteIngredient(ingredient.id)}
                          className="text-red-500"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Ingredient Form (Add or Edit) */}
        <div
          className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out ${
            isFormOpen ? "max-h-[1000px]" : "max-h-0"
          }`}
        >
          <form onSubmit={handleSubmit} className="bg-teal-50 p-6 rounded-md">
            <div className="space-y-6">
              {/* Title / Name */}
              <div>
                <label className="block text-lg font-medium mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Handle"
                  value={newIngredient.name}
                  onChange={(e) =>
                    setNewIngredient({ ...newIngredient, name: e.target.value })
                  }
                  className="w-full p-3 rounded-md bg-[#f8fffe] border border-[#e5e7eb]"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              {/* Minimum Size & Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Size &amp; Unit
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newIngredient.minSize}
                    onChange={(e) =>
                      setNewIngredient({
                        ...newIngredient,
                        minSize: e.target.value,
                      })
                    }
                    className="w-24 p-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. 1"
                  />
                  <select
                    value={newIngredient.unit}
                    onChange={(e) =>
                      setNewIngredient({
                        ...newIngredient,
                        unit: e.target.value,
                      })
                    }
                    className="w-28 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="cm">cm</option>
                    <option value="inch">inch</option>
                    <option value="m">m</option>
                  </select>
                </div>
                {errors.minSize && (
                  <p className="text-red-500 text-sm">{errors.minSize}</p>
                )}
              </div>

              {/* Manufacturing Cost */}
              <div>
                <label className="block text-lg font-medium mb-2">
                  Manufacturing Cost
                </label>
                <input
                  type="number"
                  value={newIngredient.manufacturingCost}
                  onChange={(e) =>
                    setNewIngredient({
                      ...newIngredient,
                      manufacturingCost: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-md bg-[#f8fffe] border border-[#e5e7eb]"
                />
                {errors.manufacturingCost && (
                  <p className="text-red-500 text-sm">
                    {errors.manufacturingCost}
                  </p>
                )}
              </div>

              {/* Wholesale & Market Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-medium mb-2">
                    Wholesale Price
                  </label>
                  <input
                    type="number"
                    value={newIngredient.wholesale}
                    onChange={(e) =>
                      setNewIngredient({
                        ...newIngredient,
                        wholesale: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-md bg-[#f8fffe] border border-[#e5e7eb]"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2">
                    Market Price
                  </label>
                  <input
                    type="number"
                    value={newIngredient.marketPrice}
                    onChange={(e) =>
                      setNewIngredient({
                        ...newIngredient,
                        marketPrice: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-md bg-[#f8fffe] border border-[#e5e7eb]"
                  />
                </div>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingIngredientId(null);
                }}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#00b5b7] text-white rounded-md hover:bg-[#009b9d]"
              >
                Save
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-end space-x-4">
          <button className="px-4 py-2 border border-gray-300 rounded-md">
            Cancel
          </button>
          <button
            onClick={handleNextClick}
            className="px-4 py-2 bg-teal-500 text-white rounded-md"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
