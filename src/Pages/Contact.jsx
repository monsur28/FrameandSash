import React, { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa"; // Import FontAwesome icons
import axiosSecure from "../Hooks/AsiosSecure";
import Swal from "sweetalert2";
import { useSweetAlert } from "../ContextProvider/SweetAlertContext";

// Icon Selector Modal Component
const IconSelectorModal = ({ onClose, onIconSelect, selectedIcon }) => {
  const [iconSearch, setIconSearch] = useState("");

  // Filter icons based on search input
  const filteredIcons = Object.keys(FaIcons).filter((iconName) =>
    iconName.toLowerCase().includes(iconSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 md:w-1/2 p-5 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Select Icon</h2>
        <input
          type="text"
          placeholder="Type to filter"
          value={iconSearch}
          onChange={(e) => setIconSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
        />
        <div className="grid grid-cols-5 gap-3 max-h-60 overflow-y-auto">
          {filteredIcons.map((iconName) => (
            <button
              key={iconName}
              className={`p-3 border rounded flex items-center justify-center hover:bg-gray-200 ${
                selectedIcon === iconName ? "bg-blue-100 border-blue-500" : ""
              }`}
              onClick={() => {
                onIconSelect(iconName);
                onClose();
              }}
            >
              {React.createElement(FaIcons[iconName], {
                className: "text-2xl",
              })}
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Contact Component
const Contact = () => {
  const [contacts, setContacts] = useState([]);

  const [newContact, setNewContact] = useState({
    icon: "",
    title: "",
    content: "",
    order: 0,
  });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showIconModal, setShowIconModal] = useState(false);
  const { showAlert } = useSweetAlert();

  // Fetch contacts from the API
  const fetchContacts = async () => {
    axiosSecure
      .get("/api/contacts")
      .then((response) => {
        console.log("Contacts:", response.data);
        setContacts(response.data); // Ensure response.data is an array
      })
      .catch((error) => console.error("Error fetching contacts:", error));
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  const handleAdd = async () => {
    try {
      const response = await axiosSecure.post("/api/contacts", newContact);
      setContacts([...contacts, response.data.contact]);
      setNewContact({ icon: "", title: "", content: "", order: 0 });
      setEditId(null);
      setShowModal(false);
      showAlert("Success!", "Contact added successfully.", "success");
    } catch (error) {
      console.error("Error adding contact:", error.message);
      Swal.fire("Error!", "Failed to add contact.", "error");
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axiosSecure.put(
        `/api/contacts/${editId}`,
        newContact
      );
      setContacts(
        contacts.map((contact) =>
          contact.id === editId ? response.data.contact : contact
        )
      );
      setEditId(null);
      setShowModal(false);
      showAlert("Success!", "Contact updated successfully.", "success");
    } catch (error) {
      console.error("Error updating contact:", error.message);
      Swal.fire("Error!", "Failed to update contact.", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "This contact will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });
      await axiosSecure.delete(`/api/contacts/${id}`);
      setContacts(contacts.filter((contact) => contact.id !== id));
      showAlert("Success!", "Contact deleted successfully.", "success");
    } catch (error) {
      console.error("Error deleting contact:", error.message);
      showAlert("Error!", "Failed to delete contact.", "error");
    }
  };

  return (
    <div className="h-screen p-5">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-5">
        <h3 className="text-2xl font-bold mb-5">Contact</h3>
        <button
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition mb-5"
          onClick={() => {
            setNewContact({ icon: "", title: "", content: "", order: 0 });
            setEditId(null);
            setShowModal(true);
          }}
        >
          + Add Contact
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Icon</th>
              <th className="border border-gray-300 px-4 py-2">Title</th>
              <th className="border border-gray-300 px-4 py-2">Content</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr key={contact.id}>
                <td className="border border-gray-300 px-4 py-2">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <td className="px-4 py-2">
                    {FaIcons[contact.icon] &&
                      React.createElement(FaIcons[contact.icon], {
                        className: "text-2xl",
                      })}
                  </td>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {contact.title}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {contact.content}
                </td>
                <td className="border border-gray-300 space-y-3 lg:space-x-4 px-4 py-2">
                  <button
                    onClick={() => {
                      setNewContact(contact);
                      setEditId(contact.id);
                      setShowModal(true);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-1/2 p-5 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {editId ? "Edit Contact" : "Add Contact"}
            </h2>
            <button
              onClick={() => setShowIconModal(true)}
              className="bg-gray-200 px-3 py-2 rounded mb-4"
            >
              {newContact.icon ? (
                <span className="flex items-center">
                  {React.createElement(FaIcons[newContact.icon], {
                    className: "mr-2",
                  })}
                  {newContact.icon}
                </span>
              ) : (
                "Select Icon"
              )}
            </button>
            <input
              type="text"
              name="title"
              value={newContact.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
            />
            <input
              type="text"
              name="content"
              value={newContact.content}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                onClick={editId ? handleUpdate : handleAdd}
              >
                {editId ? "Update Contact" : "Add Contact"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showIconModal && (
        <IconSelectorModal
          onClose={() => setShowIconModal(false)}
          onIconSelect={(icon) => setNewContact({ ...newContact, icon })}
          selectedIcon={newContact.icon}
        />
      )}
    </div>
  );
};

export default Contact;
