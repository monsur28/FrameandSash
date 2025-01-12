import { useState } from "react";
import { Edit2, Trash2, Users, Settings } from "lucide-react";
import UserModal from "../Shared/UserModal";
import { useLanguage } from "../ContextProvider/LanguageContext";

export default function RoleManagement() {
  const [activeTab, setActiveTab] = useState("role");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("4");
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useLanguage();

  const [roles, setRoles] = useState([
    { id: 1, name: `${t("superAdmin")}`, canDelete: false },
    { id: 2, name: `${t("manufacturer")}`, canDelete: true },
    { id: 3, name: `${t("reseller")}`, canDelete: true },
    { id: 4, name: `${t("staffAccess")}`, canDelete: true },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Super Admin" },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Manufacturer",
    },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Re-Seller" },
  ]);

  const handleAddRole = (role) => {
    if (role) {
      const newRole = { id: roles.length + 1, name: role, canDelete: true };
      setRoles([...roles, newRole]);
    }
    setShowRoleModal(false);
  };

  const handleAddUser = (user) => {
    if (user) {
      const newUser = {
        id: users.length + 1,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      setUsers([...users, newUser]);
    }
    setShowUserModal(false);
  };

  const handleDeleteRole = (id) => {
    setRoles(roles.filter((role) => role.id !== id));
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleEditRole = (role) => {
    setRoleToEdit(role);
    setShowRoleModal(true);
  };

  const handleEditUser = (user) => {
    setUserToEdit(user);
    setShowUserModal(true);
  };

  const filteredData =
    activeTab === "role"
      ? roles.filter((role) =>
          role.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : users.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="h-screen p-4 space-y-8">
      {/* Modal for adding/editing roles */}
      <UserModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onSave={roleToEdit ? handleEditRole : handleAddRole}
        initialData={roleToEdit}
        type="role"
        roles={roles} // Pass roles to the modal
      />
      {/* Modal for adding/editing users */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSave={userToEdit ? handleEditUser : handleAddUser}
        initialData={userToEdit}
        type="user"
        roles={roles} // Pass roles to the modal
      />

      {/* The rest of the RoleManagement component */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center mb-8 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 p-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">{t("RoleList")}</h1>
        <button
          onClick={() =>
            activeTab === "role"
              ? setShowRoleModal(true)
              : setShowUserModal(true)
          }
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <span className="text-xl">+</span>
          {activeTab === "role" ? `${t("addRole")}` : `${t("addUser")}`}
        </button>
      </div>

      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg overflow-hidden">
          <button
            onClick={() => setActiveTab("role")}
            className={`flex items-center gap-2 px-6 py-3 ${
              activeTab === "role"
                ? "bg-teal-500 text-white"
                : "bg-white border-2 border-gray-200"
            } hover:bg-teal-600 hover:text-white transition-colors`}
          >
            <Settings className="w-5 h-5" />
            {t("role")}
          </button>
          <button
            onClick={() => setActiveTab("user")}
            className={`flex items-center gap-2 px-6 py-3 ${
              activeTab === "user"
                ? "bg-teal-500 text-white"
                : "bg-white border-2 border-gray-200"
            } hover:bg-teal-600 hover:text-white transition-colors`}
          >
            <Users className="w-5 h-5" />
            {t("user")}
          </button>
        </div>
      </div>

      <div className="bg-white50 backdrop-blur-16.5 rounded-lg shadow-lg p-6">
        <div className="flex justify-between mb-6 flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="4">4</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>Entries</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Search:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-1 w-36 md:w-32 sm:w-28"
              placeholder="Search..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">SL.</th>
                <th className="text-left py-3 px-4">{t("Name")}</th>
                {activeTab === "user" && (
                  <>
                    <th className="text-left py-3 px-4">{t("email")}</th>
                    <th className="text-left py-3 px-4">{t("role")}</th>
                  </>
                )}
                <th className="text-left py-3 px-4">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{item.name}</td>
                  {activeTab === "user" && (
                    <>
                      <td className="py-3 px-4">{item.email}</td>
                      <td className="py-3 px-4">{item.role}</td>
                    </>
                  )}
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          activeTab === "role"
                            ? handleEditRole(item)
                            : handleEditUser(item)
                        }
                        className="text-gray-600 hover:text-teal-500"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      {(activeTab === "role" ? item.canDelete : true) && (
                        <button
                          onClick={() =>
                            activeTab === "role"
                              ? handleDeleteRole(item.id)
                              : handleDeleteUser(item.id)
                          }
                          className="text-gray-600 hover:text-red-500"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6 gap-4">
          {Array.from(
            { length: Math.ceil(filteredData.length / entriesPerPage) },
            (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === index + 1
                    ? "bg-teal-500 text-white"
                    : "bg-white border-2 border-gray-200"
                } hover:bg-teal-600 hover:text-white`}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
