import { Edit2, Trash2 } from "lucide-react";

const SavedGlassStructures = ({ glassStructures, onUpdate, onDelete }) => (
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
        {glassStructures.map((structure, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-4 py-2">
              {structure.type}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <img
                src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${
                  structure.glass_image
                }`}
                alt="Glass Structure"
                className="h-10 w-10 object-cover"
              />
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {structure.price}
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {structure.structure_multiplier}%
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <button
                onClick={() => onUpdate(index)}
                className="px-3 py-1 bg-primary text-white rounded-md"
              >
                <Edit2 size={16} />
              </button>
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

export default SavedGlassStructures;
