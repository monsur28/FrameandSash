import { useState } from "react";
import { FaEdit, FaTrash, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { useLanguage } from "../ContextProvider/LanguageContext";

const Contact = () => {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      icon: "map-marker-alt",
      title: "Address",
      desc: "Arji Naogaon, Mridhapara, Naogaon Sadar, 6500, Naogaon",
      order: 0,
    },
    {
      id: 2,
      icon: "envelope",
      title: "E-mail",
      desc: "official@twintechsoft.com",
      order: 0,
    },
  ]);

  const [newContact, setNewContact] = useState({
    icon: "",
    title: "",
    desc: "",
    order: 0,
  });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { t } = useLanguage();

  const handleChange = (e) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (editId) {
      setContacts(
        contacts.map((contact) =>
          contact.id === editId ? { ...newContact, id: editId } : contact
        )
      );
      setEditId(null);
    } else {
      setContacts([...contacts, { ...newContact, id: Date.now() }]);
    }
    setNewContact({ icon: "", title: "", desc: "", order: 0 });
    setShowModal(false);
  };

  const handleEdit = (id) => {
    const contact = contacts.find((contact) => contact.id === id);
    setNewContact(contact);
    setEditId(id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  const handleShowModal = () => {
    setNewContact({ icon: "", title: "", desc: "", order: 0 });
    setEditId(null);
    setShowModal(true);
  };

  return (
    <div className="h-screen p-5">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-5">
        <h3 className="text-2xl font-bold mb-5">Contact</h3>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mb-5"
          onClick={handleShowModal}
        >
          + {t("addContact")}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">{t("icon")}</th>
              <th className="border border-gray-300 px-4 py-2">{t("title")}</th>
              <th className="border border-gray-300 px-4 py-2">
                {t("content")}
              </th>
              <th className="border border-gray-300 px-4 py-2">
                {t("orders")}
              </th>
              <th className="border border-gray-300 px-4 py-2">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr key={contact.id}>
                <td className="border border-gray-300 px-4 py-2">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {contact.icon === "map-marker-alt" && <FaMapMarkerAlt />}
                  {contact.icon === "envelope" && <FaEnvelope />}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {contact.title}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {contact.desc}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {contact.order}
                </td>
                <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(contact.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-1/2 p-5 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {editId ? "Edit Contact" : "Add Contact"}
            </h2>
            <div className="mb-3">
              <input
                type="text"
                name="icon"
                value={newContact.icon}
                onChange={handleChange}
                placeholder="Icon (e.g., map-marker-alt)"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
              />
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
                name="desc"
                value={newContact.desc}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                onClick={handleAdd}
              >
                {editId ? "Update Contact" : "Add Contact"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
