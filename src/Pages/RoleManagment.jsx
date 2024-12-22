import { useState } from "react";
import { Edit, Trash } from "lucide-react";

const RoleManagement = () => {
  const [entries, setEntries] = useState(4);
  const roles = [
    { id: 1, name: "Super Admin" },
    { id: 2, name: "Manufacturer" },
    { id: 3, name: "Re-Seller" },
    { id: 4, name: "Staff Access" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <button className="bg-teal-500 text-white py-2 px-6 rounded-full shadow-md">
            Role
          </button>
          <button className="bg-white border border-gray-300 py-2 px-6 rounded-full shadow-md">
            User
          </button>
        </div>
        <button className="bg-gradient-to-r from-teal-500 to-blue-500 text-white py-2 px-6 rounded-full shadow-md">
          Add Role
        </button>
      </div>

      {/* Table Header */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Role List</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="entries" className="text-gray-500 text-sm">
              Show
            </label>
            <input
              id="entries"
              type="number"
              min="1"
              value={entries}
              onChange={(e) => setEntries(e.target.value)}
              className="w-12 p-1 border rounded-md text-center"
            />
            <span className="text-gray-500 text-sm">entries</span>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search"
              className="w-48 p-2 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-teal-300"
            />
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-teal-100">
              <th className="p-2 border">SL.</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {roles.slice(0, entries).map((role, index) => (
              <tr key={role.id} className="even:bg-gray-50">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{role.name}</td>
                <td className="p-2 border flex space-x-2">
                  <button className="p-2 bg-teal-100 text-teal-500 rounded-md">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-red-100 text-red-500 rounded-md">
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button className="bg-gray-200 py-1 px-4 rounded-md shadow-md">
            Previous
          </button>
          <button className="bg-teal-500 text-white py-1 px-4 rounded-md shadow-md">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
