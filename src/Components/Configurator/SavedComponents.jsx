import { Trash2 } from "lucide-react";

export const SavedColors = ({
  colors,
  color_multiplierIncrements,
  onDelete,
}) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-300 p-4 mt-6">
    <h2 className="font-medium">Saved Colors</h2>
    <table className="min-w-full mt-2 border border-gray-300">
      <thead>
        <tr className="bg-teal-500 text-white">
          <th className="border border-gray-300 px-4 py-2">Color Name</th>
          <th className="border border-gray-300 px-4 py-2">Color Preview</th>
          <th className="border border-gray-300 px-4 py-2">Color Multiplier</th>
          <th className="border border-gray-300 px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {colors.map((color, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-4 py-2">
              {color.color_name}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <div className="flex justify-center">
                <img
                  src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${
                    color.color_image
                  }`}
                  alt="Material"
                  className="h-10 w-10 "
                />
              </div>
            </td>
            <td className="border border-gray-300 text-center px-4 py-2">
              {color_multiplierIncrements[index]}%
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <button
                onClick={() => onDelete(index)}
                className="px-3 py-1 ml-2 bg-red-500 text-white rounded-md"
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const SavedEstimatedHours = ({ estimatedHours, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-300 p-4 mt-6">
    <h2 className="font-medium">Saved Estimated Hours</h2>
    <table className="min-w-full mt-2 border border-gray-300">
      <thead>
        <tr className="bg-teal-500 text-white">
          <th className="border border-gray-300 px-4 py-2">Hours</th>
          {/* <th className="border border-gray-300 px-4 py-2">Fast Option</th>
            <th className="border border-gray-300 px-4 py-2">Extra Price</th> */}
          <th className="border border-gray-300 px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {estimatedHours.map((hour, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-4 py-2">
              {hour.total_hour}hr
            </td>
            {/* <td className="border border-gray-300 px-4 py-2">
                {hour.fastOption}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {hour.extraPrice}$
              </td> */}
            <td className="border border-gray-300 px-4 py-2">
              <button
                onClick={() => onDelete(index)}
                className="px-3 py-1 bg-red-500 text-white rounded-md"
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const SavedMaterials = ({ materials, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-300 p-4 mt-6">
    <h2 className="font-medium">Saved Materials</h2>
    <table className="min-w-full mt-2 border border-gray-300">
      <thead>
        <tr className="bg-teal-500 text-white">
          <th className="border border-gray-300 px-4 py-2">Material Name</th>
          <th className="border border-gray-300 px-4 py-2">Image</th>
          <th className="border border-gray-300 px-4 py-2">Price/unit</th>
          <th className="border border-gray-300 px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {materials.map((material, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-4 py-2">
              {material.name}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <div className="flex justify-center">
                <img
                  src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${
                    material.image
                  }`}
                  alt="Material"
                  className="h-10 w-10 "
                />
              </div>
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {material.price}$
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <button
                onClick={() => onDelete(index)}
                className="px-3 py-1 ml-2 bg-red-500 text-white rounded-md"
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const SavedDimensions = ({ savedDimensions, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-300 p-4 mt-6">
    <h2 className="font-medium">Saved Dimensions</h2>
    <table className="min-w-full mt-2 border border-gray-300">
      <thead>
        <tr className="bg-teal-500 text-white">
          <th className="border border-gray-300 px-4 py-2">Height Min</th>
          <th className="border border-gray-300 px-4 py-2">Height Max</th>
          <th className="border border-gray-300 px-4 py-2">Width Min</th>
          <th className="border border-gray-300 px-4 py-2">Width Max</th>
          <th className="border border-gray-300 px-4 py-2">Unit</th>
          <th className="border border-gray-300 px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {savedDimensions.map((dimension, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-4 py-2">
              {dimension.min_height}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {dimension.max_height}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {dimension.min_width}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {dimension.max_width}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {dimension.unit}
            </td>
            <td className="flex justify-center space-x-2 mt-2">
              <button
                onClick={() => onDelete(index)}
                className="px-3 py-1 bg-red-500 text-white rounded-md"
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const SavedFanlights = ({ fanlights, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-300 p-4 mt-6">
    <h2 className="font-medium">Saved Fanlights</h2>
    <table className="min-w-full mt-2 border border-gray-300">
      <thead>
        <tr className="bg-teal-500 text-white">
          <th className="border border-gray-300 px-4 py-2">Fanlight Name</th>
          <th className="border border-gray-300 px-4 py-2">Image</th>
          <th className="border border-gray-300 px-4 py-2">Price</th>
          <th className="border border-gray-300 px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {fanlights.map((fanlight, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-4 py-2">
              {fanlight.availability}
            </td>
            <td className="border border-gray-300 px-4 py-2 flex justify-center">
              <img
                src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${
                  fanlight.fanlight_image
                }`}
                alt="Fanlight"
                className="h-10 w-10 "
              />
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {fanlight.price}$
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <button
                onClick={() => onDelete(index)}
                className="px-3 py-1 ml-1 bg-red-500 text-white rounded-md"
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const SavedGlasses = ({ glasses, glazingPriceIncrements, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-300 p-4 mt-6">
    <h2 className="font-medium">Saved Glasses</h2>
    <table className="min-w-full mt-2 border border-gray-300">
      <thead>
        <tr className="bg-teal-500 text-white">
          <th className="border border-gray-300 px-4 py-2">Glass Name</th>
          <th className="border border-gray-300 px-4 py-2">Image</th>
          <th className="border border-gray-300 px-4 py-2">Price</th>
          <th className="border border-gray-300 px-4 py-2">
            Price Increment (%)
          </th>
          <th className="border border-gray-300 px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {glasses.map((glass, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-4 py-2">{glass.type}</td>
            <td className="border border-gray-300 px-4 py-2 flex justify-center">
              <img
                src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${
                  glass.glass_image
                }`}
                alt="Glass Type"
                className="h-10 w-10 "
              />
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {glass.price}$
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {glazingPriceIncrements[index]}%
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <button
                onClick={() => onDelete(index)}
                className="px-3 py-1 ml-1 bg-red-500 text-white rounded-md"
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const SavedGlassStructures = ({
  SavedGlassStructures,
  structurePriceIncrements,
  onDelete,
}) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-300 p-4 mt-6">
    <h2 className="font-medium">Saved Glass Structures</h2>
    <table className="min-w-full mt-2 border border-gray-300">
      <thead>
        <tr className="bg-teal-500 text-white">
          <th className="border border-gray-300 px-4 py-2">Structure Name</th>
          <th className="border border-gray-300 px-4 py-2">Image</th>
          <th className="border border-gray-300 px-4 py-2">Price</th>
          <th className="border border-gray-300 px-4 py-2">
            Price Increment (%)
          </th>
          <th className="border border-gray-300 px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {SavedGlassStructures.map((structure, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-4 py-2">
              {structure.type}
            </td>
            <td className="border border-gray-300 px-4 py-2 flex justify-center">
              <img
                src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${
                  structure.glass_image
                }`}
                alt="Glass Structure"
                className="h-10 w-10 "
              />
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {structure.price}$
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {structurePriceIncrements[index]}%
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <button
                onClick={() => onDelete(index)}
                className="px-3 py-1 ml-1 bg-red-500 text-white rounded-md"
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const SavedOpeningSystems = ({ openingSystems, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-300 p-4 mt-6">
    <h2 className="font-medium">Saved Opening Systems</h2>
    <table className="min-w-full mt-2 border border-gray-300">
      <thead>
        <tr className="bg-teal-500 text-white">
          <th className="border border-gray-300 px-4 py-2">
            Opening System Name
          </th>
          <th className="border border-gray-300 px-4 py-2">Image</th>
          <th className="border border-gray-300 px-4 py-2">Price</th>
          <th className="border border-gray-300 px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {openingSystems.map((system, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-4 py-2">{system.name}</td>
            <td className="border border-gray-300 px-4 py-2 flex justify-center">
              <img
                src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${
                  system.opening_image
                }`}
                alt="Opening System"
                className="h-10 w-10 "
              />
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {system.price}$
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <button
                onClick={() => onDelete(index)}
                className="px-3 py-1 ml-1 bg-red-500 text-white rounded-md"
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const SavedProfiles = ({
  profiles,
  profile_multiplierIncrements,
  onDelete,
}) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-300 p-4 mt-6">
    <h2 className="font-medium">Saved Profiles</h2>
    <table className="min-w-full mt-2 border border-gray-300">
      <thead>
        <tr className="bg-teal-500 text-white">
          <th className="border border-gray-300 px-4 py-2">Profile Name</th>
          <th className="border border-gray-300 px-4 py-2">Image</th>
          <th className="border border-gray-300 px-4 py-2">Features</th>
          <th className="border border-gray-300 px-4 py-2">
            Price Increment (%)
          </th>
          <th className="border border-gray-300 px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {profiles.map((profile, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-4 py-2">
              {profile.profile_name}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <img
                src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${
                  profile.profile_image
                }`}
                alt="Profile"
                className="h-10 w-10 "
              />
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <ul className="list-disc ml-4">
                {profile.features.map((feature) => (
                  <li key={feature.id}>{feature}</li>
                ))}
              </ul>
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {profile_multiplierIncrements[index]}%
            </td>
            <td className="flex justify-center space-x-2 mt-2">
              <button
                onClick={() => onDelete(index)}
                className="px-3 py-1 bg-red-500 text-white rounded-md"
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const SavedWindows = ({
  windows,
  window_type_multiplierIncrements,
  onDelete,
}) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-300 p-4 mt-6">
    <h2 className="font-medium">Saved Windows</h2>
    <table className="min-w-full mt-2 border border-gray-300">
      <thead>
        <tr className="bg-teal-500 text-white">
          <th className="border border-gray-300 px-4 py-2">Window Type</th>
          <th className="border border-gray-300 px-4 py-2">Image</th>
          <th className="border border-gray-300 px-4 py-2">
            Price Increment (%)
          </th>
          <th className="border border-gray-300 px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {windows.map((window, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-4 py-2">{window.type}</td>
            <td className="border border-gray-300 px-4 py-2 flex justify-center">
              <img
                src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${
                  window.type_image
                }`}
                alt="Window Type"
                className="h-10 w-10"
              />
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {window_type_multiplierIncrements[index]}%
            </td>

            <td className="border border-gray-300 px-4 py-2">
              <button
                onClick={() => onDelete(index)}
                className="px-3 py-1 ml-2 bg-red-500 text-white rounded-md"
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const SavedHandles = ({ handles, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-300 p-4 mt-6">
    <h2 className="font-medium">Saved Handles</h2>
    <table className="min-w-full mt-2 border border-gray-300">
      <thead>
        <tr className="bg-teal-500 text-white">
          <th className="border border-gray-300 px-4 py-2">Handle Name</th>
          <th className="border border-gray-300 px-4 py-2">Image</th>
          <th className="border border-gray-300 px-4 py-2">Price</th>
          <th className="border border-gray-300 px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {handles.map((handle, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-4 py-2">{handle.type}</td>
            <td className="border border-gray-300 px-4 py-2 flex justify-center">
              <img
                src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${
                  handle.handle_image
                }`}
                alt="Handle"
                className="h-10 w-10 "
              />
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {handle.price}$
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <button
                onClick={() => onDelete(index)}
                className="px-3 py-1 ml-1 bg-red-500 text-white rounded-md"
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
