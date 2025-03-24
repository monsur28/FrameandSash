import { Trash2 } from "lucide-react";

const SavedEstimatedHours = ({ estimatedHours, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-300 p-4 mt-6">
    <h2 className="font-medium">Saved Estimated Hours</h2>
    <table className="min-w-full mt-2 border border-gray-300">
      <thead>
        <tr className="bg-teal-500 text-white">
          <th className="border border-gray-300 px-4 py-2">Hours</th>
          <th className="border border-gray-300 px-4 py-2">Fast Option</th>
          <th className="border border-gray-300 px-4 py-2">Extra Price</th>
          <th className="border border-gray-300 px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {estimatedHours.map((hour, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-4 py-2">
              {hour.estimatedHours}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {hour.fastOption}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {hour.extraPrice}$
            </td>
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

export default SavedEstimatedHours;
