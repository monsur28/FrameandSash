import { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import {
  ColorSection,
  DimensionSection,
  EstimatedWorkingHourSection,
  FanlightSection,
  GlassSection,
  GlassStructureSection,
  HandleSection,
  MaterialSection,
  OperatingSystemSection,
  ProfileSection,
  WindowTypeSection,
} from "../../../../../Components/Configurator/SetSavedWindowSection";
import { X } from "lucide-react";

// Utility function to calculate multipliers
const calculateMultiplier = (input) => {
  return (100 + Number.parseInt(input)) / 100;
};

// Utility function to validate multiplier input
const isValidMultiplierInput = (input) => {
  const num = Number.parseFloat(input);
  return !isNaN(num) && num >= 0; // Ensure input is a non-negative number
};

// Main Product Configuration Component
export default function WindowConfigurator() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("1");
  // eslint-disable-next-line no-unused-vars
  const [selectedCategoryName, setSelectedCategoryName] = useState("1");
  const [openSection, setOpenSection] = useState(null);
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

  const [dimensionError, setDimensionError] = useState("");
  const [name, setname] = useState("");
  const [image, setimage] = useState(initialImageState);
  const [savedMaterials, setSavedMaterials] = useState([]);
  console.log(savedMaterials);
  const [editingMaterialIndex, setEditingMaterialIndex] = useState(null);
  const [materialError, setMaterialError] = useState("");

  const [profile_name, setprofile_name] = useState("");
  const [profile_multiplier, setprofile_multiplier] = useState("");
  const [profile_image, setprofile_image] = useState(initialImageState);
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState("");
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [editingProfileIndex, setEditingProfileIndex] = useState(null);
  const [profile_multiplierIncrements, setprofile_multiplierIncrements] =
    useState([]);

  const [profileError, setProfileError] = useState("");

  const [glassName, setGlassName] = useState("");
  const [glassPrice, setGlassPrice] = useState("");
  const [glassImage, setGlassImage] = useState(initialImageState);
  const [glazing_multiplier, setglazing_multiplier] = useState(1);
  const [savedGlasses, setSavedGlasses] = useState([]);
  const [editingGlassIndex, setEditingGlassIndex] = useState(null);
  const [glazingPriceIncrements, setGlazingPriceIncrements] = useState([]);

  const [glassError, setGlassError] = useState("");

  const [glassStructureName, setGlassStructureName] = useState("");
  const [glassStructurePrice, setGlassStructurePrice] = useState("");
  const [glassStructureImage, setGlassStructureImage] =
    useState(initialImageState);
  const [structure_multiplier, setstructure_multiplier] = useState(1);
  const [savedGlassStructures, setSavedGlassStructures] = useState([]);
  const [editingGlassStructureIndex, setEditingGlassStructureIndex] =
    useState(null);
  const [structurePriceIncrements, setStructurePriceIncrements] = useState([]);
  const [structureError, setStructureError] = useState("");

  const [openingName, setopeningName] = useState("");
  const [openingPrice, setopeningPrice] = useState("");
  const [opening_image, setopening_image] = useState(initialImageState);
  const [savedOpening, setSavedOpening] = useState([]);
  const [editingOperatingIndex, setEditingOperatingIndex] = useState(null);

  const [operatingError, setOperatingError] = useState("");

  const [type, settype] = useState("");
  const [price, setprice] = useState("");
  const [handle_image, sethandle_image] = useState(initialImageState);
  const [savedHandles, setSavedHandles] = useState([]);
  const [editingHandleIndex, setEditingHandleIndex] = useState(null);

  const [handleError, setHandleError] = useState("");

  const [windowTypeName, setWindowTypeName] = useState("");
  const [window_type_multiplier, setwindow_type_multiplier] = useState("");
  const [windowTypeImage, setWindowTypeImage] = useState(initialImageState);
  const [savedWindows, setSavedWindows] = useState([]);
  const [editingWindowIndex, setEditingWindowIndex] = useState(null);
  const [
    window_type_multiplierIncrements,
    setwindow_type_multiplierIncrements,
  ] = useState([]);

  const [windowTypeError, setWindowTypeError] = useState("");

  const [fanlightName, setFanlightName] = useState("");
  const [fanlightPrice, setFanlightPrice] = useState("");
  const [fanlight_image, setfanlight_image] = useState(initialImageState);
  const [savedFanlights, setSavedFanlights] = useState([]);
  const [editingFanlightIndex, setEditingFanlightIndex] = useState(null);

  const [fanlightError, setFanlightError] = useState("");

  const [estimatedHours, setEstimatedHours] = useState("");
  const [fastOption, setFastOption] = useState("Normal");
  const [extraPrice, setExtraPrice] = useState("");
  const [savedEstimated, setSavedEstimated] = useState([]);
  const [editingEstimatedIndex, setEditingEstimatedIndex] = useState(null);

  const [estimatedError, setEstimatedError] = useState("");

  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [color_name, setcolor_name] = useState("");
  const [color_multiplier, setcolor_multiplier] = useState("");
  const [color_image, setcolor_image] = useState(initialImageState);
  const [savedColors, setSavedColors] = useState([]);
  const [editingColorIndex, setEditingColorIndex] = useState(null);
  const [color_multiplierIncrements, setcolor_multiplierIncrements] = useState(
    []
  );

  // ---- Info Tooltip States ----
  const [showDimensionInfo, setShowDimensionInfo] = useState(false);
  const [showMaterialInfo, setShowMaterialInfo] = useState(false);
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [showGlassInfo, setShowGlassInfo] = useState(false);
  const [showGlassStructureInfo, setShowGlassStructureInfo] = useState(false);
  const [showOperatingInfo, setShowOperatingInfo] = useState(false);
  const [showHandleInfo, setShowHandleInfo] = useState(false);
  const [showWindowInfo, setShowWindowInfo] = useState(false);
  const [showFanlightInfo, setShowFanlightInfo] = useState(false);
  const [showEstimatedInfo, setShowEstimatedInfo] = useState(false);
  const [showColorInfo, setShowColorInfo] = useState(false);

  const infoRefs = {
    dimension: useRef(null),
    material: useRef(null),
    profile: useRef(null),
    glass: useRef(null),
    glassStructure: useRef(null),
    operating: useRef(null),
    handle: useRef(null),
    window: useRef(null),
    fanlight: useRef(null),
    estimated: useRef(null),
    color: useRef(null),
  };

  const [colorError, setColorError] = useState("");
  const [configurError, setConfigurError] = useState("");

  // Instructions content for each section
  const instructionsContent = {
    dimensions: {
      title: "Dimension Instructions",
      description:
        "Enter the minimum and maximum dimensions for the window. These values will determine the size range customers can select. The unit can be set to mm, cm, or inches based on your preference.",
      formula: "Window Area = Width × Height (used in price calculations)",
      examples: [
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
      ],
    },
    material: {
      title: "Material Instructions",
      description:
        "Add different material options for the window frame. Each material should have a name, image, and base price. The material price affects the overall cost calculation.",
      formula: "Frame Cost = Material Price per meter × Frame Perimeter",
      examples: [
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
      ],
    },
    profile: {
      title: "Profile Instructions",
      description:
        "Profiles determine the structural characteristics of the window frame. Add different profile options with features and price multipliers. The multiplier is applied to the base frame cost.",
      formula: "Profile Adjusted Cost = Base Frame Cost × Profile Multiplier",
      examples: [
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
      ],
    },
    glass: {
      title: "Glass Type Instructions",
      description:
        "Add different glass type options with their respective prices and glazing multipliers. The glazing multiplier affects the final glass cost calculation.",
      formula:
        "Glazing Cost = Base Price per m² × Window Area × Glazing Multiplier",
      examples: [
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
      ],
    },
    glassStructure: {
      title: "Glass Structure Instructions",
      description:
        "Glass structures determine the appearance and properties of the window glass. Add different structure options with their prices and multipliers.",
      formula:
        "Glass Structure Cost = Base Price + (Window Area × Base Glass Price × Glazing Multiplier × Structure Multiplier)",
      examples: [
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
      ],
    },
    operating: {
      title: "Operating System Instructions",
      description:
        "Add different opening system options for the window. Each system should have a name, image, and price. This affects how the window opens and closes.",
      formula: "Opening System Cost = Base Price of Selected Opening System",
      examples: [
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
      ],
    },
    handle: {
      title: "Handle Type Instructions",
      description:
        "Add different handle options for the window. Each handle should have a type name, image, and price. The handle affects both aesthetics and functionality.",
      formula: "Handle & Lock Cost = Base Price of Selected Handle",
      examples: [
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
      ],
    },
    window: {
      title: "Window Type Instructions",
      description:
        "Add different window type options with their respective names, images, and price multipliers. The window type affects the overall design and functionality.",
      formula:
        "Window Type Adjusted Cost = Color Adjusted Cost × Window Type Multiplier",
      examples: [
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
      ],
    },
    fanlight: {
      title: "Fanlight System Instructions",
      description:
        "Add different fanlight options for the window. Fanlights are fixed window sections positioned above or below the main window.",
      formula: "Fanlight Cost = Base Price of Selected Fanlight Option",
      examples: [
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
      ],
    },
    estimated: {
      title: "Estimated Working Hour Instructions",
      description:
        "Set the estimated working hours for window installation. You can also specify fast options with extra costs for expedited service.",
      formula:
        "Total Labor Cost = Hourly Rate × Estimated Hours + Extra Price (if Fast Option selected)",
      examples: [
        {
          name: "Standard Installation (3 hours)",
          calculation: "$50/hour × 3 hours",
          result: "$150.00",
        },
        {
          name: "Fast Installation (3 hours)",
          calculation: "$50/hour × 3 hours + $50 extra",
          result: "$200.00",
        },
      ],
    },
    color: {
      title: "Color System Instructions",
      description:
        "Add different color options for the window frame. Each color should have a name, color value, and price multiplier.",
      formula: "Color Adjusted Cost = Profile Adjusted Cost × Color Multiplier",
      examples: [
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
      ],
    },
  };

  const toggleInfo = (setter, type) => {
    setter((prev) => !prev);
    setOpenSection(type);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const refs = Object.values(infoRefs);
      if (
        !refs.some((ref) => ref.current && ref.current.contains(event.target))
      ) {
        setShowDimensionInfo(false);
        setShowMaterialInfo(false);
        setShowProfileInfo(false);
        setShowGlassInfo(false);
        setShowGlassStructureInfo(false);
        setShowOperatingInfo(false);
        setShowHandleInfo(false);
        setShowWindowInfo(false);
        setShowFanlightInfo(false);
        setShowEstimatedInfo(false);
        setShowColorInfo(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosSecure.get("/product-categories");
        const windowsCategory = response.data.find(
          (cat) => cat.category_name.toLowerCase() === "windows"
        );
        if (windowsCategory) {
          setCategories([windowsCategory]);
          setSelectedCategoryId(windowsCategory.id.toString());
          setSelectedCategoryName("windows");
        } else {
          setCategories([]);
          setSelectedCategoryId(null);
          setSelectedCategoryName("");
          toast.error("Windows category not found.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories.");
      }
    };

    fetchCategories();
  }, []);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

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

  const uploadColorToImgBB = async (hexColor) => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 50;
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
      setEditingIndex(null);
    } else {
      setState([...state, newData]);
      toast.success("Saved successfully!");
    }
  };

  const validateDimensions = () => {
    if (!min_height || !max_height || !min_width || !max_width) {
      setDimensionError("All dimension fields are required.");
      return false;
    }
    if (Number.parseFloat(min_height) > Number.parseFloat(max_height)) {
      setDimensionError(
        "Minimum height cannot be greater than maximum height."
      );
      return false;
    }
    if (Number.parseFloat(min_width) > Number.parseFloat(max_width)) {
      setDimensionError("Minimum width cannot be greater than maximum width.");
      return false;
    }
    setDimensionError("");
    return true;
  };

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
    const percentageValue = Number.parseFloat(profile_multiplier);
    const calculatedMultiplier = calculateMultiplier(percentageValue);

    handleSave(
      setSavedProfiles,
      savedProfiles,
      {
        profile_name,
        features,
        profile_image: profile_image.url,
        profile_multiplier: calculatedMultiplier,
      },
      editingProfileIndex,
      setEditingProfileIndex
    );

    const updatedIncrements = [...profile_multiplierIncrements];
    if (editingProfileIndex !== null) {
      updatedIncrements[editingProfileIndex] = percentageValue;
    } else {
      updatedIncrements.push(percentageValue);
    }
    setprofile_multiplierIncrements(updatedIncrements);
    setProfileError("");
  };

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
    const percentageValue = Number.parseFloat(glazing_multiplier);
    const calculatedMultiplier = calculateMultiplier(percentageValue);

    handleSave(
      setSavedGlasses,
      savedGlasses,
      {
        type: glassName,
        glass_image: glassImage.url,
        price: glassPrice,
        glazing_multiplier: calculatedMultiplier,
      },
      editingGlassIndex,
      setEditingGlassIndex
    );

    const updatedIncrements = [...glazingPriceIncrements];
    if (editingGlassIndex !== null) {
      updatedIncrements[editingGlassIndex] = percentageValue;
    } else {
      updatedIncrements.push(percentageValue);
    }
    setGlazingPriceIncrements(updatedIncrements);
    setGlassError("");
  };

  const handleStructureSave = () => {
    if (!glassStructureName || !isValidMultiplierInput(structure_multiplier)) {
      setStructureError(
        "Glass structure name and a valid multiplier are required."
      );
      return;
    }
    const percentageValue = Number.parseFloat(structure_multiplier);
    const calculatedMultiplier = calculateMultiplier(percentageValue);

    handleSave(
      setSavedGlassStructures,
      savedGlassStructures,
      {
        type: glassStructureName,
        glass_image: glassStructureImage.url,
        price: glassStructurePrice,
        structure_multiplier: calculatedMultiplier,
      },
      editingGlassStructureIndex,
      setEditingGlassStructureIndex
    );

    const updatedIncrements = [...structurePriceIncrements];
    if (editingGlassStructureIndex !== null) {
      updatedIncrements[editingGlassStructureIndex] = percentageValue;
    } else {
      updatedIncrements.push(percentageValue);
    }
    setStructurePriceIncrements(updatedIncrements);
    setStructureError("");
  };

  const handleColorSave = () => {
    if (!color_name || !isValidMultiplierInput(color_multiplier)) {
      setColorError("Color name and a valid price are required.");
      return;
    }
    const percentageValue = Number.parseFloat(color_multiplier);
    const calculatedMultiplier = calculateMultiplier(percentageValue);

    handleSave(
      setSavedColors,
      savedColors,
      {
        color_name,
        color_image: color_image.url,
        color_multiplier: calculatedMultiplier,
        color: selectedColor,
      },
      editingColorIndex,
      setEditingColorIndex
    );

    const updatedIncrements = [...color_multiplierIncrements];
    if (editingColorIndex !== null) {
      updatedIncrements[editingColorIndex] = percentageValue;
    } else {
      updatedIncrements.push(percentageValue);
    }
    setcolor_multiplierIncrements(updatedIncrements);
    setColorError("");
  };

  const handleWindowSave = () => {
    if (!windowTypeName || !isValidMultiplierInput(window_type_multiplier)) {
      setWindowTypeError("Window type name and a valid price are required.");
      return;
    }

    const percentageValue = Number.parseFloat(window_type_multiplier);
    const calculatedMultiplier = calculateMultiplier(percentageValue);

    handleSave(
      setSavedWindows,
      savedWindows,
      {
        type: windowTypeName,
        type_image: windowTypeImage.url,
        window_type_multiplier: calculatedMultiplier,
      },
      editingWindowIndex,
      setEditingWindowIndex
    );

    const updatedIncrements = [...window_type_multiplierIncrements];
    if (editingWindowIndex !== null) {
      updatedIncrements[editingWindowIndex] = percentageValue;
    } else {
      updatedIncrements.push(percentageValue);
    }

    setwindow_type_multiplierIncrements(updatedIncrements);
    setWindowTypeError("");
  };

  const handleEdit = (index, setters, data) => {
    Object.entries(data).forEach(([key, value]) => {
      if (setters[key]) setters[key](value);
    });
  };

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
      if (material.image) {
        formData.append(`materials[${index}][image]`, material.image);
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
      if (profile.profile_image) {
        formData.append(
          `profile_features[${index}][profile_image]`,
          profile.profile_image
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
      formData.append(`glass_types[${index}][type]`, glass.type);
      formData.append(`glass_types[${index}][price]`, glass.price);
      formData.append(
        `glass_types[${index}][glazing_multiplier]`,
        calculateMultiplier(glazingPriceIncrements[index])
      );
      if (glass.glass_image) {
        formData.append(
          `glass_types[${index}][glass_image]`,
          glass.glass_image
        );
      }
    });

    savedGlassStructures.forEach((structure, index) => {
      formData.append(`glass_structures[${index}][type]`, structure.type);
      formData.append(`glass_structures[${index}][price]`, structure.price);
      formData.append(
        `glass_structures[${index}][structure_multiplier]`,
        calculateMultiplier(structurePriceIncrements[index])
      );
      if (structure.glass_image) {
        formData.append(
          `glass_structures[${index}][glass_image]`,
          structure.glass_image
        );
      }
    });

    savedOpening.forEach((operating, index) => {
      formData.append(`opening_systems[${index}][name]`, operating.name);
      formData.append(`opening_systems[${index}][price]`, operating.price);
      if (operating.opening_image) {
        formData.append(
          `opening_systems[${index}][opening_image]`,
          operating.opening_image
        );
      }
    });

    savedHandles.forEach((handle, index) => {
      formData.append(`handles[${index}][type]`, handle.type);
      formData.append(`handles[${index}][price]`, handle.price);
      if (handle.handle_image) {
        formData.append(`handles[${index}][handle_image]`, handle.handle_image);
      }
    });

    savedWindows.forEach((window, index) => {
      formData.append(`window_types[${index}][type]`, window.type);
      formData.append(
        `window_types[${index}][window_type_multiplier]`,
        calculateMultiplier(window_type_multiplierIncrements[index])
      );
      if (window.type_image) {
        formData.append(
          `window_types[${index}][type_image]`,
          window.type_image
        );
      }
    });

    savedFanlights.forEach((fanlight, index) => {
      formData.append(
        `fanlights[${index}][availability]`,
        fanlight.availability
      );
      formData.append(`fanlights[${index}][price]`, fanlight.price);
      if (fanlight.fanlight_image) {
        formData.append(
          `fanlights[${index}][fanlight_image]`,
          fanlight.fanlight_image
        );
      }
    });

    if (savedEstimated.length === 0)
      throw new Error("Working hours information is required");
    const workingHours = savedEstimated[0];
    formData.append("working_hours[total_hour]", workingHours.total_hour);
    formData.append(
      "working_hours[fastening_type]",
      workingHours.fastening_type
    );
    // formData.append(
    //   "working_hours[extra_cost]",
    //   workingHours.extra_cost || "0"
    // );

    savedColors.forEach((color, index) => {
      formData.append(`colors[${index}][color_name]`, color.color_name);
      formData.append(
        `colors[${index}][color_multiplier]`,
        calculateMultiplier(color_multiplierIncrements[index])
      );
      formData.append(`colors[${index}][color_value]`, color.color_image);
    });

    for (const pair of formData.entries()) {
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
      localStorage.removeItem("draft");
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      setConfigurError(errorMessage);
      console.error("Error details:", error.response?.data);
      toast.error(errorMessage);
    }
  };

  // Function to render instructions details
  const renderInstructionsDetails = (type) => {
    const info = instructionsContent[type];
    if (!info) return null;

    return (
      <div className="mt-3 p-4 border border-gray-200 rounded-md bg-white">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold text-gray-800">{info.title}</h3>
          <button
            onClick={() => {
              switch (type) {
                case "dimensions":
                  setShowDimensionInfo(false);
                  break;
                case "material":
                  setShowMaterialInfo(false);
                  break;
                case "profile":
                  setShowProfileInfo(false);
                  break;
                case "glass":
                  setShowGlassInfo(false);
                  break;
                case "glassStructure":
                  setShowGlassStructureInfo(false);
                  break;
                case "operating":
                  setShowOperatingInfo(false);
                  break;
                case "handle":
                  setShowHandleInfo(false);
                  break;
                case "window":
                  setShowWindowInfo(false);
                  break;
                case "fanlight":
                  setShowFanlightInfo(false);
                  break;
                case "estimated":
                  setShowEstimatedInfo(false);
                  break;
                case "color":
                  setShowColorInfo(false);
                  break;
                default:
                  break;
              }
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-gray-700 mb-4">{info.description}</p>

        {info.formula && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Formula:</h4>
            <div className="p-3 bg-gray-100 rounded-md font-mono text-sm">
              {info.formula}
            </div>
          </div>
        )}

        {info.examples && info.examples.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Examples:</h4>
            <div className="space-y-3">
              {info.examples.map((example, index) => (
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
  };

  return (
    <div className="p-2 space-y-4">
      <ToastContainer />
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

      <Section
        title={
          <div className="flex items-center justify-between w-full">
            <span>Dimension</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowDimensionInfo, "dimensions");
              }}
              className="px-3 py-1 ml-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300 focus:outline-none"
            >
              Instructions
            </button>
          </div>
        }
        isOpen={openSection === "dimensions"}
        onToggle={() => toggleSection("dimensions")}
        content={
          <>
            {showDimensionInfo && renderInstructionsDetails("dimensions")}
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
              onSave={handleDimensionSave}
              onCancel={() => {
                setmin_height("");
                setmax_height("");
                setmin_width("");
                setmax_width("");
                setUnit("mm");
                setEditingDimensionIndex(null);
              }}
            />
          </>
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

      <Section
        title={
          <div className="flex items-center justify-between w-full">
            <span>Material</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowMaterialInfo, "material");
              }}
              className="px-3 py-1 ml-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300 focus:outline-none"
            >
              Instructions
            </button>
          </div>
        }
        isOpen={openSection === "material"}
        onToggle={() => toggleSection("material")}
        content={
          <>
            {showMaterialInfo && renderInstructionsDetails("material")}

            <MaterialSection
              name={name}
              image={image}
              onNameChange={setname}
              onImageChange={(e) => handleFileChange(e, "material")}
              onSave={() => {
                if (!name || !image.url) {
                  setMaterialError("Material name and image are required.");
                  return;
                }
                handleSave(
                  setSavedMaterials,
                  savedMaterials,
                  { name, image },
                  editingMaterialIndex,
                  setEditingMaterialIndex
                );
              }}
              onCancel={() => {
                setname("");
                setimage(initialImageState);
                setEditingMaterialIndex(null);
              }}
            />
          </>
        }
      />

      {materialError && <p className="text-red-500 text-lg">{materialError}</p>}
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

      <Section
        title={
          <div className="flex items-center justify-between w-full">
            <span>Profile</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowProfileInfo, "profile");
              }}
              className="px-3 py-1 ml-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300 focus:outline-none"
            >
              Instructions
            </button>
          </div>
        }
        isOpen={openSection === "profile"}
        onToggle={() => toggleSection("profile")}
        content={
          <>
            {showProfileInfo && renderInstructionsDetails("profile")}

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
          </>
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

      <Section
        title={
          <div className="flex items-center justify-between w-full">
            <span>Glass Types</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowGlassInfo, "glass");
              }}
              className="px-3 py-1 ml-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300 focus:outline-none"
            >
              Instructions
            </button>
          </div>
        }
        isOpen={openSection === "glass"}
        onToggle={() => toggleSection("glass")}
        content={
          <>
            {showGlassInfo && renderInstructionsDetails("glass")}

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
          </>
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

      {/* Continue with other sections following the same pattern */}
      {/* Each section should have the Instructions button beside Show more */}

      <Section
        title={
          <div className="flex items-center justify-between w-full">
            <span>Glass Structure</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowGlassStructureInfo, "glassStructure");
              }}
              className="px-3 py-1 ml-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300 focus:outline-none"
            >
              Instructions
            </button>
          </div>
        }
        isOpen={openSection === "glassStructure"}
        onToggle={() => toggleSection("glassStructure")}
        content={
          <>
            {showGlassStructureInfo &&
              renderInstructionsDetails("glassStructure")}

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
          </>
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

      {/* Add the remaining sections with the same pattern */}
      <Section
        title={
          <div className="flex items-center justify-between w-full">
            <span>Opening System</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowOperatingInfo, "operating");
              }}
              className="px-3 py-1 ml-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300 focus:outline-none"
            >
              Instructions
            </button>
          </div>
        }
        isOpen={openSection === "operating"}
        onToggle={() => toggleSection("operating")}
        content={
          <>
            {showOperatingInfo && renderInstructionsDetails("operating")}

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
                setOperatingError("");
              }}
              onCancel={() => {
                setopeningName("");
                setopeningPrice("");
                setopening_image(initialImageState);
                setEditingOperatingIndex(null);
              }}
            />
          </>
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

      <Section
        title={
          <div className="flex items-center justify-between w-full">
            <span>Handle</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowHandleInfo, "handle");
              }}
              className="px-3 py-1 ml-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300 focus:outline-none"
            >
              Instructions
            </button>
          </div>
        }
        isOpen={openSection === "handle"}
        onToggle={() => toggleSection("handle")}
        content={
          <>
            {showHandleInfo && renderInstructionsDetails("handle")}

            <HandleSection
              name={type}
              price={price}
              image={handle_image}
              onNameChange={settype}
              onPriceChange={setprice}
              onImageChange={(e) => handleFileChange(e, "handle")}
              onSave={() => {
                if (!type || !isValidMultiplierInput(price)) {
                  setHandleError("Handle type and a valid price are required.");
                  return;
                }
                handleSave(
                  setSavedHandles,
                  savedHandles,
                  { type, handle_image: handle_image.url, price },
                  editingHandleIndex,
                  setEditingHandleIndex
                );
                setHandleError("");
              }}
              onCancel={() => {
                settype("");
                setprice("");
                sethandle_image(initialImageState);
                setEditingHandleIndex(null);
              }}
            />
          </>
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

      <Section
        title={
          <div className="flex items-center justify-between w-full">
            <span>Window Type</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowWindowInfo, "window");
              }}
              className="px-3 py-1 ml-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300 focus:outline-none"
            >
              Instructions
            </button>
          </div>
        }
        isOpen={openSection === "window"}
        onToggle={() => toggleSection("window")}
        content={
          <>
            {showWindowInfo && renderInstructionsDetails("window")}

            <WindowTypeSection
              name={windowTypeName}
              price={window_type_multiplier}
              image={windowTypeImage}
              window_type_multiplierIncrements={
                window_type_multiplierIncrements
              }
              onNameChange={setWindowTypeName}
              onPriceChange={setwindow_type_multiplier}
              onImageChange={(e) => handleFileChange(e, "window")}
              onSave={handleWindowSave}
              onCancel={() => {
                setWindowTypeName("");
                setwindow_type_multiplier("");
                setWindowTypeImage(initialImageState);
                setEditingWindowIndex(null);
              }}
            />
          </>
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
                type_image: setWindowTypeImage,
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

      <Section
        title={
          <div className="flex items-center justify-between w-full">
            <span>Fanlight</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowFanlightInfo, "fanlight");
              }}
              className="px-3 py-1 ml-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300 focus:outline-none"
            >
              Instructions
            </button>
          </div>
        }
        isOpen={openSection === "fanlight"}
        onToggle={() => toggleSection("fanlight")}
        content={
          <>
            {showFanlightInfo && renderInstructionsDetails("fanlight")}

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
                    fanlight_image: fanlight_image.url,
                    price: fanlightPrice,
                  },
                  editingFanlightIndex,
                  setEditingFanlightIndex
                );
                setFanlightError("");
              }}
              onCancel={() => {
                setFanlightName("");
                setFanlightPrice("");
                setfanlight_image(initialImageState);
                setEditingFanlightIndex(null);
              }}
            />
          </>
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

      <Section
        title={
          <div className="flex items-center justify-between w-full">
            <span>Estimated Working Hour</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowEstimatedInfo, "estimated");
              }}
              className="px-3 py-1 ml-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300 focus:outline-none"
            >
              Instructions
            </button>
          </div>
        }
        isOpen={openSection === "estimated"}
        onToggle={() => toggleSection("estimated")}
        content={
          <>
            {showEstimatedInfo && renderInstructionsDetails("estimated")}

            <EstimatedWorkingHourSection
              hours={estimatedHours}
              fastOption={fastOption}
              extraPrice={extraPrice}
              onHoursChange={setEstimatedHours}
              onFastOptionChange={setFastOption}
              onExtraPriceChange={setExtraPrice}
              onSave={() => {
                if (!estimatedHours) {
                  setEstimatedError("Estimated hours are required.");
                  return;
                }
                handleSave(
                  setSavedEstimated,
                  savedEstimated,
                  { total_hour: estimatedHours, fastOption, extraPrice },
                  editingEstimatedIndex,
                  setEditingEstimatedIndex
                );
                setEstimatedError("");
              }}
              onCancel={() => {
                setEstimatedHours("");
                setFastOption("Normal");
                setExtraPrice("");
                setEditingEstimatedIndex(null);
              }}
            />
          </>
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
                total_hour: setEstimatedHours,
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

      <Section
        title={
          <div className="flex items-center justify-between w-full">
            <span>Color</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowColorInfo, "color");
              }}
              className="px-3 py-1 ml-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300 focus:outline-none"
            >
              Instructions
            </button>
          </div>
        }
        isOpen={openSection === "color"}
        onToggle={() => toggleSection("color")}
        content={
          <>
            {showColorInfo && renderInstructionsDetails("color")}

            <ColorSection
              selectedColor={selectedColor}
              name={color_name}
              price={color_multiplier}
              image={color_image}
              onColorChange={handleColorChange}
              onNameChange={setcolor_name}
              onPriceChange={setcolor_multiplier}
              onImageChange={(e) => handleFileChange(e, "color")}
              onSave={handleColorSave}
              onCancel={() => {
                setcolor_name("");
                setcolor_multiplier("");
                setcolor_image(initialImageState);
                setSelectedColor("#ffffff");
                setEditingColorIndex(null);
              }}
            />
          </>
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
