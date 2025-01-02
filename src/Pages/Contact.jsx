import { useState } from "react";
import { FaEdit, FaTrash, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

const Contact = () => {
  const [contacts, setContacts] = useState([
    { id: 1, icon: "map-marker-alt", title: "Address", desc: "Arji Naogaon, Mridhapara, Naogaon Sadar, 6500, Naogaon", order: 0 },
    { id: 2, icon: "envelope", title: "E-mail", desc: "official@twintechsoft.com", order: 0 },
  ]);

  const [newContact, setNewContact] = useState({ icon: "", title: "", desc: "", order: 0 });
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (editId) {
      setContacts(contacts.map(contact => contact.id === editId ? { ...newContact, id: editId } : contact));
      setEditId(null);
    } else {
      setContacts([...contacts, { ...newContact, id: Date.now() }]);
    }
    setNewContact({ icon: "", title: "", desc: "", order: 0 });
  };

  const handleEdit = (id) => {
    const contact = contacts.find(contact => contact.id === id);
    setNewContact(contact);
    setEditId(id);
  };

  const handleDelete = (id) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  return (
    <div className="container mt-5">
      <h3>Contact</h3>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Icon (e.g., map-marker-alt)"
          name="icon"
          value={newContact.icon}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={newContact.title}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          type="text"
          placeholder="Description"
          name="desc"
          value={newContact.desc}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <button onClick={handleAdd} className="btn btn-primary">
          {editId ? "Update Contact" : "Add Contact"}
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Icon</th>
            <th>Title</th>
            <th>Content</th>
            <th>Order</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <tr key={contact.id}>
              <td>{index + 1}</td>
              <td>
                {contact.icon === "map-marker-alt" && <FaMapMarkerAlt />}
                {contact.icon === "envelope" && <FaEnvelope />}
              </td>
              <td>{contact.title}</td>
              <td>{contact.desc}</td>
              <td>{contact.order}</td>
              <td>
                <button onClick={() => handleEdit(contact.id)} className="btn btn-sm btn-warning me-2">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(contact.id)} className="btn btn-sm btn-danger">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Contact;
