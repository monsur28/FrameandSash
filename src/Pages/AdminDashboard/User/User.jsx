import { useEffect, useState } from "react";
import axiosSecure from "../../../Hooks/AsiosSecure";
import Loader from "../../../Shared/Loader";
import { Trash2, ZoomIn } from "lucide-react";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosSecure.get("/admin/users");
        console.log(response.data.users);

        setUsers(response.data.users || []);
      } catch {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdateUser = async (id, updatedData) => {
    try {
      await axiosSecure.put(`/admin/users/${id}`, updatedData);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, ...updatedData } : user
        )
      );
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosSecure.delete(`/users/${id}`);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleViewImage = (imagePath) => {
    if (!imagePath) {
      setSelectedImage("NID not found");
      return;
    }
    const imageUrl = `${
      import.meta.env.VITE_REACT_APP_API_BASE_URL
    }/${imagePath}`;
    setSelectedImage(imageUrl);
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-2 sm:p-4 dark:text-gray-800">
      <h2 className="mb-4 text-2xl font-semibold leading-tight">
        User Management
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead className="bg-gray-300">
            <tr className="text-left">
              <th className="p-3">#</th>
              <th className="p-3">User Email</th>
              <th className="p-3">Address</th>
              <th className="p-3">Company Name</th>
              <th className="p-3">NID</th>
              <th className="p-3">Role</th>
              <th className="p-3">Approved</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-2 border-white bg-white rounded-lg"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.address}</td>
                  <td className="p-3">{user.company_name}</td>

                  {/* NID Preview */}
                  <td className="p-3 flex flex-col items-center">
                    {user.user_image ? (
                      <div className="relative flex items-center">
                        <img
                          src={`${
                            import.meta.env.VITE_REACT_APP_API_BASE_URL
                          }/${user.user_image}`}
                          alt="NID"
                          className="w-20 h-20 object-contain rounded-md border"
                        />
                        <button
                          onClick={() => handleViewImage(user.user_image)}
                          className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-md"
                        >
                          <ZoomIn size={12} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">NID not found</span>
                    )}
                  </td>

                  {/* Role Selection */}
                  <td className="p-3">
                    <select
                      className="border rounded-md p-1"
                      value={user.role}
                      onChange={(e) =>
                        handleUpdateUser(user.id, { role: e.target.value })
                      }
                    >
                      <option value="manufacturer">Manufacturer</option>
                      <option value="customer">Customer</option>
                      <option value="reseller">Reseller</option>
                    </select>
                  </td>

                  {/* Approval Selection */}
                  <td className="p-3">
                    <select
                      className="border rounded-md p-1"
                      value={user.approved ? "yes" : "no"}
                      onChange={(e) =>
                        handleUpdateUser(user.id, {
                          approved: e.target.value === "yes",
                        })
                      }
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </td>

                  {/* Action Buttons */}
                  <td className="p-3">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-3">
                  No user data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Display Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative bg-white p-4 rounded-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedImage === "NID not found" ? (
              <p className="text-center text-gray-500 text-xl font-semibold">
                NID not found
              </p>
            ) : (
              <img
                src={selectedImage}
                alt="NID Image"
                className="max-w-[100vw] max-h-[100vh] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
