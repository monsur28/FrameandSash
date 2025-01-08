import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddBlog({ onAdd }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    date: "",
    status: "Draft",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...formData, id: Date.now() });
    navigate("/");
  };

  return (
    <div className="h-screen p-6 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Add Blog</h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.author}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <select
            name="status"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
          <button
            type="submit"
            className="w-full p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
          >
            Add Blog
          </button>
        </div>
      </form>
    </div>
  );
}
