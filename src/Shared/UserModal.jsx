import { useState } from "react";
import PropTypes from "prop-types";

export default function UserModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  type,
  roles, // Pass the roles array as a prop to this component
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [role, setRole] = useState(initialData?.role || ""); // Use role from the passed data
  const [error, setError] = useState("");

  const handleSave = () => {
    if (type === "user" && (!name || !email || !role)) {
      setError("All fields are required");
      return;
    } else if (type === "role" && !name) {
      setError("Role name is required");
      return;
    }

    onSave({ name, email, role });
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-8 w-96">
          <h2 className="text-xl font-semibold mb-4">
            {type === "user" ? "Add/Edit User" : "Add/Edit Role"}
          </h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="Enter name"
              />
            </div>
            {type === "user" && (
              <>
                <div>
                  <label className="block text-sm">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded p-2"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="block text-sm">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)} // Set the role from dropdown
                    className="w-full border rounded p-2"
                  >
                    <option value="">Select Role</option>
                    {roles.map((roleOption) => (
                      <option key={roleOption.id} value={roleOption.name}>
                        {roleOption.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
          <div className="mt-6 flex justify-between">
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-teal-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  );
}

UserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
  }),
  type: PropTypes.oneOf(["user", "role"]).isRequired,
  roles: PropTypes.array.isRequired, // Add the roles prop to the propTypes
};
