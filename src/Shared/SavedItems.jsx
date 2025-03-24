import { Trash2 } from "lucide-react";

const SavedItems = ({ items, onDelete, columns }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-300 p-4 mt-6">
      <h2 className="font-medium">Saved Items</h2>
      <table className="min-w-full mt-2 border border-gray-300">
        <thead>
          <tr className="bg-teal-500 text-white">
            {columns.map((col) => (
              <th key={col.key} className="border border-gray-300 px-4 py-2">
                {col.label}
              </th>
            ))}
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="border border-gray-300 px-4 py-2"
                  style={{ textAlign: col.isList ? "left" : "center" }}
                >
                  {col.isImage ? (
                    <div className="flex justify-center">
                      <img
                        src={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/${
                          item[col.key]?.url
                        }`}
                        alt={col.label}
                        className="h-16 w-16 object-contain"
                      />
                    </div>
                  ) : col.isList ? (
                    <ul className="list-disc ml-4">
                      {item[col.key]?.map((f, i) => (
                        <li key={i}>{col.isPercentage ? `${f}%` : `${f}$`}</li>
                      ))}
                    </ul>
                  ) : typeof item[col.key] === "number" ? (
                    col.isPercentage ? (
                      `${item[col.key]}$`
                    ) : (
                      `${item[col.key]}%`
                    )
                  ) : (
                    item[col.key]
                  )}
                </td>
              ))}
              <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-2">
                <button
                  onClick={() => onDelete(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md flex items-center"
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
};

export default SavedItems;
