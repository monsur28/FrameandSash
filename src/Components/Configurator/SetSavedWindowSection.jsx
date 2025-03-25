import { Trash2 } from "lucide-react";
import { SketchPicker } from "react-color";

// Dimension Section Component
export function DimensionSection({
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
export function MaterialSection({
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
export function ProfileSection({
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
export function GlassSection({
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
export function GlassStructureSection({
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
export function OperatingSystemSection({
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
export function HandleSection({
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
export function WindowTypeSection({
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
export function FanlightSection({
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
export function EstimatedWorkingHourSection({
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
export const ColorSection = ({
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
