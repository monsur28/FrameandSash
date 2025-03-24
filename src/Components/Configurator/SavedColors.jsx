import { Edit2, Trash2 } from "lucide-react";

const SavedColors = ({ colors, onUpdate, onDelete }) => (
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
              <div
                className="h-10 w-10"
                style={{ backgroundColor: color.color_name }}
              ></div>
            </td>
            <td className="border border-gray-300 text-center px-4 py-2">
              {color.color_multiplier}%
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

export default SavedColors;
