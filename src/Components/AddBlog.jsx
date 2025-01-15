import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axiosSecure from "../Hooks/AsiosSecure";
import SweetAlert from "../Shared/SweetAlert";
import { useSweetAlert } from "../ContextProvider/SweetAlertContext";

export default function AddBlog() {
  const { showAlert } = useSweetAlert();
  const [formData, setFormData] = useState({
    blog_title: "",
    author: "",
    category: "",
    blog_content: "",
    date: new Date().toISOString().split("T")[0], // Automatically set the current date
    status: "draft",
  });
  const navigate = useNavigate();
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    title: "",
    message: "",
    type: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContentChange = (content) => {
    setFormData({ ...formData, blog_content: content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.post(
        "/blogs",
        {
          blog_title: formData.blog_title,
          author: formData.author,
          category: formData.category,
          blog_content: formData.blog_content,
          date: formData.date,
          status: formData.status,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      showAlert("Congratulations!", "Blog added successfully!", "success");
      navigate("/dashboard/blog");
    } catch (error) {
      console.error(
        "Error adding blog:",
        error.response?.data || error.message
      );
    }
  };

  const handleCloseAlert = () => {
    setAlertConfig((prev) => ({ ...prev, show: false }));
  };

  return (
    <div className="h-screen p-6 rounded-[24px] border-2 border-white bg-white50 backdrop-blur-16.5 shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Add Blog</h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <input
            type="text"
            name="blog_title"
            placeholder="Title"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.blog_title}
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
          <ReactQuill
            value={formData.blog_content}
            onChange={handleContentChange}
            className="bg-white border rounded"
            theme="snow"
            placeholder="Write your blog content here..."
          />
          <select
            name="status"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          <button
            type="submit"
            className="w-full p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
          >
            Add Blog
          </button>
        </div>
      </form>

      {/* Preview Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div
          className="p-4 border rounded bg-gray-100"
          dangerouslySetInnerHTML={{ __html: formData.blog_content }}
        />
      </div>
      <SweetAlert
        show={alertConfig.show}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={handleCloseAlert}
      />
    </div>
  );
}
