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
    const percentageValue = parseFloat(profile_multiplier);
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
    const percentageValue = parseFloat(glassPrice);
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
    const percentageValue = parseFloat(structure_multiplier);
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
    const percentageValue = parseFloat(color_multiplier);
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
          <div className="flex items-center gap-2">
            <span>Dimension</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowDimensionInfo, "dimensions");
              }}
              className="p-1 focus:outline-none border border-gray-500 rounded-full"
            >
              <span className="text-xl">ℹ️</span>
            </button>
          </div>
        }
        isOpen={openSection === "dimensions"}
        onToggle={() => toggleSection("dimensions")}
        content={
          <>
            {showDimensionInfo && (
              <div
                ref={infoRefs.dimension}
                className="absolute bg-white text-gray-700 border border-gray-300 rounded-lg p-4 shadow-lg z-10 mt-2 w-96 lg:w-[500px]"
              >
                <h4 className="font-semibold mb-2 text-lg">
                  How to Add Dimensions
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-base">
                  <li>
                    <strong>Min Height:</strong> Enter the minimum height of the
                    window.
                  </li>
                  <li>
                    <strong>Max Height:</strong> Enter the maximum height of the
                    window.
                  </li>
                  <li>
                    <strong>Min Width:</strong> Enter the minimum width of the
                    window.
                  </li>
                  <li>
                    <strong>Max Width:</strong> Enter the maximum width of the
                    window.
                  </li>
                  <li>
                    <strong>Unit:</strong> Select the unit of measurement (mm,
                    cm, inch).
                  </li>
                </ul>
              </div>
            )}
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
          <div className="flex items-center gap-2">
            <span>Material</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowMaterialInfo, "material");
              }}
              className="p-1 focus:outline-none border border-gray-500 rounded-full"
            >
              <span className="text-xl">ℹ️</span>
            </button>
          </div>
        }
        isOpen={openSection === "material"}
        onToggle={() => toggleSection("material")}
        content={
          <>
            {showMaterialInfo && (
              <div
                ref={infoRefs.material}
                className="absolute bg-white text-gray-700 border border-gray-300 rounded-lg p-4 shadow-lg z-10 mt-2 w-96 lg:w-[500px]"
              >
                <h4 className="font-semibold mb-2 text-lg">
                  How to add Material
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-base">
                  <li>
                    <strong>Material Name:</strong> Enter the name of the
                    Material.
                  </li>
                  <li>
                    <strong>Image:</strong> Upload the image of the material.
                  </li>
                  <li>
                    <strong>Price:</strong> Set the Price of the material.
                  </li>
                </ul>
              </div>
            )}

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

      <Section
        title={
          <div className="flex items-center gap-2">
            <span>Profile</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowProfileInfo, "profile");
              }}
              className="p-1 focus:outline-none border border-gray-500 rounded-full"
            >
              <span className="text-xl">ℹ️</span>
            </button>
          </div>
        }
        isOpen={openSection === "profile"}
        onToggle={() => toggleSection("profile")}
        content={
          <>
            {showProfileInfo && (
              <div
                ref={infoRefs.profile}
                className="absolute bg-white text-gray-700 border border-gray-300 rounded-lg p-4 shadow-lg z-10 mt-2 w-72"
              >
                <h4 className="font-semibold mb-2 text-lg">
                  How to add profile
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-base">
                  <li>
                    <strong>Profile Name:</strong> Enter the name of the
                    profile.
                  </li>
                  <li>
                    <strong>Price:</strong> Enter the increment price of the
                    profile in percentage.
                  </li>
                  <li>
                    <strong>Feature:</strong> Enter the features of the profile
                    and add.
                  </li>
                  <li>
                    <strong>Image:</strong> Upload the image of the material.
                  </li>
                </ul>
              </div>
            )}

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
          <div className="flex items-center gap-2">
            <span>Glass Types</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowGlassInfo, "glass");
              }}
              className="p-1 focus:outline-none border border-gray-500 rounded-full"
            >
              <span className="text-xl">ℹ️</span>
            </button>
          </div>
        }
        isOpen={openSection === "glass"}
        onToggle={() => toggleSection("glass")}
        content={
          <>
            {showGlassInfo && (
              <div
                ref={infoRefs.glass}
                className="absolute bg-white text-gray-700 border border-gray-300 rounded-lg p-4 shadow-lg z-10 mt-2 w-96 lg:w-[500px]"
              >
                <h4 className="font-semibold mb-2 text-lg">
                  How to add Glass Types
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-base">
                  <li>
                    <strong>Glass Name:</strong> Enter the name of the glass
                    type.
                  </li>
                  <li>
                    <strong>Price:</strong> Enter the price of the glass type.
                  </li>
                  <li>
                    <strong>Glazing Multiplier:</strong> Enter the glazing
                    multiplier value.
                  </li>
                  <li>
                    <strong>Image:</strong> Upload an image of the glass type.
                  </li>
                </ul>
              </div>
            )}

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

      <Section
        title={
          <div className="flex items-center gap-2">
            <span>Glass Structure</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowGlassStructureInfo, "glassStructure");
              }}
              className="p-1 focus:outline-none border border-gray-500 rounded-full"
            >
              <span className="text-xl">ℹ️</span>
            </button>
          </div>
        }
        isOpen={openSection === "glassStructure"}
        onToggle={() => toggleSection("glassStructure")}
        content={
          <>
            {showGlassStructureInfo && (
              <div
                ref={infoRefs.glassStructure}
                className="absolute bg-white text-gray-700 border border-gray-300 rounded-lg p-4 shadow-lg z-10 mt-2 w-96 lg:w-[500px]"
              >
                <h4 className="font-semibold mb-2 text-lg">
                  How to add Glass Structure
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-base">
                  <li>
                    <strong>Structure Name:</strong> Enter the name of the glass
                    structure.
                  </li>
                  <li>
                    <strong>Price:</strong> Enter the price of the glass
                    structure.
                  </li>
                  <li>
                    <strong>Structure Multiplier:</strong> Enter the multiplier
                    value.
                  </li>
                  <li>
                    <strong>Image:</strong> Upload an image of the glass
                    structure.
                  </li>
                </ul>
              </div>
            )}

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

      <Section
        title={
          <div className="flex items-center gap-2">
            <span>Operating System</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowOperatingInfo, "operating");
              }}
              className="p-1 focus:outline-none border border-gray-500 rounded-full"
            >
              <span className="text-xl">ℹ️</span>
            </button>
          </div>
        }
        isOpen={openSection === "operating"}
        onToggle={() => toggleSection("operating")}
        content={
          <>
            {showOperatingInfo && (
              <div
                ref={infoRefs.operating}
                className="absolute bg-white text-gray-700 border border-gray-300 rounded-lg p-4 shadow-lg z-10 mt-2 w-96 lg:w-[500px]"
              >
                <h4 className="font-semibold mb-2 text-lg">
                  How to Add an Operating System
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-base">
                  <li>
                    <strong>Operating Name:</strong> Enter the name of the
                    operating system.
                  </li>
                  <li>
                    <strong>Price:</strong> Enter the price of the operating
                    system.
                  </li>
                  <li>
                    <strong>Image:</strong> Upload an image of the operating
                    system.
                  </li>
                </ul>
              </div>
            )}

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
          <div className="flex items-center gap-2">
            <span>Handle Type</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowHandleInfo, "handle");
              }}
              className="p-1 focus:outline-none border border-gray-500 rounded-full"
            >
              <span className="text-xl">ℹ️</span>
            </button>
          </div>
        }
        isOpen={openSection === "handle"}
        onToggle={() => toggleSection("handle")}
        content={
          <>
            {showHandleInfo && (
              <div
                ref={infoRefs.handle}
                className="absolute bg-white text-gray-700 border border-gray-300 rounded-lg p-4 shadow-lg z-10 mt-2 w-96 lg:w-[500px]"
              >
                <h4 className="font-semibold mb-2 text-lg">
                  How to Add a Handle Type
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-base">
                  <li>
                    <strong>Handle Name:</strong> Enter the name of the handle
                    type.
                  </li>
                  <li>
                    <strong>Price:</strong> Enter the price of the handle.
                  </li>
                  <li>
                    <strong>Image:</strong> Upload an image of the handle.
                  </li>
                </ul>
              </div>
            )}

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
          <div className="flex items-center gap-2">
            <span>Window Type</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowWindowInfo, "window");
              }}
              className="p-1 focus:outline-none border border-gray-500 rounded-full"
            >
              <span className="text-xl">ℹ️</span>
            </button>
          </div>
        }
        isOpen={openSection === "window"}
        onToggle={() => toggleSection("window")}
        content={
          <>
            {showWindowInfo && (
              <div
                ref={infoRefs.window}
                className="absolute bg-white text-gray-700 border border-gray-300 rounded-lg p-4 shadow-lg z-10 mt-2 w-96 lg:w-[500px]"
              >
                <h4 className="font-semibold mb-2 text-lg">
                  How to Add a Window Type
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-base">
                  <li>
                    <strong>Window Type Name:</strong> Enter the name of the
                    window type.
                  </li>
                  <li>
                    <strong>Price Multiplier:</strong> Enter the price increment
                    multiplier.
                  </li>
                  <li>
                    <strong>Image:</strong> Upload an image representing the
                    window type.
                  </li>
                </ul>
              </div>
            )}

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
                    ),
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
                setWindowTypeError("");
              }}
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
          <div className="flex items-center gap-2">
            <span>Fanlight System</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowFanlightInfo, "fanlight");
              }}
              className="p-1 focus:outline-none border border-gray-500 rounded-full"
            >
              <span className="text-xl">ℹ️</span>
            </button>
          </div>
        }
        isOpen={openSection === "fanlight"}
        onToggle={() => toggleSection("fanlight")}
        content={
          <>
            {showFanlightInfo && (
              <div
                ref={infoRefs.fanlight}
                className="absolute bg-white text-gray-700 border border-gray-300 rounded-lg p-4 shadow-lg z-10 mt-2 w-96 lg:w-[500px]"
              >
                <h4 className="font-semibold mb-2 text-lg">
                  How to Add a Fanlight System
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-base">
                  <li>
                    <strong>Fanlight Availability:</strong> Enter the
                    availability status or name.
                  </li>
                  <li>
                    <strong>Price:</strong> Enter the price increment for the
                    fanlight system.
                  </li>
                  <li>
                    <strong>Image:</strong> Upload an image representing the
                    fanlight system.
                  </li>
                </ul>
              </div>
            )}

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
                    price: fanlightPrice,
                    fanlight_image: fanlight_image.url,
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
          <div className="flex items-center gap-2">
            <span>Estimated Working Hour</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowEstimatedInfo, "estimated");
              }}
              className="p-1 focus:outline-none border border-gray-500 rounded-full"
            >
              <span className="text-xl">ℹ️</span>
            </button>
          </div>
        }
        isOpen={openSection === "estimated"}
        onToggle={() => toggleSection("estimated")}
        content={
          <>
            {showEstimatedInfo && (
              <div
                ref={infoRefs.estimated}
                className="absolute bg-white text-gray-700 border border-gray-300 rounded-lg p-4 shadow-lg z-10 mt-2 w-96 lg:w-[500px]"
              >
                <h4 className="font-semibold mb-2 text-lg">
                  How to Set Estimated Working Hours
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-base">
                  <li>
                    <strong>Estimated Hours:</strong> Enter the estimated
                    working hours for the task.
                  </li>
                  <li>
                    <strong>Fast Option:</strong> Choose between
                    &quot;Normal&quot; and &quot;Fast&quot; processing.
                  </li>
                  <li>
                    <strong>Extra Price:</strong> Enter any extra price for
                    faster processing.
                  </li>
                </ul>
              </div>
            )}

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

      <Section
        title={
          <div className="flex items-center gap-2">
            <span>Color System</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleInfo(setShowColorInfo, "color");
              }}
              className="p-1 focus:outline-none border border-gray-500 rounded-full"
            >
              <span className="text-xl">ℹ️</span>
            </button>
          </div>
        }
        isOpen={openSection === "color"}
        onToggle={() => toggleSection("color")}
        content={
          <>
            {showColorInfo && (
              <div
                ref={infoRefs.color}
                className="absolute bg-white text-gray-700 border border-gray-300 rounded-lg p-4 shadow-lg z-10 mt-2 w-96 lg:w-[500px]"
              >
                <h4 className="font-semibold mb-2 text-lg">
                  How to Add a Color
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-base">
                  <li>
                    <strong>Color Name:</strong> Enter a name for the color.
                  </li>
                  <li>
                    <strong>Multiplier Price:</strong> Enter the price increment
                    for this color.
                  </li>
                  <li>
                    <strong>Color Picker:</strong> Select a color using the
                    color picker.
                  </li>
                  <li>
                    <strong>Image:</strong> Upload an image representing the
                    color.
                  </li>
                </ul>
              </div>
            )}

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
