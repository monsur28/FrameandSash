import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axiosSecure from "../../../../../Hooks/AsiosSecure";
import Section from "../../../../../Shared/Section";
import { useParams } from "react-router-dom";
import { Trash2 } from "lucide-react"; // For delete buttons
import { SketchPicker } from "react-color"; // For color picker
import SavedDimensions from "../../../../../Components/Configurator/SavedDimensions";
import SavedMaterials from "../../../../../Components/Configurator/SavedMaterials";
import SavedProfiles from "../../../../../Components/Configurator/SavedProfiles";
import SavedColors from "../../../../../Components/Configurator/SavedColors";
import SavedWindows from "../../../../../Components/Configurator/SavedWindows";
import SavedGlasses from "../../../../../Components/Configurator/SavedGlasses";
import SavedOpeningSystems from "../../../../../Components/Configurator/SavedOpeningSystems";
import SavedFanlights from "../../../../../Components/Configurator/SavedFanlights";
import SavedHandles from "../../../../../Components/Configurator/SavedHandles";
import SavedGlassStructures from "../../../../../Components/Configurator/SavedGlassStructures";

// Main Edit Configuration Component
export default function EditConfiguration() {
  const { id } = useParams(); // Get the configuration ID from the URL
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [openSection, setOpenSection] = useState("dimensions");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingIndex, setEditingIndex] = useState(null); // Track the index of the item being edited

  // Define initial form data structure
  const initialFormData = {
    name: "",
    price: "",
    image: { url: null, name: "No file chosen" },
    features: [], // For profiles
    heightMin: "",
    heightMax: "",
    widthMin: "",
    widthMax: "",
    unit: "mm",
    multiplier: "", // Added multiplier
  };

  // Define saved data structure
  const initialSavedData = {
    dimensions: [],
    materials: [],
    profiles: [],
    colors: [],
    windows: [],
    glasses: [],
    glassStructures: [],
    fanlights: [],
    openingSystems: [],
    handles: [],
  };

  // State for form data
  const [formData, setFormData] = useState(initialFormData);

  // State for saved data
  const [savedData, setSavedData] = useState(initialSavedData);

  // Utility functions for multiplier conversion
  const percentageToMultiplier = (percentage) => {
    if (!percentage && percentage !== 0) return 1;
    const parsed = parseFloat(percentage);
    return isNaN(parsed) ? 1 : (100 + parsed) / 100;
  };

  const multiplierToPercentage = (multiplier) => {
    if (!multiplier && multiplier !== 0) return "0";
    const parsed = parseFloat(multiplier);
    if (isNaN(parsed)) return "0";
    return (parsed * 100 - 100).toFixed(0);
  };

  const isValidMultiplierInput = (input) => {
    if (!input && input !== 0) return true;
    const num = parseFloat(input);
    return !isNaN(num) && num >= 0;
  };

  // Fetch categories and existing configuration data
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

    const fetchConfiguration = async () => {
      try {
        const response = await axiosSecure.get(
          `/admin/window-configurator/${id}`
        );
        const configData = response.data.configurator_product;

        // Set initial state with fetched data
        setSelectedCategoryId(configData.category_id);
        setSavedData({
          dimensions: configData.dimensions || [],
          materials: configData.materials || [],
          profiles: configData.profiles || [],
          colors: configData.colors || [],
          windows: configData.window_types || [],
          glasses: configData.glass_types || [],
          glassStructures: configData.glass_structures || [],
          fanlights: configData.fanlights || [],
          openingSystems: configData.opening_systems || [],
          handles: configData.handles || [],
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching configuration data:", error);
        setError("Failed to fetch configuration data.");
        toast.error("Failed to fetch configuration data.");
      }
    };

    fetchCategories();
    fetchConfiguration();
  }, [id]);

  // Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate file type and size
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/svg+xml",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error(
          "Invalid file type. Please select a JPEG, PNG, SVG, or WEBP image."
        );
        return;
      }
      if (file.size > 2048 * 1024) {
        // 2048 KB max size
        toast.error("File size exceeds 2MB. Please select a smaller image.");
        return;
      }

      // For preview (immediate feedback)
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: {
            url: reader.result, // Temporary URL for preview
            name: file.name,
          },
        });
      };
      reader.readAsDataURL(file);

      // For actual upload to server
      try {
        const imageFormData = new FormData();
        imageFormData.append("image", file);

        const response = await axiosSecure.post("/user-image", imageFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Image upload response:", response);

        // If successful, update form with the returned image URL
        if (response.data && response.data.imageUrl) {
          setFormData((prev) => ({
            ...prev,
            image: {
              url: response.data.image.url,
              filename: file.name,
            },
          }));
          toast.success("Image uploaded successfully!");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image.");
      }
    }
  };

  // Handle Edit
  const handleEdit = (index, section) => {
    const item = savedData[section][index];
    setOpenSection(section);

    // Determine which multiplier property to use
    let storedMultiplier = 0;
    if (section === "profiles") {
      storedMultiplier = item.profile_multiplier;
    } else if (section === "glasses") {
      storedMultiplier = item.glazing_multiplier;
    } else if (section === "glassStructures") {
      storedMultiplier = item.structure_multiplier;
    } else if (
      section === "windows" ||
      section === "colors" ||
      section === "materials" ||
      section === "fanlights" ||
      section === "openingSystems" ||
      section === "handles"
    ) {
      storedMultiplier = item.multiplier;
    }

    // Convert multiplier to percentage for display
    const displayMultiplier = multiplierToPercentage(storedMultiplier);

    setFormData({
      name: item.name || item.profile_name || item.type || "",
      price: item.price || "",
      image: {
        url: item.image || item.profile_image || "",
        name: item.image ? item.image.split("/").pop() : "No file chosen",
      },
      features: item.profile_features
        ? item.profile_features.map((f) => f.features)
        : [],
      heightMin: item.min_height || "",
      heightMax: item.max_height || "",
      widthMin: item.min_width || "",
      widthMax: item.max_width || "",
      unit: item.unit || "mm",
      multiplier: displayMultiplier,
    });

    setEditingIndex(index);
  };

  // Handle section update
  const handleSectionUpdate = () => {
    if (!isValidMultiplierInput(formData.multiplier)) {
      toast.error("Please enter a valid multiplier.");
      return;
    }

    const updatedItems = [...savedData[openSection]];
    const multiplierValue = percentageToMultiplier(formData.multiplier);

    if (editingIndex !== null) {
      // Update existing item
      const existingItem = { ...updatedItems[editingIndex] };
      const updatedItem = { ...existingItem };

      // Update common properties
      updatedItem.name = formData.name;

      // Only update price for sections that have it (not windows)
      if (openSection !== "windows") {
        updatedItem.price = formData.price;
      }

      // Update section-specific properties
      if (openSection === "dimensions") {
        updatedItem.min_height = formData.heightMin;
        updatedItem.max_height = formData.heightMax;
        updatedItem.min_width = formData.widthMin;
        updatedItem.max_width = formData.widthMax;
        updatedItem.unit = formData.unit;
      } else if (openSection === "profiles") {
        updatedItem.profile_name = formData.name;
        updatedItem.profile_image = formData.image.url;
        updatedItem.profile_features = formData.features.map((f) => ({
          features: f,
        }));
        updatedItem.profile_multiplier = multiplierValue;
      } else if (openSection === "glasses") {
        updatedItem.glazing_multiplier = multiplierValue;
        updatedItem.image = formData.image.url;
      } else if (openSection === "glassStructures") {
        updatedItem.structure_multiplier = multiplierValue;
        updatedItem.image = formData.image.url;
      } else {
        // For other sections (windows, colors, materials, fanlights, openingSystems, handles)
        updatedItem.multiplier = multiplierValue;
        updatedItem.image = formData.image.url;
      }

      updatedItems[editingIndex] = updatedItem;
    } else {
      // Add new item
      const newItem = {
        name: formData.name,
        image: formData.image.url,
      };

      // Only add price for sections that have it (not windows)
      if (openSection !== "windows") {
        newItem.price = formData.price;
      }

      // Add section-specific properties
      if (openSection === "dimensions") {
        newItem.min_height = formData.heightMin;
        newItem.max_height = formData.heightMax;
        newItem.min_width = formData.widthMin;
        newItem.max_width = formData.widthMax;
        newItem.unit = formData.unit;
      } else if (openSection === "profiles") {
        newItem.profile_name = formData.name;
        newItem.profile_image = formData.image.url;
        newItem.profile_features = formData.features.map((f) => ({
          features: f,
        }));
        newItem.profile_multiplier = multiplierValue;
      } else if (openSection === "glasses") {
        newItem.glazing_multiplier = multiplierValue;
      } else if (openSection === "glassStructures") {
        newItem.structure_multiplier = multiplierValue;
      } else {
        // For other sections (windows, colors, materials, fanlights, openingSystems, handles)
        newItem.multiplier = multiplierValue;
      }

      updatedItems.push(newItem);
    }

    setSavedData({ ...savedData, [openSection]: updatedItems });
    toast.success(
      `${
        openSection.charAt(0).toUpperCase() + openSection.slice(1)
      } updated in local state.`
    );
    setEditingIndex(null);
    setFormData(initialFormData);
  };

  // Handle publish all changes
  const handlePublishAllChanges = async () => {
    try {
      // Prepare data for API
      const apiData = {
        id: id,
        category_id: selectedCategoryId,
        dimensions: savedData.dimensions,
        materials: savedData.materials,
        profiles: savedData.profiles,
        colors: savedData.colors,
        window_types: savedData.windows,
        glass_types: savedData.glasses,
        glass_structures: savedData.glassStructures,
        fanlights: savedData.fanlights,
        opening_systems: savedData.openingSystems,
        handles: savedData.handles,
      };

      await axiosSecure.post("/admin/window-configurator/update", apiData);
      toast.success("All changes published successfully!");
    } catch (error) {
      console.error("Error publishing changes:", error);
      toast.error("Failed to publish changes.");
    }
  };

  // Toggle Section
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Handle delete functions
  const handleDelete = (index, section) => {
    const updatedItems = savedData[section].filter((_, i) => i !== index);
    setSavedData({ ...savedData, [section]: updatedItems });
    toast.success(
      `${
        section.charAt(0).toUpperCase() + section.slice(1)
      } deleted successfully!`
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-2 space-y-4">
      <ToastContainer />

      {/* Category Selection */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-300">
        <label className="block text-2xl font-medium text-gray-700 text-left">
          Category
        </label>
        <select
          className="w-full mt-3 border border-primary rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00B5A5]"
          value={selectedCategoryId}
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
            heightMin={formData.heightMin}
            heightMax={formData.heightMax}
            widthMin={formData.widthMin}
            widthMax={formData.widthMax}
            unit={formData.unit}
            onHeightMinChange={(value) =>
              setFormData({ ...formData, heightMin: value })
            }
            onHeightMaxChange={(value) =>
              setFormData({ ...formData, heightMax: value })
            }
            onWidthMinChange={(value) =>
              setFormData({ ...formData, widthMin: value })
            }
            onWidthMaxChange={(value) =>
              setFormData({ ...formData, widthMax: value })
            }
            onUnitChange={(value) => setFormData({ ...formData, unit: value })}
            onSave={handleSectionUpdate}
            onCancel={() => setFormData(initialFormData)}
            editingIndex={editingIndex}
          />
        }
      />

      {/* Saved Dimensions */}
      <SavedDimensions
        savedDimensions={savedData.dimensions}
        onDelete={(index) => handleDelete(index, "dimensions")}
        onUpdate={(index) => handleEdit(index, "dimensions")}
      />

      {/* Material Section */}
      <Section
        title="Material"
        isOpen={openSection === "materials"}
        onToggle={() => toggleSection("materials")}
        content={
          <MaterialSection
            name={formData.name}
            price={formData.price}
            image={formData.image}
            multiplier={formData.multiplier} // Pass the multiplier from formData
            onNameChange={(value) => setFormData({ ...formData, name: value })}
            onPriceChange={(value) =>
              setFormData({ ...formData, price: value })
            }
            onImageChange={handleImageChange} // Use the image handler
            onMultiplierChange={(value) =>
              setFormData({ ...formData, multiplier: value })
            } // Multiplier input
            onSave={handleSectionUpdate}
            onCancel={() => setFormData(initialFormData)}
            editingIndex={editingIndex}
          />
        }
      />

      {/* Saved Materials */}
      <SavedMaterials
        materials={savedData.materials}
        onDelete={(index) => handleDelete(index, "materials")}
        onUpdate={(index) => handleEdit(index, "materials")}
      />

      {/* Profile Section */}
      <Section
        title="Profile"
        isOpen={openSection === "profiles"}
        onToggle={() => toggleSection("profiles")}
        content={
          <ProfileSection
            name={formData.name}
            price={formData.price}
            image={formData.image}
            features={formData.features}
            multiplier={formData.multiplier} // Pass the multiplier from formData
            onNameChange={(value) => setFormData({ ...formData, name: value })}
            onPriceChange={(value) =>
              setFormData({ ...formData, price: value })
            }
            onImageChange={handleImageChange}
            onFeaturesChange={(value) =>
              setFormData({ ...formData, features: value })
            }
            onMultiplierChange={(value) =>
              setFormData({ ...formData, multiplier: value })
            } // Multiplier input
            onSave={handleSectionUpdate}
            onCancel={() => setFormData(initialFormData)}
            editingIndex={editingIndex}
          />
        }
      />

      {/* Saved Profiles */}
      <SavedProfiles
        profiles={savedData.profiles}
        onDelete={(index) => handleDelete(index, "profiles")}
        onUpdate={(index) => handleEdit(index, "profiles")}
      />

      {/* Color Section */}
      <Section
        title="Color"
        isOpen={openSection === "colors"}
        onToggle={() => toggleSection("colors")}
        content={
          <ColorSection
            name={formData.name}
            price={formData.price}
            image={formData.image}
            multiplier={formData.multiplier} // Pass the multiplier from formData
            onNameChange={(value) => setFormData({ ...formData, name: value })}
            onPriceChange={(value) =>
              setFormData({ ...formData, price: value })
            }
            onImageChange={handleImageChange}
            onMultiplierChange={(value) =>
              setFormData({ ...formData, multiplier: value })
            } // Multiplier input
            onSave={handleSectionUpdate}
            onCancel={() => setFormData(initialFormData)}
            editingIndex={editingIndex}
          />
        }
      />

      {/* Saved Colors */}
      <SavedColors
        colors={savedData.colors}
        onDelete={(index) => handleDelete(index, "colors")}
        onUpdate={(index) => handleEdit(index, "colors")}
      />

      {/* Window Type Section */}
      <Section
        title="Window Type"
        isOpen={openSection === "windows"}
        onToggle={() => toggleSection("windows")}
        content={
          <WindowTypeSection
            name={formData.name}
            image={formData.image}
            multiplier={formData.multiplier} // Pass the multiplier from formData
            onNameChange={(value) => setFormData({ ...formData, name: value })}
            onImageChange={handleImageChange}
            onMultiplierChange={(value) =>
              setFormData({ ...formData, multiplier: value })
            } // Multiplier input
            onSave={handleSectionUpdate}
            onCancel={() => setFormData(initialFormData)}
            editingIndex={editingIndex}
          />
        }
      />

      {/* Saved Window Types */}
      <SavedWindows
        windows={savedData.windows}
        onDelete={(index) => handleDelete(index, "windows")}
        onUpdate={(index) => handleEdit(index, "windows")}
      />

      {/* Glass Section */}
      <Section
        title="Glass"
        isOpen={openSection === "glasses"}
        onToggle={() => toggleSection("glasses")}
        content={
          <GlassSection
            name={formData.name}
            price={formData.price}
            image={formData.image}
            multiplier={formData.multiplier} // Pass the multiplier from formData
            onNameChange={(value) => setFormData({ ...formData, name: value })}
            onPriceChange={(value) =>
              setFormData({ ...formData, price: value })
            }
            onImageChange={handleImageChange}
            onMultiplierChange={(value) =>
              setFormData({ ...formData, multiplier: value })
            } // Multiplier input
            onSave={handleSectionUpdate}
            onCancel={() => setFormData(initialFormData)}
            editingIndex={editingIndex}
          />
        }
      />

      {/* Saved Glasses */}
      <SavedGlasses
        glasses={savedData.glasses}
        onDelete={(index) => handleDelete(index, "glasses")}
        onUpdate={(index) => handleEdit(index, "glasses")}
      />

      {/* Glass Structure Section */}
      <Section
        title="Glass Structure"
        isOpen={openSection === "glassStructures"}
        onToggle={() => toggleSection("glassStructures")}
        content={
          <GlassStructureSection
            name={formData.name}
            price={formData.price}
            image={formData.image}
            multiplier={formData.multiplier} // Pass the multiplier from formData
            onNameChange={(value) => setFormData({ ...formData, name: value })}
            onPriceChange={(value) =>
              setFormData({ ...formData, price: value })
            }
            onImageChange={handleImageChange}
            onMultiplierChange={(value) =>
              setFormData({ ...formData, multiplier: value })
            } // Multiplier input
            onSave={handleSectionUpdate}
            onCancel={() => setFormData(initialFormData)}
            editingIndex={editingIndex}
          />
        }
      />

      {/* Saved Glass Structures */}
      <SavedGlassStructures
        glassStructures={savedData.glassStructures}
        onDelete={(index) => handleDelete(index, "glassStructures")}
        onUpdate={(index) => handleEdit(index, "glassStructures")}
      />

      {/* Fanlight Section */}
      <Section
        title="Fanlight"
        isOpen={openSection === "fanlights"}
        onToggle={() => toggleSection("fanlights")}
        content={
          <FanlightSection
            name={formData.name}
            price={formData.price}
            image={formData.image}
            multiplier={formData.multiplier} // Pass the multiplier from formData
            onNameChange={(value) => setFormData({ ...formData, name: value })}
            onPriceChange={(value) =>
              setFormData({ ...formData, price: value })
            }
            onImageChange={handleImageChange}
            onMultiplierChange={(value) =>
              setFormData({ ...formData, multiplier: value })
            } // Multiplier input
            onSave={handleSectionUpdate}
            onCancel={() => setFormData(initialFormData)}
            editingIndex={editingIndex}
          />
        }
      />

      {/* Saved Fanlights */}
      <SavedFanlights
        fanlights={savedData.fanlights}
        onDelete={(index) => handleDelete(index, "fanlights")}
        onUpdate={(index) => handleEdit(index, "fanlights")}
      />

      {/* Opening System Section */}
      <Section
        title="Opening System"
        isOpen={openSection === "openingSystems"}
        onToggle={() => toggleSection("openingSystems")}
        content={
          <OpeningSystemSection
            name={formData.name}
            price={formData.price}
            image={formData.image}
            multiplier={formData.multiplier} // Pass the multiplier from formData
            onNameChange={(value) => setFormData({ ...formData, name: value })}
            onPriceChange={(value) =>
              setFormData({ ...formData, price: value })
            }
            onImageChange={handleImageChange}
            onMultiplierChange={(value) =>
              setFormData({ ...formData, multiplier: value })
            } // Multiplier input
            onSave={handleSectionUpdate}
            onCancel={() => setFormData(initialFormData)}
            editingIndex={editingIndex}
          />
        }
      />

      {/* Saved Opening Systems */}
      <SavedOpeningSystems
        openingSystems={savedData.openingSystems}
        onDelete={(index) => handleDelete(index, "openingSystems")}
        onUpdate={(index) => handleEdit(index, "openingSystems")}
      />

      {/* Handle Section */}
      <Section
        title="Handle"
        isOpen={openSection === "handles"}
        onToggle={() => toggleSection("handles")}
        content={
          <HandleSection
            name={formData.name}
            price={formData.price}
            image={formData.image}
            multiplier={formData.multiplier} // Pass the multiplier from formData
            onNameChange={(value) => setFormData({ ...formData, name: value })}
            onPriceChange={(value) =>
              setFormData({ ...formData, price: value })
            }
            onImageChange={handleImageChange}
            onMultiplierChange={(value) =>
              setFormData({ ...formData, multiplier: value })
            } // Multiplier input
            onSave={handleSectionUpdate}
            onCancel={() => setFormData(initialFormData)}
            editingIndex={editingIndex}
          />
        }
      />

      {/* Saved Handles */}
      <SavedHandles
        handles={savedData.handles}
        onDelete={(index) => handleDelete(index, "handles")}
        onUpdate={(index) => handleEdit(index, "handles")}
      />

      {/* Publish All Changes Button */}
      <div className="fixed bottom-4 right-4 z-10">
        <button
          className="px-6 py-3 text-lg font-medium bg-teal-600 text-white rounded-lg shadow-lg hover:bg-teal-700 transition-colors"
          onClick={handlePublishAllChanges}
        >
          Publish All Changes
        </button>
      </div>
    </div>
  );
}

// Dimension Section Component
function DimensionSection({
  heightMin,
  heightMax,
  widthMin,
  widthMax,
  unit,
  onHeightMinChange,
  onHeightMaxChange,
  onWidthMinChange,
  onWidthMaxChange,
  onUnitChange,
  onSave,
  onCancel,
  editingIndex,
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
          value={heightMin}
          onChange={(e) => onHeightMinChange(e.target.value)}
          placeholder="Minimum"
          className="w-full px-3 py-2 border border-teal-300 rounded-md focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="number"
          value={heightMax}
          onChange={(e) => onHeightMaxChange(e.target.value)}
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
          value={widthMin}
          onChange={(e) => onWidthMinChange(e.target.value)}
          placeholder="Minimum"
          className="w-full px-3 py-2 border border-teal-300 rounded-md focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="number"
          value={widthMax}
          onChange={(e) => onWidthMaxChange(e.target.value)}
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
      {/* Add buttons at the bottom */}
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
          {editingIndex !== null ? "Update" : "Save"}
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
  multiplier,
  onNameChange,
  onPriceChange,
  onImageChange,
  onMultiplierChange, // Multiplier input
  onSave,
  onCancel,
  editingIndex,
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
              <input
                type="file"
                onChange={(e) => onImageChange(e)}
                className="hidden"
              />
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
      <div>
        <label className="block text-lg text-left font-medium text-gray-700">
          Price Increament (%)
        </label>
        <input
          type="text"
          value={multiplier}
          onChange={(e) => onMultiplierChange(e.target.value)}
          className="mt-1 block p-3 w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
          placeholder="10 for 10%"
        />
      </div>
      {/* Add buttons at the bottom */}
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
          {editingIndex !== null ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}

// Profile Section Component
function ProfileSection({
  name,
  image,
  features,
  multiplier,
  onNameChange,
  onImageChange,
  onFeaturesChange,
  onMultiplierChange, // Multiplier input
  onSave,
  onCancel,
  editingIndex,
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
          placeholder="Profile Name"
          className="mt-1 p-2 block w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
        />
      </div>
      <div>
        <label className="block text-lg text-left font-medium text-gray-700">
          Features
        </label>
        <input
          type="text"
          onChange={(e) => onFeaturesChange([...features, e.target.value])}
          className="mt-1 p-2 block w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
          placeholder="Add a feature"
        />
        <ul className="list-disc ml-4 mt-2">
          {features.map((feature, index) => (
            <li key={index} className="flex justify-between items-center">
              {feature}
              <button
                onClick={() =>
                  onFeaturesChange(features.filter((_, i) => i !== index))
                }
                className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
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
          Price Increament (%)
        </label>
        <input
          type="text"
          value={multiplier} // Use the prop, not formData
          onChange={(e) => onMultiplierChange(e.target.value)}
          className="mt-1 block p-3 w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
          placeholder="10 for 10%"
        />
      </div>
      {/* Add buttons at the bottom */}
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
          {editingIndex !== null ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}

// Color Section Component
const ColorSection = ({
  name,
  image,
  multiplier,
  onColorChange,
  onNameChange,
  onMultiplierChange, // Multiplier input
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
          color={image?.color_image} // Set the color based on the selected URL
          onChangeComplete={(color) => onColorChange(color.hex)} // Call onColorChange with the selected color
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
            style={{ backgroundColor: image?.color_image }} // Display selected color
          />
        </div>
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Price Increament (%)
          </label>
          <input
            type="text"
            value={multiplier} // Use the prop, not formData
            onChange={(e) => onMultiplierChange(e.target.value)}
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
};

// Window Type Section Component - Updated
function WindowTypeSection({
  name,
  image,
  multiplier,
  onNameChange,
  onImageChange,
  onMultiplierChange,
  onSave,
  onCancel,
  editingIndex,
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
            Price Increament (%)
          </label>
          <input
            type="text"
            value={multiplier}
            onChange={(e) => onMultiplierChange(e.target.value)}
            className="mt-1 block p-3 w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
            placeholder="10 for 10%"
          />
        </div>
      </div>
      {/* Add buttons at the bottom */}
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
          {editingIndex !== null ? "Update" : "Save"}
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
  multiplier,
  onNameChange,
  onPriceChange,
  onImageChange,
  onMultiplierChange, // Multiplier input
  onSave,
  onCancel,
  editingIndex,
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
          placeholder="Glass Type Name"
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
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Price Increament (%)
          </label>
          <input
            type="text"
            value={multiplier} // Use the prop, not formData
            onChange={(e) => onMultiplierChange(e.target.value)}
            className="mt-1 block p-3 w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
            placeholder="10 for 10%"
          />
        </div>
      </div>
      {/* Add buttons at the bottom */}
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
          {editingIndex !== null ? "Update" : "Save"}
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
  multiplier,
  onNameChange,
  onPriceChange,
  onImageChange,
  onMultiplierChange, // Multiplier input
  onSave,
  onCancel,
  editingIndex,
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
        <div>
          <label className="block text-lg text-left font-medium text-gray-700">
            Price Increament (%)
          </label>
          <input
            type="text"
            value={multiplier} // Use the prop, not formData
            onChange={(e) => onMultiplierChange(e.target.value)}
            className="mt-1 block p-3 w-full rounded-md border border-primary shadow-sm focus:border-teal-500 focus:ring-teal-500"
            placeholder="10 for 10%"
          />
        </div>
      </div>
      {/* Add buttons at the bottom */}
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
          {editingIndex !== null ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}

// Fanlight Section Component - Updated
function FanlightSection({
  name,
  price,
  image,
  onNameChange,
  onPriceChange,
  onImageChange,

  onSave,
  onCancel,
  editingIndex,
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

      {/* Add buttons at the bottom */}
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
          {editingIndex !== null ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}

// Opening System Section Component - Updated
function OpeningSystemSection({
  name,
  price,
  image,
  onNameChange,
  onPriceChange,
  onImageChange,

  onSave,
  onCancel,
  editingIndex,
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
          placeholder="Opening System Name"
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

      {/* Add buttons at the bottom */}
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
          {editingIndex !== null ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}

// Handle Section Component - Updated
function HandleSection({
  name,
  price,
  image,
  onNameChange,
  onPriceChange,
  onImageChange,

  onSave,
  onCancel,
  editingIndex,
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

      {/* Add buttons at the bottom */}
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
          {editingIndex !== null ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}
