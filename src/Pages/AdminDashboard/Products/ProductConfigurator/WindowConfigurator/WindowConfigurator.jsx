import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SketchPicker } from "react-color";
import axiosSecure from "../../../../../Hooks/AsiosSecure";
import { useSweetAlert } from "../../../../../ContextProvider/SweetAlertContext";
import Section from "../../../../../Shared/Section";
import {
  SavedColors,
  SavedDimensions,
  SavedEstimatedHours,
  SavedFanlights,
  SavedGlasses,
  SavedGlassStructures,
  SavedHandles,
  SavedMaterials,
  SavedOpeningSystems,
  SavedProfiles,
  SavedWindows,
} from "../../../../../Components/Configurator/SavedComponents";

// Utility function to calculate multipliers
const calculateMultiplier = (input) => {
  return (100 + parseInt(input)) / 100;
};

// Utility function to validate multiplier input
const isValidMultiplierInput = (input) => {
  const num = parseFloat(input);
  return !isNaN(num) && num >= 0; // Ensure input is a non-negative number
};

// Main Product Configuration Component
export default function ProductConfiguration() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("1");
  const [selectedCategoryName, setSelectedCategoryName] = useState("1");
  const [openSection, setOpenSection] = useState("dimensions");
  const { showAlert } = useSweetAlert();
  const initialImageState = { url: null, name: "No file chosen" };

  // State declarations (dimensions, materials, profiles, glasses, etc.)
  const [min_height, setmin_height] = useState("");
  const [max_height, setmax_height] = useState("");
  const [min_width, setmin_width] = useState("");
  const [max_width, setmax_width] = useState("");
  const [unit, setUnit] = useState("mm");
  const [savedDimensions, setSavedDimensions] = useState([]);
  const [editingDimensionIndex, setEditingDimensionIndex] = useState(null);

  // Error state for dimensions
  const [dimensionError, setDimensionError] = useState("");
  // Error state for materials
  const [name, setname] = useState("");
  const [image, setimage] = useState(initialImageState);
  const [savedMaterials, setSavedMaterials] = useState([]);
  console.log(savedMaterials);
  const [editingMaterialIndex, setEditingMaterialIndex] = useState(null);
  const [materialError, setMaterialError] = useState("");

  // state for profiles
  const [profile_name, setprofile_name] = useState("");
  const [profile_multiplier, setprofile_multiplier] = useState("");
  const [profile_image, setprofile_image] = useState(initialImageState);
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState("");
  const [savedProfiles, setSavedProfiles] = useState([]);
  console.log(savedProfiles);
  const [editingProfileIndex, setEditingProfileIndex] = useState(null);
  const [profile_multiplierIncrements, setprofile_multiplierIncrements] =
    useState([]);

  // Error state for profiles
  const [profileError, setProfileError] = useState("");

  const [glassName, setGlassName] = useState("");
  const [glassPrice, setGlassPrice] = useState("");
  const [glassImage, setGlassImage] = useState(initialImageState);
  const [glazing_multiplier, setglazing_multiplier] = useState(1);
  const [savedGlasses, setSavedGlasses] = useState([]);
  console.log(savedGlasses);
  const [editingGlassIndex, setEditingGlassIndex] = useState(null);
  const [glazingPriceIncrements, setGlazingPriceIncrements] = useState([]);

  // Error state for glasses
  const [glassError, setGlassError] = useState("");

  const [glassStructureName, setGlassStructureName] = useState("");
  const [glassStructurePrice, setGlassStructurePrice] = useState("");
  const [glassStructureImage, setGlassStructureImage] =
    useState(initialImageState);
  const [structure_multiplier, setstructure_multiplier] = useState(1);
  const [savedGlassStructures, setSavedGlassStructures] = useState([]);
  console.log(savedGlassStructures);
  const [editingGlassStructureIndex, setEditingGlassStructureIndex] =
    useState(null);
  const [structurePriceIncrements, setStructurePriceIncrements] = useState([]);

  // Error state fosavedOperatingr glass structures
  const [structureError, setStructureError] = useState("");

  const [openingName, setopeningName] = useState("");
  const [openingPrice, setopeningPrice] = useState("");
  const [opening_image, setopening_image] = useState(initialImageState);
  const [savedOpening, setSavedOpening] = useState([]);
  console.log(savedOpening);
  const [editingOperatingIndex, setEditingOperatingIndex] = useState(null);

  // Error state for operating systems
  const [operatingError, setOperatingError] = useState("");

  const [type, settype] = useState("");
  const [price, setprice] = useState("");
  const [handle_image, sethandle_image] = useState(initialImageState);
  const [savedHandles, setSavedHandles] = useState([]);
  console.log(savedHandles);
  const [editingHandleIndex, setEditingHandleIndex] = useState(null);

  // Error state for handles
  const [handleError, setHandleError] = useState("");

  const [windowTypeName, setWindowTypeName] = useState("");
  const [window_type_multiplier, setwindow_type_multiplier] = useState("");
  const [windowTypeImage, setWindowTypeImage] = useState(initialImageState);
  const [savedWindows, setSavedWindows] = useState([]);
  console.log(savedWindows);
  const [editingWindowIndex, setEditingWindowIndex] = useState(null);
  const [
    window_type_multiplierIncrements,
    setwindow_type_multiplierIncrements,
  ] = useState([]);

  // Error state for window types
  const [windowTypeError, setWindowTypeError] = useState("");

  const [fanlightName, setFanlightName] = useState("");
  const [fanlightPrice, setFanlightPrice] = useState("");
  const [fanlight_image, setfanlight_image] = useState(initialImageState);
  const [savedFanlights, setSavedFanlights] = useState([]);
  console.log(savedFanlights);
  const [editingFanlightIndex, setEditingFanlightIndex] = useState(null);

  // Error state for fanlights
  const [fanlightError, setFanlightError] = useState("");

  const [estimatedHours, setEstimatedHours] = useState("");
  const [fastOption, setFastOption] = useState("Normal");
  const [extraPrice, setExtraPrice] = useState("");
  const [savedEstimated, setSavedEstimated] = useState([]);
  const [editingEstimatedIndex, setEditingEstimatedIndex] = useState(null);

  // Error state for estimated hours
  const [estimatedError, setEstimatedError] = useState("");

  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [color_name, setcolor_name] = useState("");
  const [color_multiplier, setcolor_multiplier] = useState("");
  const [color_image, setcolor_image] = useState(initialImageState);
  const [savedColors, setSavedColors] = useState([]);
  console.log(savedColors);
  const [editingColorIndex, setEditingColorIndex] = useState(null);
  const [color_multiplierIncrements, setcolor_multiplierIncrements] = useState(
    []
  );

  // Error state for colors
  const [colorError, setColorError] = useState("");
  const [configurError, setConfigurError] = useState("");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosSecure.get("/product-categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories.");
      }
    };

    fetchCategories();
  }, []);

  // Update selectedCategoryName whenever selectedCategoryId changes
  useEffect(() => {
    if (selectedCategoryId && categories.length > 0) {
      console.log(selectedCategoryId);
      const selectedCategory = categories.find(
        (cat) => cat.id === parseInt(selectedCategoryId)
      );
      setSelectedCategoryName(
        selectedCategory ? selectedCategory.category_name.toLowerCase() : ""
      );
    }
  }, [selectedCategoryId, categories]);

  // Toggle Section
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // File Handling
  const handleFileChange = async (event, type) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axiosSecure.post("/user-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const fileUrl = response.data.image.url;
      const fileName = response.data.image.filename;

      switch (type) {
        case "material":
          setimage({ url: fileUrl, name: fileName });
          break;
        case "profile":
          setprofile_image({ url: fileUrl, name: fileName });
          break;
        case "glass":
          setGlassImage({ url: fileUrl, name: fileName });
          break;
        case "glassStructure":
          setGlassStructureImage({ url: fileUrl, name: fileName });
          break;
        case "operating":
          setopening_image({ url: fileUrl, name: fileName });
          break;
        case "handle":
          sethandle_image({ url: fileUrl, name: fileName });
          break;
        case "window":
          setWindowTypeImage({ url: fileUrl, name: fileName });
          break;
        case "fanlight":
          setfanlight_image({ url: fileUrl, name: fileName });
          break;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
    }
  };

  // ImgBB Upload for Color Swatches
  const uploadColorToImgBB = async (hexColor) => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 50; // Smaller size for efficiency
      canvas.height = 50;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = hexColor;
      ctx.fillRect(0, 0, 50, 50);

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png", 0.8);
      });

      const formData = new FormData();
      formData.append("image", blob, "color-swatch.png");

      const response = await axiosSecure.post("/user-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data.image.url;
    } catch (error) {
      console.error("ImgBB upload error:", error);
      throw new Error("Failed to upload color swatch");
    }
  };

  // Save Function
  const handleSave = (
    setState,
    state,
    newData,
    editingIndex,
    setEditingIndex
  ) => {
    if (editingIndex !== null) {
      const updatedState = [...state];
      updatedState[editingIndex] = newData;
      setState(updatedState);
      toast.success("Updated successfully!");
      setEditingIndex(null); // Reset editing index after save
    } else {
      setState([...state, newData]);
      toast.success("Saved successfully!");
    }
  };

  // Validate Dimensions
  const validateDimensions = () => {
    if (!min_height || !max_height || !min_width || !max_width) {
      setDimensionError("All dimension fields are required.");
      return false;
    }
    if (parseFloat(min_height) > parseFloat(max_height)) {
      setDimensionError(
        "Minimum height cannot be greater than maximum height."
      );
      return false;
    }
    if (parseFloat(min_width) > parseFloat(max_width)) {
      setDimensionError("Minimum width cannot be greater than maximum width.");
      return false;
    }
    setDimensionError(""); // Clear error if valid
    return true;
  };

  // Save Dimensions
  const handleDimensionSave = () => {
    if (validateDimensions()) {
      handleSave(
        setSavedDimensions,
        savedDimensions,
        {
          min_height,
          max_height,
          min_width,
          max_width,
          unit,
        },
        editingDimensionIndex,
        setEditingDimensionIndex
      );
    }
  };

  // Save Profile Features
  const handleProfileSave = () => {
    if (
      !profile_name ||
      !isValidMultiplierInput(profile_multiplier) ||
      features.length === 0 ||
      !profile_image.url
    ) {
      setProfileError(
        "Profile name, image, Feature and a valid price are required."
      );
      return;
    }
    const percentageValue = parseFloat(profile_multiplier);
    const calculatedMultiplier = calculateMultiplier(percentageValue);

    handleSave(
      setSavedProfiles,
      savedProfiles,
      {
        profile_name,
        features,
        profile_image: profile_image.url,
        profile_multiplier: calculatedMultiplier, // Save as 1.2
      },
      editingProfileIndex,
      setEditingProfileIndex
    );

    const updatedIncrements = [...profile_multiplierIncrements];
    if (editingProfileIndex !== null) {
      updatedIncrements[editingProfileIndex] = percentageValue; // Store 20 for display
    } else {
      updatedIncrements.push(percentageValue);
    }
    setprofile_multiplierIncrements(updatedIncrements);
    setProfileError(""); // Clear error if valid
  };

  // Handle Glass Type Save
  const handleSaveGlassType = () => {
    if (
      !glassName ||
      !isValidMultiplierInput(glassPrice) ||
      !glassImage.url ||
      !glazing_multiplier
    ) {
      setGlassError(
        "Glass name, Image,and a valid price, Multiplier are required."
      );
      return;
    }
    const percentageValue = parseFloat(glassPrice);
    const calculatedMultiplier = calculateMultiplier(percentageValue);

    handleSave(
      setSavedGlasses,
      savedGlasses,
      {
        type: glassName,
        glass_image: glassImage.url,
        price: glassPrice, // Use the calculated multiplier
        glazing_multiplier: calculatedMultiplier, // Include the existing glazing multiplier
      },
      editingGlassIndex,
      setEditingGlassIndex
    );

    const updatedIncrements = [...glazingPriceIncrements];
    if (editingGlassIndex !== null) {
      updatedIncrements[editingGlassIndex] = percentageValue; // Store 20 for display
    } else {
      updatedIncrements.push(percentageValue);
    }
    setGlazingPriceIncrements(updatedIncrements);
    setGlassError(""); // Clear error if valid
  };

  // Handle Glass Structure Save
  const handleStructureSave = () => {
    if (!glassStructureName || !isValidMultiplierInput(structure_multiplier)) {
      setStructureError(
        "Glass structure name and a valid multiplier are required."
      );
      return;
    }
    const percentageValue = parseFloat(structure_multiplier);
    const calculatedMultiplier = calculateMultiplier(percentageValue);

    handleSave(
      setSavedGlassStructures,
      savedGlassStructures,
      {
        type: glassStructureName,
        glass_image: glassStructureImage.url,
        price: glassStructurePrice,
        structure_multiplier: calculatedMultiplier, // Use the calculated multiplier
      },
      editingGlassStructureIndex,
      setEditingGlassStructureIndex
    );

    const updatedIncrements = [...structurePriceIncrements];
    if (editingGlassStructureIndex !== null) {
      updatedIncrements[editingGlassStructureIndex] = percentageValue; // Store 20 for display
    } else {
      updatedIncrements.push(percentageValue);
    }
    setStructurePriceIncrements(updatedIncrements);
    setStructureError(""); // Clear error if valid
  };

  // Handle Color Save
  const handleColorSave = () => {
    if (!color_name || !isValidMultiplierInput(color_multiplier)) {
      setColorError("Color name and a valid price are required.");
      return;
    }
    const percentageValue = parseFloat(color_multiplier);
    const calculatedMultiplier = calculateMultiplier(percentageValue);

    handleSave(
      setSavedColors,
      savedColors,
      {
        color_name,
        color_image: color_image.url,
        color_multiplier: calculatedMultiplier, // Use the calculated multiplier
        color: selectedColor, // Include the selected color value
      },
      editingColorIndex,
      setEditingColorIndex
    );

    const updatedIncrements = [...color_multiplierIncrements];
    if (editingColorIndex !== null) {
      updatedIncrements[editingColorIndex] = percentageValue; // Store 20 for display
    } else {
      updatedIncrements.push(percentageValue);
    }
    setcolor_multiplierIncrements(updatedIncrements);
    setColorError(""); // Clear error if valid
  };

  // Populate form fields with existing data for editing
  const handleEdit = (index, setters, data) => {
    Object.entries(data).forEach(([key, value]) => {
      if (setters[key]) setters[key](value);
    });
  };

  // Draft Retrieval and Saving
  useEffect(() => {
    const savedDraft = JSON.parse(localStorage.getItem("draft"));

    if (savedDraft) {
      setSavedDimensions(savedDraft.savedDimensions || []);
      setSavedMaterials(savedDraft.savedMaterials || []);
      setSavedProfiles(savedDraft.savedProfiles || []);
      setSavedGlasses(savedDraft.savedGlasses || []);
      setSavedGlassStructures(savedDraft.savedGlassStructures || []);
      setSavedOpening(savedDraft.savedOperating || []);
      setSavedHandles(savedDraft.savedHandles || []);
      setSavedWindows(savedDraft.savedWindows || []);
      setSavedFanlights(savedDraft.savedFanlights || []);
      setSavedEstimated(savedDraft.savedEstimated || []);
      setSavedColors(savedDraft.savedColors || []);
      setprofile_multiplierIncrements(
        savedDraft.profile_multiplierIncrements || []
      );
      setwindow_type_multiplierIncrements(
        savedDraft.window_type_multiplierIncrements || []
      );
      setGlazingPriceIncrements(savedDraft.glazingPriceIncrements || []);
      setStructurePriceIncrements(savedDraft.structurePriceIncrements || []);
      setcolor_multiplierIncrements(
        savedDraft.color_multiplierIncrements || []
      );
    }
  }, []);

  // Save Draft
  const saveDraft = () => {
    const draftData = {
      savedDimensions,
      savedMaterials,
      savedProfiles,
      savedGlasses,
      savedGlassStructures,
      savedOperating: savedOpening,
      savedHandles,
      savedWindows,
      savedFanlights,
      savedEstimated,
      savedColors,
      profile_multiplierIncrements,
      window_type_multiplierIncrements,
      glazingPriceIncrements,
      structurePriceIncrements,
      color_multiplierIncrements,
    };

    localStorage.setItem("draft", JSON.stringify(draftData));
    toast.info("Draft saved!");
  };

  const handleDelete = (setState, state, index) => {
    const updatedState = state.filter((_, i) => i !== index);
    setState(updatedState);
    toast.success("Deleted successfully!");
  };

  // Color Picker Change Handler
  const handleColorChange = async (color) => {
    try {
      setSelectedColor(color.hex);
      const color_nameResult = color.hex.toLowerCase();
      setcolor_name(color_nameResult);

      setcolor_image({ ...initialImageState, loading: true });

      const imageUrl = await uploadColorToImgBB(color.hex);
      setcolor_image({
        url: imageUrl,
        name: color_nameResult,
        loading: false,
      });
    } catch (error) {
      toast.error(error.message);
      setcolor_image(initialImageState);
    }
  };

  const handleFeatureDelete = (index) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
  };

  // Prepare Form Data for API
  const prepareFormData = () => {
    const formData = new FormData();

    if (!selectedCategoryId) throw new Error("Category is required");
    formData.append("category_id", selectedCategoryId);
    formData.append("name", "Window Product Configuration");

    if (savedDimensions.length === 0)
      throw new Error("Dimensions are required");
    const dimension = savedDimensions[0];
    formData.append("dimensions[min_height]", dimension.min_height);
    formData.append("dimensions[max_height]", dimension.max_height);
    formData.append("dimensions[min_width]", dimension.min_width);
    formData.append("dimensions[max_width]", dimension.max_width);
    formData.append("dimensions[unit]", dimension.unit);

    if (savedMaterials.length === 0)
      throw new Error("At least one material is required");
    savedMaterials.forEach((material, index) => {
      formData.append(`materials[${index}][name]`, material.name);
      formData.append(`materials[${index}][price]`, material.price);
      if (material.image?.url) {
        formData.append(`materials[${index}][image]`, material.image.url);
      }
    });

    savedProfiles.forEach((profile, index) => {
      formData.append(
        `profile_features[${index}][profile_name]`,
        profile.profile_name
      );
      formData.append(
        `profile_features[${index}][profile_multiplier]`,
        calculateMultiplier(profile_multiplierIncrements[index])
      );
      if (profile.profile_image?.url) {
        formData.append(
          `profile_features[${index}][profile_image]`,
          profile.profile_image.url
        );
      }
      profile.features.forEach((feature, fIndex) => {
        formData.append(
          `profile_features[${index}][features][${fIndex}]`,
          feature
        );
      });
    });

    savedGlasses.forEach((glass, index) => {
      formData.append(`glass_types[${index}][type]`, glass.glassName);
      formData.append(`glass_types[${index}][price]`, glass.glassPrice);
      formData.append(
        `glass_types[${index}][glazing_multiplier]`,
        calculateMultiplier(glazingPriceIncrements[index])
      );
      if (glass.glassImage?.url) {
        formData.append(
          `glass_types[${index}][glass_image]`,
          glass.glassImage.url
        );
      }
    });

    savedGlassStructures.forEach((structure, index) => {
      formData.append(
        `glass_structures[${index}][type]`,
        structure.glassStructureName
      );
      formData.append(
        `glass_structures[${index}][price]`,
        structure.glassStructurePrice
      );
      formData.append(
        `glass_structures[${index}][structure_multiplier]`,
        calculateMultiplier(structurePriceIncrements[index])
      );
      if (structure.glassStructureImage?.url) {
        formData.append(
          `glass_structures[${index}][glass_image]`,
          structure.glassStructureImage.url
        );
      }
    });

    savedOpening.forEach((operating, index) => {
      formData.append(`opening_systems[${index}][name]`, operating.openingName);
      formData.append(
        `opening_systems[${index}][price]`,
        operating.openingPrice
      );
      if (operating.opening_image?.url) {
        formData.append(
          `opening_systems[${index}][opening_image]`,
          operating.opening_image.url
        );
      }
    });

    savedHandles.forEach((handle, index) => {
      formData.append(`handles[${index}][type]`, handle.type);
      formData.append(`handles[${index}][price]`, handle.price);
      if (handle.handle_image?.url) {
        formData.append(
          `handles[${index}][handle_image]`,
          handle.handle_image.url
        );
      }
    });

    savedWindows.forEach((window, index) => {
      formData.append(`window_types[${index}][type]`, window.windowTypeName);
      formData.append(
        `window_types[${index}][window_type_multiplier]`,
        calculateMultiplier(window_type_multiplierIncrements[index])
      );
      if (window.windowTypeImage?.url) {
        formData.append(
          `window_types[${index}][type_image]`,
          window.windowTypeImage.url
        );
      }
    });

    savedFanlights.forEach((fanlight, index) => {
      formData.append(
        `fanlights[${index}][availability]`,
        fanlight.fanlightName
      );
      formData.append(`fanlights[${index}][price]`, fanlight.fanlightPrice);
      if (fanlight.fanlight_image?.url) {
        formData.append(
          `fanlights[${index}][fanlight_image]`,
          fanlight.fanlight_image.url
        );
      }
    });

    if (savedEstimated.length === 0)
      throw new Error("Working hours information is required");
    const workingHours = savedEstimated[0];
    formData.append("working_hours[total_hour]", workingHours.estimatedHours);
    formData.append("working_hours[fastening_type]", workingHours.fastOption);
    formData.append(
      "working_hours[extra_cost]",
      workingHours.extraPrice || "0"
    );

    savedColors.forEach((color, index) => {
      formData.append(`colors[${index}][color_name]`, color.color_name);
      formData.append(
        `colors[${index}][color_multiplier]`,
        calculateMultiplier(color_multiplierIncrements[index])
      );
      formData.append(`colors[${index}][color_value]`, color.color_image.url);
    });

    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    return formData;
  };

  const publishProduct = async () => {
    try {
      const formData = prepareFormData();
      await axiosSecure.post("/admin/window-configurator", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showAlert("success", "Product configuration published successfully!");
      localStorage.removeItem("draft"); // Remove draft from localStorage after successful publish
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      setConfigurError(errorMessage);
      console.error("Error details:", error.response?.data);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-2 space-y-4">
      <ToastContainer />
      {/* Category */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-300">
        <label className="block text-2xl font-medium text-gray-700 text-left">
          Category
        </label>
        <select
          className="w-full mt-3 border border-primary rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00B5A5]"
          onChange={(e) => setSelectedCategoryId(e.target.value)}
        >
          <option>Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.category_name}
            </option>
          ))}
        </select>
      </div>
      {/* Dimension Section */}
      <Section
        title="Dimension"
        isOpen={openSection === "dimensions"}
        onToggle={() => toggleSection("dimensions")}
        content={
          <DimensionSection
            min_height={min_height}
            max_height={max_height}
            min_width={min_width}
            max_width={max_width}
            unit={unit}
            onmin_heightChange={setmin_height}
            onmax_heightChange={setmax_height}
            onmin_widthChange={setmin_width}
            onmax_widthChange={setmax_width}
            onUnitChange={setUnit}
            onSave={handleDimensionSave} // Use the new save function
            onCancel={() => {
              setmin_height("");
              setmax_height("");
              setmin_width("");
              setmax_width("");
              setUnit("mm");
              setEditingDimensionIndex(null);
            }}
          />
        }
      />
      {dimensionError && <p className="text-red-500">{dimensionError}</p>}
      {savedDimensions.length > 0 && (
        <SavedDimensions
          savedDimensions={savedDimensions}
          onEdit={(entry, index) => {
            handleEdit(
              index,
              {
                min_height: setmin_height,
                max_height: setmax_height,
                min_width: setmin_width,
                max_width: setmax_width,
                unit: setUnit,
              },
              entry
            );
            setEditingDimensionIndex(index);
          }}
          onDelete={(index) =>
            handleDelete(setSavedDimensions, savedDimensions, index)
          }
        />
      )}
      {/* Material Section */}
      <Section
        title="Material"
        isOpen={openSection === "material"}
        onToggle={() => toggleSection("material")}
        content={
          <MaterialSection
            name={name}
            price={price}
            image={image}
            onNameChange={setname}
            onPriceChange={setprice}
            onImageChange={(e) => handleFileChange(e, "material")}
            onSave={() => {
              if (!name || !isValidMultiplierInput(price) || !image.url) {
                setMaterialError(
                  "Material name, an image and a valid price are required."
                );
                return;
              }
              handleSave(
                setSavedMaterials,
                savedMaterials,
                {
                  name,
                  image: image.url,
                  price,
                },
                editingMaterialIndex,
                setEditingMaterialIndex
              );
              setMaterialError(""); // Clear error if valid
            }}
            onCancel={() => {
              setname("");
              setprice("");
              setimage(initialImageState);
              setEditingMaterialIndex(null);
            }}
          />
        }
      />
      {materialError && (
        <p className="text-red-500 text-lg 875543">{materialError}</p>
      )}
      {savedMaterials.length > 0 && (
        <SavedMaterials
          materials={savedMaterials}
          onEdit={(entry, index) => {
            handleEdit(
              index,
              {
                name: setname,
                price: setprice,
              },
              setimage,
              entry
            );
            setEditingMaterialIndex(index);
          }}
          onDelete={(index) =>
            handleDelete(setSavedMaterials, savedMaterials, index)
          }
        />
      )}
      {/* Profile Section */}
      <Section
        title="Profile Features"
        isOpen={openSection === "profile"}
        onToggle={() => toggleSection("profile")}
        content={
          <ProfileSection
            name={profile_name}
            price={profile_multiplier}
            image={profile_image}
            features={features}
            newFeature={newFeature}
            onNameChange={setprofile_name}
            onPriceChange={setprofile_multiplier}
            profile_multiplierIncrements={profile_multiplierIncrements}
            onImageChange={(e) => handleFileChange(e, "profile")}
            onFeatureAdd={() => {
              if (newFeature.trim()) {
                setFeatures([...features, newFeature]);
                setNewFeature("");
              }
            }}
            onFeatureChange={setNewFeature}
            onFeatureDelete={handleFeatureDelete}
            onSave={handleProfileSave}
            onCancel={() => {
              setprofile_name("");
              setprofile_multiplier("");
              setprofile_image(initialImageState);
              setFeatures([]);
              setNewFeature("");
              setEditingProfileIndex(null);
            }}
          />
        }
      />
      {profileError && <p className="text-red-500">{profileError}</p>}
      {savedProfiles.length > 0 && (
        <SavedProfiles
          profiles={savedProfiles}
          profile_multiplierIncrements={profile_multiplierIncrements}
          onDelete={(index) =>
            handleDelete(setSavedProfiles, savedProfiles, index)
          }
        />
      )}
      {/* Glass Section */}
      <Section
        title="Glass Types"
        isOpen={openSection === "glass"}
        onToggle={() => toggleSection("glass")}
        content={
          <GlassSection
            name={glassName}
            price={glassPrice}
            image={glassImage}
            onNameChange={setGlassName}
            onPriceChange={setGlassPrice}
            onglazing_multiplierChange={setglazing_multiplier}
            onImageChange={(e) => handleFileChange(e, "glass")}
            onSave={handleSaveGlassType}
            onCancel={() => {
              setGlassName("");
              setGlassPrice("");
              setglazing_multiplier(1);
              setGlassImage(initialImageState);
              setEditingGlassIndex(null);
            }}
          />
        }
      />
      {glassError && <p className="text-red-500">{glassError}</p>}
      {savedGlasses.length > 0 && (
        <SavedGlasses
          glasses={savedGlasses}
          glazingPriceIncrements={glazingPriceIncrements}
          onEdit={(entry, index) => {
            handleEdit(
              index,
              {
                glassName: setGlassName,
                glassPrice: setGlassPrice,
                glazing_multiplier: setglazing_multiplier,
              },
              setGlassImage,
              entry
            );
            setEditingGlassIndex(index);
          }}
          onDelete={(index) =>
            handleDelete(setSavedGlasses, savedGlasses, index)
          }
        />
      )}
      {/* Glass Structure Section */}
      <Section
        title="Glass Structure"
        isOpen={openSection === "glassStructure"}
        onToggle={() => toggleSection("glassStructure")}
        content={
          <GlassStructureSection
            name={glassStructureName}
            price={glassStructurePrice}
            image={glassStructureImage}
            onNameChange={setGlassStructureName}
            onPriceChange={setGlassStructurePrice}
            onstructure_multiplierChange={setstructure_multiplier}
            onImageChange={(e) => handleFileChange(e, "glassStructure")}
            onSave={handleStructureSave}
            onCancel={() => {
              setGlassStructureName("");
              setGlassStructurePrice("");
              setstructure_multiplier(1);
              setGlassStructureImage(initialImageState);
              setEditingGlassStructureIndex(null);
            }}
          />
        }
      />
      {structureError && <p className="text-red-500">{structureError}</p>}
      {savedGlassStructures.length > 0 && (
        <SavedGlassStructures
          SavedGlassStructures={savedGlassStructures}
          structurePriceIncrements={structurePriceIncrements}
          onDelete={(index) =>
            handleDelete(setSavedGlassStructures, savedGlassStructures, index)
          }
        />
      )}
      {/* Operating System Section */}
      <Section
        title="Operating System"
        isOpen={openSection === "operating"}
        onToggle={() => toggleSection("operating")}
        content={
          <OperatingSystemSection
            name={openingName}
            price={openingPrice}
            image={opening_image}
            onNameChange={setopeningName}
            onPriceChange={setopeningPrice}
            onImageChange={(e) => handleFileChange(e, "operating")}
            onSave={() => {
              if (!openingName || !isValidMultiplierInput(openingPrice)) {
                setOperatingError(
                  "Operating name and a valid price are required."
                );
                return;
              }
              handleSave(
                setSavedOpening,
                savedOpening,
                {
                  name: openingName,
                  opening_image: opening_image.url,
                  price: openingPrice,
                },
                editingOperatingIndex,
                setEditingOperatingIndex
              );
              setOperatingError(""); // Clear error if valid
            }}
            onCancel={() => {
              setopeningName("");
              setopeningPrice("");
              setopening_image(initialImageState);
              setEditingOperatingIndex(null);
            }}
          />
        }
      />
      {operatingError && <p className="text-red-500">{operatingError}</p>}
      {savedOpening.length > 0 && (
        <SavedOpeningSystems
          openingSystems={savedOpening}
          onEdit={(entry, index) => {
            handleEdit(
              index,
              {
                openingName: setopeningName,
                openingPrice: setopeningPrice,
              },
              setopening_image,
              entry
            );
            setEditingOperatingIndex(index);
          }}
          onDelete={(index) =>
            handleDelete(setSavedOpening, savedOpening, index)
          }
        />
      )}
      {/* Handle Type Section */}
      <Section
        title="Handle Type"
        isOpen={openSection === "handle"}
        onToggle={() => toggleSection("handle")}
        content={
          <HandleSection
            name={type}
            price={price}
            image={handle_image}
            onNameChange={settype}
            onPriceChange={setprice}
            onImageChange={(e) => handleFileChange(e, "handle")}
            onSave={() => {
              if (!type || !isValidMultiplierInput(price)) {
                setHandleError("Handle name and a valid price are required.");
                return;
              }
              handleSave(
                setSavedHandles,
                savedHandles,
                {
                  type,
                  handle_image: handle_image.url,
                  price,
                },
                editingHandleIndex,
                setEditingHandleIndex
              );
              setHandleError(""); // Clear error if valid
            }}
            onCancel={() => {
              settype("");
              setprice("");
              sethandle_image(initialImageState);
              setEditingHandleIndex(null);
            }}
          />
        }
      />
      {handleError && <p className="text-red-500">{handleError}</p>}
      {savedHandles.length > 0 && (
        <SavedHandles
          handles={savedHandles}
          onEdit={(entry, index) => {
            handleEdit(
              index,
              {
                type: settype,
                price: setprice,
              },
              sethandle_image,
              entry
            );
            setEditingHandleIndex(index);
          }}
          onDelete={(index) =>
            handleDelete(setSavedHandles, savedHandles, index)
          }
        />
      )}
      {/* Window Type Section */}
      <Section
        title="Window Type"
        isOpen={openSection === "window"}
        onToggle={() => toggleSection("window")}
        content={
          <WindowTypeSection
            name={windowTypeName}
            price={window_type_multiplier}
            image={windowTypeImage}
            onNameChange={setWindowTypeName}
            onPriceChange={setwindow_type_multiplier}
            onImageChange={(e) => handleFileChange(e, "window")}
            onSave={() => {
              if (
                !windowTypeName ||
                !isValidMultiplierInput(window_type_multiplier)
              ) {
                setWindowTypeError(
                  "Window type name and a valid price are required."
                );
                return;
              }
              handleSave(
                setSavedWindows,
                savedWindows,
                {
                  type: windowTypeName,
                  window_type_multiplier: calculateMultiplier(
                    window_type_multiplier
                  ), // Save calculated value
                  type_image: windowTypeImage.url,
                },
                editingWindowIndex,
                setEditingWindowIndex
              );

              const updatedIncrements = [...window_type_multiplierIncrements];
              if (editingWindowIndex !== null) {
                updatedIncrements[editingWindowIndex] = parseFloat(
                  window_type_multiplier
                );
              } else {
                updatedIncrements.push(parseFloat(window_type_multiplier));
              }
              setwindow_type_multiplierIncrements(updatedIncrements);
              setWindowTypeError(""); // Clear error if valid
            }}
            onCancel={() => {
              setWindowTypeName("");
              setwindow_type_multiplier("");
              setWindowTypeImage(initialImageState);
              setEditingWindowIndex(null);
            }}
          />
        }
      />

      {windowTypeError && <p className="text-red-500">{windowTypeError}</p>}
      {savedWindows.length > 0 && (
        <SavedWindows
          windows={savedWindows}
          window_type_multiplierIncrements={window_type_multiplierIncrements}
          onEdit={(entry, index) => {
            handleEdit(
              index,
              {
                windowTypeName: setWindowTypeName,
                window_type_multiplier: setwindow_type_multiplier,
              },
              setWindowTypeImage,
              entry
            );
            setEditingWindowIndex(index);
          }}
          onDelete={(index) =>
            handleDelete(setSavedWindows, savedWindows, index)
          }
        />
      )}
      {/* Fanlight System Section */}
      <Section
        title="Fanlight System"
        isOpen={openSection === "fanlight"}
        onToggle={() => toggleSection("fanlight")}
        content={
          <FanlightSection
            name={fanlightName}
            price={fanlightPrice}
            image={fanlight_image}
            onNameChange={setFanlightName}
            onPriceChange={setFanlightPrice}
            onImageChange={(e) => handleFileChange(e, "fanlight")}
            onSave={() => {
              if (!fanlightName || !isValidMultiplierInput(fanlightPrice)) {
                setFanlightError(
                  "Fanlight name and a valid price are required."
                );
                return;
              }
              handleSave(
                setSavedFanlights,
                savedFanlights,
                {
                  availability: fanlightName,
                  price: fanlightPrice, // Save calculated value
                  fanlight_image: fanlight_image.url,
                },
                editingFanlightIndex,
                setEditingFanlightIndex
              );
              setFanlightError(""); // Clear error if valid
            }}
            onCancel={() => {
              setFanlightName("");
              setFanlightPrice("");
              setfanlight_image(initialImageState);
              setEditingFanlightIndex(null);
            }}
          />
        }
      />

      {fanlightError && <p className="text-red-500">{fanlightError}</p>}
      {savedFanlights.length > 0 && (
        <SavedFanlights
          fanlights={savedFanlights}
          onEdit={(entry, index) => {
            handleEdit(
              index,
              {
                fanlightName: setFanlightName,
                fanlightPrice: setFanlightPrice,
              },
              setfanlight_image,
              entry
            );
            setEditingFanlightIndex(index);
          }}
          onDelete={(index) =>
            handleDelete(setSavedFanlights, savedFanlights, index)
          }
        />
      )}
      {/* Estimated Working Hour Section */}
      <Section
        title="Estimated Working Hour"
        isOpen={openSection === "estimated"}
        onToggle={() => toggleSection("estimated")}
        content={
          <EstimatedWorkingHourSection
            estimatedHours={estimatedHours}
            fastOption={fastOption}
            extraPrice={extraPrice}
            onHoursChange={setEstimatedHours}
            onFastOptionChange={setFastOption}
            onExtraPriceChange={setExtraPrice}
            onSave={() => {
              if (!estimatedHours || !isValidMultiplierInput(extraPrice)) {
                setEstimatedError(
                  "Estimated hours and a valid extra price are required."
                );
                return;
              }
              handleSave(
                setSavedEstimated,
                savedEstimated,
                {
                  estimatedHours,
                  fastOption,
                  extraPrice,
                },
                editingEstimatedIndex,
                setEditingEstimatedIndex
              );
              setEstimatedError(""); // Clear error if valid
            }}
            onCancel={() => {
              setEstimatedHours("");
              setFastOption("Normal");
              setExtraPrice("");
              setEditingEstimatedIndex(null);
            }}
          />
        }
      />
      {estimatedError && <p className="text-red-500">{estimatedError}</p>}
      {savedEstimated.length > 0 && (
        <SavedEstimatedHours
          estimatedHours={savedEstimated}
          onEdit={(entry, index) => {
            handleEdit(
              index,
              {
                estimatedHours: setEstimatedHours,
                fastOption: setFastOption,
                extraPrice: setExtraPrice,
              },
              entry
            );
            setEditingEstimatedIndex(index);
          }}
          onDelete={(index) =>
            handleDelete(setSavedEstimated, savedEstimated, index)
          }
        />
      )}
      {/* Color System Section */}
      <Section
        title="Color System"
        isOpen={openSection === "color"}
        onToggle={() => toggleSection("color")}
        content={
          <ColorSection
            name={color_name}
            price={color_multiplier}
            image={color_image}
            selectedColor={selectedColor}
            onColorChange={handleColorChange}
            onNameChange={setcolor_name}
            onPriceChange={setcolor_multiplier}
            onSave={handleColorSave}
            onCancel={() => {
              setcolor_name("");
              setcolor_multiplier("");
              setcolor_image(initialImageState);
              setSelectedColor("#ffffff");
              setEditingColorIndex(null);
            }}
          />
        }
      />
      {colorError && <p className="text-red-500">{colorError}</p>}
      {savedColors.length > 0 && (
        <SavedColors
          colors={savedColors}
          color_multiplierIncrements={color_multiplierIncrements}
          onEdit={(entry, index) => {
            handleEdit(
              index,
              {
                color_name: setcolor_name,
                color_multiplier: setcolor_multiplier,
              },
              setcolor_image,
              entry
            );
            setEditingColorIndex(index);
          }}
          onDelete={(index) => handleDelete(setSavedColors, savedColors, index)}
        />
      )}
      {/* Draft and Publish Buttons */}
      <div className="flex justify-end space-x-2 pt-4">
        {configurError && (
          <p className="text-red-500 text-lg font-medium">{configurError}</p>
        )}
        <button
          className="px-6 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={saveDraft}
        >
          Save Draft
        </button>
        <button
          className="px-6 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600"
          onClick={publishProduct}
        >
          Publish
        </button>
      </div>
    </div>
  );
}

// Dimension Section Component
function DimensionSection({
  min_height,
  max_height,
  min_width,
  max_width,
  unit,
  onmin_heightChange,
  onmax_heightChange,
  onmin_widthChange,
  onmax_widthChange,
  onUnitChange,
  onSave,
  onCancel,
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[auto,1fr,1fr] gap-x-2 font-medium">
        <h2></h2>
        <h2 className="text-center">Minimum</h2>
        <h2 className="text-center">Maximum</h2>
      </div>
      <div className="grid grid-cols-[auto,1fr,1fr] gap-x-2 items-center">
        <label className="text-[15px] text-gray-700 whitespace-nowrap">
          Height *
        </label>
        <input
          type="number"
          value={min_height}
          onChange={(e) => onmin_heightChange(e.target.value)}
          placeholder="Minimum"
          className="w-full px-3 py-2 border border-teal-300 rounded-md focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="number"
          value={max_height}
          onChange={(e) => onmax_heightChange(e.target.value)}
          placeholder="Maximum"
          className="w-full px-3 py-2 border border-teal-300 rounded-md focus:ring-2 focus:ring-teal-500"
        />
      </div>
      <div className="grid grid-cols-[auto,1fr,1fr] gap-x-2 items-center">
        <label className="text-[15px] text-gray-700 whitespace-nowrap">
          Width *
        </label>
        <input
          type="number"
          value={min_width}
          onChange={(e) => onmin_widthChange(e.target.value)}
          placeholder="Minimum"
          className="w-full px-3 py-2 border border-teal-300 rounded-md focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="number"
          value={max_width}
          onChange={(e) => onmax_widthChange(e.target.value)}
          placeholder="Maximum"
          className="w-full px-3 py-2 border border-teal-300 rounded-md focus:ring-2 focus:ring-teal-500"
        />
      </div>
      <div className="grid grid-cols-[auto,1fr] gap-x-4 items-center">
        <label className="text-[15px] text-gray-700 whitespace-nowrap">
          Unit
        </label>
        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value)}
          className="w-full px-3 py-2 border border-teal-300 rounded-md focus:ring-2 focus:ring-teal-500"
        >
          <option value="mm">mm</option>
          <option value="cm">cm</option>
          <option value="inches">inches</option>
        </select>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-6 py-2 text-white bg-teal-500 rounded-md hover:bg-teal-600 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}

// Material Section Component
function MaterialSection({
  name,
  price,
  image,
  onNameChange,
  onPriceChange,
  onImageChange,
  onSave,
  onCancel,
}) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-lg text-left font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Material Name"
          className="mt-1 p-2 block w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Image *
          </label>
          <div className="mt-1 flex items-center border border-primary rounded-md p-2">
            <label className="cursor-pointer">
              <input type="file" onChange={onImageChange} className="hidden" />
              <span className="inline-block px-4 py-2 text-sm bg-teal-500 text-white rounded-l-md hover:bg-teal-600">
                Choose File
              </span>
            </label>
            <span className="ml-2 text-sm text-gray-500">{image.name}</span>
          </div>
        </div>
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Price/unit
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            className="mt-1 block p-3 w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
            placeholder="$00.00"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}

// Profile Section Component
function ProfileSection({
  name,
  price,
  image,
  features,
  newFeature,
  onNameChange,
  onPriceChange,
  onImageChange,
  onFeatureAdd,
  onFeatureChange,
  onFeatureDelete,
  onSave,
  onCancel,
}) {
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="mt-1 p-2 block w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
            placeholder="Profile Name"
          />
        </div>
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Features
          </label>
          <div className="flex items-center">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => onFeatureChange(e.target.value)}
              className="mt-1 p-2 block w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
              placeholder="Add a feature"
            />
            <button
              onClick={onFeatureAdd}
              className="ml-2 px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600"
            >
              Add
            </button>
          </div>
          <ul className="mt-2 space-y-3">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex justify-between items-center text-gray-700 list-disc ml-4"
              >
                {feature}
                <button
                  onClick={() => onFeatureDelete(index)}
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Image *
          </label>
          <div className="mt-1 flex items-center border border-primary rounded-md p-2">
            <label className="cursor-pointer">
              <input type="file" onChange={onImageChange} className="hidden" />
              <span className="inline-block px-4 py-2 text-sm bg-teal-500 text-white rounded-l-md hover:bg-teal-600">
                Choose File
              </span>
            </label>
            <span className="ml-2 text-sm text-gray-500">{image.name}</span>
          </div>
        </div>
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Price Increment (%)
          </label>
          <input
            type="text"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            className="mt-1 block p-3 w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
            placeholder="10 for 10%"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}

// Glass Section Component
function GlassSection({
  name,
  price,
  image,
  onNameChange,
  onPriceChange,
  onImageChange,
  onSave,
  onCancel,
  glazing_multiplier,
  onglazing_multiplierChange,
}) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-lg text-left font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Single Glazing"
          className="mt-1 p-2 block w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Image *
          </label>
          <div className="mt-1 flex items-center border border-primary rounded-md p-2">
            <label className="cursor-pointer">
              <input type="file" onChange={onImageChange} className="hidden" />
              <span className="inline-block px-4 py-2 text-sm bg-teal-500 text-white rounded-l-md hover:bg-teal-600">
                Choose File
              </span>
            </label>
            <span className="ml-2 text-sm text-gray-500">{image.name}</span>
          </div>
        </div>
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Price (Base Price per m<sup>2</sup>)
          </label>
          <input
            type="text"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            className="mt-1 block p-3 w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
            placeholder="$00.00"
          />
        </div>
      </div>
      <div>
        <label className="block text-lg text-left font-medium text-gray-700">
          Glazing Multiplier (%)
        </label>
        <input
          type="number"
          value={glazing_multiplier}
          onChange={(e) => onglazing_multiplierChange(e.target.value)}
          className="mt-1 block p-3 w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
          placeholder="1.0"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}

// Glass Structure Section Component
function GlassStructureSection({
  name,
  price,
  image,
  onNameChange,
  onPriceChange,
  onImageChange,
  onSave,
  onCancel,
  structure_multiplier,
  onstructure_multiplierChange,
}) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-lg text-left font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Glass Structure Name"
          className="mt-1 p-2 block w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Image *
          </label>
          <div className="mt-1 flex items-center border border-primary rounded-md p-2">
            <label className="cursor-pointer">
              <input type="file" onChange={onImageChange} className="hidden" />
              <span className="inline-block px-4 py-2 text-sm bg-teal-500 text-white rounded-l-md hover:bg-teal-600">
                Choose File
              </span>
            </label>
            <span className="ml-2 text-sm text-gray-500">{image.name}</span>
          </div>
        </div>
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Price (Base Price per m<sup>2</sup>)
          </label>
          <input
            type="text"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            className="mt-1 block p-3 w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
            placeholder="$00.00"
          />
        </div>
      </div>
      <div>
        <label className="block text-lg text-left font-medium text-gray-700">
          Price Increment (%)
        </label>
        <input
          type="number"
          value={structure_multiplier}
          onChange={(e) => onstructure_multiplierChange(e.target.value)}
          className="mt-1 block p-3 w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
          placeholder="1.0"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}

// Operating System Section Component
function OperatingSystemSection({
  name,
  price,
  image,
  onNameChange,
  onPriceChange,
  onImageChange,
  onSave,
  onCancel,
}) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-lg text-left font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Operating System Name"
          className="mt-1 p-2 block w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Image *
          </label>
          <div className="mt-1 flex items-center border border-primary rounded-md p-2">
            <label className="cursor-pointer">
              <input type="file" onChange={onImageChange} className="hidden" />
              <span className="inline-block px-4 py-2 text-sm bg-teal-500 text-white rounded-l-md hover:bg-teal-600">
                Choose File
              </span>
            </label>
            <span className="ml-2 text-sm text-gray-500">{image.name}</span>
          </div>
        </div>
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Price/unit
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            className="mt-1 block p-3 w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
            placeholder="$00.00"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}

// Handle Section Component
function HandleSection({
  name,
  price,
  image,
  onNameChange,
  onPriceChange,
  onImageChange,
  onSave,
  onCancel,
}) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-lg text-left font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Handle Name"
          className="mt-1 p-2 block w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Image *
          </label>
          <div className="mt-1 flex items-center border border-primary rounded-md p-2">
            <label className="cursor-pointer">
              <input type="file" onChange={onImageChange} className="hidden" />
              <span className="inline-block px-4 py-2 text-sm bg-teal-500 text-white rounded-l-md hover:bg-teal-600">
                Choose File
              </span>
            </label>
            <span className="ml-2 text-sm text-gray-500">{image.name}</span>
          </div>
        </div>
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Price/unit
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            className="mt-1 block p-3 w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
            placeholder="$00.00"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}

// Window Type Section Component
function WindowTypeSection({
  name,
  price,
  image,
  onNameChange,
  onPriceChange,
  onImageChange,
  onSave,
  onCancel,
}) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-lg text-left font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Window Type Name"
          className="mt-1 p-2 block w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Image *
          </label>
          <div className="mt-1 flex items-center border border-primary rounded-md p-2">
            <label className="cursor-pointer">
              <input type="file" onChange={onImageChange} className="hidden" />
              <span className="inline-block px-4 py-2 text-sm bg-teal-500 text-white rounded-l-md hover:bg-teal-600">
                Choose File
              </span>
            </label>
            <span className="ml-2 text-sm text-gray-500">{image.name}</span>
          </div>
        </div>
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Window Type Price Increment (%)
          </label>
          <input
            type="text"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            className="mt-1 block p-3 w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
            placeholder="10 for 10%"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}

// Fanlight Section Component
function FanlightSection({
  name,
  price,
  image,
  onNameChange,
  onPriceChange,
  onImageChange,
  onSave,
  onCancel,
}) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-lg text-left font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Fanlight Name"
          className="mt-1 p-2 block w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Image *
          </label>
          <div className="mt-1 flex items-center border border-primary rounded-md p-2">
            <label className="cursor-pointer">
              <input type="file" onChange={onImageChange} className="hidden" />
              <span className="inline-block px-4 py-2 text-sm bg-teal-500 text-white rounded-l-md hover:bg-teal-600">
                Choose File
              </span>
            </label>
            <span className="ml-2 text-sm text-gray-500">{image.name}</span>
          </div>
        </div>
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Price/unit
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            className="mt-1 block p-3 w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
            placeholder="$00.00"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}

// Estimated Working Hour Section Component
function EstimatedWorkingHourSection({
  estimatedHours,
  // fastOption,
  // extraPrice,
  onHoursChange,
  // onFastOptionChange,
  // onExtraPriceChange,
  onSave,
  onCancel,
}) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-lg text-left font-medium text-gray-700">
          Total Hour
        </label>
        <input
          type="text"
          value={estimatedHours}
          onChange={(e) => onHoursChange(e.target.value)}
          placeholder="e.g., 48"
          className="mt-1 p-2 block w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>
      {/* <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Fast Option
          </label>
          <select
            value={fastOption}
            onChange={(e) => onFastOptionChange(e.target.value)}
            className="mt-1 p-2 block w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="Normal">Normal</option>
            <option value="Express">Express</option>
          </select>
        </div>
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Extra Price
          </label>
          <input
            type="text"
            value={extraPrice}
            onChange={(e) => onExtraPriceChange(e.target.value)}
            placeholder="$00.00"
            className="mt-1 p-2 block w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>
      </div> */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}

// Color Section Component
const ColorSection = ({
  name,
  price,
  image,
  selectedColor,
  onColorChange,
  onNameChange,
  onPriceChange,
  onSave,
  onCancel,
}) => {
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-lg text-left font-medium text-gray-700">
          Color Picker
        </label>
        <SketchPicker
          color={selectedColor}
          onChangeComplete={onColorChange}
          disableAlpha={true}
        />
      </div>

      <div>
        <label className="block text-lg text-left font-medium text-gray-700">
          Color Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-100"
          placeholder="Enter color name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Color Preview
          </label>
          <div
            className="mt-2 h-20 w-20 border border-gray-300"
            style={{ backgroundColor: selectedColor }}
          />
        </div>
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Price Increment (%)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            className="mt-1 block p-3 w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
            placeholder="10 for 10%"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={image.loading}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={image.loading}
          className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};
