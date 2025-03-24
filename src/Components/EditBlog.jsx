import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSweetAlert } from "../ContextProvider/SweetAlertContext";
import axiosSecure from "../Hooks/AsiosSecure";

export default function EditBlog() {
  const [formData, setFormData] = useState({
    blog_title: "",
    author: "",
    category: "",
    blog_content: "",
    date: "",
    status: "draft",
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useSweetAlert();

  // Fetch the existing blog post data by ID
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await axiosSecure.get(`/blogs/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching blog post:", error);
      }
    };
    fetchBlogPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      blog_content: content,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.put(
        `/blogs/${id}`,
        {
          ...formData,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      showAlert("Success!", "Blog post updated successfully.", "success");
      navigate("/dashboard/blog");
    } catch (error) {
      console.error("Error updating blog post:", error);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <button
        onClick={() => navigate("/dashboard/blog")}
        className="mb-8 flex items-center space-x-2 text-teal-700 hover:text-teal-900 transition-colors duration-300"
      >
        <ArrowLeft size={20} />
        <span>Back to Blog List</span>
      </button>

      <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>
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
            className="w-full"
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
            Update Blog
          </button>
        </div>
      </form>
    </div>
  );
}
