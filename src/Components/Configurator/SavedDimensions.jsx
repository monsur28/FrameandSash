import { Edit2, Trash2 } from "lucide-react";

const SavedDimensions = ({ savedDimensions, onUpdate, onDelete }) => (
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
                onClick={() => onUpdate(index)}
                className="px-3 py-1 bg-primary text-white rounded-md"
              >
                <Edit2 size={16} />
              </button>
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

export default SavedDimensions;
